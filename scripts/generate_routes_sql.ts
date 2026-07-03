import fs from 'fs';
import routesData from '../routes_data.json';

let sql = '';

for (const route of routesData) {
  const gamificacionStr = route.gamificacion ? JSON.stringify(route.gamificacion).replace(/'/g, "''") : '[]';
  const justificacionesStr = route.justificaciones ? JSON.stringify(route.justificaciones).replace(/'/g, "''") : '[]';
  const justificacionesEnStr = route.justificaciones_en ? JSON.stringify(route.justificaciones_en).replace(/'/g, "''") : '[]';
  const recomendacionesStr = route.recomendaciones ? JSON.stringify(route.recomendaciones).replace(/'/g, "''") : '[]';
  const puntosStr = route.puntos ? JSON.stringify(route.puntos).replace(/'/g, "''") : '[]';

  sql += `
INSERT INTO public.routes (
  id,
  nombre,
  nombre_en,
  puntos,
  duracion_min,
  descripcion,
  descripcion_en,
  intro_story,
  intro_story_en,
  justificaciones,
  justificaciones_en,
  recomendaciones,
  gamificacion,
  reward_badge_id,
  is_published,
  user_id
) VALUES (
  '${route.id}',
  '${route.nombre.replace(/'/g, "''")}',
  ${route.nombre_en ? `'${route.nombre_en.replace(/'/g, "''")}'` : 'NULL'},
  '${puntosStr}'::jsonb,
  ${route.duracionMin || route.duracion_min || 120},
  '${route.descripcion.replace(/'/g, "''")}',
  ${route.descripcion_en ? `'${route.descripcion_en.replace(/'/g, "''")}'` : 'NULL'},
  ${route.intro_story ? `'${route.intro_story.replace(/'/g, "''")}'` : 'NULL'},
  ${route.intro_story_en ? `'${route.intro_story_en.replace(/'/g, "''")}'` : 'NULL'},
  '${justificacionesStr}'::jsonb,
  '${justificacionesEnStr}'::jsonb,
  '${recomendacionesStr}'::jsonb,
  '${gamificacionStr}'::jsonb,
  ${route.reward_badge_id ? `'${route.reward_badge_id}'` : 'NULL'},
  true,
  '00000000-0000-0000-0000-000000000000'
) ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  nombre_en = EXCLUDED.nombre_en,
  puntos = EXCLUDED.puntos,
  duracion_min = EXCLUDED.duracion_min,
  descripcion = EXCLUDED.descripcion,
  descripcion_en = EXCLUDED.descripcion_en,
  intro_story = EXCLUDED.intro_story,
  intro_story_en = EXCLUDED.intro_story_en,
  justificaciones = EXCLUDED.justificaciones,
  justificaciones_en = EXCLUDED.justificaciones_en,
  recomendaciones = EXCLUDED.recomendaciones,
  gamificacion = EXCLUDED.gamificacion,
  reward_badge_id = EXCLUDED.reward_badge_id,
  is_published = EXCLUDED.is_published;
`;
}

fs.writeFileSync('scripts/routes_update.sql', sql);
console.log('Generated scripts/routes_update.sql');
