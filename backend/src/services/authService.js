<<<<<<< Updated upstream
const crypto = require("crypto");
const { getSupabaseAdmin } = require("../config/supabaseClient");
const { signJwt, verifyJwt, parseExpiresIn } = require("../utils/jwt");
const { verifyPassword, sha256, hashPassword } = require("../utils/password");
const AppError = require("../utils/appError");

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "dev-access-secret-change-me";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "dev-refresh-secret-change-me";
const ACCESS_TOKEN_EXPIRES = parseExpiresIn(
  process.env.ACCESS_TOKEN_EXPIRES,
  900,
);
const REFRESH_TOKEN_EXPIRES = parseExpiresIn(
  process.env.REFRESH_TOKEN_EXPIRES,
  604800,
);

// --- Funciones Internas ---

async function findUserByEmail(email) {
  const db = getSupabaseAdmin();
  const users = await db.restSelect("users", {
    select: "id,email,full_name,role,area_id,password_hash,is_active",
    limit: 1,
    filters: { email: `eq.${email.toLowerCase()}` },
  });
=======
const crypto = require('crypto');
const { getSupabaseAdmin } = require('../config/supabaseClient');
const { signJwt, verifyJwt, parseExpiresIn } = require('../utils/jwt');
const { verifyPassword, sha256 } = require('../utils/password');
const AppError = require('../utils/appError');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'dev-access-secret-change-me';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret-change-me';
const ACCESS_TOKEN_EXPIRES = parseExpiresIn(process.env.ACCESS_TOKEN_EXPIRES, 900);
const REFRESH_TOKEN_EXPIRES = parseExpiresIn(process.env.REFRESH_TOKEN_EXPIRES, 604800);

async function findUserByEmail(email) {
  const db = getSupabaseAdmin();
  const users = await db.restSelect('users', {
    select: 'id,email,full_name,role,area_id,password_hash,is_active',
    limit: 1,
    filters: { email: `eq.${email.toLowerCase()}` },
  });

>>>>>>> Stashed changes
  return Array.isArray(users) ? users[0] : null;
}

async function findUserById(id) {
  const db = getSupabaseAdmin();
<<<<<<< Updated upstream
  const users = await db.restSelect("users", {
    select: "id,email,full_name,role,area_id,is_active,last_login_at",
    limit: 1,
    filters: { id: `eq.${id}` },
  });
  return Array.isArray(users) ? users[0] : null;
}

async function issueAccessToken(user, sessionId) {
  return signJwt(
    {
      sub: user.id,
      role: user.role,
      area_id: user.area_id,
      sid: sessionId,
      typ: "access",
    },
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES,
  );
}

async function enforceSessionLimit(userId, limit = 2) {
  const db = getSupabaseAdmin();
  const activeSessions = await db.restSelect("auth_refresh_tokens", {
    select: "id,created_at",
    filters: {
      user_id: `eq.${userId}`,
      revoked_at: "is.null",
    },
    order: "created_at.asc",
  });

  if (activeSessions && activeSessions.length >= limit) {
    const sessionsToRevoke = activeSessions.slice(
      0,
      activeSessions.length - limit + 1,
    );
    for (const session of sessionsToRevoke) {
      await db.restUpdate(
        "auth_refresh_tokens",
        { revoked_at: new Date().toISOString() },
        { filters: { id: `eq.${session.id}` } },
      );
    }
  }
}

async function issueRefreshToken(userId, userAgent = null, ipAddress = null) {
  const db = getSupabaseAdmin();
  await enforceSessionLimit(userId, 2);

  const sessionId = crypto.randomUUID();
  const token = signJwt(
    { sub: userId, typ: "refresh", jti: sessionId },
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES,
  );
  const tokenHash = sha256(token);
  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRES * 1000,
  ).toISOString();

  await db.restInsert("auth_refresh_tokens", {
    id: sessionId,
    user_id: userId,
    token_hash: tokenHash,
    expires_at: expiresAt,
    user_agent: userAgent,
    ip_address: ipAddress,
  });

  return { token, sessionId };
}

// =============================
// PASSWORD RECOVERY
// =============================

async function requestPasswordRecovery(email) {
  const db = getSupabaseAdmin();

  const user = await findUserByEmail(email.toLowerCase());

  if (!user) {
    return { message: "Si el correo existe, se enviará un enlace." };
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 20).toISOString();

  await db.restInsert("password_recovery_tokens", {
    user_id: user.id,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  console.log(`🔗 Token recuperación: ${rawToken}`);

  return { message: "Si el correo existe, se enviará un enlace." };
}

async function validateRecoveryToken(token) {
  const db = getSupabaseAdmin();

  const tokenHash = sha256(token);

  const records = await db.restSelect("password_recovery_tokens", {
    select: "*",
    limit: 1,
    filters: { token_hash: `eq.${tokenHash}` },
  });

  const record = Array.isArray(records) ? records[0] : null;

  if (!record) return { status: "invalid" };
  if (record.used_at) return { status: "used" };
  if (new Date(record.expires_at) <= new Date()) return { status: "expired" };

  return { status: "valid" };
}

async function resetPassword(token, newPassword) {
  const db = getSupabaseAdmin();

  if (!newPassword || newPassword.length < 6) {
    throw new AppError("Contraseña insegura.", { statusCode: 400 });
  }

  const tokenHash = sha256(token);

  const records = await db.restSelect("password_recovery_tokens", {
    select: "*",
    limit: 1,
    filters: { token_hash: `eq.${tokenHash}` },
  });

  const record = Array.isArray(records) ? records[0] : null;

  if (!record) throw new AppError("Token inválido.", { statusCode: 400 });
  if (record.used_at)
    throw new AppError("Token ya usado.", { statusCode: 400 });
  if (new Date(record.expires_at) <= new Date()) {
    throw new AppError("Token expirado.", { statusCode: 400 });
  }

  const newHash = await hashPassword(newPassword);

  await db.restUpdate(
    "users",
    {
      password_hash: newHash,
    },
    {
      filters: { id: `eq.${record.user_id}` },
    },
  );

  await db.restUpdate(
    "password_recovery_tokens",
    {
      used_at: new Date().toISOString(),
    },
    {
      filters: { id: `eq.${record.id}` },
    },
  );

  return { message: "Contraseña actualizada correctamente." };
}

// --- Funciones Exportadas ---

async function register({ email, password, full_name }) {
  if (!email || !password || !full_name) {
    const err = new Error("Email, contraseña y nombre son requeridos.");
    err.statusCode = 400;
    throw err;
  }

  const db = getSupabaseAdmin();

  // Verificar si el email ya existe
  const existing = await db.restSelect("users", {
    select: "id",
    limit: 1,
    filters: { email: `eq.${email.toLowerCase()}` },
  });

  if (existing && existing.length > 0) {
    const err = new Error("Este correo ya está registrado.");
    err.statusCode = 409;
    throw err;
  }

  const hash = await hashPassword(password);

  // ✅ Validación defensiva (BONUS)
  if (!hash) {
    throw new Error("Error generando hash de contraseña");
  }

  const newUsers = await db.restInsert("users", {
    email: email.toLowerCase(),
    password_hash: hash,
    full_name,
    role: "usuario",
    is_active: true,
  });

  const user = Array.isArray(newUsers) ? newUsers[0] : newUsers;

  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
  };
}

async function login({ email, password, userAgent, ipAddress }) {
  if (!email || !password)
    throw new AppError("Email y contraseña requeridos.", { statusCode: 400 });

  const user = await findUserByEmail(email.toLowerCase().trim());

  // 1. Validar usuario
  if (!user || !user.is_active) {
    throw new AppError("Credenciales inválidas.", { statusCode: 401 });
  }

  // 2. Validar password
  const isValid = await verifyPassword(password, user.password_hash);

  if (!isValid) {
    throw new AppError("Credenciales inválidas.", { statusCode: 401 });
  }
  const db = getSupabaseAdmin();
  await db.restUpdate(
    "users",
    { last_login_at: new Date().toISOString() },
    {
      filters: { id: `eq.${user.id}` },
    },
  );

  const { token: refreshToken, sessionId } = await issueRefreshToken(
    user.id,
    userAgent,
    ipAddress,
  );
  const accessToken = await issueAccessToken(user, sessionId);
=======
  const users = await db.restSelect('users', {
    select: 'id,email,full_name,role,area_id,is_active,last_login_at',
    limit: 1,
    filters: { id: `eq.${id}` },
  });

  return Array.isArray(users) ? users[0] : null;
}

function buildTokenPayload(user) {
  return {
    sub: user.id,
    role: user.role,
    area_id: user.area_id,
  };
}

async function issueRefreshToken(userId) {
  const db = getSupabaseAdmin();
  const tokenId = crypto.randomUUID();
  const token = signJwt({ sub: userId, typ: 'refresh', jti: tokenId }, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES);
  const tokenHash = sha256(token);

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES * 1000).toISOString();
  await db.restInsert('auth_refresh_tokens', {
    id: tokenId,
    user_id: userId,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  return token;
}

async function issueAccessToken(user) {
  return signJwt({ ...buildTokenPayload(user), typ: 'access' }, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES);
}

async function login({ email, password }) {
  if (!email || !password) {
    throw new AppError('Email y contraseña son requeridos.', {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      fields: {
        ...(email ? {} : { email: 'Email requerido' }),
        ...(password ? {} : { password: 'Contraseña requerida' }),
      },
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);
  if (!user || !user.is_active || !verifyPassword(password, user.password_hash)) {
    throw new AppError('Credenciales inválidas.', {
      statusCode: 401,
      code: 'AUTH_INVALID_CREDENTIALS',
    });
  }

  const db = getSupabaseAdmin();
  await db.restUpdate('users', { last_login_at: new Date().toISOString() }, {
    filters: { id: `eq.${user.id}` },
  });

  const accessToken = await issueAccessToken(user);
  const refreshToken = await issueRefreshToken(user.id);
>>>>>>> Stashed changes

  return {
    accessToken,
    refreshToken,
<<<<<<< Updated upstream
    tokenType: "Bearer",
=======
    tokenType: 'Bearer',
>>>>>>> Stashed changes
    expiresIn: ACCESS_TOKEN_EXPIRES,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
<<<<<<< Updated upstream
=======
      area_id: user.area_id,
>>>>>>> Stashed changes
    },
  };
}

async function refreshSession(refreshToken) {
<<<<<<< Updated upstream
  if (!refreshToken)
    throw new AppError("Refresh token requerido.", { statusCode: 400 });
=======
  if (!refreshToken) {
    throw new AppError('Refresh token requerido.', {
      statusCode: 400,
      code: 'REFRESH_TOKEN_REQUIRED',
    });
  }
>>>>>>> Stashed changes

  let payload;
  try {
    payload = verifyJwt(refreshToken, REFRESH_TOKEN_SECRET);
<<<<<<< Updated upstream
  } catch (e) {
    throw new AppError("Token inválido.", { statusCode: 401 });
  }

  const db = getSupabaseAdmin();
  const records = await db.restSelect("auth_refresh_tokens", {
    select: "*",
=======
  } catch (error) {
    throw new AppError('Refresh token inválido.', {
      statusCode: 401,
      code: 'REFRESH_TOKEN_INVALID',
    });
  }

  if (payload.typ !== 'refresh' || !payload.jti) {
    throw new AppError('Refresh token inválido.', {
      statusCode: 401,
      code: 'REFRESH_TOKEN_INVALID',
    });
  }

  const db = getSupabaseAdmin();
  const records = await db.restSelect('auth_refresh_tokens', {
    select: 'id,user_id,token_hash,expires_at,revoked_at',
>>>>>>> Stashed changes
    limit: 1,
    filters: { id: `eq.${payload.jti}` },
  });

  const record = Array.isArray(records) ? records[0] : null;
<<<<<<< Updated upstream
  if (
    !record ||
    record.revoked_at ||
    new Date(record.expires_at) <= new Date() ||
    record.token_hash !== sha256(refreshToken)
  ) {
    throw new AppError("Sesión inválida o expirada.", { statusCode: 401 });
  }

  await db.restUpdate(
    "auth_refresh_tokens",
    { revoked_at: new Date().toISOString() },
    {
      filters: { id: `eq.${record.id}` },
    },
  );

  const user = await findUserById(record.user_id);
  const newSession = await issueRefreshToken(
    user.id,
    record.user_agent,
    record.ip_address,
  );

  return {
    accessToken: await issueAccessToken(user, newSession.sessionId),
    refreshToken: newSession.token,
    tokenType: "Bearer",
=======
  if (!record || record.revoked_at || new Date(record.expires_at) <= new Date()) {
    throw new AppError('Refresh token expirado o revocado.', {
      statusCode: 401,
      code: 'REFRESH_TOKEN_REVOKED',
    });
  }

  if (record.token_hash !== sha256(refreshToken)) {
    throw new AppError('Refresh token inválido.', {
      statusCode: 401,
      code: 'REFRESH_TOKEN_INVALID',
    });
  }

  await db.restUpdate('auth_refresh_tokens', { revoked_at: new Date().toISOString() }, {
    filters: { id: `eq.${record.id}` },
  });

  const user = await findUserById(record.user_id);
  if (!user || !user.is_active) {
    throw new AppError('Usuario no disponible.', {
      statusCode: 401,
      code: 'USER_INACTIVE',
    });
  }

  return {
    accessToken: await issueAccessToken(user),
    refreshToken: await issueRefreshToken(user.id),
    tokenType: 'Bearer',
>>>>>>> Stashed changes
    expiresIn: ACCESS_TOKEN_EXPIRES,
  };
}

<<<<<<< Updated upstream
async function logout(sessionId) {
  const db = getSupabaseAdmin();
  await db.restUpdate(
    "auth_refresh_tokens",
    { revoked_at: new Date().toISOString() },
    {
      filters: { id: `eq.${sessionId}` },
    },
  );
}

async function isSessionActive(sessionId) {
  if (!sessionId) return false;
  const db = getSupabaseAdmin();
  const records = await db.restSelect("auth_refresh_tokens", {
    select: "id,revoked_at,expires_at",
    limit: 1,
    filters: { id: `eq.${sessionId}` },
  });
  const record = Array.isArray(records) ? records[0] : null;
  return (
    record && !record.revoked_at && new Date(record.expires_at) > new Date()
  );
}

async function getUserSessions(userId) {
  const db = getSupabaseAdmin();
  return await db.restSelect("auth_refresh_tokens", {
    select: "id, user_agent, ip_address, created_at",
    filters: {
      user_id: `eq.${userId}`,
      revoked_at: "is.null",
    },
  });
=======
async function getProfile(userId) {
  const user = await findUserById(userId);
  if (!user) {
    throw new AppError('Usuario no encontrado.', {
      statusCode: 404,
      code: 'USER_NOT_FOUND',
    });
  }

  return user;
>>>>>>> Stashed changes
}

module.exports = {
  login,
  refreshSession,
<<<<<<< Updated upstream
  getProfile: findUserById,
  logout,
  isSessionActive,
  register,
  getUserSessions,
  verifyAccessToken(token) {
    return verifyJwt(token, ACCESS_TOKEN_SECRET);
  },

  // 👇 NUEVO
  requestPasswordRecovery,
  validateRecoveryToken,
  resetPassword,
=======
  getProfile,
  verifyAccessToken(token) {
    return verifyJwt(token, ACCESS_TOKEN_SECRET);
  },
>>>>>>> Stashed changes
};
