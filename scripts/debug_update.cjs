const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

console.log("URL:", process.env.VITE_SUPABASE_URL);
// Do not print key

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testUpdate() {
    const targetId = 's40';
    const newLat = 3.4583977;

    console.log(`Attempting to update ${targetId} to lat: ${newLat}`);

    const { data, error } = await supabase
        .from('sites')
        .update({ lat: newLat })
        .eq('id', targetId)
        .select();

    if (error) {
        console.error("Update Error:", error);
    } else {
        console.log("Update Success. Returned Data:", data);
    }

    // Verify
    const { data: verify, error: vError } = await supabase
        .from('sites')
        .select('lat')
        .eq('id', targetId);

    console.log("Verification Read:", verify);
}

testUpdate();
