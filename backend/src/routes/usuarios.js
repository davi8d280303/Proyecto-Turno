/**
<<<<<<< Updated upstream
 * Rutas de Usuarios (Supabase + Auth)
=======
<<<<<<< HEAD
 * Rutas de Usuarios - Conectadas a Supabase
>>>>>>> Stashed changes
 */
const express = require('express');
const { getSupabaseAdmin } = require('../config/supabaseClient');
const isAuth = require('../middleware/isAuth');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

/**
 * GET /api/usuarios
 * super_admin: todos
 * admin: solo su área
 */
router.get('/', isAuth, checkRole('super_admin', 'admin'), async (req, res, next) => {
  try {
    const db = getSupabaseAdmin();
    const filters = {};

    if (req.auth.role === 'admin') {
      filters.area_id = `eq.${req.auth.areaId}`;
    }

    const users = await db.restSelect('users', {
      select: 'id,email,full_name,role,area_id,is_active,last_login_at,created_at',
      filters,
    });

    res.json({
      success: true,
      data: users,
      total: users.length,
      scope: req.auth.role === 'super_admin' ? 'global' : 'area',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/usuarios/login
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const db = getSupabaseAdmin();

    const users = await db.restSelect('users', {
      select: '*',
      filters: { email: `eq.${email}` },
      limit: 1,
    });

    const usuario = Array.isArray(users) ? users[0] : null;

    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
      });
    }

    // ⚠️ Aquí deberías usar bcrypt en producción
    if (usuario.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
      });
    }

    res.json({
      success: true,
<<<<<<< Updated upstream
      data: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.full_name,
      },
      message: 'Login exitoso',
=======
      data: { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
      message: 'Login exitoso'
=======
 * Rutas de Usuarios (fuente: Supabase)
 */
const express = require('express');
const { getSupabaseAdmin } = require('../config/supabaseClient');
const isAuth = require('../middleware/isAuth');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

/**
 * GET /api/usuarios
 * super_admin: todos
 * admin: solo su área
 */
router.get('/', isAuth, checkRole('super_admin', 'admin'), async (req, res, next) => {
  try {
    const db = getSupabaseAdmin();
    const filters = {};

    if (req.auth.role === 'admin') {
      filters.area_id = `eq.${req.auth.areaId}`;
    }

    const users = await db.restSelect('users', {
      select: 'id,email,full_name,role,area_id,is_active,last_login_at,created_at',
      filters,
    });

    res.json({
      success: true,
      data: users,
      total: users.length,
      scope: req.auth.role === 'super_admin' ? 'global' : 'area',
      timestamp: new Date().toISOString(),
>>>>>>> 20fed7f (commit backend sistema de prestamos)
>>>>>>> Stashed changes
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/usuarios/:id
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
 * Obtiene un usuario por ID desde Supabase
>>>>>>> Stashed changes
 */
router.get('/:id', isAuth, checkRole('super_admin', 'admin'), async (req, res, next) => {
  try {
    const db = getSupabaseAdmin();

    const filters = { id: `eq.${req.params.id}` };

    if (req.auth.role === 'admin') {
      filters.area_id = `eq.${req.auth.areaId}`;
    }

    const users = await db.restSelect('users', {
      select: 'id,email,full_name,role,area_id,is_active,last_login_at,created_at',
      limit: 1,
      filters,
    });

    const user = Array.isArray(users) ? users[0] : null;

    if (!user) {
      return res.status(404).json({
        success: false,
        code: 'USER_NOT_FOUND',
        error: 'Usuario no encontrado',
      });
    }

    return res.json({
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
=======
 */
router.get('/:id', isAuth, checkRole('super_admin', 'admin'), async (req, res, next) => {
  try {
    const db = getSupabaseAdmin();
    const filters = { id: `eq.${req.params.id}` };
    if (req.auth.role === 'admin') {
      filters.area_id = `eq.${req.auth.areaId}`;
    }

    const users = await db.restSelect('users', {
      select: 'id,email,full_name,role,area_id,is_active,last_login_at,created_at',
      limit: 1,
      filters,
    });

    const user = Array.isArray(users) ? users[0] : null;
    if (!user) {
      return res.status(404).json({
        success: false,
        code: 'USER_NOT_FOUND',
        error: 'Usuario no encontrado',
      });
    }

    return res.json({ success: true, data: user, timestamp: new Date().toISOString() });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
>>>>>>> 20fed7f (commit backend sistema de prestamos)
