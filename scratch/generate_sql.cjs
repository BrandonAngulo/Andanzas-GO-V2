const fs = require('fs');
const path = 'C:/Users/grues/.gemini/antigravity/brain/76153fe8-bf01-41c5-9da3-28bff63bb62b/supabase_sites_export.json';
const sites = JSON.parse(fs.readFileSync(path, 'utf8'));

const escape = (str) => {
  if (str == null) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
};

const sql = sites.map(s => {
  return `UPDATE sites SET horario = ${escape(s.horario)}, tarifa = ${escape(s.precio)}, direccion = ${escape(s.direccion)} WHERE id = ${escape(s.id)};`;
}).join('\n');

fs.writeFileSync('update_sites.sql', sql);
console.log("SQL generated.");
