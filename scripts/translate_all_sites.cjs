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
        await sleep(200); // Small delay to avoid rate limiting
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

    console.log(`Found ${sites.length} sites. Force translating ALL to ensure sync.`);

    let sqlStatements = [];
    let i = 0;
    
    for (const site of sites) {
        i++;
        console.log(`[${i}/${sites.length}] Translating: ${site.nombre}`);
        
        let updates = [];
        
        if (site.nombre) {
            let tr = await safeTranslate(site.nombre);
            updates.push(`nombre_en = '${tr}'`);
        }
        
        if (site.tipo) {
            let tr = await safeTranslate(site.tipo);
            updates.push(`tipo_en = '${tr}'`);
        }

        if (site.descripcion) {
            let tr = await safeTranslate(site.descripcion);
            updates.push(`descripcion_en = '${tr}'`);
        }
        
        if (site.importancia) {
            let tr = await safeTranslate(site.importancia);
            updates.push(`importancia_en = '${tr}'`);
        }
        
        if (site.datos_historicos) {
            let tr = await safeTranslate(site.datos_historicos);
            updates.push(`datos_historicos_en = '${tr}'`);
        }
        
        if (site.datos_curiosos && site.datos_curiosos.length > 0) {
            let arr = await safeTranslateArray(site.datos_curiosos);
            let arrStr = `ARRAY[${arr.map(a => `'${a}'`).join(', ')}]::text[]`;
            updates.push(`datos_curiosos_en = ${arrStr}`);
        }

        if (updates.length > 0) {
            let sql = `UPDATE sites SET ${updates.join(', ')} WHERE id = '${site.id}';`;
            sqlStatements.push(sql);
        }
        
        // Write to file incrementally
        fs.writeFileSync('translations_all.sql', sqlStatements.join('\n\n'));
        
        await sleep(500);
    }
    
    console.log("All translations completed! See translations_all.sql");
}

translateSites();
