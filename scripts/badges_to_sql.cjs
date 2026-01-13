const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../badges_data.json');
const outputFile = path.join(__dirname, '../seed_badges.sql');

const badges = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

let sqlContent = '';

badges.forEach(badge => {
    const safeString = (str) => str ? str.replace(/'/g, "''") : '';

    // badge.icono should be a string now
    const iconoName = badge.icono || 'Award'; // Default fallback

    sqlContent += `INSERT INTO public.badges (
        id, nombre, nombre_en, descripcion, descripcion_en, icono_name
    ) VALUES (
        '${safeString(badge.id)}',
        '${safeString(badge.nombre)}',
        '${safeString(badge.nombre_en)}',
        '${safeString(badge.descripcion)}',
        '${safeString(badge.descripcion_en)}',
        '${safeString(iconoName)}'
    ) ON CONFLICT (id) DO UPDATE SET 
        nombre = EXCLUDED.nombre,
        nombre_en = EXCLUDED.nombre_en,
        descripcion = EXCLUDED.descripcion,
        descripcion_en = EXCLUDED.descripcion_en,
        icono_name = EXCLUDED.icono_name;\n\n`;
});

fs.writeFileSync(outputFile, sqlContent);
console.log(`Generated SQL for ${badges.length} badges in ${outputFile}`);
