const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const idsToDelete = [
    's7_topa',
    's9_alameda',
    's27_swing',
    's28_zaperoco',
    's29_tintin',
    's84_starlatin',
    's85_saborswing'
];

async function deleteDuplicates() {
    console.log(`Deleting ${idsToDelete.length} duplicate sites...`);

    const { error } = await supabase
        .from('sites')
        .delete()
        .in('id', idsToDelete);

    if (error) {
        console.error('Error deleting duplicates:', error);
    } else {
        console.log('Successfully deleted duplicates.');
    }
}

deleteDuplicates();
