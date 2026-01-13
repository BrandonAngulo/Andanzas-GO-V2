const fs = require('fs');
const path = require('path');

const matches = JSON.parse(fs.readFileSync(path.join(__dirname, 'google_api_matches.json'), 'utf8'));

function getSimilarity(s1, s2) {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1.0;

    let s1n = s1.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let s2n = s2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (s1n.includes(s2n) || s2n.includes(s1n)) return 1.0;
    return 0;
}

function normalize(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function realSimilarity(s1, s2) {
    // Basic implementation for identifying the skips
    if (!s1 || !s2) return 0;
    const s1n = normalize(s1);
    const s2n = normalize(s2);
    if (s1n.includes(s2n) || s2n.includes(s1n)) return 1;
    // VERY rough check to reproduce the previous 'skipped' list
    return 0;
}

// We want to identify exactly the ones that were skipped in the previous step.
// The logic in verify_google_updates.cjs was:
// const isCloseEnough = similarity > 0.4 || contains;
// We need to replicate that to get the same list.

const skipped = [];

for (const match of matches) {
    const dbName = normalize(match.nombre);
    const googleName = normalize(match.google_name);
    const contains = googleName.includes(dbName) || dbName.includes(googleName);

    // We need a proper edit distance for similarity > 0.4
    // Let's just use the 'is_different' flag from the JSON? No, that tracks coordinate diff.
    // The skip logic computed similarity on the fly.

    // Let's rely on the fact that we can recompute it.
    // Or simpler: We know which IDs were updated. We can check the database?
    // No, let's just re-run the logic.

    // Re-implement edit distance briefly
    const costs = [];
    const s1 = dbName;
    const s2 = googleName;
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
    const distance = costs[s2.length];
    const longer = s1.length > s2.length ? s1 : s2;
    const sim = (longer.length - distance) / parseFloat(longer.length);

    if (sim <= 0.4 && !contains) {
        skipped.push({
            id: match.id,
            nombre: match.nombre,
            google_name: match.google_name,
            google_address: match.google_address,
            current_lat: match.old_lat, // This is what is currently in DB (well, assumed 'old' before the update script ran, but for these skipped ones, it IS the current)
            current_lng: match.old_lng
        });
    }
}

console.log(JSON.stringify(skipped, null, 2));
