require('dotenv').config(); // Try default location first (CWD)
if (!process.env.VITE_SUPABASE_URL) {
    // Fallback to relative path if not found
    require('dotenv').config({ path: path.join(__dirname, '../.env') });
}
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Env path used:', path.join(__dirname, '../.env'));
console.log('Supabase URL found:', !!supabaseUrl);
console.log('Supabase Key found:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const routesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../routes_data.json'), 'utf8'));

async function updateRoutes() {
    console.log(`Starting update of ${routesData.length} routes...`);

    for (const route of routesData) {
        const { error } = await supabase
            .from('routes')
            .upsert({
                id: route.id,
                nombre: route.nombre,
                nombre_en: route.nombre_en,
                puntos: route.puntos,
                duracion_min: route.duracionMin,
                descripcion: route.descripcion,
                descripcion_en: route.descripcion_en,
                justificaciones: route.justificaciones,
                justificaciones_en: route.justificaciones_en,
                recomendaciones: route.recomendaciones,
                gamificacion: route.gamificacion,
                is_published: true
            }, { onConflict: 'id' });

        if (error) {
            console.error(`Error updating route ${route.id}:`, error);
        } else {
            console.log(`Route ${route.id} updated successfully.`);
        }
    }
}

updateRoutes();
