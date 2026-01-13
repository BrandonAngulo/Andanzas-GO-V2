const fs = require('fs');
const path = require('path');

const matches = JSON.parse(fs.readFileSync(path.join(__dirname, 'google_api_matches.json'), 'utf8'));
const sites = require('../sites.json'); // We can use the JSON as a reference for the full list

const matchedIds = new Set(matches.map(m => m.id));
const missing = sites.filter(s => !matchedIds.has(s.id));

console.log("Missing Sites (No Google Match):");
missing.forEach(s => console.log(`${s.id}: ${s.nombre}`));

console.log("\ns52 Match Check:");
const s52 = matches.find(m => m.id === 's52');
if (s52) {
    console.log(JSON.stringify(s52, null, 2));
} else {
    console.log("s52 not in matches.");
}
