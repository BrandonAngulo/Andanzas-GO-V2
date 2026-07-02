require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

// Map of recommendation titles to their specific siteId
const recMapping = {
    'Pandebono Caliente': 's39',
    'Hora Dorada': 's17',
    'Amanecer': 's65',
    'San Antonio': 's19',
    'Las Gatas': 's8'
};

async function updateRouteRecommendations() {
    console.log('Fetching all public routes...');
    const { data: routes, error } = await supabase
        .from('routes')
        .select('*')
        .eq('is_published', true);

    if (error) {
        console.error('Error fetching routes:', error);
        return;
    }

    console.log(`Found ${routes.length} routes.`);

    for (const route of routes) {
        if (!route.recomendaciones || !Array.isArray(route.recomendaciones)) {
            continue;
        }

        let updated = false;
        const newRecs = route.recomendaciones.map(rec => {
            let matchedSiteId = null;
            
            for (const [key, siteId] of Object.entries(recMapping)) {
                if (rec.titulo.includes(key)) {
                    matchedSiteId = siteId;
                    break;
                }
            }

            if (matchedSiteId) {
                console.log(`Mapped [${route.nombre}] "${rec.titulo}" -> ${matchedSiteId}`);
                updated = true;
                return { ...rec, siteId: matchedSiteId };
            }
            
            // If it already had siteId, keep it
            return rec;
        });

        if (updated) {
            console.log(`Updating route: ${route.id}...`);
            const { error: updateError } = await supabase
                .from('routes')
                .update({ recomendaciones: newRecs })
                .eq('id', route.id);
                
            if (updateError) {
                console.error(`Error updating route ${route.id}:`, updateError);
            } else {
                console.log(`Successfully updated ${route.id}`);
            }
        }
    }
    
    console.log('Done!');
}

updateRouteRecommendations();
