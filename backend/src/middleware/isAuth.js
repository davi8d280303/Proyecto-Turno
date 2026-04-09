const AppError = require('../utils/appError');
<<<<<<< Updated upstream
const { verifyAccessToken, isSessionActive } = require('../services/authService');

async function isAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      throw new AppError('Token de acceso requerido.', { statusCode: 401 });
=======
const { verifyAccessToken } = require('../services/authService');

function isAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      throw new AppError('Token de acceso requerido.', {
        statusCode: 401,
        code: 'AUTH_TOKEN_MISSING',
      });
>>>>>>> Stashed changes
    }

    const token = authHeader.slice(7).trim();
    const payload = verifyAccessToken(token);

<<<<<<< Updated upstream
    // Tarea: Validar sesión en cada petición (Revisar si el SID no fue revocado en DB)
    const active = await isSessionActive(payload.sid);
    if (!active) {
      throw new AppError('La sesión ha sido invalidada o ha expirado.', { statusCode: 401 });
=======
    if (payload.typ !== 'access') {
      throw new AppError('Token inválido.', {
        statusCode: 401,
        code: 'AUTH_TOKEN_INVALID',
      });
>>>>>>> Stashed changes
    }

    req.auth = {
      userId: payload.sub,
      role: payload.role,
      areaId: payload.area_id,
<<<<<<< Updated upstream
      sessionId: payload.sid, // Guardamos el SID para poder hacer logout
=======
>>>>>>> Stashed changes
      exp: payload.exp,
    };

    next();
  } catch (error) {
<<<<<<< Updated upstream
    next(error.statusCode ? error : new AppError('Sesión no válida.', { statusCode: 401 }));
  }
}

module.exports = isAuth;
=======
    if (error.statusCode) return next(error);

    return next(new AppError('Token inválido o expirado.', {
      statusCode: 401,
      code: 'AUTH_TOKEN_INVALID',
    }));
  }
}

module.exports = isAuth;
>>>>>>> Stashed changes
