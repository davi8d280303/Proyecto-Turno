/**
 * Rutas de Áreas
 * GET  /api/areas      → listar todas (cualquier usuario autenticado)
 * POST /api/areas      → crear nueva (solo super_admin)
 * PATCH /api/areas/:id → editar (solo super_admin)
 */
const express   = require('express');
const isAuth    = require('../middleware/isAuth');
const checkRole = require('../middleware/checkRole');
const { getSupabaseAdmin } = require('../config/supabaseClient');

const router = express.Router();

// GET /api/areas — todos los autenticados la necesitan (para selects de área)
router.get('/', isAuth, async (req, res, next) => {
  try {
    const db   = getSupabaseAdmin();
    const data = await db.restSelect('areas', {
      select:  'id,name,description,is_active',
      filters: { is_active: 'eq.true' },
      order:   'name.asc',
    });
    res.json({ success: true, data: data || [] });
  } catch (error) {
    next(error);
  }
});

// POST /api/areas — solo super_admin
router.post('/', isAuth, checkRole('super_admin'), async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ success: false, error: 'El nombre del área es obligatorio.' });
    }

    const db   = getSupabaseAdmin();
    const data = await db.restInsert('areas', {
      name:        name.trim(),
      description: description?.trim() || null,
    });

    res.status(201).json({ success: true, data: Array.isArray(data) ? data[0] : data });
  } catch (error) {
    // Código 23505 = unique_violation en PostgreSQL
    if (error.details?.code === '23505') {
      return res.status(409).json({ success: false, error: 'Ya existe un área con ese nombre.' });
    }
    next(error);
  }
});

// PATCH /api/areas/:id — solo super_admin
router.patch('/:id', isAuth, checkRole('super_admin'), async (req, res, next) => {
  try {
    const { name, description, is_active } = req.body;
    const updates = {};

    if (name        !== undefined) updates.name        = name.trim();
    if (description !== undefined) updates.description = description?.trim() || null;
    if (is_active   !== undefined) updates.is_active   = Boolean(is_active);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No se enviaron campos para actualizar.' });
    }

    const db   = getSupabaseAdmin();
    const data = await db.restUpdate('areas', updates, {
      filters: { id: `eq.${req.params.id}` },
    });

    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, error: 'Área no encontrada.' });
    }

    res.json({ success: true, data: Array.isArray(data) ? data[0] : data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
