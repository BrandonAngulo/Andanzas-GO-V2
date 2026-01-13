
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NEW_SITES = [
    "Centro Recreacional y Deportivo Club Cañasgordas Comfenalco Valle Delagente",
    "Centro Campestre Comfandi Pance",
    "Acuaparque de la Caña",
    "Orquideorama Cali",
    "La Estrella De Siloé"
];

const API_KEY = "AIzaSyDEVp0GhzKRgRtuNe_UCx9affGKpgTO82o";

async function fetchPlaceDetails() {
    const results = [];

    for (const name of NEW_SITES) {
        console.log(`Fetching details for: ${name}...`);
        // Search for the place
        const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(name + " Cali")}&inputtype=textquery&fields=place_id,name,geometry,formatted_address,types,rating,user_ratings_total&key=${API_KEY}`;

        try {
            const searchRes = await fetch(searchUrl);
            const searchData = await searchRes.json();

            if (searchData.candidates && searchData.candidates.length > 0) {
                const place = searchData.candidates[0];

                // Construct the site object matching our schema
                const site = {
                    id: `new_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // temporary ID
                    nombre: place.name,
                    nombre_en: place.name, // Will need manual translation or use same
                    tipo: mapType(place.types),
                    tipo_en: "Place", // Placeholder
                    lat: place.geometry.location.lat,
                    lng: place.geometry.location.lng,
                    rating: place.rating || 0,
                    visitas: place.user_ratings_total || 0,
                    place_id: place.place_id,
                    direccion: place.formatted_address,
                    logoUrl: "https://via.placeholder.com/400", // Will need image later
                    descripcion: "Descripción pendiente.",
                    descripcion_en: "Description pending.",
                    // Fill other required fields with placeholders
                    importancia: "Sitio de interés en Cali.",
                    importancia_en: "Site of interest in Cali.",
                    datosHistoricos: "",
                    datosHistoricos_en: "",
                    reconocimientos: [],
                    reconocimientos_en: [],
                    datosCuriosos: [],
                    datosCuriosos_en: []
                };

                results.push(site);
            } else {
                console.warn(`No results found for ${name}`);
            }
        } catch (error) {
            console.error(`Error fetching ${name}:`, error);
        }
    }

    // Save to a temporary JSON file
    fs.writeFileSync(path.join(__dirname, '../new_sites_details.json'), JSON.stringify(results, null, 2));
    console.log(`Saved ${results.length} sites to new_sites_details.json`);
}

function mapType(types) {
    const t = types || [];
    if (t.includes('park')) return 'Parque';
    if (t.includes('museum')) return 'Museo';
    if (t.includes('stadium') || t.includes('gym')) return 'Centro Deportivo';
    if (t.includes('point_of_interest')) return 'Sitio de Interés';
    return 'Sitio Turístico';
}

fetchPlaceDetails();
