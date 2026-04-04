const AppError = require('../utils/appError');

function checkRole(...allowedRoles) {
  return (req, res, next) => {
    // Leer rol del usuario
    if (!req.auth?.role) {
      return next(new AppError('No autenticado.', { statusCode: 401, code: 'AUTH_REQUIRED' }));
    }

    // Comparar con rol requerido y bloquear si no coincide
    if (!allowedRoles.includes(req.auth.role)) {
      return next(new AppError('No autorizado para esta acción.', {
        statusCode: 403,
        code: 'RBAC_FORBIDDEN',
      }));
    }

    // Permitir acceso
    return next();
  };
}

module.exports = checkRole;