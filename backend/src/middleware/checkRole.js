const AppError = require('../utils/appError');

function checkRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.auth?.role) {
      return next(new AppError('No autenticado.', { statusCode: 401, code: 'AUTH_REQUIRED' }));
    }

    if (!allowedRoles.includes(req.auth.role)) {
      return next(new AppError('No autorizado para esta acción.', {
        statusCode: 403,
        code: 'RBAC_FORBIDDEN',
      }));
    }

    return next();
  };
}

module.exports = checkRole;
