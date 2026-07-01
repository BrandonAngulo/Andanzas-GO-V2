const fs = require('fs');
const path = require('path');

const local = require('./sites_temp.cjs').CULTURAL_SITES;

// Read the database output file using absolute path
const dbRaw = fs.readFileSync('C:\\Users\\grues\\.gemini\\antigravity\\brain\\76153fe8-bf01-41c5-9da3-28bff63bb62b\\.system_generated\\steps\\1320\\output.txt', 'utf8');

const obj = JSON.parse(dbRaw);
const match = obj.result.match(/\[\s*\{.*\}\s*\]/s);
const dbSites = JSON.parse(match[0]);

console.log("Local sites count:", local.length);
console.log("Database sites count:", dbSites.length);

const matched = [];
const unmatchedLocal = [];

for (const loc of local) {
    const clean = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const locClean = clean(loc.nombre);
    
    const dbMatch = dbSites.find(db => {
        const dbClean = clean(db.nombre);
        return dbClean.includes(locClean) || locClean.includes(dbClean);
    });
    
    if (dbMatch) {
        matched.push({ localId: loc.id, localNombre: loc.nombre, dbId: dbMatch.id, dbNombre: dbMatch.nombre });
    } else {
        unmatchedLocal.push({ id: loc.id, nombre: loc.nombre });
    }
}

console.log("\n--- MATCHED SITES (Duplicates) ---");
console.log(JSON.stringify(matched, null, 2));

console.log("\n--- UNMATCHED LOCAL SITES (Need detailed description in data/sites.ts) ---");
console.log(JSON.stringify(unmatchedLocal, null, 2));
