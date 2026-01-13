const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function listSites() {
    const { data: sites, error } = await supabase
        .from('sites')
        .select('*');

    if (error) {
        console.error('Error fetching sites:', error);
        return;
    }

    // Sort numerically by ID
    sites.sort((a, b) => {
        const idA = parseInt(a.id.replace('s', ''));
        const idB = parseInt(b.id.replace('s', ''));
        return idA - idB;
    });

    let output = "| ID | Nombre | Latitud | Longitud |\n|---|---|---|---|\n";
    sites.forEach(site => {
        output += `| ${site.id} | ${site.nombre} | ${site.lat} | ${site.lng} |\n`;
    });

    output += `\n**Total Sites: ${sites.length}**`;

    // Write to file and also print to console
    fs.writeFileSync('sites_list_db.md', output, 'utf8');
    console.log(output);
}

listSites();
