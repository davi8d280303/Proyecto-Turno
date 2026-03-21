const express = require('express');
const { login, refreshSession, getProfile, logout } = require('../services/authService');
const isAuth = require('../middleware/isAuth');
const loginRateLimit = require('../middleware/loginRateLimit');

const router = express.Router();

router.post('/login', loginRateLimit, async (req, res, next) => {
  try {
    // Tarea: Manejar info de conexión (userAgent e IP)
    const session = await login({ 
      ...(req.body || {}), 
      userAgent: req.headers['user-agent'], 
      ipAddress: req.ip 
    });
    res.json({ success: true, data: session, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const result = await refreshSession(req.body?.refreshToken);
    res.json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// Tarea: Implementar invalidación de sesiones
router.post('/logout', isAuth, async (req, res, next) => {
  try {
    await logout(req.auth.sessionId);
    res.json({ success: true, message: 'Sesión cerrada correctamente' });
  } catch (error) {
    next(error);
  }
});

router.get('/me', isAuth, async (req, res, next) => {
  try {
    const user = await getProfile(req.auth.userId);
    res.json({ success: true, data: user, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

module.exports = router;