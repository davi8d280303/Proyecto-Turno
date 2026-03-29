const crypto = require('crypto');
const { getSupabaseAdmin } = require('../config/supabaseClient');
const { signJwt, verifyJwt, parseExpiresIn } = require('../utils/jwt');
const { verifyPassword, sha256 } = require('../utils/password');
const AppError = require('../utils/appError');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'dev-access-secret-change-me';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret-change-me';
const ACCESS_TOKEN_EXPIRES = parseExpiresIn(process.env.ACCESS_TOKEN_EXPIRES, 900);
const REFRESH_TOKEN_EXPIRES = parseExpiresIn(process.env.REFRESH_TOKEN_EXPIRES, 604800);

// --- Funciones Internas ---

async function findUserByEmail(email) {
  const db = getSupabaseAdmin();
  const users = await db.restSelect('users', {
    select: 'id,email,full_name,role,area_id,password_hash,is_active',
    limit: 1,
    filters: { email: `eq.${email.toLowerCase()}` },
  });
  return Array.isArray(users) ? users[0] : null;
}

async function findUserById(id) {
  const db = getSupabaseAdmin();
  const users = await db.restSelect('users', {
    select: 'id,email,full_name,role,area_id,is_active,last_login_at',
    limit: 1,
    filters: { id: `eq.${id}` },
  });
  return Array.isArray(users) ? users[0] : null;
}

async function issueAccessToken(user, sessionId) {
  return signJwt({ 
    sub: user.id, 
    role: user.role, 
    area_id: user.area_id,
    sid: sessionId, 
    typ: 'access' 
  }, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES);
}

async function enforceSessionLimit(userId, limit = 2) {
  const db = getSupabaseAdmin();
  const activeSessions = await db.restSelect('auth_refresh_tokens', {
    select: 'id,created_at',
    filters: { 
        user_id: `eq.${userId}`,
        revoked_at: 'is.null'
    },
    order: 'created_at.asc'
  });

  if (activeSessions && activeSessions.length >= limit) {
    const sessionsToRevoke = activeSessions.slice(0, (activeSessions.length - limit) + 1);
    for (const session of sessionsToRevoke) {
      await db.restUpdate('auth_refresh_tokens', 
        { revoked_at: new Date().toISOString() }, 
        { filters: { id: `eq.${session.id}` } }
      );
    }
  }
}

async function issueRefreshToken(userId, userAgent = null, ipAddress = null) {
  const db = getSupabaseAdmin();
  await enforceSessionLimit(userId, 2);

  const sessionId = crypto.randomUUID();
  const token = signJwt({ sub: userId, typ: 'refresh', jti: sessionId }, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES);
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES * 1000).toISOString();
  
  await db.restInsert('auth_refresh_tokens', {
    id: sessionId,
    user_id: userId,
    token_hash: tokenHash,
    expires_at: expiresAt,
    user_agent: userAgent,
    ip_address: ipAddress
  });

  return { token, sessionId };
}

// --- Funciones Exportadas ---

async function login({ email, password, userAgent, ipAddress }) {
  if (!email || !password) throw new AppError('Email y contraseña requeridos.', { statusCode: 400 });

  const user = await findUserByEmail(email);
  if (!user || !user.is_active || !verifyPassword(password, user.password_hash)) {
    throw new AppError('Credenciales inválidas.', { statusCode: 401 });
  }

  const db = getSupabaseAdmin();
  await db.restUpdate('users', { last_login_at: new Date().toISOString() }, {
    filters: { id: `eq.${user.id}` },
  });

  const { token: refreshToken, sessionId } = await issueRefreshToken(user.id, userAgent, ipAddress);
  const accessToken = await issueAccessToken(user, sessionId);

  return {
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: ACCESS_TOKEN_EXPIRES,
    user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
  };
}

async function refreshSession(refreshToken) {
  if (!refreshToken) throw new AppError('Refresh token requerido.', { statusCode: 400 });

  let payload;
  try {
    payload = verifyJwt(refreshToken, REFRESH_TOKEN_SECRET);
  } catch (e) { throw new AppError('Token inválido.', { statusCode: 401 }); }

  const db = getSupabaseAdmin();
  const records = await db.restSelect('auth_refresh_tokens', {
    select: '*',
    limit: 1,
    filters: { id: `eq.${payload.jti}` },
  });

  const record = Array.isArray(records) ? records[0] : null;
  if (!record || record.revoked_at || new Date(record.expires_at) <= new Date() || record.token_hash !== sha256(refreshToken)) {
    throw new AppError('Sesión inválida o expirada.', { statusCode: 401 });
  }

  await db.restUpdate('auth_refresh_tokens', { revoked_at: new Date().toISOString() }, {
    filters: { id: `eq.${record.id}` },
  });

  const user = await findUserById(record.user_id);
  const newSession = await issueRefreshToken(user.id, record.user_agent, record.ip_address);
  
  return {
    accessToken: await issueAccessToken(user, newSession.sessionId),
    refreshToken: newSession.token,
    tokenType: 'Bearer',
    expiresIn: ACCESS_TOKEN_EXPIRES,
  };
}

async function logout(sessionId) {
  const db = getSupabaseAdmin();
  await db.restUpdate('auth_refresh_tokens', { revoked_at: new Date().toISOString() }, {
    filters: { id: `eq.${sessionId}` },
  });
}

async function isSessionActive(sessionId) {
  if (!sessionId) return false;
  const db = getSupabaseAdmin();
  const records = await db.restSelect('auth_refresh_tokens', {
    select: 'id,revoked_at,expires_at',
    limit: 1,
    filters: { id: `eq.${sessionId}` },
  });
  const record = Array.isArray(records) ? records[0] : null;
  return record && !record.revoked_at && new Date(record.expires_at) > new Date();
}

async function getUserSessions(userId) {
    const db = getSupabaseAdmin();
    return await db.restSelect('auth_refresh_tokens', {
        select: 'id, user_agent, ip_address, created_at',
        filters: { 
            user_id: `eq.${userId}`,
            revoked_at: 'is.null'
        }
    });
}

module.exports = {
  login,
  refreshSession,
  getProfile: findUserById,
  logout,
  isSessionActive,
  getUserSessions,
  verifyAccessToken(token) {
    return verifyJwt(token, ACCESS_TOKEN_SECRET);
  },
};