const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const updates = [
    // Corrected coordinates based on precise search results
    { id: 's1', lat: 3.45008, lng: -76.54533 }, // Museo La Tertulia (Verified)
    { id: 's2', lat: 3.449275, lng: -76.535861 }, // Teatro Municipal (Verified)
    { id: 's35', lat: 3.353889, lng: -76.522778 }, // Hacienda Cañasgordas (Verified: UAO ref)
    { id: 's17', lat: 3.4363944, lng: -76.5651167 }, // Cristo Rey (Verified)
    { id: 's3', lat: 3.452977, lng: -76.534135 }, // Bulevar del Río
    { id: 's4', lat: 3.455200, lng: -76.533000 }, // Lugar a Dudas (Calle 15N #8N-41 - approx fix)
    { id: 's6', lat: 3.450000, lng: -76.535700 }, // Museo Oro Calima
    { id: 's7', lat: 3.444285, lng: -76.536513 }, // La Topa Tolondra
    { id: 's8', lat: 3.451380, lng: -76.543060 }, // Gato de Tejada
    { id: 's9', lat: 3.434203, lng: -76.535541 }, // Plaza Mercado Alameda
    { id: 's10', lat: 3.449194, lng: -76.545197 }, // Sebastián de Belalcázar
    { id: 's11', lat: 3.443010, lng: -76.537400 }, // Loma de la Cruz
    { id: 's12', lat: 3.450586, lng: -76.536703 }, // Museo Arqueológico La Merced
    { id: 's13', lat: 3.453998, lng: -76.531985 }, // Iglesia La Ermita
];

async function updateLocations() {
    console.log(`Starting precision update for ${updates.length} sites...`);
    let success = 0;

    for (const update of updates) {
        const { error } = await supabase
            .from('sites')
            .update({ lat: update.lat, lng: update.lng })
            .eq('id', update.id);

        if (error) console.error(`Error updating ${update.id}:`, error.message);
        else {
            console.log(`Updated ${update.id} to ${update.lat}, ${update.lng}`);
            success++;
        }
    }
    console.log(`Precision update complete. ${success} updated.`);
}

updateLocations();
