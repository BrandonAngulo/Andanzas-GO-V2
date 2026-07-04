const fs = require('fs');
const path = require('path');

const inputFile = path.join('C:', 'Users', 'grues', '.gemini', 'antigravity', 'brain', '76153fe8-bf01-41c5-9da3-28bff63bb62b', 'supabase_sites_export.json');
const outputFile = path.join(__dirname, '..', 'data', 'sites.ts');

try {
  const data = fs.readFileSync(inputFile, 'utf8');
  const sites = JSON.parse(data);

  // Convert snake_case properties back to camelCase as expected by the frontend if needed
  const mappedSites = sites.map(site => {
    return {
      id: site.id,
      nombre: site.nombre,
      nombre_en: site.nombre_en,
      tipo: site.tipo,
      tipo_en: site.tipo_en,
      lat: site.lat,
      lng: site.lng,
      rating: site.rating || 4.5,
      visitas: site.visitas || 0,
      logoUrl: site.logo_url || site.logoUrl || 'https://via.placeholder.com/150',
      descripcion: site.descripcion,
      descripcion_en: site.descripcion_en,
      importancia: site.importancia,
      importancia_en: site.importancia_en,
      datosHistoricos: site.datos_historicos || site.datosHistoricos,
      datosHistoricos_en: site.datos_historicos_en || site.datosHistoricos_en,
      reconocimientos: site.reconocimientos,
      reconocimientos_en: site.reconocimientos_en,
      datosCuriosos: site.datos_curiosos || site.datosCuriosos,
      datosCuriosos_en: site.datos_curiosos_en || site.datosCuriosos_en,
      gancho_emocional: site.gancho_emocional,
      gancho_emocional_en: site.gancho_emocional_en,
      por_que_ir: site.por_que_ir,
      por_que_ir_en: site.por_que_ir_en,
      que_hacer: site.que_hacer,
      que_hacer_en: site.que_hacer_en,
      mejor_momento: site.mejor_momento,
      mejor_momento_en: site.mejor_momento_en,
      direccion: site.direccion,
      horarios: site.horarios,
      horarios_en: site.horarios_en,
      tarifa: site.tarifa,
      tarifa_en: site.tarifa_en,
      tags: site.tags,
      tags_en: site.tags_en,
      barrio: site.barrio
    };
  });

  const tsContent = `import { Site } from '../types';\n\nexport const sitesData: Site[] = ${JSON.stringify(mappedSites, null, 2)};\n`;
  
  fs.writeFileSync(outputFile, tsContent, 'utf8');
  console.log('Successfully generated data/sites.ts with ' + mappedSites.length + ' sites.');
} catch (error) {
  console.error('Error:', error);
}
