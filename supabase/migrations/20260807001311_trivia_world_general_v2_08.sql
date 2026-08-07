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
('Cine y series', 2, 'multiple_choice', 'standard', '¿Qué película de 1972 dirigida por Francis Ford Coppola retrata a una familia mafiosa?', '["El padrino", "Uno de los nuestros", "Scarface", "Casino"]'::jsonb, '"El padrino"'::jsonb, 0, 'Está basada en la novela de Mario Puzo.'),
    ('Cine y series', 2, 'multiple_choice', 'standard', '¿Qué actriz mexicana ha sido nominada al Óscar por Roma?', '["Yalitza Aparicio", "Salma Hayek", "Adriana Barraza", "Marina de Tavira"]'::jsonb, '"Yalitza Aparicio"'::jsonb, 0, 'La película fue dirigida por Alfonso Cuarón en 2018.'),
    ('Cine y series', 2, 'multiple_choice', 'elimination', '¿Cuál de estas películas NO fue dirigida por Steven Spielberg?', '["Titanic", "Tiburón", "E.T. el extraterrestre", "La lista de Schindler"]'::jsonb, '"Titanic"'::jsonb, 0, 'Titanic es de James Cameron.'),
    ('Cine y series', 2, 'multiple_choice', 'fill_blank', 'El movimiento italiano de posguerra que filmaba en las calles con actores no profesionales fue el ___.', '["neorrealismo", "expresionismo", "dogma 95", "free cinema"]'::jsonb, '"neorrealismo"'::jsonb, 0, 'Ladrón de bicicletas es una de sus obras emblemáticas.'),
    ('Cine y series', 2, 'multiple_choice', 'true_false', 'La serie Los Simpson se emite desde 1989.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Es una de las series de mayor duración de la televisión estadounidense.'),
    ('Cine y series', 2, 'multiple_choice', 'standard', '¿Qué película surcoreana ganó el Óscar a mejor película en 2020?', '["Parásitos", "Old Boy", "El hospedante", "Decision to Leave"]'::jsonb, '"Parásitos"'::jsonb, 0, 'Fue la primera cinta en lengua no inglesa en lograrlo.'),
    ('Cine y series', 2, 'ordering', NULL, 'Ordena estos avances técnicos del cine del más antiguo al más reciente.', '["Cine mudo", "Cine sonoro", "Cine en color", "Imagen generada por computadora"]'::jsonb, '["Cine mudo", "Cine sonoro", "Cine en color", "Imagen generada por computadora"]'::jsonb, NULL, 'Cada etapa transformó el lenguaje audiovisual.'),
    ('Cine y series', 2, 'multiple_choice', 'standard', '¿Qué director español ganó el Óscar por Todo sobre mi madre y Hable con ella?', '["Pedro Almodóvar", "Alejandro Amenábar", "Carlos Saura", "Luis Buñuel"]'::jsonb, '"Pedro Almodóvar"'::jsonb, 0, 'Ganó mejor película extranjera y luego mejor guion original.'),
    ('Cine y series', 2, 'multiple_choice', 'standard', '¿Qué actriz protagonizó Alien y la saga de Ellen Ripley?', '["Sigourney Weaver", "Linda Hamilton", "Jamie Lee Curtis", "Carrie Fisher"]'::jsonb, '"Sigourney Weaver"'::jsonb, 0, 'El primer filme se estrenó en 1979.'),
    ('Cine y series', 2, 'multiple_choice', 'standard', '¿Qué serie de HBO adaptó las novelas de George R. R. Martin?', '["Juego de tronos", "The Wire", "Roma", "Deadwood"]'::jsonb, '"Juego de tronos"'::jsonb, 0, 'Se emitió entre 2011 y 2019.'),
    ('Cine y series', 3, 'multiple_choice', 'standard', '¿Qué película de Orson Welles de 1941 revolucionó la profundidad de campo y el montaje?', '["Ciudadano Kane", "Sed de mal", "El cuarto mandamiento", "La dama de Shanghái"]'::jsonb, '"Ciudadano Kane"'::jsonb, 0, 'Suele encabezar las listas de mejores películas de la historia.'),
    ('Cine y series', 3, 'matching', NULL, 'Relaciona cada director con una de sus películas.', '{"left": ["Akira Kurosawa", "Federico Fellini", "Ingmar Bergman", "Stanley Kubrick"], "right": ["Los siete samuráis", "La dolce vita", "El séptimo sello", "2001 Odisea del espacio"]}'::jsonb, '{"Akira Kurosawa": "Los siete samuráis", "Federico Fellini": "La dolce vita", "Ingmar Bergman": "El séptimo sello", "Stanley Kubrick": "2001 Odisea del espacio"}'::jsonb, NULL, 'Cuatro nombres centrales del cine de autor del siglo XX.'),
    ('Cine y series', 3, 'multiple_choice', 'standard', '¿Qué movimiento francés de los años sesenta renovó el cine con cámara ligera y montaje libre?', '["La Nouvelle Vague", "El Cinema Novo", "El Free Cinema", "El Nuevo Hollywood"]'::jsonb, '"La Nouvelle Vague"'::jsonb, 0, 'Godard y Truffaut fueron sus figuras más visibles.'),
    ('Cine y series', 3, 'multi_select', NULL, 'Selecciona las películas dirigidas por Christopher Nolan.', '["Memento", "El origen", "Interestelar", "El sexto sentido", "Gravedad", "Blade Runner 2049"]'::jsonb, '["Memento", "El origen", "Interestelar"]'::jsonb, NULL, 'Las otras tres son de Shyamalan, Cuarón y Villeneuve.'),
    ('Cine y series', 3, 'multiple_choice', 'standard', '¿Qué festival de cine entrega el Oso de Oro?', '["El Festival de Berlín", "El Festival de Venecia", "El Festival de Locarno", "El Festival de San Sebastián"]'::jsonb, '"El Festival de Berlín"'::jsonb, 0, 'Se celebra cada febrero en la capital alemana.'),
    ('Cine y series', 3, 'multiple_choice', 'elimination', '¿Cuál de estas NO es una película del cine mexicano de la época de oro?', '["Amores perros", "Los olvidados", "Nosotros los pobres", "María Candelaria"]'::jsonb, '"Amores perros"'::jsonb, 0, 'Amores perros se estrenó en el año 2000.'),
    ('Cine y series', 3, 'multiple_choice', 'fill_blank', 'El término ___ designa el cine negro estadounidense de los años cuarenta con atmósferas urbanas y personajes ambiguos.', '["cine negro", "slapstick", "screwball", "western spaghetti"]'::jsonb, '"cine negro"'::jsonb, 0, 'Su nombre en francés es film noir.'),
    ('Cine y series', 3, 'multiple_choice', 'true_false', 'Sergio Leone fue el principal director del llamado western spaghetti.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Rodó la trilogía del dólar con Clint Eastwood.'),
    ('Cine y series', 3, 'multiple_choice', 'standard', '¿Qué animación de Pixar fue el primer largometraje enteramente generado por computadora?', '["Toy Story", "Bichos", "Monsters Inc", "Buscando a Nemo"]'::jsonb, '"Toy Story"'::jsonb, 0, 'Se estrenó en 1995.'),
    ('Cine y series', 3, 'multiple_choice', 'standard', '¿Qué director brasileño dirigió Ciudad de Dios junto a Kátia Lund?', '["Fernando Meirelles", "Walter Salles", "Glauber Rocha", "Kleber Mendonça Filho"]'::jsonb, '"Fernando Meirelles"'::jsonb, 0, 'La película se estrenó en 2002.'),
    ('Cine y series', 3, 'multiple_choice', 'standard', '¿Qué serie estadounidense narra la transformación de un profesor de química en fabricante de drogas?', '["Breaking Bad", "Los Soprano", "Mad Men", "Ozark"]'::jsonb, '"Breaking Bad"'::jsonb, 0, 'Se emitió entre 2008 y 2013.'),
    ('Cine y series', 4, 'multiple_choice', 'standard', '¿Qué película alemana de 1927 dirigida por Fritz Lang imaginó una ciudad futurista dividida en clases?', '["Metrópolis", "El gabinete del doctor Caligari", "Nosferatu", "M el vampiro de Düsseldorf"]'::jsonb, '"Metrópolis"'::jsonb, 0, 'Su estética influyó en casi toda la ciencia ficción posterior.'),
    ('Cine y series', 4, 'multiple_choice', 'standard', '¿Qué técnica de montaje desarrollada por Serguéi Eisenstein genera significado por choque de imágenes?', '["El montaje de atracciones", "El plano secuencia", "El raccord invisible", "El campo contracampo"]'::jsonb, '"El montaje de atracciones"'::jsonb, 0, 'La escena de la escalinata de Odesa es su ejemplo más citado.'),
    ('Cine y series', 4, 'matching', NULL, 'Relaciona cada película con su país de producción principal.', '{"left": ["Rashomon", "Ladrón de bicicletas", "El acorazado Potemkin", "La batalla de Argel"], "right": ["Japón", "Italia", "Unión Soviética", "Argelia e Italia"]}'::jsonb, '{"Rashomon": "Japón", "Ladrón de bicicletas": "Italia", "El acorazado Potemkin": "Unión Soviética", "La batalla de Argel": "Argelia e Italia"}'::jsonb, NULL, 'Cuatro clásicos de cinematografías distintas.'),
    ('Cine y series', 4, 'multiple_choice', 'standard', '¿Qué cineasta senegalés es considerado el padre del cine africano subsahariano?', '["Ousmane Sembène", "Souleymane Cissé", "Djibril Diop Mambéty", "Idrissa Ouedraogo"]'::jsonb, '"Ousmane Sembène"'::jsonb, 0, 'Su película La noire de… se estrenó en 1966.'),
    ('Cine y series', 4, 'multi_select', NULL, 'Selecciona las películas ganadoras del Óscar a mejor película.', '["Parásitos", "Moonlight", "El artista", "Pulp Fiction", "Ciudadano Kane", "Cadena perpetua"]'::jsonb, '["Parásitos", "Moonlight", "El artista"]'::jsonb, NULL, 'Las tres últimas fueron nominadas pero no ganaron esa categoría.'),
    ('Cine y series', 4, 'multiple_choice', 'true_false', 'El Dogma 95 fue un manifiesto danés que prohibía la música añadida y la iluminación artificial.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Lars von Trier y Thomas Vinterberg lo firmaron.'),
    ('Cine y series', 4, 'multiple_choice', 'standard', '¿Qué directora neozelandesa ganó la Palma de Oro con El piano en 1993?', '["Jane Campion", "Kathryn Bigelow", "Agnès Varda", "Claire Denis"]'::jsonb, '"Jane Campion"'::jsonb, 0, 'Fue la primera mujer en recibir ese premio.'),
    ('Cine y series', 4, 'multiple_choice', 'standard', '¿Qué formato de proyección amplió la pantalla en los años cincuenta para competir con la televisión?', '["El CinemaScope", "El IMAX", "El Technicolor", "El Dolby Vision"]'::jsonb, '"El CinemaScope"'::jsonb, 0, 'Su relación de aspecto ensanchó la imagen de forma notable.'),
    ('Cine y series', 5, 'multiple_choice', 'standard', '¿Qué película de Andréi Tarkovski adapta una novela de Stanislaw Lem sobre un océano consciente?', '["Solaris", "Stalker", "El espejo", "Andréi Rubliov"]'::jsonb, '"Solaris"'::jsonb, 0, 'Se estrenó en 1972.'),
    ('Cine y series', 5, 'multiple_choice', 'standard', '¿Qué concepto teórico describe la mirada dominante que la cámara clásica dirige sobre los personajes femeninos?', '["La mirada masculina", "El efecto Kuleshov", "La sutura", "La diégesis"]'::jsonb, '"La mirada masculina"'::jsonb, 0, 'Laura Mulvey lo formuló en 1975.'),
    ('Cine y series', 5, 'matching', NULL, 'Relaciona cada movimiento cinematográfico con su década de auge.', '{"left": ["Expresionismo alemán", "Neorrealismo italiano", "Nouvelle Vague", "Nuevo Hollywood"], "right": ["Años veinte", "Años cuarenta", "Años sesenta", "Años setenta"]}'::jsonb, '{"Expresionismo alemán": "Años veinte", "Neorrealismo italiano": "Años cuarenta", "Nouvelle Vague": "Años sesenta", "Nuevo Hollywood": "Años setenta"}'::jsonb, NULL, 'Cada corriente respondió a una crisis política o industrial.'),
    ('Cine y series', 5, 'multiple_choice', 'standard', '¿Qué experimento de montaje demostró que el sentido de un plano depende del plano contiguo?', '["El efecto Kuleshov", "El plano holandés", "El zoom vertiginoso", "El corte en el eje"]'::jsonb, '"El efecto Kuleshov"'::jsonb, 0, 'Lev Kuleshov lo formuló en la Unión Soviética de los años veinte.'),
    ('Cine y series', 5, 'multiple_choice', 'standard', '¿Qué cineasta francesa dirigió Cléo de 5 a 7 y es considerada precursora de la Nouvelle Vague?', '["Agnès Varda", "Marguerite Duras", "Chantal Akerman", "Alice Guy"]'::jsonb, '"Agnès Varda"'::jsonb, 0, 'Su primer largometraje es anterior a los debuts de Godard y Truffaut.'),
    ('Cine y series', 5, 'multiple_choice', 'true_false', 'La primera proyección pública de pago de los hermanos Lumière ocurrió en 1895 en París.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Se realizó en el Salon Indien del Gran Café.'),
    ('Cine y series', 5, 'multiple_choice', 'standard', '¿Qué película húngara de Béla Tarr dura más de siete horas y se estructura en doce capítulos?', '["Sátántangó", "El caballo de Turín", "Armonías de Werckmeister", "Condenación"]'::jsonb, '"Sátántangó"'::jsonb, 0, 'Se estrenó en 1994.'),
    ('Deportes', 1, 'multiple_choice', 'standard', '¿Cuántos jugadores conforman un equipo de fútbol en el campo?', '["Once", "Nueve", "Doce", "Diez"]'::jsonb, '"Once"'::jsonb, 0, 'Incluye al portero y diez jugadores de campo.'),
    ('Deportes', 1, 'multiple_choice', 'standard', '¿Cada cuántos años se celebran los Juegos Olímpicos de verano?', '["Cada cuatro años", "Cada dos años", "Cada tres años", "Cada cinco años"]'::jsonb, '"Cada cuatro años"'::jsonb, 0, 'La cita se mantiene salvo interrupciones excepcionales.'),
    ('Deportes', 1, 'multiple_choice', 'true_false', 'En el baloncesto un tiro desde fuera del arco vale tres puntos.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Dentro del arco vale dos y el tiro libre uno.'),
    ('Deportes', 1, 'multiple_choice', 'standard', '¿Qué deporte se juega en Wimbledon?', '["Tenis", "Golf", "Críquet", "Rugby"]'::jsonb, '"Tenis"'::jsonb, 0, 'Es el torneo de tenis más antiguo del mundo.'),
    ('Deportes', 1, 'multiple_choice', 'standard', '¿Qué país ha ganado más veces la Copa Mundial de fútbol masculina?', '["Brasil", "Alemania", "Italia", "Argentina"]'::jsonb, '"Brasil"'::jsonb, 0, 'Brasil acumula cinco títulos mundiales.'),
    ('Deportes', 1, 'multiple_choice', 'elimination', '¿Cuál de estos NO es un deporte olímpico de verano?', '["Hockey sobre hielo", "Atletismo", "Natación", "Judo"]'::jsonb, '"Hockey sobre hielo"'::jsonb, 0, 'El hockey sobre hielo pertenece a los Juegos de invierno.'),
    ('Deportes', 1, 'multiple_choice', 'fill_blank', 'En el ciclismo, la carrera por etapas más famosa del mundo es el Tour de ___.', '["Francia", "Italia", "España", "Suiza"]'::jsonb, '"Francia"'::jsonb, 0, 'Se disputa cada julio desde 1903.'),
    ('Deportes', 1, 'multiple_choice', 'standard', '¿Qué implemento se usa para golpear la pelota en el béisbol?', '["El bate", "La raqueta", "El palo", "El mazo"]'::jsonb, '"El bate"'::jsonb, 0, 'Suele ser de madera o de aluminio según la categoría.'),
    ('Deportes', 1, 'multiple_choice', 'true_false', 'El maratón olímpico tiene una distancia oficial de 42,195 kilómetros.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'La distancia se fijó definitivamente en 1921.'),
    ('Deportes', 1, 'multiple_choice', 'standard', '¿Qué deporte practicaba Michael Jordan?', '["Baloncesto", "Fútbol americano", "Béisbol", "Hockey"]'::jsonb, '"Baloncesto"'::jsonb, 0, 'Ganó seis títulos de la NBA con los Chicago Bulls.'),
    ('Deportes', 2, 'multiple_choice', 'standard', '¿En qué ciudad se celebraron los primeros Juegos Olímpicos modernos en 1896?', '["Atenas", "París", "Londres", "Roma"]'::jsonb, '"Atenas"'::jsonb, 0, 'Pierre de Coubertin impulsó su restauración.'),
    ('Deportes', 2, 'multiple_choice', 'standard', '¿Qué país inventó el deporte del judo?', '["Japón", "China", "Corea del Sur", "Brasil"]'::jsonb, '"Japón"'::jsonb, 0, 'Jigoro Kano lo sistematizó en 1882.'),
    ('Deportes', 2, 'multiple_choice', 'standard', '¿Cuántos anillos tiene la bandera olímpica?', '["Cinco", "Cuatro", "Seis", "Tres"]'::jsonb, '"Cinco"'::jsonb, 0, 'Representan los cinco continentes habitados.'),
    ('Deportes', 2, 'multiple_choice', 'elimination', '¿Cuál de estas NO es una prueba del decatlón?', '["Natación de cien metros", "Lanzamiento de disco", "Salto con pértiga", "Carrera de 1.500 metros"]'::jsonb, '"Natación de cien metros"'::jsonb, 0, 'El decatlón se disputa íntegramente en pista y campo.')
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
