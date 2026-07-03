import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import routesData from '../routes_data.json';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function uploadRoutes() {
  console.log('Uploading 6 routes to Supabase...');
  for (const route of routesData) {
    const { data, error } = await supabase
      .from('routes')
      .upsert({
        id: route.id,
        nombre: route.nombre,
        nombre_en: route.nombre_en,
        puntos: route.puntos,
        duracion_min: route.duracionMin || route.duracion_min || 120,
        descripcion: route.descripcion,
        descripcion_en: route.descripcion_en,
        intro_story: route.intro_story,
        intro_story_en: route.intro_story_en,
        justificaciones: route.justificaciones,
        justificaciones_en: route.justificaciones_en,
        recomendaciones: route.recomendaciones,
        gamificacion: route.gamificacion,
        reward_badge_id: route.reward_badge_id,
        is_published: true
      });
      
    if (error) {
      console.error(`Error uploading route ${route.id}:`, error.message);
    } else {
      console.log(`Successfully uploaded route ${route.id}`);
    }
  }
}

uploadRoutes();
