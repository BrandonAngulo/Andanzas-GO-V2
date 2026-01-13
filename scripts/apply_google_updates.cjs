const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

function getSimilarity(s1, s2) {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1.0;
    return (longer.length - editDistance(longer, shorter)) / parseFloat(longer.length);
}

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

async function run() {
    const matches = JSON.parse(fs.readFileSync(path.join(__dirname, 'google_api_matches.json'), 'utf8'));
    console.log(`Loaded ${matches.length} potential matches.`);

    let updated = 0;
    let skipped = 0;

    for (const match of matches) {
        const dbName = normalize(match.nombre);
        const googleName = normalize(match.google_name);

        // Safety check: is the name reasonably similar?
        // Or does one contain the other?
        const similarity = getSimilarity(dbName, googleName);
        const contains = googleName.includes(dbName) || dbName.includes(googleName);

        // Special exceptions for known short names or variations
        const isCloseEnough = similarity > 0.4 || contains;

        if (isCloseEnough) {
            // Update DB
            const { error } = await supabase
                .from('sites')
                .update({
                    lat: match.new_lat,
                    lng: match.new_lng,
                    // Store the Google Place ID for future reference/stable linking
                    // Assuming we might have a column or just overwrite coords
                })
                .eq('id', match.id);

            if (error) {
                console.error(`Error updating ${match.id}:`, error.message);
            } else {
                console.log(`[UPDATE] ${match.id}: ${match.nombre} -> ${match.google_name} (${match.new_lat}, ${match.new_lng})`);
                updated++;
            }
        } else {
            console.log(`[SKIP] ${match.id}: ${match.nombre} vs ${match.google_name} (Sim: ${similarity.toFixed(2)})`);
            skipped++;
        }
    }

    console.log(`\nRun complete. Updated: ${updated}, Skipped: ${skipped}`);
}

run();
