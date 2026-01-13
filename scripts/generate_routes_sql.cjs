const fs = require('fs');
const path = require('path');

const routesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../routes_data.json'), 'utf8'));

let sql = '';

routesData.forEach(route => {
    const recomendacionJSON = route.recomendaciones ? "'" + JSON.stringify(route.recomendaciones).replace(/'/g, "''") + "'::jsonb" : 'NULL';
    const gamificacionJSON = route.gamificacion ? "'" + JSON.stringify(route.gamificacion).replace(/'/g, "''") + "'::jsonb" : 'NULL';

    // Convert array of points to Postgres array format: ARRAY['s1','s2']
    const puntosArray = `ARRAY[${route.puntos.map(p => `'${p}'`).join(',')}]`;
    const justificacionesArray = `ARRAY[${route.justificaciones.map(j => `'${j.replace(/'/g, "''")}'`).join(',')}]`;
    const justificacionesEnArray = route.justificaciones_en ? `ARRAY[${route.justificaciones_en.map(j => `'${j.replace(/'/g, "''")}'`).join(',')}]` : 'NULL';

    sql += `
INSERT INTO public.routes (
    id, nombre, nombre_en, puntos, duracion_min, 
    descripcion, descripcion_en, justificaciones, justificaciones_en, 
    recomendaciones, gamificacion, is_published
) VALUES (
    '${route.id}',
    '${route.nombre.replace(/'/g, "''")}',
    '${route.nombre_en ? route.nombre_en.replace(/'/g, "''") : ""}',
    ${puntosArray},
    ${route.duracionMin},
    '${route.descripcion.replace(/'/g, "''")}',
    '${route.descripcion_en ? route.descripcion_en.replace(/'/g, "''") : ""}',
    ${justificacionesArray},
    ${justificacionesEnArray},
    ${recomendacionJSON},
    ${gamificacionJSON},
    TRUE
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
    gamificacion = EXCLUDED.gamificacion;
\n`;
});

fs.writeFileSync(path.join(__dirname, '../routes_update.sql'), sql);
console.log('SQL generated at routes_update.sql');
