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

module.exports = router;