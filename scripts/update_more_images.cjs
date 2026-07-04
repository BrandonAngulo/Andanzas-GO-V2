
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const updates = [
    {
        id: 's16',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Ermita_Cali.jpg'
    },
    {
        id: 's8',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Gato_de_Tejada.jpg'
    },
    {
        id: 's19',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Capilla_de_San_Antonio_Cali_2.jpg'
    },
    {
        id: 's5',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Monumento_a_Sebasti%C3%A1n_de_Belalc%C3%A1zar%2C_Cali.jpg'
    },
    {
        id: 's13',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Oso_de_Anteojos_en_el_Zoologico_de_Cali.jpg'
    },
    {
        id: 's11',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Parque_Artesanal_Loma_de_la_Cruz.jpg'
    },
    {
        id: 's65',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Cerro_de_las_Tres_Cruces_Cali.jpg'
    },
    {
        id: 's3',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Bulevar_del_Rio_Cali.jpg'
    },
    {
        id: 's122',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Biblioteca_Mario_Carvajal_Univalle.jpg'
    },
    {
        id: 's137',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Estadio_Olimpico_Pascual_Guerrero.jpg'
    }
];

async function updateImages() {
    console.log('Starting update for ' + updates.length + ' sites...');
    for (const update of updates) {
        const { id, logoUrl } = update;
        const { error } = await supabase
            .from('sites')
            .update({ logo_url: logoUrl })
            .eq('id', id);

        if (error) console.error('Failed to update ' + id + ':', error.message);
        else console.log('Updated ' + id);
    }
}

updateImages();

