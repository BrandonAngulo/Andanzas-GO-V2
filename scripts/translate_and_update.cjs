require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { translate } = require('google-translate-api-x');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function safeTranslate(text, to = 'en') {
    if (!text || text.trim() === '') return text;
    if (text === 'Descripción pendiente.') return 'Description pending.';
    try {
        const res = await translate(text, { to, forceBatch: false });
        return res.text;
    } catch (e) {
        console.error("Translation error:", e.message);
        return text;
    }
}

async function safeTranslateArray(arr, to = 'en') {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return arr;
    const res = [];
    for (const item of arr) {
        res.push(await safeTranslate(item, to));
        await sleep(200);
    }
    return res;
}

async function translateSites() {
    console.log("Fetching sites...");
    const { data: sites, error } = await supabase
        .from('sites')
        .select('*')
        .not('descripcion', 'is', null)
        .not('descripcion', 'eq', 'Descripción pendiente.');

    if (error) {
        console.error("Error fetching sites:", error);
        return;
    }

    console.log(`Found ${sites.length} sites. Translating and updating directly via API...`);

    let i = 0;
    
    for (const site of sites) {
        i++;
        console.log(`[${i}/${sites.length}] Translating and updating: ${site.nombre}`);
        
        let updates = {};
        
        if (site.nombre) {
            updates.nombre_en = await safeTranslate(site.nombre);
        }
        
        if (site.tipo) {
            updates.tipo_en = await safeTranslate(site.tipo);
        }

        if (site.descripcion) {
            updates.descripcion_en = await safeTranslate(site.descripcion);
        }
        
        if (site.importancia) {
            updates.importancia_en = await safeTranslate(site.importancia);
        }
        
        if (site.datos_historicos) {
            updates.datos_historicos_en = await safeTranslate(site.datos_historicos);
        }
        
        if (site.datos_curiosos && site.datos_curiosos.length > 0) {
            updates.datos_curiosos_en = await safeTranslateArray(site.datos_curiosos);
        }

        if (Object.keys(updates).length > 0) {
            const { error: updateError } = await supabase
                .from('sites')
                .update(updates)
                .eq('id', site.id);
                
            if (updateError) {
                console.error(`Error updating ${site.nombre}:`, updateError);
            } else {
                console.log(`✓ Updated ${site.nombre} successfully.`);
            }
        }
        
        await sleep(500);
    }
    
    console.log("All translations and updates completed!");
}

translateSites();
