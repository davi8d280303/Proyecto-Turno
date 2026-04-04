const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/index'); // Importamos tu servidor Express

test('QA: 1. Acceso sin token (Directo por URL) debe ser bloqueado con 401', async () => {
  const res = await request(app).get('/api/usuarios');
  
  // Solo validamos el código HTTP, que es la barrera real
  assert.equal(res.statusCode, 401);
});

test('QA: 2. Acceso con token mal formado o inválido debe ser bloqueado con 401', async () => {
  const res = await request(app)
    .get('/api/usuarios/perfil')
    .set('Authorization', 'Bearer token_ficticio_inventado');
    
  assert.equal(res.statusCode, 401);
});

test('QA: 3. Intentar acceder a ruta de sistema sin autorización falla en backend', async () => {
  const res = await request(app).post('/api/auth/logout'); // Requiere isAuth
  
  assert.equal(res.statusCode, 401);
});