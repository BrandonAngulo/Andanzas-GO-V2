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
('Geografía y territorio', 1, 'multiple_choice', 'standard', '¿Qué océano es el más extenso del planeta?', '["Océano Pacífico", "Océano Atlántico", "Océano Índico", "Océano Ártico"]'::jsonb, '"Océano Pacífico"'::jsonb, 0, 'El Pacífico cubre cerca de un tercio de la superficie terrestre.'),
    ('Geografía y territorio', 1, 'multiple_choice', 'standard', '¿Qué cordillera recorre todo el occidente de América del Sur?', '["Los Andes", "Las Rocosas", "Los Alpes", "Los Urales"]'::jsonb, '"Los Andes"'::jsonb, 0, 'Los Andes se extienden unos 7.000 km desde Venezuela hasta Tierra del Fuego.'),
    ('Geografía y territorio', 1, 'multiple_choice', 'standard', '¿Qué desierto cálido es el más grande del mundo?', '["Sahara", "Gobi", "Kalahari", "Atacama"]'::jsonb, '"Sahara"'::jsonb, 0, 'El Sahara ocupa buena parte del norte de África.'),
    ('Geografía y territorio', 1, 'multiple_choice', 'true_false', 'El río Amazonas desemboca en el océano Atlántico.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'El Amazonas vierte sus aguas en el Atlántico, en el norte de Brasil.'),
    ('Geografía y territorio', 1, 'multiple_choice', 'standard', '¿Cuál es el país más grande del mundo por superficie?', '["Rusia", "Canadá", "China", "Brasil"]'::jsonb, '"Rusia"'::jsonb, 0, 'Rusia abarca más de 17 millones de km2 entre Europa y Asia.'),
    ('Geografía y territorio', 1, 'multiple_choice', 'elimination', '¿Cuál de estos países NO tiene salida al mar?', '["Bolivia", "Perú", "Chile", "Ecuador"]'::jsonb, '"Bolivia"'::jsonb, 0, 'Bolivia perdió su litoral en el siglo XIX y hoy no tiene costa.'),
    ('Geografía y territorio', 1, 'multiple_choice', 'standard', '¿Qué continente está cubierto casi por completo por hielo?', '["Antártida", "Oceanía", "Asia", "América del Norte"]'::jsonb, '"Antártida"'::jsonb, 0, 'El manto de hielo antártico concentra la mayor reserva de agua dulce del planeta.'),
    ('Geografía y territorio', 1, 'multiple_choice', 'fill_blank', 'El canal de ___ conecta el Atlántico con el Pacífico atravesando Centroamérica.', '["Panamá", "Suez", "Kiel", "Corinto"]'::jsonb, '"Panamá"'::jsonb, 0, 'El canal de Panamá se inauguró en 1914.'),
    ('Geografía y territorio', 1, 'multiple_choice', 'standard', '¿Qué mar separa Europa de África?', '["Mar Mediterráneo", "Mar Báltico", "Mar Negro", "Mar Caspio"]'::jsonb, '"Mar Mediterráneo"'::jsonb, 0, 'El Mediterráneo baña las costas del sur de Europa y el norte de África.'),
    ('Geografía y territorio', 1, 'multiple_choice', 'true_false', 'Australia es al mismo tiempo un país y un continente.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Es el único país que ocupa un continente completo.'),
    ('Geografía y territorio', 2, 'multiple_choice', 'standard', '¿Qué cadena montañosa se toma como límite entre Europa y Asia?', '["Montes Urales", "Cáucaso", "Cárpatos", "Balcanes"]'::jsonb, '"Montes Urales"'::jsonb, 0, 'Los Urales cruzan Rusia de norte a sur y marcan el límite convencional entre ambos continentes.'),
    ('Geografía y territorio', 2, 'multiple_choice', 'standard', '¿Qué país tiene hoy la mayor población del mundo?', '["India", "China", "Estados Unidos", "Indonesia"]'::jsonb, '"India"'::jsonb, 0, 'India superó a China en población durante 2023.'),
    ('Geografía y territorio', 2, 'multiple_choice', 'elimination', '¿Cuál de estas ciudades NO es capital de su país?', '["Estambul", "Nairobi", "Hanói", "Rabat"]'::jsonb, '"Estambul"'::jsonb, 0, 'La capital de Turquía es Ankara, no Estambul.'),
    ('Geografía y territorio', 2, 'multiple_choice', 'standard', '¿Cuál es el lago más profundo del mundo?', '["Lago Baikal", "Lago Superior", "Lago Titicaca", "Lago Tanganica"]'::jsonb, '"Lago Baikal"'::jsonb, 0, 'El Baikal supera los 1.600 metros de profundidad en Siberia.'),
    ('Geografía y territorio', 2, 'multiple_choice', 'standard', '¿Qué estrecho separa España de Marruecos?', '["Estrecho de Gibraltar", "Estrecho de Ormuz", "Estrecho de Magallanes", "Estrecho de Bering"]'::jsonb, '"Estrecho de Gibraltar"'::jsonb, 0, 'Gibraltar comunica el Mediterráneo con el Atlántico en apenas 14 km de anchura mínima.'),
    ('Geografía y territorio', 2, 'multiple_choice', 'standard', '¿En qué país se encuentra la ciudadela inca de Machu Picchu?', '["Perú", "Bolivia", "Ecuador", "Chile"]'::jsonb, '"Perú"'::jsonb, 0, 'Machu Picchu está en la región de Cusco, en Perú.'),
    ('Geografía y territorio', 2, 'multiple_choice', 'fill_blank', 'La península ___ está formada principalmente por España y Portugal.', '["Ibérica", "Balcánica", "Escandinava", "Itálica"]'::jsonb, '"Ibérica"'::jsonb, 0, 'La península ibérica se separa del resto de Europa por los Pirineos.'),
    ('Geografía y territorio', 2, 'multiple_choice', 'standard', '¿Qué país africano tiene la mayor población?', '["Nigeria", "Egipto", "Etiopía", "Sudáfrica"]'::jsonb, '"Nigeria"'::jsonb, 0, 'Nigeria supera los 200 millones de habitantes.'),
    ('Geografía y territorio', 2, 'multiple_choice', 'true_false', 'Groenlandia es un territorio autónomo dentro del Reino de Dinamarca.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Groenlandia tiene autogobierno pero sigue vinculada a Dinamarca.'),
    ('Geografía y territorio', 2, 'multiple_choice', 'standard', '¿Qué mar interior de Asia Central se ha reducido drásticamente desde 1960?', '["Mar de Aral", "Mar Caspio", "Mar Negro", "Mar Muerto"]'::jsonb, '"Mar de Aral"'::jsonb, 0, 'El desvío de sus ríos tributarios para riego secó gran parte del Aral.'),
    ('Geografía y territorio', 2, 'ordering', NULL, 'Ordena estas ciudades europeas de norte a sur.', '["Oslo", "Berlín", "Roma", "Túnez"]'::jsonb, '["Oslo", "Berlín", "Roma", "Túnez"]'::jsonb, NULL, 'La secuencia sigue las latitudes decrecientes desde Escandinavia hasta el norte de África.'),
    ('Geografía y territorio', 2, 'multiple_choice', 'standard', '¿Qué archipiélago del Pacífico inspiró las observaciones de Darwin sobre las especies?', '["Islas Galápagos", "Islas Marshall", "Islas Salomón", "Islas Fiyi"]'::jsonb, '"Islas Galápagos"'::jsonb, 0, 'Darwin visitó las Galápagos en 1835 durante el viaje del Beagle.'),
    ('Geografía y territorio', 3, 'multiple_choice', 'standard', '¿Qué isla comparten Indonesia, Malasia y Brunéi?', '["Borneo", "Nueva Guinea", "Sumatra", "Célebes"]'::jsonb, '"Borneo"'::jsonb, 0, 'Borneo es la única isla del mundo dividida entre tres países.'),
    ('Geografía y territorio', 3, 'multiple_choice', 'standard', '¿Cuál es el país soberano más pequeño del mundo por superficie?', '["Ciudad del Vaticano", "Mónaco", "Nauru", "San Marino"]'::jsonb, '"Ciudad del Vaticano"'::jsonb, 0, 'El Vaticano ocupa cerca de 0,44 km2 dentro de Roma.'),
    ('Geografía y territorio', 3, 'multi_select', NULL, 'Selecciona los países que tienen costa sobre el mar Báltico.', '["Polonia", "Letonia", "Finlandia", "Chequia", "Hungría", "Austria"]'::jsonb, '["Polonia", "Letonia", "Finlandia"]'::jsonb, NULL, 'Chequia, Hungría y Austria no tienen salida al mar.'),
    ('Geografía y territorio', 3, 'multiple_choice', 'elimination', '¿Cuál de estos países europeos SÍ tiene costa marítima?', '["Eslovenia", "Austria", "Hungría", "Suiza"]'::jsonb, '"Eslovenia"'::jsonb, 0, 'Eslovenia tiene un breve litoral sobre el mar Adriático.'),
    ('Geografía y territorio', 3, 'multiple_choice', 'standard', '¿Qué corriente oceánica cálida suaviza el clima del noroeste de Europa?', '["Corriente del Golfo", "Corriente de Humboldt", "Corriente de Benguela", "Corriente de California"]'::jsonb, '"Corriente del Golfo"'::jsonb, 0, 'La corriente del Golfo transporta agua cálida desde el Caribe hacia el Atlántico norte.'),
    ('Geografía y territorio', 3, 'matching', NULL, 'Relaciona cada país con el desierto que lo caracteriza.', '{"left": ["Chile", "Mongolia", "Namibia", "Botsuana"], "right": ["Atacama", "Gobi", "Namib", "Kalahari"]}'::jsonb, '{"Chile": "Atacama", "Mongolia": "Gobi", "Namibia": "Namib", "Botsuana": "Kalahari"}'::jsonb, NULL, 'Cada desierto define el paisaje dominante de su país.'),
    ('Geografía y territorio', 3, 'multiple_choice', 'standard', '¿Qué cordillera submarina recorre el océano Atlántico de norte a sur?', '["Dorsal Mesoatlántica", "Fosa de las Marianas", "Meseta del Tíbet", "Cordillera de Kerguelen"]'::jsonb, '"Dorsal Mesoatlántica"'::jsonb, 0, 'La dorsal marca el límite donde se separan las placas americana y euroasiática.'),
    ('Geografía y territorio', 3, 'multiple_choice', 'standard', '¿Cuál es la capital administrativa de Sudáfrica?', '["Pretoria", "Ciudad del Cabo", "Johannesburgo", "Durban"]'::jsonb, '"Pretoria"'::jsonb, 0, 'Sudáfrica reparte sus funciones de gobierno entre tres ciudades.'),
    ('Geografía y territorio', 3, 'multiple_choice', 'fill_blank', 'El punto más bajo de tierra firme del planeta está a orillas del ___.', '["Mar Muerto", "Mar Caspio", "Lago Eyre", "Valle de la Muerte"]'::jsonb, '"Mar Muerto"'::jsonb, 0, 'La costa del mar Muerto está a más de 400 metros bajo el nivel del mar.'),
    ('Geografía y territorio', 3, 'multiple_choice', 'true_false', 'El Danubio atraviesa más países que cualquier otro río del mundo.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'El Danubio recorre o bordea diez países europeos.'),
    ('Geografía y territorio', 3, 'multiple_choice', 'standard', '¿Qué país tiene la frontera terrestre más larga del mundo compartida con un solo vecino?', '["Canadá", "Mongolia", "México", "Kazajistán"]'::jsonb, '"Canadá"'::jsonb, 0, 'La frontera entre Canadá y Estados Unidos supera los 8.800 km.'),
    ('Geografía y territorio', 3, 'multiple_choice', 'standard', '¿Qué ciudad está atravesada por el estrecho del Bósforo?', '["Estambul", "Atenas", "Odesa", "Bakú"]'::jsonb, '"Estambul"'::jsonb, 0, 'Estambul se extiende a ambos lados del Bósforo, en Europa y en Asia.'),
    ('Geografía y territorio', 3, 'multiple_choice', 'standard', '¿Qué gran isla del Mediterráneo pertenece a Italia y alberga el volcán Etna?', '["Sicilia", "Cerdeña", "Creta", "Córcega"]'::jsonb, '"Sicilia"'::jsonb, 0, 'El Etna es el volcán activo más alto de Europa continental.'),
    ('Geografía y territorio', 4, 'multiple_choice', 'standard', '¿Cuál es el país más densamente poblado del mundo entre los estados soberanos?', '["Mónaco", "Singapur", "Bangladés", "Malta"]'::jsonb, '"Mónaco"'::jsonb, 0, 'Mónaco concentra decenas de miles de habitantes en poco más de 2 km2.'),
    ('Geografía y territorio', 4, 'ordering', NULL, 'Ordena estas montañas de mayor a menor altitud.', '["Everest", "K2", "Kangchenjunga", "Lhotse"]'::jsonb, '["Everest", "K2", "Kangchenjunga", "Lhotse"]'::jsonb, NULL, 'Las cuatro superan los 8.500 metros y están en el Himalaya o el Karakórum.'),
    ('Geografía y territorio', 4, 'multiple_choice', 'standard', '¿Qué mar carece de costas y está delimitado únicamente por corrientes oceánicas?', '["Mar de los Sargazos", "Mar de Coral", "Mar de Barents", "Mar de Weddell"]'::jsonb, '"Mar de los Sargazos"'::jsonb, 0, 'El mar de los Sargazos está encerrado por el giro del Atlántico Norte.'),
    ('Geografía y territorio', 4, 'multiple_choice', 'standard', '¿Qué país africano resistió la colonización europea y mantuvo su independencia?', '["Etiopía", "Ghana", "Senegal", "Kenia"]'::jsonb, '"Etiopía"'::jsonb, 0, 'Etiopía derrotó a Italia en Adua en 1896 y conservó su soberanía.'),
    ('Geografía y territorio', 4, 'multi_select', NULL, 'Selecciona los países que atraviesa la línea del ecuador.', '["Ecuador", "Kenia", "Indonesia", "Bolivia", "Angola", "Vietnam"]'::jsonb, '["Ecuador", "Kenia", "Indonesia"]'::jsonb, NULL, 'Bolivia, Angola y Vietnam quedan fuera de la línea ecuatorial.'),
    ('Geografía y territorio', 4, 'multiple_choice', 'standard', '¿Cuál es el país completamente rodeado por otro con mayor superficie?', '["Lesoto", "San Marino", "Ciudad del Vaticano", "Andorra"]'::jsonb, '"Lesoto"'::jsonb, 0, 'Lesoto está enteramente rodeado por Sudáfrica.'),
    ('Geografía y territorio', 4, 'multiple_choice', 'standard', '¿Qué región rusa está separada del resto del país entre Polonia y Lituania?', '["Kaliningrado", "Carelia", "Daguestán", "Chukotka"]'::jsonb, '"Kaliningrado"'::jsonb, 0, 'Kaliningrado es un exclave ruso sobre el mar Báltico.'),
    ('Geografía y territorio', 4, 'multiple_choice', 'standard', '¿Qué desierto costero es considerado el lugar no polar más árido del planeta?', '["Desierto de Atacama", "Desierto del Sahara", "Desierto de Gobi", "Desierto de Sonora"]'::jsonb, '"Desierto de Atacama"'::jsonb, 0, 'En algunas zonas de Atacama no se registran lluvias durante años.'),
    ('Geografía y territorio', 4, 'multiple_choice', 'standard', '¿Qué estrecho controla el paso marítimo de buena parte del petróleo del golfo Pérsico?', '["Estrecho de Ormuz", "Estrecho de Malaca", "Estrecho de Skagerrak", "Estrecho de Dover"]'::jsonb, '"Estrecho de Ormuz"'::jsonb, 0, 'Ormuz separa Irán de la península arábiga.'),
    ('Geografía y territorio', 5, 'multiple_choice', 'standard', '¿Cuál es el punto más profundo conocido de los océanos?', '["Abismo Challenger", "Fosa de Puerto Rico", "Fosa de Tonga", "Fosa de Java"]'::jsonb, '"Abismo Challenger"'::jsonb, 0, 'El Abismo Challenger está en la fosa de las Marianas y supera los 10.900 metros.'),
    ('Geografía y territorio', 5, 'multiple_choice', 'standard', '¿Qué país cuenta con tres capitales oficiales repartidas entre los poderes del Estado?', '["Sudáfrica", "Bolivia", "Países Bajos", "Malasia"]'::jsonb, '"Sudáfrica"'::jsonb, 0, 'Sudáfrica separa el ejecutivo, el legislativo y el judicial en tres ciudades.'),
    ('Geografía y territorio', 5, 'multiple_choice', 'standard', '¿Cuál es el bioma terrestre continuo más extenso del planeta?', '["Taiga o bosque boreal", "Selva tropical", "Sabana", "Tundra"]'::jsonb, '"Taiga o bosque boreal"'::jsonb, 0, 'La taiga forma un cinturón casi ininterrumpido por Canadá, Escandinavia y Siberia.'),
    ('Geografía y territorio', 5, 'matching', NULL, 'Relaciona cada capital con su país.', '{"left": ["Astaná", "Uagadugú", "Nukualofa", "Paramaribo"], "right": ["Kazajistán", "Burkina Faso", "Tonga", "Surinam"]}'::jsonb, '{"Astaná": "Kazajistán", "Uagadugú": "Burkina Faso", "Nukualofa": "Tonga", "Paramaribo": "Surinam"}'::jsonb, NULL, 'Cuatro capitales poco conocidas de cuatro continentes distintos.'),
    ('Geografía y territorio', 5, 'multiple_choice', 'standard', '¿Qué estrecho conecta el mar Negro con el mar de Mármara?', '["Bósforo", "Dardanelos", "Estrecho de Kerch", "Canal de Corinto"]'::jsonb, '"Bósforo"'::jsonb, 0, 'Los Dardanelos, en cambio, unen el mar de Mármara con el Egeo.'),
    ('Geografía y territorio', 5, 'multiple_choice', 'standard', '¿Qué accidente geográfico separa la isla de Gran Bretaña de Irlanda?', '["Mar de Irlanda", "Canal de la Mancha", "Mar del Norte", "Estrecho de Dover"]'::jsonb, '"Mar de Irlanda"'::jsonb, 0, 'El mar de Irlanda queda entre ambas islas británicas.')
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
