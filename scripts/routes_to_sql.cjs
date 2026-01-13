const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../routes_data.json');
const outputFile = path.join(__dirname, '../seed_routes.sql');

const routes = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

let sqlContent = '';

function formatArray(arr) {
    if (!arr || arr.length === 0) return 'ARRAY[]::text[]';
    const values = arr.map(item => `'${item.replace(/'/g, "''")}'`).join(',');
    return `ARRAY[${values}]`;
}

function formatJson(obj) {
    if (!obj) return 'NULL';
    return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

routes.forEach(route => {
    const safeString = (str) => str ? str.replace(/'/g, "''") : '';
    const isPublished = 'TRUE';

    sqlContent += `INSERT INTO public.routes (
        id, nombre, nombre_en, puntos, duracion_min, 
        descripcion, descripcion_en, justificaciones, justificaciones_en, 
        recomendaciones, gamificacion, is_published
    ) VALUES (
        '${safeString(route.id)}',
        '${safeString(route.nombre)}',
        '${safeString(route.nombre_en)}',
        ${formatArray(route.puntos)},
        ${route.duracionMin || 0},
        '${safeString(route.descripcion)}',
        '${safeString(route.descripcion_en)}',
        ${formatArray(route.justificaciones)},
        ${formatArray(route.justificaciones_en)},
        ${formatJson(route.recomendaciones)},
        ${formatJson(route.gamificacion)},
        ${isPublished}
    ) ON CONFLICT (id) DO UPDATE SET 
        nombre = EXCLUDED.nombre,
        nombre_en = EXCLUDED.nombre_en,
        puntos = EXCLUDED.puntos,
        duracion_min = EXCLUDED.duracion_min,
        descripcion = EXCLUDED.descripcion,
        descripcion_en = EXCLUDED.descripcion_en,
        justificaciones = EXCLUDED.justificaciones,
        justificaciones_en = EXCLUDED.justificaciones_en,
        recomendaciones = EXCLUDED.recomendaciones,
        gamificacion = EXCLUDED.gamificacion;\n\n`;
});

fs.writeFileSync(outputFile, sqlContent);
console.log(`Generated SQL for ${routes.length} routes in ${outputFile}`);
