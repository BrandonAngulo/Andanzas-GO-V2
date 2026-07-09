import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase credentials");

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Checking avatar presets...");
    const { data, error } = await supabase.from('avatar_presets').select('*');
    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log("Data:", JSON.stringify(data, null, 2));
    }
}
check();
