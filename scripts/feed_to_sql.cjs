const fs = require('fs');
const path = require('path');

const outputFile = path.join(__dirname, '../seed_feed.sql');

const feedItems = [
    {
        type: 'anuncio',
        titulo: '¡Nueva funcionalidad!',
        titulo_en: 'New Feature!',
        contenido: 'Ahora puedes ver la programación de los teatros directamente en el mapa.',
        contenido_en: 'Now you can see theater schedules directly on the map.',
        icono_name: 'Megaphone',
        fecha: "NOW() - INTERVAL '30 minutes'"
    },
    {
        type: 'publicacion_sitio',
        siteId: 's1',
        contenido: 'Inauguramos nuestra nueva exposición "Voces del Río". ¡Entrada libre este fin de semana!',
        contenido_en: 'We are inaugurating our new exhibition "Voices of the River". Free entry this weekend!',
        fecha: "NOW() - INTERVAL '2 hours'"
    },
    {
        type: 'publicacion_sitio',
        siteId: 's7',
        contenido: 'Hoy jueves de salsa en vivo con la orquesta local. ¡No te lo pierdas!',
        contenido_en: 'Today Thursday live salsa with the local orchestra. Don\'t miss it!',
        fecha: "NOW() - INTERVAL '5 hours'"
    }
];

let sqlContent = '';

feedItems.forEach(item => {
    const safe = (str) => str ? str.replace(/'/g, "''") : '';

    sqlContent += `INSERT INTO public.feed_items (
        type, titulo, titulo_en, contenido, contenido_en, site_id, icono_name, fecha
    ) VALUES (
        '${item.type}',
        ${item.titulo ? `'${safe(item.titulo)}'` : 'NULL'},
        ${item.titulo_en ? `'${safe(item.titulo_en)}'` : 'NULL'},
        ${item.contenido ? `'${safe(item.contenido)}'` : 'NULL'},
        ${item.contenido_en ? `'${safe(item.contenido_en)}'` : 'NULL'},
        ${item.siteId ? `'${item.siteId}'` : 'NULL'},
        ${item.icono_name ? `'${item.icono_name}'` : 'NULL'},
        ${item.fecha}
    );\n\n`;
});

fs.writeFileSync(outputFile, sqlContent);
console.log(`Generated SQL for ${feedItems.length} feed items in ${outputFile}`);
