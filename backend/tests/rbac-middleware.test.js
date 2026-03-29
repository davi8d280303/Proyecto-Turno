const test = require('node:test');
const assert = require('node:assert/strict');

const checkRole = require('../src/middleware/checkRole');
const checkAreaAccess = require('../src/middleware/checkAreaAccess');

function runMiddleware(middleware, req) {
  return new Promise((resolve) => {
    middleware(req, {}, (err) => resolve(err || null));
  });
}

test('checkRole allows configured role', async () => {
  const middleware = checkRole('super_admin', 'admin');
  const err = await runMiddleware(middleware, { auth: { role: 'admin' } });
  assert.equal(err, null);
});

test('checkRole blocks unauthorized role', async () => {
  const middleware = checkRole('super_admin');
  const err = await runMiddleware(middleware, { auth: { role: 'usuario' } });
  assert.ok(err);
  assert.equal(err.statusCode, 403);
});

test('checkAreaAccess allows super admin', async () => {
  const middleware = checkAreaAccess((req) => req.params.areaId);
  const err = await runMiddleware(middleware, { auth: { role: 'super_admin', areaId: 'a1' }, params: { areaId: 'x' } });
  assert.equal(err, null);
});

test('checkAreaAccess blocks admin from other area', async () => {
  const middleware = checkAreaAccess((req) => req.params.areaId);
  const err = await runMiddleware(middleware, { auth: { role: 'admin', areaId: 'a1' }, params: { areaId: 'a2' } });
  assert.ok(err);
  assert.equal(err.statusCode, 403);
});
