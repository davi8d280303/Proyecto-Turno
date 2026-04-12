const express = require('express');
const { 
  login, 
  refreshSession, 
  getProfile, 
  logout,
  requestPasswordRecovery,
  validateRecoveryToken,
  resetPassword,
  register
} = require('../services/authService');

const isAuth = require('../middleware/isAuth');
const loginRateLimit = require('../middleware/loginRateLimit');
const { verifyPassword, hashPassword } = require('../utils/password');

const router = express.Router();

// =============================
// LOGIN
// =============================
router.post('/login', loginRateLimit, async (req, res, next) => {
  try {
    const session = await login({ 
      ...(req.body || {}), 
      userAgent: req.headers['user-agent'], 
      ipAddress: req.ip 
    });

    res.json({ 
      success: true, 
      data: session, 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    next(error);
  }
});

// =============================
// REGISTRO
// =============================
router.post('/register', async (req, res, next) => {
  try {
    const user = await register(req.body || {});
    res.status(201).json({
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// =============================
// REFRESH TOKEN
// =============================
router.post('/refresh', async (req, res, next) => {
  try {
    const result = await refreshSession(req.body?.refreshToken);

    res.json({ 
      success: true, 
      data: result, 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    next(error);
  }
});

// =============================
// LOGOUT
// =============================
router.post('/logout', isAuth, async (req, res, next) => {
  try {
    await logout(req.auth.sessionId);

    res.json({ 
      success: true, 
      message: 'Sesión cerrada correctamente' 
    });
  } catch (error) {
    next(error);
  }
});

// =============================
// PERFIL
// =============================
router.get('/me', isAuth, async (req, res, next) => {
  try {
    const user = await getProfile(req.auth.userId);

    res.json({ 
      success: true, 
      data: user, 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    next(error);
  }
});

// =============================
// PASSWORD RECOVERY
// =============================

// 🔹 1. Solicitar recuperación
router.post('/password-recovery', async (req, res, next) => {
  try {
    const result = await requestPasswordRecovery(req.body?.email);

    res.json({ 
      success: true, 
      ...result 
    });
  } catch (error) {
    next(error);
  }
});

// 🔹 2. Validar token
router.post('/password-recovery/validate', async (req, res, next) => {
  try {
    const result = await validateRecoveryToken(req.body?.token);

    res.json({ 
      success: true, 
      ...result 
    });
  } catch (error) {
    next(error);
  }
});

// 🔹 3. Reset password
router.post('/password-recovery/reset', async (req, res, next) => {
  try {
    const result = await resetPassword(
      req.body?.token,
      req.body?.password
    );

    res.json({ 
      success: true, 
      ...result 
    });
  } catch (error) {
    next(error);
  }
});

// =============================
// ACTUALIZAR NOMBRE (perfil)
// PATCH /api/auth/me
// =============================
router.patch('/me', isAuth, async (req, res, next) => {
  try {
    const { full_name } = req.body;
 
    if (!full_name?.trim()) {
      return res.status(400).json({ success: false, error: 'El nombre no puede estar vacío.' });
    }
 
    const db   = getSupabaseAdmin();
    const data = await db.restUpdate(
      'users',
      { full_name: full_name.trim() },
      { filters: { id: `eq.${req.auth.userId}` } }
    );
 
    const updated = Array.isArray(data) ? data[0] : data;
 
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});
 
// =============================
// CAMBIAR CONTRASEÑA
// PATCH /api/auth/password
// =============================
router.patch('/password', isAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
 
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Ambas contraseñas son requeridas.' });
    }
 
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    }
 
    const db = getSupabaseAdmin();
 
    // Obtener el hash actual del usuario
    const users = await db.restSelect('users', {
      select:  'id,password_hash',
      limit:   1,
      filters: { id: `eq.${req.auth.userId}` },
    });
    const user = Array.isArray(users) ? users[0] : null;
 
    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado.' });
    }
 
    // Verificar que la contraseña actual sea correcta
    if (!verifyPassword(currentPassword, user.password_hash)) {
      return res.status(401).json({ success: false, error: 'La contraseña actual es incorrecta.' });
    }
 
    // Guardar la nueva contraseña hasheada
    await db.restUpdate(
      'users',
      { password_hash: hashPassword(newPassword) },
      { filters: { id: `eq.${req.auth.userId}` } }
    );
 
    res.json({ success: true, message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;