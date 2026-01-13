const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedSites() {
    const sitesPath = path.join(__dirname, '../sites.json');
    const sitesData = JSON.parse(fs.readFileSync(sitesPath, 'utf8'));

    console.log(`Read ${sitesData.length} sites from JSON.`);

    let successCount = 0;
    let failCount = 0;

    for (const site of sitesData) {
        const dbSite = {
            id: site.id,
            nombre: site.nombre,
            nombre_en: site.nombre_en,
            tipo: site.tipo,
            tipo_en: site.tipo_en,
            lat: site.lat,
            lng: site.lng,
            rating: site.rating,
            visitas: site.visitas,
            logo_url: site.logoUrl,
            descripcion: site.descripcion,
            descripcion_en: site.descripcion_en,
            importancia: site.importancia,
            importancia_en: site.importancia_en,
            datos_historicos: site.datosHistoricos,
            datos_historicos_en: site.datosHistoricos_en,
            // Ensure arrays are arrays or null, dependent on DB constraint. 
            // Supabase client handles array to postgres array conversion automatically.
            reconocimientos: site.reconocimientos,
            reconocimientos_en: site.reconocimientos_en,
            datos_curiosos: site.datosCuriosos,
            datos_curiosos_en: site.datosCuriosos_en,
            is_published: true
        };

        const { error } = await supabase
            .from('sites')
            .upsert(dbSite, { onConflict: 'id' });

        if (error) {
            console.error(`Error inserting site ${site.id}:`, error.message);
            failCount++;
        } else {
            successCount++;
        }
    }

    console.log(`Seeding complete. Success: ${successCount}, Failed: ${failCount}`);
}

seedSites();
