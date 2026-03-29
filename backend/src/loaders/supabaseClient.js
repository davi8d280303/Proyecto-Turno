const { createClient } = require('@supabase/supabase-js');

// Estas variables las tomará de tu archivo .env (en local) 
// o de la pestaña Environment (en Render)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Faltan las variables de entorno de Supabase");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;