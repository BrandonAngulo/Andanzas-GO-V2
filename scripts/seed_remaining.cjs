const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedBadges() {
    console.log("Seeding badges...");
    const filePath = path.join(__dirname, '../badges_data.json');
    if (!fs.existsSync(filePath)) {
        console.warn("badges_data.json not found!");
        return;
    }
    const badges = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let success = 0;
    let fail = 0;
    for (const badge of badges) {
        const dbBadge = {
            id: String(badge.id),
            nombre: badge.nombre,
            nombre_en: badge.nombre_en,
            descripcion: badge.descripcion,
            descripcion_en: badge.descripcion_en,
            icono_name: badge.icono || 'Award'
        };
        const { error } = await supabase.from('badges').upsert(dbBadge, { onConflict: 'id' });
        if (error) {
            console.error(`Error inserting badge ${badge.id}:`, error.message);
            fail++;
        } else {
            success++;
        }
    }
    console.log(`Badges seeded. Success: ${success}, Failed: ${fail}`);
}

async function seedRoutes() {
    console.log("Seeding routes...");
    const filePath = path.join(__dirname, '../routes_data.json');
    if (!fs.existsSync(filePath)) {
        console.warn("routes_data.json not found!");
        return;
    }
    const routes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let success = 0;
    let fail = 0;
    for (const route of routes) {
        const dbRoute = {
            id: route.id,
            nombre: route.nombre,
            nombre_en: route.nombre_en,
            puntos: route.puntos,
            duracion_min: route.duracionMin,
            descripcion: route.descripcion,
            descripcion_en: route.descripcion_en,
            intro_story: route.intro_story,
            intro_story_en: route.intro_story_en,
            justificaciones: route.justificaciones,
            justificaciones_en: route.justificaciones_en,
            recomendaciones: route.recomendaciones,
            gamificacion: route.gamificacion,
            is_published: route.publico || false,
            reward_badge_id: route.reward_badge_id
        };
        const { error } = await supabase.from('routes').upsert(dbRoute, { onConflict: 'id' });
        if (error) {
            console.error(`Error inserting route ${route.id}:`, error.message);
            fail++;
        } else {
            success++;
        }
    }
    console.log(`Routes seeded. Success: ${success}, Failed: ${fail}`);
}

async function run() {
    await seedBadges();
    await seedRoutes();
}

run();
