-- No-code content controls for Entertainment and scheduled learning stories.
insert into public.app_banners (key, scope, title_es, subtitle_es, title_en, subtitle_en, image_url, is_active) values
('entertainment_music', 'app', 'Una playlist para cada recorrido', 'Muy pronto vas a encontrar selecciones musicales para ponerle ritmo a tus caminatas, visitas y rutas.', 'A playlist for every journey', 'Music selections to bring rhythm to your walks, visits and routes are coming soon.', '/images/banners/unified/entretenimiento-v2.webp', true),
('entertainment_stories', 'app', 'Relatos, pódcast y voces de la ciudad', 'Muy pronto podrás escuchar historias, voces y relatos que le dan vida a Cali mientras andás.', 'Stories, podcasts and city voices', 'Soon you will be able to hear the stories and voices that bring Cali to life.', '/images/banners/unified/aprende-v2.webp', true)
on conflict (key) do update set title_es=excluded.title_es, subtitle_es=excluded.subtitle_es, title_en=excluded.title_en, subtitle_en=excluded.subtitle_en, image_url=excluded.image_url, updated_at=now();

update public.app_banners set image_url = case key
  when 'explorar' then '/images/banners/unified/explorar-v2.webp'
  when 'juegos' then '/images/banners/unified/entretenimiento-v2.webp'
  when 'paquesepas' then '/images/banners/unified/aprende-v2.webp'
  when 'rutas' then '/images/banners/unified/rutas-v2.webp'
  when 'eventos' then '/images/banners/unified/eventos-v2.webp'
  else image_url end,
  updated_at=now()
where key in ('explorar','juegos','paquesepas','rutas','eventos');

alter table public.learn_entries add column if not exists publish_at timestamptz;

drop policy if exists "Public Read Published Curiosidades" on public.learn_entries;
create policy "Public Read Published Curiosidades" on public.learn_entries for select using (
  is_staff() or (status = 'published' and (publish_at is null or publish_at <= now())) or (status = 'scheduled' and publish_at <= now())
);
drop policy if exists "Public can view published learn entries" on public.learn_entries;
create policy "Public can view published learn entries" on public.learn_entries for select using (
  (status = 'published' and (publish_at is null or publish_at <= now())) or (status = 'scheduled' and publish_at <= now())
);

insert into public.learn_entries (title, content_simple, content_full, sabias_que, city, tags, fuentes, status) values
('El río Cali: una ciudad que también se cuenta desde el agua', 'El río Cali cruza parte de la memoria urbana y acompaña varios espacios emblemáticos del centro.', 'Seguir el río Cali permite leer distintas capas de la ciudad: sus puentes, zonas verdes, edificios patrimoniales y transformaciones urbanas. Más que un fondo del paisaje, es un hilo para conversar sobre ambiente, crecimiento y vida cotidiana.\n\nEsta historia queda en borrador para revisión editorial, verificación de fuentes y futura conexión con sitios y rutas.', array['El río puede servir como eje narrativo para recorrer varias épocas y sectores de Cali.'], 'Cali', array['río','memoria urbana','ambiente'], 'Pendiente de validación editorial y fuentes institucionales.', 'draft'),
('Las carátulas de salsa: memoria gráfica para mirar y escuchar', 'Los discos de salsa también cuentan historias mediante fotografías, tipografías, colores y escenas de barrio.', 'Una carátula puede revelar cómo una época imaginó la fiesta, la ciudad y a sus artistas. Leer esos detalles abre una puerta entre música, diseño gráfico, fotografía y memoria popular.\n\nLa ficha deberá enriquecerse con ejemplos autorizados y fuentes antes de publicarse.', array['Escuchar una canción y observar su carátula activa dos formas distintas de memoria.'], 'Cali', array['salsa','diseño','música'], 'Pendiente de curaduría musical, visual y de derechos.', 'draft'),
('Los teatros del centro y la costumbre de encontrarse', 'Los teatros no fueron solamente salas de espectáculo: también funcionaron como puntos de encuentro y referencias urbanas.', 'Hablar de los teatros del centro permite unir arquitectura, cine, artes escénicas y hábitos cotidianos. Sus historias muestran cómo cambiaron las formas de reunirse y disfrutar la ciudad.\n\nAntes de publicar se deben precisar los recintos relacionados y revisar cronologías.', array['Un edificio cultural también guarda memoria de las personas que hicieron fila, trabajaron o se presentaron allí.'], 'Cali', array['teatro','arquitectura','centro'], 'Pendiente de revisión con archivos y fuentes culturales locales.', 'draft'),
('Cocinas de plaza: saberes que pasan de mano en mano', 'En las plazas de mercado, las recetas conviven con consejos, medidas aprendidas y maneras particulares de nombrar los ingredientes.', 'Las cocinas de plaza permiten acercarse a la ciudad desde los sentidos y reconocer conocimientos transmitidos entre generaciones. Cada preparación puede conectar territorios, migraciones, temporadas y memorias familiares.\n\nLa versión pública deberá incorporar voces directas y consentimiento de sus protagonistas.', array['Una receta puede ser, al mismo tiempo, una técnica, un recuerdo familiar y un mapa de procedencias.'], 'Cali', array['gastronomía','plazas de mercado','memoria'], 'Pendiente de reportería y validación con portadores de saberes.', 'draft'),
('Murales que cambian la forma de caminar el barrio', 'Un mural puede convertir una pared cotidiana en relato, homenaje, pregunta o punto de orientación.', 'El arte urbano propone otras maneras de observar el recorrido. Sus imágenes hablan de identidades, conflictos, celebraciones y futuros posibles, pero también cambian con el tiempo y requieren reconocer la autoría.\n\nLa ficha debe documentar obra, artista, fecha y contexto antes de pasar a revisión final.', array['Registrar cuándo se vio un mural ayuda a conservar memoria de una obra que puede transformarse o desaparecer.'], 'Cali', array['arte urbano','muralismo','barrios'], 'Pendiente de identificación de obras, autores y permisos de imagen.', 'draft'),
('Las aves urbanas: otra banda sonora de Cali', 'Parques, ríos, jardines y árboles ofrecen oportunidades para reconocer aves sin salir de la ciudad.', 'Aprender a observar aves cambia el ritmo del recorrido: invita a escuchar, esperar y notar relaciones entre vegetación, agua y vida urbana. La historia puede convertirse luego en una experiencia guiada de observación responsable.\n\nAntes de publicar se requiere revisión de especies y recomendaciones con fuentes especializadas.', array['Observar sin alimentar, perseguir ni alterar a las aves es parte esencial de una experiencia responsable.'], 'Cali', array['aves','naturaleza urbana','biodiversidad'], 'Pendiente de validación con fuentes ornitológicas y ambientales.', 'draft')
on conflict do nothing;
