
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const updates = [
    { id: 's139', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Complejo_Religioso_La_Merced_Cali.jpg' },
    { id: 's9', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Plaza_de_Mercado_Alameda%2C_Cali.jpg' },
    { id: 's10', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Museo_del_Oro_Calima.jpg' },
    { id: 's21', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Plazoleta_Jairo_Varela%2C_Cali.jpg' },
    { id: 's39', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Plaza_de_Cayzedo.jpg' },
    { id: 's40', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Torre_de_Cali_2.jpg' },
    { id: 's15', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Biblioteca_Departamental_Jorge_Garc%C3%A9s_Borrero.jpg' },
    { id: 's140', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Complejo_Religioso_San_Francisco.jpg' },
    { id: 's52', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Monumento_a_Jovita_Feijoo.jpg' },
    { id: 's108', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Edificio_Otero.jpg' }
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

