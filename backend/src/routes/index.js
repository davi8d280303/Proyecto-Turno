/**
 * Rutas de salud del servidor y utilidades
 */
const express = require('express');
const router = express.Router();
const usuariosRoutes = require('./usuarios');
<<<<<<< Updated upstream
const authRoutes = require('./auth');
const { checkSupabaseConnection } = require('../services/supabaseHealthService');
const { getSupabaseConfigStatus } = require('../config/supabaseClient');
const inventarioRoutes = require('./inventario'); 

=======
<<<<<<< HEAD
=======
const authRoutes = require('./auth');
const { checkSupabaseConnection } = require('../services/supabaseHealthService');
const { getSupabaseConfigStatus } = require('../config/supabaseClient');
>>>>>>> 20fed7f (commit backend sistema de prestamos)
>>>>>>> Stashed changes

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'API activa',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
<<<<<<< Updated upstream
    environment: process.env.NODE_ENV,
  });
});

=======
<<<<<<< HEAD
    environment: process.env.NODE_ENV
  });
});

=======
    environment: process.env.NODE_ENV,
  });
});

>>>>>>> Stashed changes
// Health check de Supabase (sin exponer secretos)
router.get('/health/supabase', async (req, res, next) => {
  try {
    const config = getSupabaseConfigStatus();

    if (!config.urlConfigured || !config.serviceRoleConfigured) {
      return res.status(503).json({
        success: false,
        status: 'Supabase no configurado',
        config,
        timestamp: new Date().toISOString(),
      });
    }

    const connection = await checkSupabaseConnection();

    return res.json({
      success: true,
      status: 'Supabase activo',
      config,
      connection,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return next(error);
  }
});

<<<<<<< Updated upstream
=======
>>>>>>> 20fed7f (commit backend sistema de prestamos)
>>>>>>> Stashed changes
// Info del servidor
router.get('/', (req, res) => {
  res.json({
    name: 'API Sistema Préstamos',
<<<<<<< Updated upstream
    version: '2.0.0',
=======
<<<<<<< HEAD
    version: '1.0.0',
>>>>>>> Stashed changes
    description: 'Backend para sistema de gestión de préstamos',
    endpoints: {
      health: '/api/health',
      supabaseHealth: '/api/health/supabase',
      auth: {
        login: '/api/auth/login',
        refresh: '/api/auth/refresh',
        me: '/api/auth/me',
      },
      usuarios: '/api/usuarios',
      prestamos: '/api/prestamos',
<<<<<<< Updated upstream
      inventario: '/api/inventario',
    },
=======
      inventario: '/api/inventario'
    }
=======
    version: '2.0.0',
    description: 'Backend para sistema de gestión de préstamos',
    endpoints: {
      health: '/api/health',
      supabaseHealth: '/api/health/supabase',
      auth: {
        login: '/api/auth/login',
        refresh: '/api/auth/refresh',
        me: '/api/auth/me',
      },
      usuarios: '/api/usuarios',
      prestamos: '/api/prestamos',
      inventario: '/api/inventario',
    },
>>>>>>> 20fed7f (commit backend sistema de prestamos)
>>>>>>> Stashed changes
  });
});

// Rutas principales
<<<<<<< Updated upstream
router.use('/auth', authRoutes);
=======
<<<<<<< HEAD
=======
router.use('/auth', authRoutes);
>>>>>>> 20fed7f (commit backend sistema de prestamos)
>>>>>>> Stashed changes
router.use('/usuarios', usuariosRoutes);
router.use('/inventario', inventarioRoutes);

// Health check para verificar que la API está viva
router.get('/health', (req, res) => {
  res.json({ success: true, status: 'OK', uptime: process.uptime() });
});

module.exports = router;
