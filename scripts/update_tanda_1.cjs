const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function updateTanda1() {
    console.log("Deshabilitando RLS temporalmente...");
    const adminSupabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY // We need the service role key for this to work actually, but I'll try normal first or execute via SQL
    );
}
