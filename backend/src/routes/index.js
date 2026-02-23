/**
 * Rutas de salud del servidor y utilidades
 */
const express = require('express');
const router = express.Router();
const usuariosRoutes = require('./usuarios');

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'API activa',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Info del servidor
router.get('/', (req, res) => {
  res.json({
    name: 'API Sistema Préstamos',
    version: '1.0.0',
    description: 'Backend para sistema de gestión de préstamos',
    endpoints: {
      health: '/api/health',
      usuarios: '/api/usuarios',
      prestamos: '/api/prestamos',
      inventario: '/api/inventario'
    }
  });
});

// Rutas principales
router.use('/usuarios', usuariosRoutes);

module.exports = router;
