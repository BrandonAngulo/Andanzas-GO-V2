const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const updates = [
    {
        id: 's1',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Museo_la_tertulia.JPG',
        image_credit: 'C arango, Public domain, via Wikimedia Commons'
    },
    {
        id: 's2',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Teatro_Municipal_de_Cali_-Panorama-.JPG',
        image_credit: 'Alejo1983, CC BY-SA 3.0, via Wikimedia Commons'
    },
    {
        id: 's17',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Cristo_Rey%2C_Cali.JPG',
        image_credit: 'Matt0962, CC BY-SA 3.0, via Wikimedia Commons'
    }
];

async function updateImages() {
    console.log(`Starting update for ${updates.length} sites...`);
    for (const update of updates) {
        const { id, logoUrl, image_credit } = update;
        const { error } = await supabase
            .from('sites')
            .update({ logo_url: logoUrl, image_credit: image_credit })
            .eq('id', id);

        if (error) console.error(`Failed to update ${id}:`, error.message);
        else console.log(`Updated ${id}`);
    }
}

updateImages();
