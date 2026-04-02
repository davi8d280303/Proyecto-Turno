const AppError = require('../utils/appError');
const { verifyAccessToken, isSessionActive } = require('../services/authService');

async function isAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      throw new AppError('Token de acceso requerido.', { statusCode: 401 });
    }

    const token = authHeader.slice(7).trim();
    const payload = verifyAccessToken(token);

    // Tarea: Validar sesión en cada petición (Revisar si el SID no fue revocado en DB)
    const active = await isSessionActive(payload.sid);
    if (!active) {
      throw new AppError('La sesión ha sido invalidada o ha expirado.', { statusCode: 401 });
    }

    req.auth = {
      userId: payload.sub,
      role: payload.role,
      areaId: payload.area_id,
      sessionId: payload.sid, // Guardamos el SID para poder hacer logout
      exp: payload.exp,
    };

    next();
  } catch (error) {
    next(error.statusCode ? error : new AppError('Sesión no válida.', { statusCode: 401 }));
  }
}

module.exports = isAuth;