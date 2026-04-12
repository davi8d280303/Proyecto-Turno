const express  = require('express');
const router   = express.Router();

const usuariosRoutes  = require('./usuarios');
const authRoutes      = require('./auth');
const inventarioRoutes = require('./inventario');
const areasRoutes     = require('./areas');      // ← NUEVO

const { checkSupabaseConnection }  = require('../services/supabaseHealthService');
const { getSupabaseConfigStatus }  = require('../config/supabaseClient');

// ─── Health ───────────────────────────────────
router.get('/health', (req, res) => {
  res.json({
    status:      'API activa',
    timestamp:   new Date().toISOString(),
    uptime:      process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

router.get('/health/supabase', async (req, res, next) => {
  try {
    const config = getSupabaseConfigStatus();

    if (!config.urlConfigured || !config.serviceRoleConfigured) {
      return res.status(503).json({
        success: false,
        status:  'Supabase no configurado',
        config,
      });
    }

    const connection = await checkSupabaseConnection();
    res.json({ success: true, status: 'Supabase activo', config, connection });
  } catch (error) {
    next(error);
  }
});

// ─── Info ─────────────────────────────────────
router.get('/', (req, res) => {
  res.json({
    name:    'API Sistema Préstamos',
    version: '2.0.0',
    endpoints: {
      auth:       '/api/auth',
      usuarios:   '/api/usuarios',
      inventario: '/api/inventario',
      areas:      '/api/areas',
      prestamos:  '/api/prestamos',
    },
  });
});

// ─── Rutas principales ────────────────────────
router.use('/auth',       authRoutes);
router.use('/usuarios',   usuariosRoutes);
router.use('/inventario', inventarioRoutes);
router.use('/areas',      areasRoutes);
router.use('/prestamos', require('./prestamos'));

module.exports = router;
