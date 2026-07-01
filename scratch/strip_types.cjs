const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../data/sites.ts'), 'utf8');
// Remove import
let jsContent = content.replace(/import\s+.*?;/g, '');
// Remove type annotations
jsContent = jsContent.replace(/:\s*Site\[\]/g, '');
// Replace export with module.exports
jsContent = jsContent.replace(/export\s+const\s+CULTURAL_SITES\s*=/g, 'module.exports.CULTURAL_SITES =');
// Write to temp file
fs.writeFileSync(path.join(__dirname, 'sites_temp.cjs'), jsContent, 'utf8');

// Now load it
const { CULTURAL_SITES } = require('./sites_temp.cjs');
console.log(JSON.stringify(CULTURAL_SITES.map(s => ({ id: s.id, nombre: s.nombre, lat: s.lat, lng: s.lng })), null, 2));
