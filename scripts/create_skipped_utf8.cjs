const fs = require('fs');
const path = require('path');

const matches = JSON.parse(fs.readFileSync(path.join(__dirname, 'google_api_matches.json'), 'utf8'));

function normalize(str) {
    if (!str) return "";
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const skipped = [];
for (const match of matches) {
    const dbName = normalize(match.nombre);
    const googleName = normalize(match.google_name);
    const contains = googleName.includes(dbName) || dbName.includes(googleName);

    const s1 = dbName;
    const s2 = googleName;
    let distance = s2.length;
    if (s1.length > 0) {
        const costs = [];
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i == 0) costs[j] = j;
                else if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
            if (i > 0) costs[s2.length] = lastValue;
        }
        distance = costs[s2.length];
    }
    const longer = s1.length > s2.length ? s1 : s2;
    const sim = longer.length === 0 ? 1.0 : (longer.length - distance) / parseFloat(longer.length);

    if (sim <= 0.4 && !contains) {
        skipped.push({ id: match.id, nombre: match.nombre });
    }
}

fs.writeFileSync(path.join(__dirname, 'skipped_utf8.json'), JSON.stringify(skipped, null, 2), 'utf8');
