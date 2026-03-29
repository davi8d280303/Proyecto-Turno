/**
 * Rutas de Usuarios - Conectadas a Supabase
 */
const express = require('express');
const router = express.Router();
const supabase = require('../loaders/supabaseClient'); // Importamos tu cliente de Supabase

/**
 * GET /api/usuarios
 * Obtiene todos los usuarios de la tabla de Supabase
 */
router.get('/', async (req, res, next) => {
  try {
    console.log('GET /api/usuarios desde Supabase');
    
    // Consultamos la tabla 'usuarios'
    const { data, error } = await supabase
      .from('usuarios')
      .select('*');

    if (error) throw error;
    
    res.json({
      success: true,
      data: data,
      total: data.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/usuarios/login
 * Nueva ruta para el Login real
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(`Intentando login para: ${email}`);

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !usuario) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Validación simple (En el futuro usa bcrypt para comparar contraseñas encriptadas)
    if (usuario.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    res.json({
      success: true,
      data: { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
      message: 'Login exitoso'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/usuarios/:id
 * Obtiene un usuario por ID desde Supabase
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`GET /api/usuarios/${id} desde Supabase`);
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;