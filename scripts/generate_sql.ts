import { CULTURAL_SITES } from '../data/sites';

const lines = [];

let startId = 102;

CULTURAL_SITES.forEach(site => {
    // Generate new s-prefixed ID
    const newId = `s${startId++}`;
    
    // Map fields carefully avoiding SQL injection issues
    const sanitize = (str) => {
        if (!str) return 'NULL';
        return `'${str.replace(/'/g, "''")}'`;
    };

    const sanitizeArray = (arr) => {
        if (!arr || arr.length === 0) return 'NULL';
        const els = arr.map(a => sanitize(a)).join(',');
        return `ARRAY[${els}]`;
    };

    const sql = `INSERT INTO sites (
        id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, logo_url,
        descripcion, descripcion_en, importancia, importancia_en,
        datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en,
        horario, horario_en, tarifa, tarifa_en, direccion
    ) VALUES (
        '${newId}',
        ${sanitize(site.nombre)},
        ${sanitize(site.nombre_en)},
        ${sanitize(site.tipo)},
        ${sanitize(site.tipo_en)},
        ${site.lat},
        ${site.lng},
        ${site.rating},
        ${site.visitas || 0},
        ${sanitize(site.logoUrl)},
        ${sanitize(site.descripcion)},
        ${sanitize(site.descripcion_en)},
        ${sanitize(site.importancia)},
        ${sanitize(site.importancia_en)},
        ${sanitize(site.datosHistoricos)},
        ${sanitize(site.datosHistoricos_en)},
        ${sanitizeArray(site.datosCuriosos)},
        ${sanitizeArray(site.datosCuriosos_en)},
        ${sanitize(site.horario)},
        ${sanitize(site.horario_en)},
        ${sanitize(site.tarifa)},
        ${sanitize(site.tarifa_en)},
        ${sanitize(site.direccion)}
    );`;
    lines.push(sql);
});

const fs = require('fs');
fs.writeFileSync('insert_remaining.sql', lines.join('\n'));
console.log('Generated insert_remaining.sql with ' + lines.length + ' inserts.');
