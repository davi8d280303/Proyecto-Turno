const express = require('express');
const { login, refreshSession, getProfile } = require('../services/authService');
const isAuth = require('../middleware/isAuth');
const loginRateLimit = require('../middleware/loginRateLimit');

const router = express.Router();

router.post('/login', loginRateLimit, async (req, res, next) => {
  try {
    const session = await login(req.body || {});
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

router.get('/me', isAuth, async (req, res, next) => {
  try {
    const user = await getProfile(req.auth.userId);
    res.json({ success: true, data: user, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
