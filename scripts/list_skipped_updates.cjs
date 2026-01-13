const fs = require('fs');
const path = require('path');

const matches = JSON.parse(fs.readFileSync(path.join(__dirname, 'google_api_matches.json'), 'utf8'));

function getSimilarity(s1, s2) {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1.0;

    // Simple mock since I don't want to copy paste the big function again just for listing
    // Assuming normalized inclusion check mainly used
    let s1n = s1.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let s2n = s2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (s1n.includes(s2n) || s2n.includes(s1n)) return 1.0;
    return 0; // Rough approximation for display
}

// Full logic for exact reproduction
function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    const costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i == 0) costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function normalize(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function realSimilarity(s1, s2) {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1.0;
    return (longer.length - editDistance(longer, shorter)) / parseFloat(longer.length);
}

console.log("| ID | Nombre (App) | Nombre (Google Match) | Similitud | Acción |");
console.log("|---|---|---|---|---|");

for (const match of matches) {
    const dbName = normalize(match.nombre);
    const googleName = normalize(match.google_name);

    const similarity = realSimilarity(dbName, googleName);
    const contains = googleName.includes(dbName) || dbName.includes(googleName);
    const isCloseEnough = similarity > 0.4 || contains;

    if (!isCloseEnough) {
        console.log(`| ${match.id} | ${match.nombre} | ${match.google_name} | ${similarity.toFixed(2)} | MANTENIDO (Manual) |`);
    }
}
