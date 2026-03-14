const crypto = require('crypto');

const DEFAULT_SCRYPT_PARAMS = {
  N: 16384,
  r: 8,
  p: 1,
  keylen: 64,
};

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, DEFAULT_SCRYPT_PARAMS.keylen, {
    N: DEFAULT_SCRYPT_PARAMS.N,
    r: DEFAULT_SCRYPT_PARAMS.r,
    p: DEFAULT_SCRYPT_PARAMS.p,
  }).toString('hex');

  return `scrypt$${DEFAULT_SCRYPT_PARAMS.N}$${DEFAULT_SCRYPT_PARAMS.r}$${DEFAULT_SCRYPT_PARAMS.p}$${salt}$${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || !stored.startsWith('scrypt$')) return false;

  const [, n, r, p, salt, hash] = stored.split('$');
  const candidate = crypto.scryptSync(password, salt, hash.length / 2, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  }).toString('hex');

  const hashBuffer = Buffer.from(hash, 'hex');
  const candidateBuffer = Buffer.from(candidate, 'hex');

  if (hashBuffer.length !== candidateBuffer.length) return false;
  return crypto.timingSafeEqual(hashBuffer, candidateBuffer);
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

module.exports = {
  hashPassword,
  verifyPassword,
  sha256,
};
