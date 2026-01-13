const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../events_data.json');
const outputFile = path.join(__dirname, '../seed_events.sql');

const events = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

let sqlContent = '';

events.forEach(event => {
    // Escape single quotes in text fields
    const safeString = (str) => str ? str.replace(/'/g, "''") : '';

    // Determine is_published (default true)
    const isPublished = 'TRUE';

    sqlContent += `INSERT INTO public.events (
        id, titulo, titulo_en, fecha, lugar, lugar_en, 
        resumen, resumen_en, img, descripcion, descripcion_en, is_published
    ) VALUES (
        '${safeString(event.id)}',
        '${safeString(event.titulo)}',
        '${safeString(event.titulo_en)}',
        '${safeString(event.fecha)}',
        '${safeString(event.lugar)}',
        '${safeString(event.lugar_en)}',
        '${safeString(event.resumen)}',
        '${safeString(event.resumen_en)}',
        '${safeString(event.img)}',
        '${safeString(event.descripcion)}',
        '${safeString(event.descripcion_en)}',
        ${isPublished}
    ) ON CONFLICT (id) DO UPDATE SET 
        titulo = EXCLUDED.titulo,
        titulo_en = EXCLUDED.titulo_en,
        fecha = EXCLUDED.fecha,
        img = EXCLUDED.img,
        descripcion = EXCLUDED.descripcion,
        descripcion_en = EXCLUDED.descripcion_en;\n\n`;
});

fs.writeFileSync(outputFile, sqlContent);
console.log(`Generated SQL for ${events.length} events in ${outputFile}`);
