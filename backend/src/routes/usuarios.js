/**
 * Rutas de Usuarios
 * Consume data de JSONPlaceholder API
 */
const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_URL = 'https://jsonplaceholder.typicode.com';

/**
 * GET /api/usuarios
 * Obtiene todos los usuarios
 */
router.get('/', async (req, res, next) => {
  try {
    console.log('GET /api/usuarios');
    const response = await axios.get(`${API_URL}/users`);
    
    res.json({
      success: true,
      data: response.data,
      total: response.data.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/usuarios/:id
 * Obtiene un usuario por ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`GET /api/usuarios/${id}`);
    
    const response = await axios.get(`${API_URL}/users/${id}`);
    
    if (!response.data) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    next(error);
  }
});

/**
 * GET /api/usuarios/:id/posts
 * Obtiene los posts de un usuario
 */
router.get('/:id/posts', async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`GET /api/usuarios/${id}/posts`);
    
    const response = await axios.get(`${API_URL}/users/${id}/posts`);
    
    res.json({
      success: true,
      data: response.data,
      total: response.data.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
