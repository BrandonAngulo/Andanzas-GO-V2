const fs = require('fs');
const path = require('path');

// Regenerate sites_temp.cjs from the updated data/sites.ts
const content = fs.readFileSync(path.join(__dirname, '../data/sites.ts'), 'utf8');
let jsContent = content.replace(/import\s+.*?;/g, '');
jsContent = jsContent.replace(/:\s*Site\[\]/g, '');
jsContent = jsContent.replace(/export\s+const\s+CULTURAL_SITES\s*=/g, 'module.exports.CULTURAL_SITES =');
fs.writeFileSync(path.join(__dirname, 'sites_temp.cjs'), jsContent, 'utf8');

// Must delete module cache to reload fresh
delete require.cache[require.resolve('./sites_temp.cjs')];
const { CULTURAL_SITES } = require('./sites_temp.cjs');

// Load DB sites
const dbRaw = fs.readFileSync('C:\\Users\\grues\\.gemini\\antigravity\\brain\\76153fe8-bf01-41c5-9da3-28bff63bb62b\\.system_generated\\steps\\1320\\output.txt', 'utf8');
const obj = JSON.parse(dbRaw);
const matchArr = obj.result.match(/\[\s*\{.*\}\s*\]/s);
const dbSites = JSON.parse(matchArr[0]);

// Same explicit map as in the service
const LOCAL_TO_DB_ID = {
    'museo-salsa-obrero':      's25',
    'plazoleta-jairo-varela':  's21',
    'galeria-alameda':         's9',
    'teatro-municipal':        's2',
    'biblioteca-centenario':   's53',
    'bulevar-petronio':        's3',
    'iglesia-ermita':          's16',
    'capilla-san-antonio':     's63',
    'gato-tejada':             's8',
    'museo-tertulia':          's1',
    'zoologico-cali':          's13',
    'teatro-jorge-isaacs':     's22',
    'tec-teatro-experimental': 's96',
};

const localIds = new Set(CULTURAL_SITES.map(s => s.id));
const dbIdsCoveredByLocal = new Set(Object.values(LOCAL_TO_DB_ID));

const filteredDbSites = dbSites.filter(s =>
    !localIds.has(s.id) && !dbIdsCoveredByLocal.has(s.id)
);

const total = CULTURAL_SITES.length + filteredDbSites.length;

console.log('Local sites:', CULTURAL_SITES.length);
console.log('DB sites (total):', dbSites.length);
console.log('DB IDs covered by local (explicit map):', dbIdsCoveredByLocal.size);
console.log('DB sites kept after dedup:', filteredDbSites.length);
console.log('TOTAL SITES ON MAP:', total);
console.log('\nLocal site IDs:', CULTURAL_SITES.map(s => s.id).join(', '));
