/**
 * Middleware de manejo de errores global
 */

const errorHandler = (err, req, res, next) => {
<<<<<<< Updated upstream
  console.error('Error:', err.message);
=======
<<<<<<< HEAD
  console.error("Error:", err.message);
>>>>>>> Stashed changes

  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    code,
    error: message,
    fields: err.fields || null,
    timestamp: new Date().toISOString(),
<<<<<<< Updated upstream
    path: req.path,
=======
    path: req.path
=======
  console.error('Error:', err.message);

  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    code,
    error: message,
    fields: err.fields || null,
    timestamp: new Date().toISOString(),
    path: req.path,
>>>>>>> 20fed7f (commit backend sistema de prestamos)
>>>>>>> Stashed changes
  });
};

/**
 * Middleware para rutas no encontradas
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
<<<<<<< Updated upstream
    code: 'ROUTE_NOT_FOUND',
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method,
=======
<<<<<<< HEAD
    error: "Ruta no encontrada",
    path: req.path,
    method: req.method
=======
    code: 'ROUTE_NOT_FOUND',
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method,
>>>>>>> 20fed7f (commit backend sistema de prestamos)
>>>>>>> Stashed changes
  });
};

module.exports = {
  errorHandler,
<<<<<<< Updated upstream
  notFoundHandler,
=======
<<<<<<< HEAD
  notFoundHandler
=======
  notFoundHandler,
>>>>>>> 20fed7f (commit backend sistema de prestamos)
>>>>>>> Stashed changes
};
