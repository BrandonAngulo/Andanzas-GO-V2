
const fs = require('fs');
const path = require('path');

const sitesPath = path.join(__dirname, '../sites.json');
const sitesStr = fs.readFileSync(sitesPath, 'utf8');
const sites = JSON.parse(sitesStr);
console.log("Sites length:", sites.length);

const escapeStr = (str) => {
    if (!str) return 'null';
    return "'" + str.replace(/'/g, "''") + "'";
};

const escapeArr = (arr) => {
    if (!arr) return 'null';
    const items = arr.map(s => escapeStr(s)).join(',');
    return `ARRAY[${items}]`;
};

const CHUNK_SIZE = 10;
const chunks = [];
for (let i = 0; i < sites.length; i += CHUNK_SIZE) {
    chunks.push(sites.slice(i, i + CHUNK_SIZE));
}

chunks.forEach((chunk, index) => {
    const sql = chunk.map(site => {
        return `INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            ${escapeStr(site.id)},
            ${escapeStr(site.nombre)},
            ${escapeStr(site.nombre_en)},
            ${escapeStr(site.tipo)},
            ${escapeStr(site.tipo_en)},
            ${site.lat},
            ${site.lng},
            ${site.rating},
            ${site.visitas},
            ${escapeStr(site.logoUrl)},
            ${escapeStr(site.descripcion)},
            ${escapeStr(site.descripcion_en)},
            ${escapeStr(site.importancia)},
            ${escapeStr(site.importancia_en)},
            ${escapeStr(site.datosHistoricos)},
            ${escapeStr(site.datosHistoricos_en)},
            ${escapeArr(site.datosCuriosos)},
            ${escapeArr(site.datosCuriosos_en)}
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;`;
    }).join('\n');

    const fileName = `seed_sites_${index + 1}.sql`;
    fs.writeFileSync(path.join(__dirname, '../' + fileName), sql);
    console.log(`Generated ${fileName} (${sql.length} chars)`);
});
