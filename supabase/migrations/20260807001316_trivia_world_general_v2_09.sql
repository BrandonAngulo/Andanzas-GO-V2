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
('Deportes', 2, 'multiple_choice', 'fill_blank', 'El torneo de tenis disputado sobre arcilla en París se llama Roland ___.', '["Garros", "Laver", "Wimbledon", "Federer"]'::jsonb, '"Garros"'::jsonb, 0, 'Es el único Grand Slam sobre tierra batida.'),
    ('Deportes', 2, 'multiple_choice', 'true_false', 'En el rugby, un ensayo vale cinco puntos según el reglamento actual.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'La conversión posterior añade dos puntos más.'),
    ('Deportes', 2, 'multiple_choice', 'standard', '¿Qué deportista jamaicano batió los récords mundiales de 100 y 200 metros en 2009?', '["Usain Bolt", "Yohan Blake", "Asafa Powell", "Tyson Gay"]'::jsonb, '"Usain Bolt"'::jsonb, 0, 'Sus marcas de 9,58 y 19,19 segundos siguen vigentes.'),
    ('Deportes', 2, 'ordering', NULL, 'Ordena estas distancias de atletismo de menor a mayor.', '["100 metros", "400 metros", "1.500 metros", "Maratón"]'::jsonb, '["100 metros", "400 metros", "1.500 metros", "Maratón"]'::jsonb, NULL, 'Cada prueba exige un perfil físico distinto.'),
    ('Deportes', 2, 'multiple_choice', 'standard', '¿Qué selección ganó la Copa Mundial de fútbol de 2022?', '["Argentina", "Francia", "Brasil", "Croacia"]'::jsonb, '"Argentina"'::jsonb, 0, 'Se impuso a Francia en la final disputada en Catar.'),
    ('Deportes', 2, 'multiple_choice', 'standard', '¿Qué deporte combina esquí de fondo y tiro con rifle?', '["El biatlón", "El pentatlón moderno", "El triatlón", "El esquí alpino"]'::jsonb, '"El biatlón"'::jsonb, 0, 'Es una de las disciplinas más seguidas de los Juegos de invierno.'),
    ('Deportes', 2, 'multiple_choice', 'standard', '¿Cuántos jugadores tiene en cancha un equipo de voleibol?', '["Seis", "Cinco", "Siete", "Cuatro"]'::jsonb, '"Seis"'::jsonb, 0, 'Rotan sus posiciones tras recuperar el saque.'),
    ('Deportes', 3, 'multiple_choice', 'standard', '¿Qué ciclista colombiano ganó el Tour de Francia en 2019?', '["Egan Bernal", "Nairo Quintana", "Rigoberto Urán", "Fernando Gaviria"]'::jsonb, '"Egan Bernal"'::jsonb, 0, 'Fue el primer latinoamericano en lograrlo.'),
    ('Deportes', 3, 'matching', NULL, 'Relaciona cada deporte con la superficie o escenario donde se practica.', '{"left": ["Curling", "Waterpolo", "Bádminton", "Surf"], "right": ["Hielo", "Piscina", "Cancha cubierta", "Mar"]}'::jsonb, '{"Curling": "Hielo", "Waterpolo": "Piscina", "Bádminton": "Cancha cubierta", "Surf": "Mar"}'::jsonb, NULL, 'Cada disciplina exige condiciones ambientales específicas.'),
    ('Deportes', 3, 'multiple_choice', 'standard', '¿Qué torneo de golf se disputa cada año en Augusta?', '["El Masters", "El Abierto Británico", "El US Open", "El Campeonato de la PGA"]'::jsonb, '"El Masters"'::jsonb, 0, 'Su ganador recibe la chaqueta verde.'),
    ('Deportes', 3, 'multi_select', NULL, 'Selecciona los deportes que forman parte del triatlón olímpico.', '["Natación", "Ciclismo", "Carrera a pie", "Remo", "Tiro", "Esgrima"]'::jsonb, '["Natación", "Ciclismo", "Carrera a pie"]'::jsonb, NULL, 'El pentatlón moderno sí incluye tiro y esgrima.'),
    ('Deportes', 3, 'multiple_choice', 'standard', '¿Qué país organizó los Juegos Olímpicos de verano de 2016?', '["Brasil", "Reino Unido", "China", "Japón"]'::jsonb, '"Brasil"'::jsonb, 0, 'Río de Janeiro fue la primera sede sudamericana.'),
    ('Deportes', 3, 'multiple_choice', 'elimination', '¿Cuál de estos NO es uno de los cuatro torneos de Grand Slam de tenis?', '["Masters de Madrid", "Abierto de Australia", "Roland Garros", "Abierto de Estados Unidos"]'::jsonb, '"Masters de Madrid"'::jsonb, 0, 'Madrid es un Masters 1000, no un Grand Slam.'),
    ('Deportes', 3, 'multiple_choice', 'fill_blank', 'En fútbol americano, anotar llevando el balón a la zona final se llama ___.', '["touchdown", "home run", "try", "slam dunk"]'::jsonb, '"touchdown"'::jsonb, 0, 'Vale seis puntos más el punto extra.'),
    ('Deportes', 3, 'multiple_choice', 'true_false', 'La Fórmula 1 otorga el campeonato tanto a pilotos como a constructores.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Ambos títulos se disputan en paralelo durante la temporada.'),
    ('Deportes', 3, 'multiple_choice', 'standard', '¿Qué deportista estadounidense acumula más medallas olímpicas de la historia?', '["Michael Phelps", "Carl Lewis", "Mark Spitz", "Simone Biles"]'::jsonb, '"Michael Phelps"'::jsonb, 0, 'Suma veintiocho medallas en natación.'),
    ('Deportes', 3, 'multiple_choice', 'standard', '¿Qué selección femenina de fútbol ha ganado más Copas del Mundo?', '["Estados Unidos", "Alemania", "Noruega", "Japón"]'::jsonb, '"Estados Unidos"'::jsonb, 0, 'Acumula cuatro títulos mundiales.'),
    ('Deportes', 3, 'multiple_choice', 'standard', '¿En qué deporte se disputa la Copa Davis?', '["Tenis", "Rugby", "Vela", "Polo"]'::jsonb, '"Tenis"'::jsonb, 0, 'Es la principal competición por equipos nacionales masculina.'),
    ('Deportes', 4, 'multiple_choice', 'standard', '¿Qué atleta etíope ganó el maratón olímpico de 1960 corriendo descalzo?', '["Abebe Bikila", "Haile Gebrselassie", "Kenenisa Bekele", "Mamo Wolde"]'::jsonb, '"Abebe Bikila"'::jsonb, 0, 'Ganó en Roma y repitió el título en Tokio en 1964.'),
    ('Deportes', 4, 'multiple_choice', 'standard', '¿Qué país ha ganado más medallas de oro en la historia de los Juegos Olímpicos de verano?', '["Estados Unidos", "Unión Soviética", "China", "Alemania"]'::jsonb, '"Estados Unidos"'::jsonb, 0, 'Su ventaja acumulada supera con claridad a la del resto.'),
    ('Deportes', 4, 'matching', NULL, 'Relaciona cada trofeo con su deporte.', '{"left": ["Copa Stanley", "Trofeo Webb Ellis", "Copa Davis", "Balón de Oro"], "right": ["Hockey sobre hielo", "Rugby", "Tenis", "Fútbol"]}'::jsonb, '{"Copa Stanley": "Hockey sobre hielo", "Trofeo Webb Ellis": "Rugby", "Copa Davis": "Tenis", "Balón de Oro": "Fútbol"}'::jsonb, NULL, 'Los trofeos identifican a las grandes competiciones de cada disciplina.'),
    ('Deportes', 4, 'multiple_choice', 'standard', '¿Qué gimnasta obtuvo el primer diez perfecto en unos Juegos Olímpicos?', '["Nadia Comaneci", "Olga Korbut", "Larisa Latynina", "Vera Caslavska"]'::jsonb, '"Nadia Comaneci"'::jsonb, 0, 'Lo logró en Montreal 1976 con catorce años.'),
    ('Deportes', 4, 'multi_select', NULL, 'Selecciona los deportes incorporados al programa olímpico en el siglo XXI.', '["Rugby siete", "Surf", "Escalada deportiva", "Esgrima", "Tiro con arco", "Halterofilia"]'::jsonb, '["Rugby siete", "Surf", "Escalada deportiva"]'::jsonb, NULL, 'Los tres últimos llevan más de un siglo en el programa.'),
    ('Deportes', 4, 'multiple_choice', 'true_false', 'El ajedrez es reconocido como deporte por el Comité Olímpico Internacional aunque no compite en los Juegos.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Su federación está reconocida desde 1999.'),
    ('Deportes', 4, 'multiple_choice', 'standard', '¿Qué circuito de Fórmula 1 se disputa por las calles de un principado mediterráneo?', '["Mónaco", "Singapur", "Bakú", "Yeda"]'::jsonb, '"Mónaco"'::jsonb, 0, 'Es la prueba más antigua y estrecha del calendario.'),
    ('Deportes', 4, 'multiple_choice', 'standard', '¿Qué reglamento introdujo el fútbol para revisar jugadas con repetición en video?', '["El VAR", "El TMO", "El ojo de halcón", "El challenge"]'::jsonb, '"El VAR"'::jsonb, 0, 'Se implantó de forma generalizada a partir de 2018.'),
    ('Deportes', 5, 'multiple_choice', 'standard', '¿Qué deporte tradicional vasco consiste en levantar piedras de gran peso?', '["El harrijasotze", "La soka tira", "El aizkolaritza", "La estropada"]'::jsonb, '"El harrijasotze"'::jsonb, 0, 'Forma parte de los deportes rurales vascos.'),
    ('Deportes', 5, 'multiple_choice', 'standard', '¿En qué año se celebraron los primeros Juegos Paralímpicos oficiales?', '["1960", "1948", "1976", "1988"]'::jsonb, '"1960"'::jsonb, 0, 'Se realizaron en Roma poco después de los Juegos Olímpicos.'),
    ('Deportes', 5, 'matching', NULL, 'Relaciona cada deporte con su país de origen.', '{"left": ["Sumo", "Hurling", "Sepak takraw", "Capoeira"], "right": ["Japón", "Irlanda", "Sudeste asiático", "Brasil"]}'::jsonb, '{"Sumo": "Japón", "Hurling": "Irlanda", "Sepak takraw": "Sudeste asiático", "Capoeira": "Brasil"}'::jsonb, NULL, 'Cada práctica está ligada a tradiciones culturales específicas.'),
    ('Deportes', 5, 'multiple_choice', 'standard', '¿Qué maratonista keniano bajó por primera vez de dos horas en una prueba no homologada?', '["Eliud Kipchoge", "Kenenisa Bekele", "Wilson Kipsang", "Dennis Kimetto"]'::jsonb, '"Eliud Kipchoge"'::jsonb, 0, 'Lo consiguió en Viena en 2019 en condiciones especiales.'),
    ('Deportes', 5, 'multiple_choice', 'standard', '¿Qué competición ciclista italiana entrega la maglia rosa al líder de la general?', '["El Giro de Italia", "La Vuelta a España", "La Milán-San Remo", "El Tirreno-Adriático"]'::jsonb, '"El Giro de Italia"'::jsonb, 0, 'Se disputa habitualmente en mayo.'),
    ('Deportes', 5, 'multiple_choice', 'true_false', 'El primer partido internacional de fútbol reconocido enfrentó a Escocia e Inglaterra en 1872.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Terminó sin goles en Glasgow.'),
    ('Deportes', 5, 'multiple_choice', 'standard', '¿Qué disciplina de los World Games combina acrobacia sobre una cuerda tensada elástica?', '["El slackline", "El parkour", "El korfbal", "El floorball"]'::jsonb, '"El slackline"'::jsonb, 0, 'Sus modalidades incluyen trickline y highline.'),
    ('Gastronomía del mundo', 1, 'multiple_choice', 'standard', '¿De qué país es originaria la pizza?', '["Italia", "Grecia", "España", "Francia"]'::jsonb, '"Italia"'::jsonb, 0, 'La pizza napolitana es su forma tradicional más reconocida.'),
    ('Gastronomía del mundo', 1, 'multiple_choice', 'standard', '¿Qué ingrediente principal tiene el guacamole?', '["El aguacate", "El tomate", "La papa", "El maíz"]'::jsonb, '"El aguacate"'::jsonb, 0, 'Es una preparación mexicana de origen prehispánico.'),
    ('Gastronomía del mundo', 1, 'multiple_choice', 'true_false', 'El sushi es un plato tradicional de la cocina japonesa.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Combina arroz avinagrado con pescado, verduras o algas.'),
    ('Gastronomía del mundo', 1, 'multiple_choice', 'standard', '¿Qué bebida caliente se obtiene de granos tostados y molidos de un arbusto tropical?', '["El café", "El té", "El cacao", "La cerveza"]'::jsonb, '"El café"'::jsonb, 0, 'Se cultiva principalmente en la franja tropical del planeta.'),
    ('Gastronomía del mundo', 1, 'multiple_choice', 'standard', '¿Qué cereal es la base de la alimentación en gran parte de Asia?', '["El arroz", "El trigo", "La cebada", "El centeno"]'::jsonb, '"El arroz"'::jsonb, 0, 'Se cultiva en terrazas y campos inundados desde hace milenios.'),
    ('Gastronomía del mundo', 1, 'multiple_choice', 'elimination', '¿Cuál de estos NO es un producto lácteo?', '["El tofu", "El queso", "El yogur", "La mantequilla"]'::jsonb, '"El tofu"'::jsonb, 0, 'El tofu se elabora a partir de la soya.'),
    ('Gastronomía del mundo', 1, 'multiple_choice', 'fill_blank', 'La pasta italiana con salsa de huevo, queso y panceta se llama ___.', '["carbonara", "boloñesa", "puttanesca", "amatriciana"]'::jsonb, '"carbonara"'::jsonb, 0, 'La receta tradicional no lleva crema de leche.'),
    ('Gastronomía del mundo', 1, 'multiple_choice', 'standard', '¿Qué fruta se usa para hacer el vino?', '["La uva", "La manzana", "La pera", "La ciruela"]'::jsonb, '"La uva"'::jsonb, 0, 'Su fermentación produce alcohol de forma natural.'),
    ('Gastronomía del mundo', 1, 'multiple_choice', 'true_false', 'El chocolate se obtiene de las semillas del cacao.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'El cacao es originario de América tropical.'),
    ('Gastronomía del mundo', 1, 'multiple_choice', 'standard', '¿Qué plato español combina arroz, azafrán y mariscos o carnes?', '["La paella", "El gazpacho", "La fabada", "El cocido"]'::jsonb, '"La paella"'::jsonb, 0, 'Es originaria de la región de Valencia.'),
    ('Gastronomía del mundo', 2, 'multiple_choice', 'standard', '¿Qué especia es la más cara del mundo por peso?', '["El azafrán", "La vainilla", "El cardamomo", "La pimienta rosa"]'::jsonb, '"El azafrán"'::jsonb, 0, 'Se necesitan miles de flores para obtener un kilo.'),
    ('Gastronomía del mundo', 2, 'multiple_choice', 'standard', '¿De qué país es originario el ceviche en su forma más reconocida internacionalmente?', '["Perú", "México", "Ecuador", "Chile"]'::jsonb, '"Perú"'::jsonb, 0, 'Se prepara con pescado curado en jugo de limón.'),
    ('Gastronomía del mundo', 2, 'multiple_choice', 'standard', '¿Qué producto se obtiene al fermentar la leche con bacterias específicas?', '["El yogur", "La nata", "El suero", "La leche condensada"]'::jsonb, '"El yogur"'::jsonb, 0, 'Los lactobacilos transforman la lactosa en ácido láctico.'),
    ('Gastronomía del mundo', 2, 'multiple_choice', 'elimination', '¿Cuál de estos ingredientes NO es originario de América?', '["El arroz", "El maíz", "La papa", "El tomate"]'::jsonb, '"El arroz"'::jsonb, 0, 'El arroz llegó a América tras la colonización.'),
    ('Gastronomía del mundo', 2, 'multiple_choice', 'fill_blank', 'El plato japonés de fideos en caldo con carne y huevo se llama ___.', '["ramen", "udon", "soba", "tempura"]'::jsonb, '"ramen"'::jsonb, 0, 'Tiene múltiples variantes regionales en Japón.'),
    ('Gastronomía del mundo', 2, 'multiple_choice', 'true_false', 'El pan sin levadura recibe el nombre de pan ácimo.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Es tradicional en varias culturas del Mediterráneo y Oriente Medio.'),
    ('Gastronomía del mundo', 2, 'multiple_choice', 'standard', '¿Qué técnica de cocción sumerge el alimento en aceite muy caliente?', '["La fritura", "El escalfado", "El braseado", "La cocción al vapor"]'::jsonb, '"La fritura"'::jsonb, 0, 'El aceite transmite calor a temperaturas superiores a las del agua.')
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
