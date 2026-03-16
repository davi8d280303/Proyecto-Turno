const AppError = require('../utils/appError');
const { verifyAccessToken } = require('../services/authService');

function isAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      throw new AppError('Token de acceso requerido.', {
        statusCode: 401,
        code: 'AUTH_TOKEN_MISSING',
      });
    }

    const token = authHeader.slice(7).trim();
    const payload = verifyAccessToken(token);

    if (payload.typ !== 'access') {
      throw new AppError('Token inválido.', {
        statusCode: 401,
        code: 'AUTH_TOKEN_INVALID',
      });
    }

    req.auth = {
      userId: payload.sub,
      role: payload.role,
      areaId: payload.area_id,
      exp: payload.exp,
    };

    next();
  } catch (error) {
    if (error.statusCode) return next(error);

    return next(new AppError('Token inválido o expirado.', {
      statusCode: 401,
      code: 'AUTH_TOKEN_INVALID',
    }));
  }
}

module.exports = isAuth;
