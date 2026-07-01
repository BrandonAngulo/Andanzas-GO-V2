const fs = require('fs');

const content = fs.readFileSync('data/sites.ts', 'utf8');
// Remove import
let jsContent = content.replace(/import\s+.*?;/g, '');
// Remove type annotations
jsContent = jsContent.replace(/:\s*Site\[\]/g, '');
// Write to temp file
fs.writeFileSync('scratch/sites_temp.js', jsContent, 'utf8');

// Now load it
const { CULTURAL_SITES } = require('./sites_temp.js');
console.log(JSON.stringify(CULTURAL_SITES.map(s => ({ id: s.id, nombre: s.nombre, lat: s.lat, lng: s.lng })), null, 2));
