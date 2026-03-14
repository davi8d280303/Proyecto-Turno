const AppError = require('../utils/appError');

const attempts = new Map();
const WINDOW_MS = Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || 60000);
const MAX_ATTEMPTS = Number(process.env.LOGIN_RATE_LIMIT_MAX || 8);

function loginRateLimit(req, res, next) {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = attempts.get(ip) || { count: 0, start: now };

  if (now - entry.start > WINDOW_MS) {
    entry.count = 0;
    entry.start = now;
  }

  entry.count += 1;
  attempts.set(ip, entry);

  if (entry.count > MAX_ATTEMPTS) {
    return next(new AppError('Demasiados intentos de login. Intenta más tarde.', {
      statusCode: 429,
      code: 'LOGIN_RATE_LIMITED',
    }));
  }

  return next();
}

module.exports = loginRateLimit;
