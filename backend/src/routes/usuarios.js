const express = require('express');
const { getSupabaseAdmin } = require('../config/supabaseClient');
const isAuth = require('../middleware/isAuth');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

// ✅ Ruta para usuarios normales (Cualquier logueado puede entrar)
router.get('/perfil', isAuth, (req, res) => {
  res.json({
    success: true,
    data: req.auth,
    message: 'Acceso concedido al perfil.'
  });
});

// ✅ Rutas protegidas (Solo admin/super_admin)
router.get('/', isAuth, checkRole('super_admin', 'admin'), async (req, res, next) => {
  try {
    const db = getSupabaseAdmin();
    const filters = {};
    if (req.auth.role === 'admin') filters.area_id = `eq.${req.auth.areaId}`;

    const users = await db.restSelect('users', {
      select: 'id,email,full_name,role,area_id,is_active,last_login_at,created_at',
      filters,
    });

    res.json({ success: true, data: users || [] });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', isAuth, checkRole('super_admin', 'admin'), async (req, res, next) => {
  try {
    const db = getSupabaseAdmin();
    const filters = { id: `eq.${req.params.id}` };
    if (req.auth.role === 'admin') filters.area_id = `eq.${req.auth.areaId}`;

    const users = await db.restSelect('users', {
      select: 'id,email,full_name,role,area_id,is_active,last_login_at,created_at',
      limit: 1, filters,
    });

    const user = Array.isArray(users) ? users[0] : null;
    if (!user) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });

    return res.json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;