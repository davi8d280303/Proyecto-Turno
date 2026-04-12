/**
 * Rutas de Préstamos
 *
 * GET  /api/prestamos           → listar préstamos activos
 * POST /api/prestamos           → registrar nuevo préstamo
 * PATCH /api/prestamos/:id/devolver → marcar como devuelto
 *
 * Reglas de negocio:
 *   - super_admin y admin ven todos los préstamos (o los de su área)
 *   - usuario solo ve sus propios préstamos
 *   - Al crear un préstamo el inventario pasa a 'en_uso'
 *   - Al devolver el inventario vuelve a 'disponible'
 *   - Solo se puede prestar un artículo que esté 'disponible'
 */
const express  = require('express');
const isAuth   = require('../middleware/isAuth');
const checkRole = require('../middleware/checkRole');
const { getSupabaseAdmin } = require('../config/supabaseClient');

const router = express.Router();

// ─────────────────────────────────────────────
// GET /api/prestamos
// Devuelve préstamos con datos del artículo y usuario
// ─────────────────────────────────────────────
router.get('/', isAuth, async (req, res, next) => {
  try {
    const db      = getSupabaseAdmin();
    const { role, userId, areaId } = req.auth;
    const { estado } = req.query; // ?estado=activo | devuelto

    const filters = {};

    // Usuario normal: solo ve sus propios préstamos
    if (role === 'usuario') {
      filters.usuario_id = `eq.${userId}`;
    }
    // Admin con área: solo préstamos de artículos de su área
    // (se filtra después del join, ver abajo)

    if (estado) {
      filters.estado = `eq.${estado}`;
    }

    const prestamos = await db.restSelect('prestamos', {
      select:  'id,estado,notas,prestado_en,devuelto_en,inventario_id,usuario_id,registrado_por',
      filters,
      order:   'prestado_en.desc',
    });

    if (!prestamos || prestamos.length === 0) {
      return res.json({ success: true, data: [], total: 0 });
    }

    // ── Enriquecer con datos del artículo y usuario ──
    // Obtenemos los IDs únicos para hacer el mínimo de consultas
    const inventarioIds = [...new Set(prestamos.map((p) => p.inventario_id))];
    const usuarioIds    = [...new Set(prestamos.flatMap((p) => [p.usuario_id, p.registrado_por]).filter(Boolean))];

    const [articulos, usuarios] = await Promise.all([
      db.restSelect('inventario', {
        select:  'id,nombre,categoria,area_id,estado',
        filters: { id: `in.(${inventarioIds.join(',')})` },
      }),
      db.restSelect('users', {
        select:  'id,full_name,email',
        filters: { id: `in.(${usuarioIds.join(',')})` },
      }),
    ]);

    // Mapas para lookup O(1)
    const articuloMap = Object.fromEntries((articulos || []).map((a) => [a.id, a]));
    const usuarioMap  = Object.fromEntries((usuarios  || []).map((u) => [u.id, u]));

    // Construir respuesta enriquecida
    let data = prestamos.map((p) => ({
      ...p,
      articulo:       articuloMap[p.inventario_id]  || null,
      usuario:        usuarioMap[p.usuario_id]       || null,
      registrado_por: usuarioMap[p.registrado_por]  || null,
    }));

    // Admin con área: filtrar solo los de su área
    if (role === 'admin' && areaId) {
      data = data.filter((p) => p.articulo?.area_id === areaId);
    }

    res.json({ success: true, data, total: data.length });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────
// POST /api/prestamos
// Registrar un nuevo préstamo
// Solo admin y super_admin pueden registrar
// ─────────────────────────────────────────────
router.post('/', isAuth, checkRole('admin', 'super_admin'), async (req, res, next) => {
  try {
    const db = getSupabaseAdmin();
    const { inventario_id, usuario_id, notas } = req.body;

    // ── Validaciones ──
    if (!inventario_id || !usuario_id) {
      return res.status(400).json({
        success: false,
        error:   'El artículo y el usuario son obligatorios.',
      });
    }

    // Verificar que el artículo existe y está disponible
    const articulos = await db.restSelect('inventario', {
      select:  'id,nombre,estado,area_id',
      limit:   1,
      filters: { id: `eq.${inventario_id}` },
    });
    const articulo = Array.isArray(articulos) ? articulos[0] : null;

    if (!articulo) {
      return res.status(404).json({ success: false, error: 'Artículo no encontrado.' });
    }

    if (articulo.estado !== 'disponible') {
      return res.status(409).json({
        success: false,
        error:   `El artículo "${articulo.nombre}" no está disponible (estado: ${articulo.estado}).`,
      });
    }

    // Admin con área solo puede prestar artículos de su área
    if (req.auth.role === 'admin' && req.auth.areaId && articulo.area_id !== req.auth.areaId) {
      return res.status(403).json({
        success: false,
        error:   'No tienes permiso para prestar artículos de otra área.',
      });
    }

    // Verificar que el usuario receptor existe
    const usuarios = await db.restSelect('users', {
      select:  'id,full_name',
      limit:   1,
      filters: { id: `eq.${usuario_id}` },
    });
    const usuarioReceptor = Array.isArray(usuarios) ? usuarios[0] : null;

    if (!usuarioReceptor) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado.' });
    }

    // ── Crear préstamo y actualizar inventario en paralelo ──
    const [prestamo] = await Promise.all([
      db.restInsert('prestamos', {
        inventario_id,
        usuario_id,
        registrado_por: req.auth.userId,
        estado:         'activo',
        notas:          notas || null,
      }),
      db.restUpdate('inventario', { estado: 'en_uso' }, {
        filters: { id: `eq.${inventario_id}` },
      }),
    ]);

    res.status(201).json({
      success: true,
      data:    Array.isArray(prestamo) ? prestamo[0] : prestamo,
      message: `Préstamo registrado: "${articulo.nombre}" → ${usuarioReceptor.full_name}`,
    });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────
// PATCH /api/prestamos/:id/devolver
// Marcar como devuelto y liberar el artículo
// Solo admin y super_admin
// ─────────────────────────────────────────────
router.patch('/:id/devolver', isAuth, checkRole('admin', 'super_admin'), async (req, res, next) => {
  try {
    const db = getSupabaseAdmin();

    // Obtener el préstamo
    const prestamos = await db.restSelect('prestamos', {
      select:  'id,estado,inventario_id',
      limit:   1,
      filters: { id: `eq.${req.params.id}` },
    });
    const prestamo = Array.isArray(prestamos) ? prestamos[0] : null;

    if (!prestamo) {
      return res.status(404).json({ success: false, error: 'Préstamo no encontrado.' });
    }

    if (prestamo.estado === 'devuelto') {
      return res.status(409).json({ success: false, error: 'Este préstamo ya fue devuelto.' });
    }

    // Marcar devuelto y liberar artículo en paralelo
    const [data] = await Promise.all([
      db.restUpdate('prestamos',
        { estado: 'devuelto', devuelto_en: new Date().toISOString() },
        { filters: { id: `eq.${req.params.id}` } }
      ),
      db.restUpdate('inventario',
        { estado: 'disponible' },
        { filters: { id: `eq.${prestamo.inventario_id}` } }
      ),
    ]);

    res.json({
      success: true,
      data:    Array.isArray(data) ? data[0] : data,
      message: 'Artículo devuelto correctamente.',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
