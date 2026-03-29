require('dotenv').config();
const test = require('node:test');
const assert = require('node:assert');

const { login, logout, isSessionActive, verifyAccessToken } = require('../src/services/authService');
const { getSupabaseAdmin } = require('../src/config/supabaseClient');
const { hashPassword } = require('../src/utils/password');

const TEST_USER = {
  email: 'test_auto@ejemplo.com',
  password: 'Password123!',
};

test('Manejo de Sesiones Concurrentes (Límite 2)', async (t) => {
  const db = getSupabaseAdmin();
  let userId;

  await t.before(async () => {
    const users = await db.restSelect('users', {
      select: 'id,email',
      limit: 1,
      filters: { email: `eq.${TEST_USER.email}` },
    });

    if (users && users.length > 0) {
      userId = users[0].id;

      await db.restUpdate(
        'users',
        {
          password_hash: hashPassword(TEST_USER.password),
          full_name: 'Test Bot',
          role: 'usuario',
          is_active: true,
        },
        {
          filters: { id: `eq.${userId}` },
        }
      );
    } else {
      await db.restInsert('users', {
        email: TEST_USER.email,
        password_hash: hashPassword(TEST_USER.password),
        full_name: 'Test Bot',
        role: 'usuario',
        is_active: true,
      });

      const retryFetch = await db.restSelect('users', {
        select: 'id',
        limit: 1,
        filters: { email: `eq.${TEST_USER.email}` },
      });

      userId = retryFetch[0].id;
    }

    await db.restDelete('auth_refresh_tokens', {
      filters: { user_id: `eq.${userId}` },
    });
  });

  await t.test('Debe permitir 2 sesiones activas y revocar la primera al iniciar una tercera', async () => {
    const s1 = await login({ ...TEST_USER, userAgent: 'PC' });
    const sid1 = verifyAccessToken(s1.accessToken).sid;

    const s2 = await login({ ...TEST_USER, userAgent: 'Mobile' });
    const sid2 = verifyAccessToken(s2.accessToken).sid;

    assert.strictEqual(await isSessionActive(sid1), true, 'Sesión 1 debe estar activa');
    assert.strictEqual(await isSessionActive(sid2), true, 'Sesión 2 debe estar activa');

    const s3 = await login({ ...TEST_USER, userAgent: 'Tablet' });
    const sid3 = verifyAccessToken(s3.accessToken).sid;

    assert.strictEqual(await isSessionActive(sid1), false, 'Sesión 1 debe haber sido revocada');
    assert.strictEqual(await isSessionActive(sid2), true, 'Sesión 2 debe seguir activa');
    assert.strictEqual(await isSessionActive(sid3), true, 'Sesión 3 debe estar activa');
  });

  await t.test('Debe invalidar la sesión correctamente al hacer Logout', async () => {
    const s = await login({ ...TEST_USER, userAgent: 'Logout-Test' });
    const sid = verifyAccessToken(s.accessToken).sid;

    await logout(sid);

    const active = await isSessionActive(sid);
    assert.strictEqual(active, false, 'La sesión debe estar inactiva tras logout');
  });
});