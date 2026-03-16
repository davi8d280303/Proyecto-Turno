const crypto = require('crypto');
const { encode, decode } = require('./base64url');

function parseExpiresIn(value, fallbackSeconds) {
  if (!value) return fallbackSeconds;
  if (/^\d+$/.test(String(value))) return Number(value);

  const match = String(value).match(/^(\d+)([smhd])$/i);
  if (!match) return fallbackSeconds;

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const map = { s: 1, m: 60, h: 3600, d: 86400 };
  return amount * map[unit];
}

function signJwt(payload, secret, expiresInSeconds = 900) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds };

  const encodedHeader = encode(JSON.stringify(header));
  const encodedPayload = encode(JSON.stringify(fullPayload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto.createHmac('sha256', secret).update(data).digest();
  return `${data}.${encode(signature)}`;
}

function verifyJwt(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Token inválido');
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  const expected = encode(crypto.createHmac('sha256', secret).update(data).digest());

  if (expected !== signature) {
    throw new Error('Firma inválida');
  }

  const payload = JSON.parse(decode(encodedPayload).toString('utf8'));
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && now >= payload.exp) {
    throw new Error('Token expirado');
  }

  return payload;
}

module.exports = {
  signJwt,
  verifyJwt,
  parseExpiresIn,
};
