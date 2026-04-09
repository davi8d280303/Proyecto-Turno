const AppError = require('../utils/appError');

function checkAreaAccess(getTargetAreaId) {
  return (req, res, next) => {
    const role = req.auth?.role;
    const userAreaId = req.auth?.areaId;

    if (!role) {
      return next(new AppError('No autenticado.', { statusCode: 401, code: 'AUTH_REQUIRED' }));
    }

    if (role === 'super_admin') {
      return next();
    }

    const targetAreaId = getTargetAreaId(req);
    if (!targetAreaId) {
      return next(new AppError('No se pudo determinar el área del recurso.', {
        statusCode: 400,
        code: 'AREA_TARGET_REQUIRED',
      }));
    }

    if (role === 'admin' && targetAreaId === userAreaId) {
      return next();
    }

    return next(new AppError('No tienes permisos para operar fuera de tu área.', {
      statusCode: 403,
      code: 'AREA_FORBIDDEN',
    }));
  };
}

module.exports = checkAreaAccess;
