require('dotenv').config();
const { getSupabaseAdmin } = require('../src/config/supabaseClient');
const bcrypt = require('bcrypt'); // Asegúrate de tener bcrypt instalado

async function setup() {
  const db = getSupabaseAdmin();
  const email = 'test@ejemplo.com';
  const password = 'Password123!';
  const saltRounds = 10;
  
  // Generar el hash real que tu sistema espera
  const password_hash = await bcrypt.hash(password, saltRounds);

  console.log(`Configurando usuario: ${email}...`);

  const { error } = await db.restInsert('users', {
    email,
    password_hash,
    full_name: 'Usuario de Test',
    role: 'usuario',
    is_active: true
  });

  if (error && error.code !== '23505') { // 23505 es error de duplicado (ya existe)
    console.error('Error al crear usuario:', error);
  } else {
    console.log('✅ Usuario listo para las pruebas.');
  }
  process.exit();
}

setup();