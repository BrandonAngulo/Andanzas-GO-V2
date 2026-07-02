require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { translate } = require('google-translate-api-x');
const fs = require('fs');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function safeTranslate(text, to = 'en') {
    if (!text || text.trim() === '') return text;
    if (text === 'Descripción pendiente.') return 'Description pending.';
    try {
        const res = await translate(text, { to, forceBatch: false });
        return res.text.replace(/'/g, "''"); // escape single quotes for SQL
    } catch (e) {
        console.error("Translation error:", e.message);
        return text.replace(/'/g, "''");
    }
}

async function safeTranslateArray(arr, to = 'en') {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return arr;
    const res = [];
    for (const item of arr) {
        res.push(await safeTranslate(item, to));
        await sleep(500); // Small delay to avoid rate limiting
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

    // Filter sites that actually need translation (verified ones, skipping if they already have valid EN fields)
    const toTranslate = sites.filter(s => {
        return !s.descripcion_en || 
               s.descripcion_en.trim() === '' || 
               s.descripcion_en === 'Description pending.' ||
               (s.importancia && !s.importancia_en);
    });

    console.log(`Found ${toTranslate.length} sites needing translation out of ${sites.length} total.`);

    let sqlStatements = [];
    let i = 0;
    
    for (const site of toTranslate) {
        i++;
        console.log(`[${i}/${toTranslate.length}] Translating: ${site.nombre}`);
        
        let updates = [];
        
        if (site.nombre && (!site.nombre_en || site.nombre_en === site.nombre)) {
            let tr = await safeTranslate(site.nombre);
            updates.push(`nombre_en = '${tr}'`);
        }
        
        if (site.tipo && (!site.tipo_en || site.tipo_en === 'Place' || site.tipo_en === site.tipo)) {
            let tr = await safeTranslate(site.tipo);
            updates.push(`tipo_en = '${tr}'`);
        }

        if (site.descripcion && (!site.descripcion_en || site.descripcion_en === 'Description pending.')) {
            let tr = await safeTranslate(site.descripcion);
            updates.push(`descripcion_en = '${tr}'`);
        }
        
        if (site.importancia && !site.importancia_en) {
            let tr = await safeTranslate(site.importancia);
            updates.push(`importancia_en = '${tr}'`);
        }
        
        if (site.datos_historicos && !site.datos_historicos_en) {
            let tr = await safeTranslate(site.datos_historicos);
            updates.push(`datos_historicos_en = '${tr}'`);
        }
        
        if (site.datos_curiosos && site.datos_curiosos.length > 0 && (!site.datos_curiosos_en || site.datos_curiosos_en.length === 0)) {
            let arr = await safeTranslateArray(site.datos_curiosos);
            let arrStr = `ARRAY[${arr.map(a => `'${a}'`).join(', ')}]::text[]`;
            updates.push(`datos_curiosos_en = ${arrStr}`);
        }

        if (updates.length > 0) {
            let sql = `UPDATE sites SET ${updates.join(', ')} WHERE id = '${site.id}';`;
            sqlStatements.push(sql);
            console.log(`✓ Generated SQL for ${site.nombre}.`);
        } else {
            console.log(`- Skipping ${site.nombre}, no updates needed.`);
        }
        
        // Write to file incrementally to be safe
        fs.writeFileSync('translations.sql', sqlStatements.join('\n\n'));
        
        // Sleep to avoid rate limiting from Google Translate
        await sleep(1500);
    }
    
    console.log("All translations completed! See translations.sql");
}

translateSites();
