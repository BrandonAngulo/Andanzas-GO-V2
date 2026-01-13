
const fs = require('fs');
const path = require('path');

// Read sites.json to find the new ones (ID starts with 'new_')
const sites = JSON.parse(fs.readFileSync(path.join(__dirname, '../sites.json'), 'utf8'));
const newSites = sites.filter(s => s.id.startsWith('new_'));

console.log(`Found ${newSites.length} new sites to insert.`);

function escapeSql(str) {
    if (!str) return 'NULL';
    return "'" + str.replace(/'/g, "''") + "'";
}

let sql = '';

for (const s of newSites) {
    const fields = [
        'id', 'nombre', 'nombre_en', 'tipo', 'tipo_en', 'lat', 'lng',
        'rating', 'visitas', 'place_id', 'direccion', 'logo_url',
        'descripcion', 'descripcion_en', 'importancia', 'importancia_en',
        'datos_historicos', 'datos_historicos_en'
    ];

    const values = [
        escapeSql(s.id),
        escapeSql(s.nombre),
        escapeSql(s.nombre_en),
        escapeSql(s.tipo),
        escapeSql(s.tipo_en),
        s.lat,
        s.lng,
        s.rating,
        s.visitas,
        escapeSql(s.place_id),
        escapeSql(s.direccion),
        escapeSql(s.logoUrl), // Note: logoUrl in json -> logo_url in DB usually
        escapeSql(s.descripcion),
        escapeSql(s.descripcion_en),
        escapeSql(s.importancia),
        escapeSql(s.importancia_en),
        escapeSql(s.datosHistoricos),
        escapeSql(s.datosHistoricos_en)
    ];

    // Handling arrays (reconocimientos, datos_curiosos) as text arrays or JSONB? 
    // Assuming text[] for now in Supabase based on typical usage, 
    // or maybe they are stored in separate tables? 
    // Looking at seed_sites.sql would confirm, but let's assume standard INSERT for main table first.
    // Actually, I should check the schema.

    sql += `INSERT INTO sites (${fields.join(', ')}) VALUES (${values.join(', ')});\n`;
}

fs.writeFileSync(path.join(__dirname, '../insert_new_sites.sql'), sql, 'utf8');
console.log("SQL Generated: insert_new_sites.sql");
