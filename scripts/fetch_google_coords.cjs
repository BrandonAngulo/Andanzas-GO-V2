const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const GOOGLE_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;

// Use the explicit list provided by the user for the search queries to ensure we use their "Google Maps Address" hint if possible,
// but primarily we trust Google's return for that name.
// Actually, let's fetch from DB to get the IDs, but use the names/addresses from the user's latest CSV input if possible for better search terms.
// For now, let's rely on the DB names + "Cali, Colombia" as a baseline, as they are generally correct names.

async function fetchGoogleLocations() {
    console.log("Fetching sites from Supabase...");
    const { data: sites, error } = await supabase.from('sites').select('*');
    if (error) {
        console.error("Error fetching sites:", error);
        return;
    }

    console.log(`Found ${sites.length} sites. Querying Google Places API...`);
    const results = [];
    const notFound = [];

    // We process sequentially to be nice to the API rate limit
    for (const site of sites) {
        // Construct a query. 
        // We'll try: "{Name} Cali" first. 
        // If the user provided a specific address in the previous turns, it might be in the DB (schema doesn't have address col?).
        // The DB schema doesn't seem to have an address column based on the previous read. 
        // So we rely on "Nombre + Cali".
        const query = encodeURIComponent(`${site.nombre} Cali`);
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${GOOGLE_API_KEY}`;

        try {
            const googleData = await new Promise((resolve, reject) => {
                https.get(url, (res) => {
                    let data = '';
                    res.on('data', (chunk) => data += chunk);
                    res.on('end', () => resolve(JSON.parse(data)));
                    res.on('error', reject);
                });
            });

            if (googleData.status === 'OK' && googleData.results.length > 0) {
                // Take the first result (usually the best match)
                const match = googleData.results[0];
                const newLat = match.geometry.location.lat;
                const newLng = match.geometry.location.lng;

                // Calculate distance/diff to see if it changed significantly
                const diffLat = Math.abs(site.lat - newLat);
                const diffLng = Math.abs(site.lng - newLng);
                const isDifferent = diffLat > 0.0001 || diffLng > 0.0001; // ~11 meters difference

                console.log(`[MATCH] ${site.id} - ${site.nombre}`);
                console.log(`   Old: ${site.lat}, ${site.lng}`);
                console.log(`   New: ${newLat}, ${newLng} (${match.formatted_address})`);

                results.push({
                    id: site.id,
                    nombre: site.nombre,
                    google_name: match.name,
                    google_address: match.formatted_address,
                    old_lat: site.lat,
                    old_lng: site.lng,
                    new_lat: newLat,
                    new_lng: newLng,
                    place_id: match.place_id,
                    is_different: isDifferent
                });
            } else {
                console.warn(`[NO MATCH] ${site.id} - ${site.nombre} (Status: ${googleData.status})`);
                notFound.push(site);
            }
        } catch (err) {
            console.error(`[ERROR] Failed to fetch for ${site.nombre}:`, err.message);
        }

        // Small delay
        await new Promise(r => setTimeout(r, 200));
    }

    // Save results
    fs.writeFileSync(path.join(__dirname, 'google_api_matches.json'), JSON.stringify(results, null, 2));

    console.log(`\n---------------------------------`);
    console.log(`Total Processed: ${sites.length}`);
    console.log(`Matches Found: ${results.length}`);
    console.log(`Not Found: ${notFound.length}`);
    console.log(`Results saved to scripts/google_api_matches.json`);
}

fetchGoogleLocations();
