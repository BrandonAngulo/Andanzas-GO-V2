-- =====================================================================
-- TRIVIA GO · Banco world_general v2  (600 preguntas)
-- =====================================================================
-- Objetivo: sustituir el banco de mundo generado por plantillas por un
-- banco redactado pregunta a pregunta, con cobertura real de niveles 1-5
-- y 12 categorías, de modo que los modos niveles / leyenda / contrarreloj
-- dejen de repetirse.
--
-- Es IDEMPOTENTE: cada inserción se salta si ya existe una pregunta con el
-- mismo texto normalizado en el juego. Se puede ejecutar varias veces.
--
-- No altera reglas de juego, economía ni esquema. Sólo añade contenido.
-- =====================================================================

BEGIN;

-- 0) Marca el lote anterior generado por plantillas para poder auditarlo.
--    NO lo archiva: eso se decide tras revisar el banco nuevo en producción.
UPDATE public.game_questions
SET content_batch = COALESCE(content_batch, 'world_v1_plantillas'),
    updated_at    = timezone('utc', now())
WHERE game_id = '81111111-1111-1111-1111-111111111111'
  AND campaign = 'world_general'
  AND content_batch IS NULL;

-- 1) Banco nuevo.
WITH seed(category, level, question_type, question_format, question_text,
          options, correct_answer, correct_index, explanation) AS (
  VALUES
('Música', 1, 'multiple_choice', 'true_false', 'Una orquesta sinfónica está dirigida por un director frente a los músicos.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'El director marca el tempo y equilibra las secciones.'),
    ('Música', 1, 'multiple_choice', 'standard', '¿Qué instrumento tiene teclas blancas y negras y se toca con ambas manos?', '["El piano", "El violín", "La flauta", "El arpa"]'::jsonb, '"El piano"'::jsonb, 0, 'Un piano de cola estándar tiene 88 teclas.'),
    ('Música', 2, 'multiple_choice', 'standard', '¿Qué compositor alemán perdió la audición y aun así compuso su Novena Sinfonía?', '["Ludwig van Beethoven", "Johann Sebastian Bach", "Franz Schubert", "Johannes Brahms"]'::jsonb, '"Ludwig van Beethoven"'::jsonb, 0, 'La estrenó en 1824 ya prácticamente sordo.'),
    ('Música', 2, 'multiple_choice', 'standard', '¿Qué género musical argentino se asocia con el bandoneón y Carlos Gardel?', '["El tango", "La chacarera", "La zamba", "El candombe"]'::jsonb, '"El tango"'::jsonb, 0, 'Nació en el Río de la Plata a finales del siglo XIX.'),
    ('Música', 2, 'multiple_choice', 'standard', '¿Qué género nació en Jamaica y tuvo a Bob Marley como figura mundial?', '["El reggae", "El calipso", "El son", "El zouk"]'::jsonb, '"El reggae"'::jsonb, 0, 'Se desarrolló a partir del ska y el rocksteady.'),
    ('Música', 2, 'multiple_choice', 'elimination', '¿Cuál de estos géneros NO nació en Estados Unidos?', '["El flamenco", "El blues", "El jazz", "El hip hop"]'::jsonb, '"El flamenco"'::jsonb, 0, 'El flamenco surgió en Andalucía, España.'),
    ('Música', 2, 'multiple_choice', 'fill_blank', 'El compositor austriaco Wolfgang Amadeus ___ escribió La flauta mágica.', '["Mozart", "Haydn", "Salieri", "Gluck"]'::jsonb, '"Mozart"'::jsonb, 0, 'La ópera se estrenó en Viena en 1791.'),
    ('Música', 2, 'multiple_choice', 'true_false', 'El violín, la viola, el violonchelo y el contrabajo forman la familia de la cuerda frotada.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Todos se tocan principalmente con arco.'),
    ('Música', 2, 'multiple_choice', 'standard', '¿Qué grupo británico publicó el álbum The Dark Side of the Moon en 1973?', '["Pink Floyd", "Led Zeppelin", "Queen", "The Kinks"]'::jsonb, '"Pink Floyd"'::jsonb, 0, 'Permaneció en las listas de ventas durante más de una década.'),
    ('Música', 2, 'ordering', NULL, 'Ordena estas figuras musicales de mayor a menor duración.', '["Redonda", "Blanca", "Negra", "Corchea"]'::jsonb, '["Redonda", "Blanca", "Negra", "Corchea"]'::jsonb, NULL, 'Cada figura dura la mitad que la anterior.'),
    ('Música', 2, 'multiple_choice', 'standard', '¿Qué género de origen brasileño se asocia con el carnaval de Río de Janeiro?', '["La samba", "El forró", "El maracatú", "El choro"]'::jsonb, '"La samba"'::jsonb, 0, 'Las escolas de samba desfilan en el sambódromo.'),
    ('Música', 2, 'multiple_choice', 'standard', '¿Qué instrumento andino de viento está formado por tubos de caña de distinta longitud?', '["La zampoña", "El charango", "El bombo legüero", "El cajón peruano"]'::jsonb, '"La zampoña"'::jsonb, 0, 'También se conoce como siku en el mundo aimara.'),
    ('Música', 2, 'multiple_choice', 'standard', '¿Qué cantante estadounidense es apodada la Reina del Soul?', '["Aretha Franklin", "Diana Ross", "Tina Turner", "Whitney Houston"]'::jsonb, '"Aretha Franklin"'::jsonb, 0, 'Respect se convirtió en un himno de derechos civiles.'),
    ('Música', 3, 'multiple_choice', 'standard', '¿Qué compositor italiano escribió el ciclo de conciertos Las cuatro estaciones?', '["Antonio Vivaldi", "Arcangelo Corelli", "Domenico Scarlatti", "Giuseppe Tartini"]'::jsonb, '"Antonio Vivaldi"'::jsonb, 0, 'Cada concierto se acompaña de un soneto descriptivo.'),
    ('Música', 3, 'matching', NULL, 'Relaciona cada género con su país de origen.', '{"left": ["Fado", "Rebetiko", "Highlife", "Cumbia"], "right": ["Portugal", "Grecia", "Ghana", "Colombia"]}'::jsonb, '{"Fado": "Portugal", "Rebetiko": "Grecia", "Highlife": "Ghana", "Cumbia": "Colombia"}'::jsonb, NULL, 'Cada género refleja procesos históricos propios de su país.'),
    ('Música', 3, 'multiple_choice', 'standard', '¿Qué escala de siete notas caracteriza la música modal del canto gregoriano?', '["Los modos eclesiásticos", "La escala pentatónica", "La escala cromática", "La escala de tonos enteros"]'::jsonb, '"Los modos eclesiásticos"'::jsonb, 0, 'Dorio, frigio y lidio son algunos de esos modos.'),
    ('Música', 3, 'multi_select', NULL, 'Selecciona los instrumentos de la sección de viento madera de una orquesta.', '["Flauta", "Oboe", "Fagot", "Trompeta", "Trombón", "Tuba"]'::jsonb, '["Flauta", "Oboe", "Fagot"]'::jsonb, NULL, 'Los tres últimos pertenecen al viento metal.'),
    ('Música', 3, 'multiple_choice', 'standard', '¿Qué compositor ruso escribió el ballet El lago de los cisnes?', '["Piotr Ilich Chaikovski", "Ígor Stravinski", "Serguéi Prokófiev", "Modest Músorgski"]'::jsonb, '"Piotr Ilich Chaikovski"'::jsonb, 0, 'Se estrenó en Moscú en 1877.'),
    ('Música', 3, 'multiple_choice', 'elimination', '¿Cuál de estos NO es un compositor del periodo barroco?', '["Franz Liszt", "Johann Sebastian Bach", "Georg Friedrich Handel", "Antonio Vivaldi"]'::jsonb, '"Franz Liszt"'::jsonb, 0, 'Liszt pertenece al romanticismo del siglo XIX.'),
    ('Música', 3, 'multiple_choice', 'fill_blank', 'El intervalo entre una nota y su repetición al doble de frecuencia se llama ___.', '["octava", "quinta", "tercera", "séptima"]'::jsonb, '"octava"'::jsonb, 0, 'Es la base de la organización de las escalas musicales.'),
    ('Música', 3, 'multiple_choice', 'true_false', 'El jazz nació en Nueva Orleans a comienzos del siglo XX.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Combinó blues, ragtime y tradiciones de bandas de marcha.'),
    ('Música', 3, 'multiple_choice', 'standard', '¿Qué género urbano surgido en el Bronx en los años setenta combina rap, DJ, grafiti y breakdance?', '["El hip hop", "El funk", "El disco", "El house"]'::jsonb, '"El hip hop"'::jsonb, 0, 'Sus cuatro elementos definieron toda una cultura.'),
    ('Música', 3, 'multiple_choice', 'standard', '¿Qué compositor húngaro y qué colega recopilaron música campesina de Europa del Este a comienzos del siglo XX?', '["Béla Bartók", "Zoltán Kodály", "Ambos trabajaron juntos", "Ninguno de los dos"]'::jsonb, '"Béla Bartók"'::jsonb, 0, 'Bartók y Kodály documentaron miles de melodías tradicionales.'),
    ('Música', 3, 'multiple_choice', 'standard', '¿Qué instrumento de cuerda pulsada es característico de la música andina y suele tener cinco órdenes dobles?', '["El charango", "El cuatro", "El tres cubano", "El requinto"]'::jsonb, '"El charango"'::jsonb, 0, 'Su caja se construía tradicionalmente con caparazón de armadillo.'),
    ('Música', 4, 'multiple_choice', 'standard', '¿Qué compositor austriaco desarrolló el dodecafonismo a comienzos del siglo XX?', '["Arnold Schoenberg", "Gustav Mahler", "Anton Bruckner", "Richard Strauss"]'::jsonb, '"Arnold Schoenberg"'::jsonb, 0, 'Su método organiza las doce notas sin jerarquía tonal.'),
    ('Música', 4, 'multiple_choice', 'standard', '¿Qué obra de Ígor Stravinski provocó un tumulto en su estreno parisino de 1913?', '["La consagración de la primavera", "El pájaro de fuego", "Petrushka", "Pulcinella"]'::jsonb, '"La consagración de la primavera"'::jsonb, 0, 'Su ritmo y disonancias rompieron con la tradición del ballet.'),
    ('Música', 4, 'matching', NULL, 'Relaciona cada instrumento tradicional con su región.', '{"left": ["Sitar", "Koto", "Kora", "Didgeridoo"], "right": ["India", "Japón", "África occidental", "Australia"]}'::jsonb, '{"Sitar": "India", "Koto": "Japón", "Kora": "África occidental", "Didgeridoo": "Australia"}'::jsonb, NULL, 'Cada instrumento es central en la música de su cultura.'),
    ('Música', 4, 'multiple_choice', 'standard', '¿Qué sello discográfico de Detroit definió el sonido soul de los años sesenta?', '["Motown", "Stax", "Chess", "Blue Note"]'::jsonb, '"Motown"'::jsonb, 0, 'Lanzó a The Supremes, Marvin Gaye y The Temptations.'),
    ('Música', 4, 'multi_select', NULL, 'Selecciona los géneros que surgieron en el Caribe.', '["Son cubano", "Merengue", "Calipso", "Bossa nova", "Tango", "Vals criollo"]'::jsonb, '["Son cubano", "Merengue", "Calipso"]'::jsonb, NULL, 'La bossa nova es brasileña, el tango rioplatense.'),
    ('Música', 4, 'multiple_choice', 'true_false', 'El compositor John Cage escribió una obra que consiste enteramente en silencio interpretado.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'La pieza 4 minutos y 33 segundos se estrenó en 1952.'),
    ('Música', 4, 'multiple_choice', 'standard', '¿Qué forma musical alterna un estribillo recurrente con episodios contrastantes?', '["El rondó", "La fuga", "El canon", "La sonata"]'::jsonb, '"El rondó"'::jsonb, 0, 'Su esquema básico se describe como ABACA.'),
    ('Música', 4, 'multiple_choice', 'standard', '¿Qué género surgido en Jamaica y desarrollado en Panamá y Puerto Rico dio origen al reguetón?', '["El dancehall y el reggae en español", "El calipso", "El zouk", "El soca"]'::jsonb, '"El dancehall y el reggae en español"'::jsonb, 0, 'La fusión se consolidó en el Caribe hispano en los años noventa.'),
    ('Música', 5, 'multiple_choice', 'standard', '¿Qué obra de Johann Sebastian Bach explora sistemáticamente las 24 tonalidades mayores y menores?', '["El clave bien temperado", "Las variaciones Goldberg", "El arte de la fuga", "La ofrenda musical"]'::jsonb, '"El clave bien temperado"'::jsonb, 0, 'Consta de preludios y fugas en todas las tonalidades.'),
    ('Música', 5, 'multiple_choice', 'standard', '¿Qué término designa la superposición de dos o más líneas melódicas independientes?', '["El contrapunto", "La homofonía", "El ostinato", "El glissando"]'::jsonb, '"El contrapunto"'::jsonb, 0, 'Bach es considerado su máximo exponente.'),
    ('Música', 5, 'matching', NULL, 'Relaciona cada compositor con el periodo al que pertenece.', '{"left": ["Claudio Monteverdi", "Joseph Haydn", "Claude Debussy", "Karlheinz Stockhausen"], "right": ["Renacimiento y primer barroco", "Clasicismo", "Impresionismo musical", "Vanguardia de posguerra"]}'::jsonb, '{"Claudio Monteverdi": "Renacimiento y primer barroco", "Joseph Haydn": "Clasicismo", "Claude Debussy": "Impresionismo musical", "Karlheinz Stockhausen": "Vanguardia de posguerra"}'::jsonb, NULL, 'Cada uno marcó una transición estilística.'),
    ('Música', 5, 'multiple_choice', 'standard', '¿Qué escala de cinco notas es común en la música tradicional de África occidental y Asia oriental?', '["La escala pentatónica", "La escala frigia", "La escala armónica menor", "La escala hexatonal"]'::jsonb, '"La escala pentatónica"'::jsonb, 0, 'También aparece en el blues y en el folclore andino.'),
    ('Música', 5, 'multiple_choice', 'standard', '¿Qué compositora del siglo XII escribió cantos litúrgicos y es una de las primeras autoras identificadas de la música occidental?', '["Hildegard von Bingen", "Barbara Strozzi", "Francesca Caccini", "Clara Schumann"]'::jsonb, '"Hildegard von Bingen"'::jsonb, 0, 'Además de música dejó obras de teología y medicina.'),
    ('Música', 5, 'multiple_choice', 'true_false', 'El ritmo de clave de tres por dos es una célula rítmica fundamental de la música afrocubana.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Organiza la sincronía de toda la sección rítmica.'),
    ('Música', 5, 'multiple_choice', 'standard', '¿Qué instrumento electrónico inventado en 1920 se toca sin contacto físico moviendo las manos entre dos antenas?', '["El theremín", "El ondas Martenot", "El mellotrón", "El sintetizador modular"]'::jsonb, '"El theremín"'::jsonb, 0, 'Lev Termen lo desarrolló en la Unión Soviética.'),
    ('Cine y series', 1, 'multiple_choice', 'standard', '¿Qué premio entrega anualmente la Academia de Hollywood?', '["El Óscar", "El Globo de Oro", "La Palma de Oro", "El Goya"]'::jsonb, '"El Óscar"'::jsonb, 0, 'La primera ceremonia se celebró en 1929.'),
    ('Cine y series', 1, 'multiple_choice', 'standard', '¿Qué estudio creó a Mickey Mouse?', '["Disney", "Warner Bros", "Universal", "Paramount"]'::jsonb, '"Disney"'::jsonb, 0, 'El personaje debutó en Steamboat Willie en 1928.'),
    ('Cine y series', 1, 'multiple_choice', 'true_false', 'El cine mudo existió antes de que se incorporara el sonido sincronizado.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'El paso al sonoro se aceleró tras El cantor de jazz en 1927.'),
    ('Cine y series', 1, 'multiple_choice', 'standard', '¿Qué saga espacial creada por George Lucas comenzó en 1977?', '["Star Wars", "Star Trek", "Dune", "Battlestar Galactica"]'::jsonb, '"Star Wars"'::jsonb, 0, 'La primera entrega se estrenó como Una nueva esperanza.'),
    ('Cine y series', 1, 'multiple_choice', 'standard', '¿Qué actor interpretó al arqueólogo Indiana Jones?', '["Harrison Ford", "Tom Hanks", "Kurt Russell", "Michael Douglas"]'::jsonb, '"Harrison Ford"'::jsonb, 0, 'El personaje debutó en 1981.'),
    ('Cine y series', 1, 'multiple_choice', 'elimination', '¿Cuál de estos NO es un género cinematográfico?', '["Óleo", "Comedia", "Terror", "Documental"]'::jsonb, '"Óleo"'::jsonb, 0, 'El óleo es una técnica pictórica.'),
    ('Cine y series', 1, 'multiple_choice', 'fill_blank', 'El festival de cine de ___ entrega la Palma de Oro cada mayo en Francia.', '["Cannes", "Venecia", "Berlín", "Toronto"]'::jsonb, '"Cannes"'::jsonb, 0, 'Se celebra desde 1946 en la Riviera francesa.'),
    ('Cine y series', 1, 'multiple_choice', 'standard', '¿Qué película de animación japonesa dirigida por Hayao Miyazaki ganó el Óscar en 2003?', '["El viaje de Chihiro", "La princesa Mononoke", "Mi vecino Totoro", "El castillo ambulante"]'::jsonb, '"El viaje de Chihiro"'::jsonb, 0, 'Fue la primera película de anime en ganar la categoría.'),
    ('Cine y series', 1, 'multiple_choice', 'true_false', 'Una serie de televisión se organiza habitualmente en temporadas y episodios.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Cada temporada agrupa episodios emitidos en un mismo periodo.'),
    ('Cine y series', 1, 'multiple_choice', 'standard', '¿Qué personaje de cómic creado por DC es conocido como el hombre murciélago?', '["Batman", "Superman", "Flash", "Linterna Verde"]'::jsonb, '"Batman"'::jsonb, 0, 'Debutó en Detective Comics en 1939.'),
    ('Cine y series', 2, 'multiple_choice', 'standard', '¿Qué director británico es conocido como el maestro del suspenso?', '["Alfred Hitchcock", "David Lean", "Carol Reed", "Michael Powell"]'::jsonb, '"Alfred Hitchcock"'::jsonb, 0, 'Dirigió Psicosis, Vértigo y Los pájaros.')
),
seed_typed AS (
  SELECT category::text        AS category,
         level::int            AS level,
         question_type::text   AS question_type,
         question_format::text AS question_format,
         question_text::text   AS question_text,
         options::jsonb        AS options,
         correct_answer::jsonb AS correct_answer,
         correct_index::int    AS correct_index,
         explanation::text     AS explanation,
         lower(regexp_replace(
           translate(question_text, 'áéíóúüñÁÉÍÓÚÜÑ', 'aeiouunAEIOUUN'),
           '[^a-zA-Z0-9]+', '', 'g')) AS norm_key
  FROM seed
),
seed_unique AS (
  SELECT DISTINCT ON (norm_key) * FROM seed_typed ORDER BY norm_key
)
INSERT INTO public.game_questions (
  game_id, question_text, options, correct_index, correct_answer,
  points_reward, time_limit_sec, question_type, question_format,
  category, level, explanation, version, status, campaign, content_batch
)
SELECT
  '81111111-1111-1111-1111-111111111111'::uuid,
  s.question_text,
  s.options,
  s.correct_index,
  s.correct_answer,
  10,
  30,
  s.question_type,
  s.question_format,
  s.category,
  s.level,
  s.explanation,
  1,
  'published',
  'world_general',
  'world_v2_2026'
FROM seed_unique s
WHERE NOT EXISTS (
  SELECT 1 FROM public.game_questions existente
  WHERE existente.game_id = '81111111-1111-1111-1111-111111111111'
    AND lower(regexp_replace(
          translate(existente.question_text, 'áéíóúüñÁÉÍÓÚÜÑ', 'aeiouunAEIOUUN'),
          '[^a-zA-Z0-9]+', '', 'g')) = s.norm_key
);

COMMIT;

-- =====================================================================
-- VERIFICACIÓN (ejecutar después del COMMIT)
-- =====================================================================
-- Cobertura por categoría y nivel del banco de mundo:
--
--   SELECT category, level, count(*)
--   FROM public.game_questions
--   WHERE game_id = '81111111-1111-1111-1111-111111111111'
--     AND campaign = 'world_general' AND status = 'published'
--   GROUP BY 1,2 ORDER BY 1,2;
--
-- Debe haber preguntas en los cinco niveles de las doce categorías.
-- Si algún nivel queda vacío, el modo Leyenda volverá a caer al fallback.
--
-- Densidad de plantillas (ninguna familia debería superar 3):
--
--   SELECT left(question_text, 40) AS patron, count(*)
--   FROM public.game_questions
--   WHERE game_id = '81111111-1111-1111-1111-111111111111' AND campaign = 'world_general'
--     AND content_batch = 'world_v2_2026'
--   GROUP BY 1 HAVING count(*) > 3 ORDER BY 2 DESC;
-- =====================================================================
