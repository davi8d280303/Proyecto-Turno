const test = require('node:test');
const assert = require('node:assert/strict');
const { signJwt, verifyJwt, parseExpiresIn } = require('../src/utils/jwt');
const { hashPassword, verifyPassword } = require('../src/utils/password');

const SECRET = 'test-secret';

test('jwt sign/verify works', () => {
  const token = signJwt({ sub: 'user-1', typ: 'access' }, SECRET, 120);
  const payload = verifyJwt(token, SECRET);

  assert.equal(payload.sub, 'user-1');
  assert.equal(payload.typ, 'access');
  assert.ok(payload.exp > payload.iat);
});

test('jwt verify fails with wrong secret', () => {
  const token = signJwt({ sub: 'user-1' }, SECRET, 120);
  assert.throws(() => verifyJwt(token, 'other-secret'));
});

test('parseExpiresIn parses shorthand', () => {
  assert.equal(parseExpiresIn('15m', 10), 900);
  assert.equal(parseExpiresIn('7d', 10), 604800);
  assert.equal(parseExpiresIn('120', 10), 120);
  assert.equal(parseExpiresIn('bad', 10), 10);
});

test('password hashing and verify', () => {
  const hash = hashPassword('MyS3cret!');
  assert.ok(hash.startsWith('scrypt$'));
  assert.equal(verifyPassword('MyS3cret!', hash), true);
  assert.equal(verifyPassword('wrong', hash), false);
});
