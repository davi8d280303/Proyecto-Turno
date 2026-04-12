const express = require('express');
const router = express.Router();
const { getSupabaseAdmin } = require('../config/supabaseClient');
const isAuth = require('../middleware/isAuth');
const checkRole = require('../middleware/checkRole');

// ─────────────────────────────────────────────
// HELPER: construir filtros según el rol
// ─────────────────────────────────────────────
// Reglas de negocio:
//   super_admin → ve todo (sin filtro de área)
//   admin con área → ve solo su área
//   admin sin área → ve todo (admin global)
//   usuario → ve todo (solo lectura, se controla en el frontend y en las rutas)
function buildAreaFilter(auth) {
  const { role, areaId } = auth;

  // Admins con área asignada filtran por su área
  if (role === 'admin' && areaId) {
    return { area_id: `eq.${areaId}` };
  }

  // super_admin, admin global y usuario ven todo
  return {};
}

// ─────────────────────────────────────────────
// GET /api/inventario
// Quién puede: todos los usuarios autenticados
// ─────────────────────────────────────────────
router.get('/', isAuth, async (req, res, next) => {
  try {
    const db = getSupabaseAdmin();
    const filters = buildAreaFilter(req.auth);

    const data = await db.restSelect('inventario', {
      select: '*',
      filters,
      order: 'created_at.desc',
    });

    res.json({
      success: true,
      data: data || [],
      total: data?.length || 0,
    });
  } catch (error) {
    console.error('Error en GET /inventario:', error);
    next(error);
  }
});

// ─────────────────────────────────────────────
// POST /api/inventario
// Quién puede: solo admin y super_admin
// ─────────────────────────────────────────────
router.post(
  '/',
  isAuth,
  checkRole('admin', 'super_admin'),
  async (req, res, next) => {
    try {
      const db = getSupabaseAdmin();
      const { nombre, cantidad, descripcion, categoria } = req.body;

      if (!nombre || cantidad == null) {
        return res.status(400).json({
          success: false,
          message: 'El nombre y la cantidad son campos obligatorios.',
        });
      }

      const payload = {
        nombre,
        cantidad: Number(cantidad),
        descripcion: descripcion || null,
        categoria: categoria || 'GENERAL',
        // Si el admin tiene área, el item se asigna a esa área
        // Si es super_admin sin área, area_id queda null (inventario global)
        area_id: req.auth.areaId || null,
      };

      const data = await db.restInsert('inventario', payload);

      res.status(201).json({
        success: true,
        data: Array.isArray(data) ? data[0] : data,
      });
    } catch (error) {
      console.error('Error en POST /inventario:', error);
      next(error);
    }
  }
);

// ─────────────────────────────────────────────
// PATCH /api/inventario/:id
// Quién puede: solo admin y super_admin
// ─────────────────────────────────────────────
router.patch(
  '/:id',
  isAuth,
  checkRole('admin', 'super_admin'),
  async (req, res, next) => {
    try {
      const db = getSupabaseAdmin();
      const { id } = req.params;
      const { nombre, cantidad, descripcion, categoria, estado } = req.body;

      // Construir solo los campos que llegaron (actualización parcial)
      const updates = {};
      if (nombre !== undefined) updates.nombre = nombre;
      if (cantidad !== undefined) updates.cantidad = Number(cantidad);
      if (descripcion !== undefined) updates.descripcion = descripcion;
      if (categoria !== undefined) updates.categoria = categoria;
      if (estado !== undefined) updates.estado = estado;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No se enviaron campos para actualizar.',
        });
      }

      // Seguridad: un admin con área solo puede editar items de su área
      const filters = { id: `eq.${id}` };
      if (req.auth.role === 'admin' && req.auth.areaId) {
        filters.area_id = `eq.${req.auth.areaId}`;
      }

      const data = await db.restUpdate('inventario', updates, { filters });

      if (!data || data.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Recurso no encontrado o sin permisos para editarlo.',
        });
      }

      res.json({
        success: true,
        data: Array.isArray(data) ? data[0] : data,
      });
    } catch (error) {
      console.error('Error en PATCH /inventario/:id:', error);
      next(error);
    }
  }
);

// ─────────────────────────────────────────────
// DELETE /api/inventario/:id
// Quién puede: solo admin y super_admin
// ─────────────────────────────────────────────
router.delete(
  '/:id',
  isAuth,
  checkRole('admin', 'super_admin'),
  async (req, res, next) => {
    try {
      const db = getSupabaseAdmin();
      const { id } = req.params;

      // Seguridad: un admin con área solo puede borrar items de su área
      const filters = { id: `eq.${id}` };
      if (req.auth.role === 'admin' && req.auth.areaId) {
        filters.area_id = `eq.${req.auth.areaId}`;
      }

      await db.restDelete('inventario', { filters });

      res.json({
        success: true,
        message: 'Recurso eliminado correctamente.',
      });
    } catch (error) {
      console.error('Error en DELETE /inventario/:id:', error);
      next(error);
    }
  }
);

module.exports = router;
