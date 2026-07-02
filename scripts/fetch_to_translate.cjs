require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fetchSites() {
    const { data, error } = await supabase
        .from('sites')
        .select('id, nombre, descripcion, importancia, datos_historicos, datos_curiosos')
        .not('descripcion', 'is', null)
        .not('descripcion', 'eq', 'Descripción pendiente.');

    if (error) {
        console.error(error);
        return;
    }
    console.log(`Found ${data.length} sites to translate.`);
    fs.writeFileSync('sites_to_translate.json', JSON.stringify(data, null, 2));
}

fetchSites();
