/**
 * Rutas de Usuarios
 * GET  /api/usuarios          → listar (super_admin: todos, admin: su área)
 * GET  /api/usuarios/:id      → detalle
 * PATCH /api/usuarios/:id     → editar rol y/o área (solo super_admin)
 * PATCH /api/usuarios/:id/toggle → activar/desactivar (solo super_admin)
 */
const express    = require('express');
const { getSupabaseAdmin } = require('../config/supabaseClient');
const isAuth     = require('../middleware/isAuth');
const checkRole  = require('../middleware/checkRole');

const router = express.Router();

// ─────────────────────────────────────────────
// GET /api/usuarios
// super_admin → todos los usuarios
// admin       → solo usuarios de su área
// ─────────────────────────────────────────────
router.get('/', isAuth, checkRole('super_admin', 'admin'), async (req, res, next) => {
  try {
    const db      = getSupabaseAdmin();
    const filters = {};

    if (req.auth.role === 'admin' && req.auth.areaId) {
      filters.area_id = `eq.${req.auth.areaId}`;
    }

    const users = await db.restSelect('users', {
      select:  'id,email,full_name,role,area_id,is_active,last_login_at,created_at',
      filters,
      order:   'created_at.desc',
    });

    res.json({
      success: true,
      data:    users || [],
      total:   users?.length || 0,
      scope:   req.auth.role === 'super_admin' ? 'global' : 'area',
    });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────
// GET /api/usuarios/:id
// ─────────────────────────────────────────────
router.get('/:id', isAuth, checkRole('super_admin', 'admin'), async (req, res, next) => {
  try {
    const db      = getSupabaseAdmin();
    const filters = { id: `eq.${req.params.id}` };

    // Admin solo puede ver usuarios de su área
    if (req.auth.role === 'admin' && req.auth.areaId) {
      filters.area_id = `eq.${req.auth.areaId}`;
    }

    const users = await db.restSelect('users', {
      select: 'id,email,full_name,role,area_id,is_active,last_login_at,created_at',
      limit:  1,
      filters,
    });

    const user = Array.isArray(users) ? users[0] : null;

    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado.' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────
// PATCH /api/usuarios/:id
// Editar rol y/o área asignada
// Solo super_admin puede cambiar roles y áreas
// ─────────────────────────────────────────────
router.patch('/:id', isAuth, checkRole('super_admin'), async (req, res, next) => {
  try {
    const db = getSupabaseAdmin();
    const { role, area_id } = req.body;

    // Validar que no se asigne un rol inválido
    const rolesPermitidos = ['super_admin', 'admin', 'usuario'];
    if (role && !rolesPermitidos.includes(role)) {
      return res.status(400).json({ success: false, error: 'Rol no válido.' });
    }

    // Construir solo los campos que llegaron
    const updates = {};
    if (role    !== undefined) updates.role    = role;
    if (area_id !== undefined) updates.area_id = area_id || null; // null = sin área

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No se enviaron campos para actualizar.' });
    }

    // Evitar que el super_admin se quite su propio rol accidentalmente
    if (req.params.id === req.auth.userId && role && role !== 'super_admin') {
      return res.status(400).json({
        success: false,
        error: 'No puedes cambiar tu propio rol.',
      });
    }

    const data = await db.restUpdate('users', updates, {
      filters: { id: `eq.${req.params.id}` },
    });

    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado.' });
    }

    res.json({ success: true, data: Array.isArray(data) ? data[0] : data });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────
// PATCH /api/usuarios/:id/toggle
// Activar o desactivar cuenta (is_active)
// Solo super_admin
// ─────────────────────────────────────────────
router.patch('/:id/toggle', isAuth, checkRole('super_admin'), async (req, res, next) => {
  try {
    const db = getSupabaseAdmin();

    // Primero leer el estado actual
    const users = await db.restSelect('users', {
      select: 'id,is_active',
      limit:  1,
      filters: { id: `eq.${req.params.id}` },
    });

    const user = Array.isArray(users) ? users[0] : null;

    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado.' });
    }

    // Evitar que el super_admin se desactive a sí mismo
    if (req.params.id === req.auth.userId) {
      return res.status(400).json({
        success: false,
        error:   'No puedes desactivar tu propia cuenta.',
      });
    }

    const data = await db.restUpdate(
      'users',
      { is_active: !user.is_active },
      { filters: { id: `eq.${req.params.id}` } }
    );

    res.json({
      success:   true,
      data:      Array.isArray(data) ? data[0] : data,
      message:   `Usuario ${!user.is_active ? 'activado' : 'desactivado'} correctamente.`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;