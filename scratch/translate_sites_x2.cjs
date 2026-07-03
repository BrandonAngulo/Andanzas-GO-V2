const fs = require('fs');
const translate = require('google-translate-api-x');

const data = JSON.parse(fs.readFileSync('scratch/supabase_to_translate.json', 'utf8'));

const escape = (str) => {
  if (str == null) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
};

const escapeArray = (arr) => {
  if (!arr || arr.length === 0) return 'NULL';
  return "ARRAY[" + arr.map(a => escape(a)).join(", ") + "]::text[]";
};

async function doTranslate(text) {
  if (!text) return text;
  try {
    const res = await translate(text, { from: 'es', to: 'en', forceBatch: false });
    return res.text;
  } catch (err) {
    console.error("Error for text: ", text.substring(0, 20), err.message);
    await new Promise(r => setTimeout(r, 4000));
    try {
      const res = await translate(text, { from: 'es', to: 'en', forceBatch: true });
      return res.text;
    } catch(err2) {
      console.error("Failed again. Using placeholder.");
      return text + " [EN]";
    }
  }
}

async function run() {
  // Clear file
  fs.writeFileSync('update_sites_translations.sql', '');
  
  for (let i = 22; i < data.length; i++) {
    const site = data[i];
    console.log(`Translating ${i+1}/${data.length}: ${site.nombre}`);
    
    const horario_en = await doTranslate(site.horario);
    const tarifa_en = await doTranslate(site.tarifa);
    const descripcion_en = await doTranslate(site.descripcion);
    const datos_historicos_en = await doTranslate(site.datos_historicos);
    
    let datos_curiosos_en = null;
    if (site.datos_curiosos && site.datos_curiosos.length > 0) {
      datos_curiosos_en = [];
      for (const dc of site.datos_curiosos) {
         datos_curiosos_en.push(await doTranslate(dc));
      }
    }
    
    let sets = [];
    if (horario_en) sets.push(`horario_en = ${escape(horario_en)}`);
    if (tarifa_en) sets.push(`tarifa_en = ${escape(tarifa_en)}`);
    if (descripcion_en) sets.push(`descripcion_en = ${escape(descripcion_en)}`);
    if (datos_historicos_en) sets.push(`datos_historicos_en = ${escape(datos_historicos_en)}`);
    if (datos_curiosos_en) sets.push(`datos_curiosos_en = ${escapeArray(datos_curiosos_en)}`);
    
    if (sets.length > 0) {
      const sql = `UPDATE sites SET ${sets.join(', ')} WHERE id = '${site.id}';\n`;
      fs.appendFileSync('update_sites_translations.sql', sql);
    }
    
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log("Translation complete! Output written to update_sites_translations.sql");
}

run().catch(console.error);
