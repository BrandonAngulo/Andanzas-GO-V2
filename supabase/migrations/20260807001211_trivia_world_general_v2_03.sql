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
('Historia', 1, 'multiple_choice', 'standard', '¿En qué año llegó Cristóbal Colón por primera vez a América?', '["1492", "1500", "1453", "1519"]'::jsonb, '"1492"'::jsonb, 0, 'El primer desembarco ocurrió en octubre de 1492 en una isla del Caribe.'),
    ('Historia', 1, 'multiple_choice', 'standard', '¿Qué civilización construyó las pirámides de Guiza?', '["El antiguo Egipto", "Mesopotamia", "Los mayas", "Los persas"]'::jsonb, '"El antiguo Egipto"'::jsonb, 0, 'Las pirámides de Guiza se levantaron durante el Imperio Antiguo egipcio.'),
    ('Historia', 1, 'multiple_choice', 'true_false', 'La Segunda Guerra Mundial terminó en 1945.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Alemania se rindió en mayo y Japón en septiembre de ese año.'),
    ('Historia', 1, 'multiple_choice', 'standard', '¿Qué muro dividió una ciudad europea entre 1961 y 1989?', '["El Muro de Berlín", "La Muralla China", "El Muro de Adriano", "El Muro de las Lamentaciones"]'::jsonb, '"El Muro de Berlín"'::jsonb, 0, 'Su caída en noviembre de 1989 anticipó el fin de la Guerra Fría.'),
    ('Historia', 1, 'multiple_choice', 'standard', '¿Qué imperio antiguo tuvo su capital en Roma?', '["El Imperio Romano", "El Imperio Otomano", "El Imperio Persa", "El Imperio Mongol"]'::jsonb, '"El Imperio Romano"'::jsonb, 0, 'Roma fue el centro político del mundo mediterráneo durante siglos.'),
    ('Historia', 1, 'multiple_choice', 'elimination', '¿Cuál de estas civilizaciones NO fue americana?', '["Sumeria", "Maya", "Azteca", "Inca"]'::jsonb, '"Sumeria"'::jsonb, 0, 'Sumeria se desarrolló en Mesopotamia, en el actual Irak.'),
    ('Historia', 1, 'multiple_choice', 'fill_blank', 'La Revolución ___ de 1789 derrocó a la monarquía absoluta en Francia.', '["Francesa", "Industrial", "Rusa", "Mexicana"]'::jsonb, '"Francesa"'::jsonb, 0, 'La toma de la Bastilla el 14 de julio marcó su inicio simbólico.'),
    ('Historia', 1, 'multiple_choice', 'standard', '¿Qué misión espacial llevó a los primeros seres humanos a la superficie lunar en 1969?', '["Apolo 11", "Apolo 13", "Vostok 1", "Gemini 4"]'::jsonb, '"Apolo 11"'::jsonb, 0, 'Neil Armstrong y Buzz Aldrin descendieron mientras Collins orbitaba.'),
    ('Historia', 1, 'multiple_choice', 'true_false', 'Los Juegos Olímpicos nacieron en la antigua Grecia.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Se celebraban en Olimpia en honor a Zeus desde el siglo VIII a. C.'),
    ('Historia', 1, 'multiple_choice', 'standard', '¿Qué documento firmado en 1948 proclamó los derechos humanos universales?', '["La Declaración Universal de Derechos Humanos", "La Carta Magna", "El Tratado de Versalles", "La Convención de Ginebra"]'::jsonb, '"La Declaración Universal de Derechos Humanos"'::jsonb, 0, 'La ONU la adoptó en París en diciembre de 1948.'),
    ('Historia', 2, 'multiple_choice', 'standard', '¿Qué acontecimiento de 1914 desencadenó la Primera Guerra Mundial?', '["El asesinato del archiduque Francisco Fernando", "La invasión de Polonia", "La caída de Constantinopla", "La Revolución Rusa"]'::jsonb, '"El asesinato del archiduque Francisco Fernando"'::jsonb, 0, 'El magnicidio en Sarajevo activó el sistema de alianzas europeo.'),
    ('Historia', 2, 'multiple_choice', 'standard', '¿Qué imperio conquistó Constantinopla en 1453?', '["El Imperio Otomano", "El Imperio Bizantino", "El Imperio Mongol", "El Sacro Imperio"]'::jsonb, '"El Imperio Otomano"'::jsonb, 0, 'La caída de Constantinopla suele marcar el fin de la Edad Media.'),
    ('Historia', 2, 'multiple_choice', 'standard', '¿Quién lideró la marcha de la sal en la India colonial?', '["Mahatma Gandhi", "Jawaharlal Nehru", "Subhas Chandra Bose", "Rabindranath Tagore"]'::jsonb, '"Mahatma Gandhi"'::jsonb, 0, 'La marcha de 1930 desafió el monopolio británico sobre la sal.'),
    ('Historia', 2, 'ordering', NULL, 'Ordena estos hechos del más antiguo al más reciente.', '["Caída del Imperio Romano de Occidente", "Descubrimiento de América", "Revolución Francesa", "Primera Guerra Mundial"]'::jsonb, '["Caída del Imperio Romano de Occidente", "Descubrimiento de América", "Revolución Francesa", "Primera Guerra Mundial"]'::jsonb, NULL, 'La secuencia cubre desde el año 476 hasta 1914.'),
    ('Historia', 2, 'multiple_choice', 'true_false', 'La imprenta de tipos móviles en Europa se atribuye a Johannes Gutenberg.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Su Biblia impresa hacia 1455 transformó la difusión del conocimiento.'),
    ('Historia', 2, 'multiple_choice', 'standard', '¿Qué civilización desarrolló el sistema de escritura cuneiforme?', '["Los sumerios", "Los fenicios", "Los hititas", "Los etruscos"]'::jsonb, '"Los sumerios"'::jsonb, 0, 'La escritura cuneiforme se grababa sobre tablillas de arcilla.'),
    ('Historia', 2, 'multiple_choice', 'elimination', '¿Cuál de estos NO fue un líder de la independencia hispanoamericana?', '["Giuseppe Garibaldi", "Simón Bolívar", "José de San Martín", "Bernardo O''Higgins"]'::jsonb, '"Giuseppe Garibaldi"'::jsonb, 0, 'Garibaldi fue una figura central de la unificación italiana.'),
    ('Historia', 2, 'multiple_choice', 'fill_blank', 'El emperador ___ fue derrotado definitivamente en la batalla de Waterloo en 1815.', '["Napoleón Bonaparte", "Carlomagno", "Julio César", "Federico el Grande"]'::jsonb, '"Napoleón Bonaparte"'::jsonb, 0, 'Waterloo puso fin a su regreso al poder tras el exilio en Elba.'),
    ('Historia', 2, 'multiple_choice', 'standard', '¿Qué muro construido en Asia buscaba proteger un imperio de invasiones del norte?', '["La Gran Muralla China", "El Muro de Adriano", "La Muralla de Babilonia", "La Línea Maginot"]'::jsonb, '"La Gran Muralla China"'::jsonb, 0, 'Su construcción se extendió a lo largo de varias dinastías.'),
    ('Historia', 2, 'multiple_choice', 'standard', '¿Qué conflicto enfrentó a Estados Unidos y la Unión Soviética sin combate directo entre ambos?', '["La Guerra Fría", "La Guerra de Secesión", "La Guerra de los Cien Años", "La Guerra del Golfo"]'::jsonb, '"La Guerra Fría"'::jsonb, 0, 'Se libró mediante carrera armamentista, espionaje y conflictos indirectos.'),
    ('Historia', 2, 'multiple_choice', 'standard', '¿Qué faraona gobernó Egipto y es una de las mujeres más conocidas de la Antigüedad?', '["Cleopatra", "Nefertiti", "Hatshepsut", "Livia"]'::jsonb, '"Cleopatra"'::jsonb, 0, 'Cleopatra VII fue la última soberana del Egipto ptolemaico.'),
    ('Historia', 2, 'multiple_choice', 'standard', '¿Qué barco naufragó en su viaje inaugural en abril de 1912?', '["El Titanic", "El Lusitania", "El Britannic", "El Andrea Doria"]'::jsonb, '"El Titanic"'::jsonb, 0, 'Chocó contra un iceberg en el Atlántico Norte.'),
    ('Historia', 3, 'multiple_choice', 'standard', '¿Qué tratado puso fin a la Primera Guerra Mundial en 1919?', '["El Tratado de Versalles", "El Tratado de Utrecht", "La Paz de Westfalia", "El Pacto de Varsovia"]'::jsonb, '"El Tratado de Versalles"'::jsonb, 0, 'Sus condiciones sobre Alemania alimentaron tensiones posteriores.'),
    ('Historia', 3, 'multiple_choice', 'standard', '¿Qué ruta comercial conectó China con el Mediterráneo durante siglos?', '["La Ruta de la Seda", "La Ruta de las Especias", "El Camino Real Persa", "La Ruta del Ámbar"]'::jsonb, '"La Ruta de la Seda"'::jsonb, 0, 'Por ella circularon seda, papel, ideas y también epidemias.'),
    ('Historia', 3, 'matching', NULL, 'Relaciona cada revolución con su año de inicio.', '{"left": ["Revolución Francesa", "Revolución Rusa", "Revolución Mexicana", "Revolución Cubana"], "right": ["1789", "1917", "1910", "1953"]}'::jsonb, '{"Revolución Francesa": "1789", "Revolución Rusa": "1917", "Revolución Mexicana": "1910", "Revolución Cubana": "1953"}'::jsonb, NULL, 'Cada proceso transformó profundamente el país donde ocurrió.'),
    ('Historia', 3, 'multiple_choice', 'standard', '¿Qué conferencia repartió el continente africano entre potencias europeas?', '["La Conferencia de Berlín", "El Congreso de Viena", "La Conferencia de Yalta", "El Tratado de Tordesillas"]'::jsonb, '"La Conferencia de Berlín"'::jsonb, 0, 'Se celebró entre 1884 y 1885 sin participación africana.'),
    ('Historia', 3, 'multi_select', NULL, 'Selecciona los países que formaron parte del Eje en la Segunda Guerra Mundial.', '["Alemania", "Italia", "Japón", "Unión Soviética", "Reino Unido", "Francia"]'::jsonb, '["Alemania", "Italia", "Japón"]'::jsonb, NULL, 'Los tres últimos combatieron del lado aliado.'),
    ('Historia', 3, 'multiple_choice', 'standard', '¿Qué código legal babilónico es uno de los conjuntos de leyes escritas más antiguos conservados?', '["El Código de Hammurabi", "Las Doce Tablas", "El Código Justiniano", "La Ley Sálica"]'::jsonb, '"El Código de Hammurabi"'::jsonb, 0, 'Se grabó en una estela de basalto hacia el siglo XVIII a. C.'),
    ('Historia', 3, 'multiple_choice', 'true_false', 'El Imperio Bizantino fue la continuación oriental del Imperio Romano.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Sobrevivió casi mil años tras la caída de Roma occidental.'),
    ('Historia', 3, 'multiple_choice', 'standard', '¿Qué epidemia mató a un tercio de la población europea en el siglo XIV?', '["La peste negra", "La viruela", "El cólera", "La gripe española"]'::jsonb, '"La peste negra"'::jsonb, 0, 'Llegó por rutas comerciales desde Asia hacia 1347.'),
    ('Historia', 3, 'multiple_choice', 'elimination', '¿Cuál de estas ciudades NO fue capital de un imperio antiguo?', '["Lisboa", "Persépolis", "Tenochtitlán", "Cartago"]'::jsonb, '"Lisboa"'::jsonb, 0, 'Persépolis, Tenochtitlán y Cartago fueron centros imperiales.'),
    ('Historia', 3, 'multiple_choice', 'fill_blank', 'El movimiento cultural del siglo XV y XVI que recuperó la Antigüedad clásica se llama ___.', '["Renacimiento", "Ilustración", "Romanticismo", "Barroco"]'::jsonb, '"Renacimiento"'::jsonb, 0, 'Nació en las ciudades italianas y se extendió por Europa.'),
    ('Historia', 3, 'multiple_choice', 'standard', '¿Qué acuerdo de 1494 repartió las tierras descubiertas entre España y Portugal?', '["El Tratado de Tordesillas", "La Bula Inter Caetera", "La Paz de Cateau-Cambrésis", "El Tratado de Zaragoza"]'::jsonb, '"El Tratado de Tordesillas"'::jsonb, 0, 'Trazó una línea imaginaria en el Atlántico.'),
    ('Historia', 4, 'multiple_choice', 'standard', '¿Qué dinastía china inauguró la construcción unificada de la Gran Muralla?', '["La dinastía Qin", "La dinastía Han", "La dinastía Ming", "La dinastía Tang"]'::jsonb, '"La dinastía Qin"'::jsonb, 0, 'Qin Shi Huang unió tramos previos en el siglo III a. C.'),
    ('Historia', 4, 'multiple_choice', 'standard', '¿Qué imperio precolombino desarrolló el sistema de registro con cuerdas anudadas llamado quipu?', '["El Imperio Inca", "La civilización maya", "Los aztecas", "Los olmecas"]'::jsonb, '"El Imperio Inca"'::jsonb, 0, 'Los quipus registraban censos, tributos y calendarios.'),
    ('Historia', 4, 'ordering', NULL, 'Ordena estos imperios según el momento de su máxima extensión.', '["Imperio Persa Aqueménida", "Imperio Romano", "Imperio Mongol", "Imperio Británico"]'::jsonb, '["Imperio Persa Aqueménida", "Imperio Romano", "Imperio Mongol", "Imperio Británico"]'::jsonb, NULL, 'La secuencia va del siglo V a. C. al siglo XX.'),
    ('Historia', 4, 'multiple_choice', 'standard', '¿Qué acuerdo secreto de 1916 repartió el Medio Oriente otomano entre Francia y Reino Unido?', '["El acuerdo Sykes-Picot", "La Declaración Balfour", "El Pacto de Locarno", "El Tratado de Sèvres"]'::jsonb, '"El acuerdo Sykes-Picot"'::jsonb, 0, 'Sus fronteras trazadas siguen influyendo en la región.'),
    ('Historia', 4, 'multiple_choice', 'standard', '¿Qué civilización africana controló el comercio transahariano del oro desde Tombuctú?', '["El Imperio de Malí", "El reino de Aksum", "El Imperio Zulú", "El reino de Benín"]'::jsonb, '"El Imperio de Malí"'::jsonb, 0, 'Mansa Musa, su soberano más famoso, peregrinó a La Meca en 1324.'),
    ('Historia', 4, 'matching', NULL, 'Relaciona cada documento con el país donde se firmó.', '{"left": ["Carta Magna", "Declaración de Independencia de 1776", "Edicto de Nantes", "Constitución de Cádiz"], "right": ["Inglaterra", "Estados Unidos", "Francia", "España"]}'::jsonb, '{"Carta Magna": "Inglaterra", "Declaración de Independencia de 1776": "Estados Unidos", "Edicto de Nantes": "Francia", "Constitución de Cádiz": "España"}'::jsonb, NULL, 'Los cuatro marcaron hitos en la limitación del poder absoluto.'),
    ('Historia', 4, 'multiple_choice', 'true_false', 'El Sacro Imperio Romano Germánico se disolvió formalmente en 1806.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Francisco II abdicó bajo la presión de Napoleón.'),
    ('Historia', 4, 'multiple_choice', 'standard', '¿Qué revuelta de esclavos dio origen al primer estado independiente gobernado por antiguos esclavizados?', '["La Revolución haitiana", "La revuelta de Espartaco", "La rebelión de Nat Turner", "La rebelión Taiping"]'::jsonb, '"La Revolución haitiana"'::jsonb, 0, 'Haití declaró su independencia de Francia en 1804.'),
    ('Historia', 4, 'multiple_choice', 'standard', '¿Qué batalla naval de 1805 consolidó el dominio marítimo británico frente a Francia y España?', '["La batalla de Trafalgar", "La batalla de Lepanto", "La batalla de Jutlandia", "La batalla de Actium"]'::jsonb, '"La batalla de Trafalgar"'::jsonb, 0, 'Nelson murió en la victoria frente al cabo de Trafalgar.'),
    ('Historia', 5, 'multiple_choice', 'standard', '¿Qué tratado de 1648 puso fin a la Guerra de los Treinta Años y fundó el orden de estados soberanos?', '["La Paz de Westfalia", "El Tratado de Utrecht", "La Paz de Augsburgo", "El Congreso de Viena"]'::jsonb, '"La Paz de Westfalia"'::jsonb, 0, 'Suele considerarse el origen del sistema internacional moderno.'),
    ('Historia', 5, 'multiple_choice', 'standard', '¿Qué emperador romano dividió administrativamente el imperio mediante la tetrarquía?', '["Diocleciano", "Constantino", "Augusto", "Trajano"]'::jsonb, '"Diocleciano"'::jsonb, 0, 'Instauró un gobierno de dos augustos y dos césares hacia el año 293.'),
    ('Historia', 5, 'multiple_choice', 'standard', '¿Qué reino africano resistió al colonialismo británico y venció en la batalla de Isandlwana en 1879?', '["El reino zulú", "El reino ashanti", "El imperio etíope", "El sultanato de Zanzíbar"]'::jsonb, '"El reino zulú"'::jsonb, 0, 'Fue una de las mayores derrotas del ejército británico en África.'),
    ('Historia', 5, 'matching', NULL, 'Relaciona cada pensador con la corriente que impulsó.', '{"left": ["Adam Smith", "Karl Marx", "John Locke", "Montesquieu"], "right": ["Economía liberal clásica", "Materialismo histórico", "Liberalismo político", "Separación de poderes"]}'::jsonb, '{"Adam Smith": "Economía liberal clásica", "Karl Marx": "Materialismo histórico", "John Locke": "Liberalismo político", "Montesquieu": "Separación de poderes"}'::jsonb, NULL, 'Sus ideas moldearon los estados modernos.'),
    ('Historia', 5, 'multiple_choice', 'standard', '¿Qué acontecimiento de 1917 sacó a Rusia de la Primera Guerra Mundial?', '["La Revolución de Octubre", "La abdicación del zar en febrero", "El Tratado de Rapallo", "La ofensiva Brusílov"]'::jsonb, '"La Revolución de Octubre"'::jsonb, 0, 'El gobierno bolchevique firmó la paz de Brest-Litovsk en 1918.'),
    ('Historia', 5, 'multiple_choice', 'true_false', 'El califato abasí trasladó la capital del mundo islámico a Bagdad.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Bagdad se convirtió en centro científico y comercial desde el siglo VIII.'),
    ('Historia', 5, 'multiple_choice', 'standard', '¿Qué expedición completó la primera circunnavegación documentada del planeta?', '["La expedición de Magallanes y Elcano", "El viaje de Vasco da Gama", "La flota de Zheng He", "El viaje del Beagle"]'::jsonb, '"La expedición de Magallanes y Elcano"'::jsonb, 0, 'Elcano regresó a España en 1522 tras la muerte de Magallanes.'),
    ('Ciencia y tecnología', 1, 'multiple_choice', 'standard', '¿Cuál es el planeta más cercano al Sol?', '["Mercurio", "Venus", "Marte", "La Tierra"]'::jsonb, '"Mercurio"'::jsonb, 0, 'Mercurio completa su órbita en apenas 88 días terrestres.')
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
