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
('Literatura', 1, 'multiple_choice', 'elimination', '¿Cuál de estas NO es una obra de teatro?', '["La Odisea", "Hamlet", "La casa de Bernarda Alba", "Esperando a Godot"]'::jsonb, '"La Odisea"'::jsonb, 0, 'La Odisea es un poema épico atribuido a Homero.'),
    ('Literatura', 1, 'multiple_choice', 'fill_blank', 'La obra ___ narra el viaje de regreso de Ulises a Ítaca.', '["La Odisea", "La Ilíada", "La Eneida", "Las Metamorfosis"]'::jsonb, '"La Odisea"'::jsonb, 0, 'Se atribuye a Homero y consta de veinticuatro cantos.'),
    ('Literatura', 1, 'multiple_choice', 'standard', '¿Qué escritor danés escribió cuentos como El patito feo y La sirenita?', '["Hans Christian Andersen", "Los hermanos Grimm", "Charles Perrault", "Lewis Carroll"]'::jsonb, '"Hans Christian Andersen"'::jsonb, 0, 'Sus cuentos se publicaron a partir de 1835.'),
    ('Literatura', 1, 'multiple_choice', 'true_false', 'Una fábula suele tener animales como personajes y dejar una moraleja.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Esopo y La Fontaine son sus autores más conocidos.'),
    ('Literatura', 1, 'multiple_choice', 'standard', '¿Qué premio literario internacional se entrega cada año en Estocolmo?', '["El Premio Nobel de Literatura", "El Premio Cervantes", "El Premio Pulitzer", "El Premio Booker"]'::jsonb, '"El Premio Nobel de Literatura"'::jsonb, 0, 'Se concede desde 1901 por decisión de la Academia Sueca.'),
    ('Literatura', 2, 'multiple_choice', 'standard', '¿Qué novela de George Orwell describe un régimen que vigila a todos los ciudadanos?', '["1984", "Un mundo feliz", "Fahrenheit 451", "Nosotros"]'::jsonb, '"1984"'::jsonb, 0, 'Publicada en 1949, popularizó la figura del Gran Hermano.'),
    ('Literatura', 2, 'multiple_choice', 'standard', '¿Quién escribió La metamorfosis, donde un hombre despierta convertido en insecto?', '["Franz Kafka", "Thomas Mann", "Hermann Hesse", "Robert Musil"]'::jsonb, '"Franz Kafka"'::jsonb, 0, 'El relato apareció en 1915.'),
    ('Literatura', 2, 'multiple_choice', 'standard', '¿Qué poeta chilena fue la primera latinoamericana en ganar el Nobel de Literatura?', '["Gabriela Mistral", "Alfonsina Storni", "Juana de Ibarbourou", "Delmira Agustini"]'::jsonb, '"Gabriela Mistral"'::jsonb, 0, 'Lo recibió en 1945.'),
    ('Literatura', 2, 'multiple_choice', 'elimination', '¿Cuál de estos autores NO pertenece al boom latinoamericano?', '["Isabel Allende", "Julio Cortázar", "Carlos Fuentes", "Mario Vargas Llosa"]'::jsonb, '"Isabel Allende"'::jsonb, 0, 'Allende publicó su primera novela después del periodo del boom.'),
    ('Literatura', 2, 'multiple_choice', 'fill_blank', 'El movimiento literario que exageró lo maravilloso dentro de lo cotidiano se llama realismo ___.', '["mágico", "social", "sucio", "crítico"]'::jsonb, '"mágico"'::jsonb, 0, 'García Márquez es su referente más conocido.'),
    ('Literatura', 2, 'multiple_choice', 'true_false', 'Jorge Luis Borges nunca escribió una novela larga.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Su obra se concentra en cuentos, ensayos y poesía.'),
    ('Literatura', 2, 'multiple_choice', 'standard', '¿Qué novela de Mary Shelley se considera precursora de la ciencia ficción?', '["Frankenstein", "Drácula", "La isla del doctor Moreau", "La máquina del tiempo"]'::jsonb, '"Frankenstein"'::jsonb, 0, 'Se publicó en 1818 cuando la autora tenía veinte años.'),
    ('Literatura', 2, 'ordering', NULL, 'Ordena estas obras de la más antigua a la más reciente.', '["La Odisea", "Don Quijote de la Mancha", "Madame Bovary", "Cien años de soledad"]'::jsonb, '["La Odisea", "Don Quijote de la Mancha", "Madame Bovary", "Cien años de soledad"]'::jsonb, NULL, 'La secuencia abarca casi tres milenios de literatura.'),
    ('Literatura', 2, 'multiple_choice', 'standard', '¿Qué autor ruso escribió Crimen y castigo?', '["Fiódor Dostoyevski", "León Tolstói", "Antón Chéjov", "Nikolái Gógol"]'::jsonb, '"Fiódor Dostoyevski"'::jsonb, 0, 'La novela se publicó por entregas en 1866.'),
    ('Literatura', 2, 'multiple_choice', 'standard', '¿Qué escritora británica creó a la detective Miss Marple y a Hercule Poirot?', '["Agatha Christie", "Dorothy Sayers", "P. D. James", "Ruth Rendell"]'::jsonb, '"Agatha Christie"'::jsonb, 0, 'Es una de las autoras más vendidas de la historia.'),
    ('Literatura', 2, 'multiple_choice', 'standard', '¿Qué libro de Antoine de Saint-Exupéry narra el encuentro entre un piloto y un niño de otro planeta?', '["El principito", "Vuelo nocturno", "Tierra de hombres", "Correo del sur"]'::jsonb, '"El principito"'::jsonb, 0, 'Se publicó en 1943 y es uno de los libros más traducidos del mundo.'),
    ('Literatura', 3, 'multiple_choice', 'standard', '¿Qué obra de Dante Alighieri describe un viaje por el infierno, el purgatorio y el paraíso?', '["La Divina Comedia", "El Decamerón", "Orlando furioso", "Los sonetos a Laura"]'::jsonb, '"La Divina Comedia"'::jsonb, 0, 'La escribió en toscano a comienzos del siglo XIV.'),
    ('Literatura', 3, 'matching', NULL, 'Relaciona cada novela latinoamericana con quien la escribió.', '{"left": ["Rayuela", "Pedro Páramo", "La casa de los espíritus", "Conversación en La Catedral"], "right": ["Julio Cortázar", "Juan Rulfo", "Isabel Allende", "Mario Vargas Llosa"]}'::jsonb, '{"Rayuela": "Julio Cortázar", "Pedro Páramo": "Juan Rulfo", "La casa de los espíritus": "Isabel Allende", "Conversación en La Catedral": "Mario Vargas Llosa"}'::jsonb, NULL, 'Cuatro hitos de la narrativa latinoamericana.'),
    ('Literatura', 3, 'multiple_choice', 'standard', '¿Qué corriente poética hispanoamericana lideró Rubén Darío a finales del siglo XIX?', '["El modernismo", "El ultraísmo", "El creacionismo", "El costumbrismo"]'::jsonb, '"El modernismo"'::jsonb, 0, 'Azul, de 1888, suele señalarse como su punto de partida.'),
    ('Literatura', 3, 'multi_select', NULL, 'Selecciona los autores que recibieron el Premio Nobel de Literatura.', '["Gabriel García Márquez", "Toni Morrison", "Kazuo Ishiguro", "Jorge Luis Borges", "Marcel Proust", "Virginia Woolf"]'::jsonb, '["Gabriel García Márquez", "Toni Morrison", "Kazuo Ishiguro"]'::jsonb, NULL, 'Los tres últimos nunca lo recibieron pese a su influencia.'),
    ('Literatura', 3, 'multiple_choice', 'standard', '¿Qué novela de Herman Melville narra la persecución de una ballena blanca?', '["Moby Dick", "Billy Budd", "Typee", "Bartleby el escribiente"]'::jsonb, '"Moby Dick"'::jsonb, 0, 'Se publicó en 1851 y fue reivindicada décadas después.'),
    ('Literatura', 3, 'multiple_choice', 'elimination', '¿Cuál de estas obras NO fue escrita por William Shakespeare?', '["Fausto", "Macbeth", "Otelo", "El rey Lear"]'::jsonb, '"Fausto"'::jsonb, 0, 'Fausto es de Johann Wolfgang von Goethe.'),
    ('Literatura', 3, 'multiple_choice', 'fill_blank', 'El género que combina relato de hechos reales con recursos narrativos se llama ___ literaria.', '["crónica", "égloga", "elegía", "parábola"]'::jsonb, '"crónica"'::jsonb, 0, 'En América Latina tuvo un desarrollo especialmente fuerte.'),
    ('Literatura', 3, 'multiple_choice', 'true_false', 'Virginia Woolf fue una de las principales figuras del modernismo literario en lengua inglesa.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'La señora Dalloway y Al faro son obras clave de ese movimiento.'),
    ('Literatura', 3, 'multiple_choice', 'standard', '¿Qué escritor portugués ganó el Nobel en 1998 y escribió Ensayo sobre la ceguera?', '["José Saramago", "Fernando Pessoa", "Antonio Lobo Antunes", "Eça de Queirós"]'::jsonb, '"José Saramago"'::jsonb, 0, 'Es el único Nobel de Literatura en lengua portuguesa.'),
    ('Literatura', 3, 'multiple_choice', 'standard', '¿Qué poeta estadounidense del siglo XIX publicó casi toda su obra tras su muerte?', '["Emily Dickinson", "Walt Whitman", "Edgar Allan Poe", "Robert Frost"]'::jsonb, '"Emily Dickinson"'::jsonb, 0, 'Se conservaron cerca de mil ochocientos poemas suyos.'),
    ('Literatura', 3, 'multiple_choice', 'standard', '¿Qué obra de Homero narra la cólera de Aquiles durante la guerra de Troya?', '["La Ilíada", "La Odisea", "La Eneida", "Las Argonáuticas"]'::jsonb, '"La Ilíada"'::jsonb, 0, 'Comienza con la disputa entre Aquiles y Agamenón.'),
    ('Literatura', 4, 'multiple_choice', 'standard', '¿Qué autor irlandés escribió Ulises, situada en un solo día de Dublín?', '["James Joyce", "Samuel Beckett", "Oscar Wilde", "W. B. Yeats"]'::jsonb, '"James Joyce"'::jsonb, 0, 'La novela transcurre el 16 de junio de 1904.'),
    ('Literatura', 4, 'multiple_choice', 'standard', '¿Qué escritora nigeriana es autora de Americanah y Medio sol amarillo?', '["Chimamanda Ngozi Adichie", "Buchi Emecheta", "Tsitsi Dangarembga", "Bernardine Evaristo"]'::jsonb, '"Chimamanda Ngozi Adichie"'::jsonb, 0, 'Su obra explora identidad, migración y memoria histórica.'),
    ('Literatura', 4, 'matching', NULL, 'Relaciona cada corriente literaria con un rasgo característico.', '{"left": ["Romanticismo", "Naturalismo", "Simbolismo", "Existencialismo"], "right": ["Exaltación del yo y la naturaleza", "Determinismo social y biológico", "Sugerencia mediante imágenes", "Angustia ante la libertad"]}'::jsonb, '{"Romanticismo": "Exaltación del yo y la naturaleza", "Naturalismo": "Determinismo social y biológico", "Simbolismo": "Sugerencia mediante imágenes", "Existencialismo": "Angustia ante la libertad"}'::jsonb, NULL, 'Cada corriente respondió a un momento histórico distinto.'),
    ('Literatura', 4, 'multiple_choice', 'standard', '¿Qué autor japonés escribió Tokio blues y Kafka en la orilla?', '["Haruki Murakami", "Yukio Mishima", "Kenzaburo Oe", "Yasunari Kawabata"]'::jsonb, '"Haruki Murakami"'::jsonb, 0, 'Su obra mezcla realismo cotidiano y elementos oníricos.'),
    ('Literatura', 4, 'multi_select', NULL, 'Selecciona las obras que pertenecen a la literatura distópica.', '["1984", "Un mundo feliz", "Fahrenheit 451", "Los miserables", "Ana Karenina", "Cumbres borrascosas"]'::jsonb, '["1984", "Un mundo feliz", "Fahrenheit 451"]'::jsonb, NULL, 'Las tres primeras imaginan sociedades futuras opresivas.'),
    ('Literatura', 4, 'multiple_choice', 'true_false', 'Marcel Proust escribió En busca del tiempo perdido en siete volúmenes.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'La obra se publicó entre 1913 y 1927.'),
    ('Literatura', 4, 'multiple_choice', 'standard', '¿Qué heterónimo de Fernando Pessoa firmó los poemas de El guardador de rebaños?', '["Alberto Caeiro", "Ricardo Reis", "Álvaro de Campos", "Bernardo Soares"]'::jsonb, '"Alberto Caeiro"'::jsonb, 0, 'Pessoa creó decenas de heterónimos con biografía y estilo propios.'),
    ('Literatura', 4, 'multiple_choice', 'standard', '¿Qué novelista británica retrató la sociedad rural inglesa en Orgullo y prejuicio?', '["Jane Austen", "Charlotte Brontë", "George Eliot", "Elizabeth Gaskell"]'::jsonb, '"Jane Austen"'::jsonb, 0, 'La novela apareció en 1813.'),
    ('Literatura', 5, 'multiple_choice', 'standard', '¿Qué obra anónima medieval española narra las andanzas de un mozo de muchos amos?', '["El Lazarillo de Tormes", "El Cantar de Mío Cid", "El Libro de buen amor", "La Celestina"]'::jsonb, '"El Lazarillo de Tormes"'::jsonb, 0, 'Publicada en 1554, fundó la novela picaresca.'),
    ('Literatura', 5, 'multiple_choice', 'standard', '¿Qué poeta griega de la isla de Lesbos es una de las voces líricas más antiguas conservadas?', '["Safo", "Corina", "Erina", "Praxila"]'::jsonb, '"Safo"'::jsonb, 0, 'De su obra solo se conservan fragmentos.'),
    ('Literatura', 5, 'matching', NULL, 'Relaciona cada premio literario con su ámbito.', '{"left": ["Premio Cervantes", "Premio Booker", "Premio Goncourt", "Premio Camoes"], "right": ["Lengua española", "Lengua inglesa", "Lengua francesa", "Lengua portuguesa"]}'::jsonb, '{"Premio Cervantes": "Lengua española", "Premio Booker": "Lengua inglesa", "Premio Goncourt": "Lengua francesa", "Premio Camoes": "Lengua portuguesa"}'::jsonb, NULL, 'Cada galardón reconoce trayectorias u obras en su idioma.'),
    ('Literatura', 5, 'multiple_choice', 'standard', '¿Qué término designa la técnica narrativa que reproduce el flujo desordenado del pensamiento?', '["El monólogo interior", "La analepsis", "La écfrasis", "La metaficción"]'::jsonb, '"El monólogo interior"'::jsonb, 0, 'Joyce y Woolf la llevaron al centro de la novela moderna.'),
    ('Literatura', 5, 'multiple_choice', 'standard', '¿Qué escritor argentino publicó Ficciones y El Aleph?', '["Jorge Luis Borges", "Adolfo Bioy Casares", "Ernesto Sábato", "Leopoldo Marechal"]'::jsonb, '"Jorge Luis Borges"'::jsonb, 0, 'Sus cuentos exploran laberintos, espejos y bibliotecas infinitas.'),
    ('Literatura', 5, 'multiple_choice', 'true_false', 'El Popol Vuh recoge el relato de creación del pueblo maya quiché.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Se transcribió al alfabeto latino en el siglo XVI.'),
    ('Literatura', 5, 'multiple_choice', 'standard', '¿Qué autor checo en lengua alemana dejó instrucciones de quemar sus manuscritos, ignoradas por su albacea?', '["Franz Kafka", "Rainer Maria Rilke", "Stefan Zweig", "Joseph Roth"]'::jsonb, '"Franz Kafka"'::jsonb, 0, 'Max Brod desobedeció el encargo y publicó El proceso y El castillo.'),
    ('Música', 1, 'multiple_choice', 'standard', '¿Cuántas cuerdas tiene una guitarra española estándar?', '["Seis", "Cuatro", "Ocho", "Doce"]'::jsonb, '"Seis"'::jsonb, 0, 'Se afinan tradicionalmente en mi, la, re, sol, si y mi.'),
    ('Música', 1, 'multiple_choice', 'standard', '¿Qué banda británica formaron John, Paul, George y Ringo?', '["The Beatles", "The Rolling Stones", "The Who", "Pink Floyd"]'::jsonb, '"The Beatles"'::jsonb, 0, 'Se disolvieron en 1970 tras una década de actividad.'),
    ('Música', 1, 'multiple_choice', 'true_false', 'El piano es un instrumento de percusión de cuerda percutida.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Sus martillos golpean las cuerdas al pulsar las teclas.'),
    ('Música', 1, 'multiple_choice', 'standard', '¿Qué instrumento de viento se asocia con la música de jazz y tiene forma curva de metal?', '["El saxofón", "El violonchelo", "El acordeón", "La marimba"]'::jsonb, '"El saxofón"'::jsonb, 0, 'Adolphe Sax lo patentó a mediados del siglo XIX.'),
    ('Música', 1, 'multiple_choice', 'standard', '¿Qué género musical nació en el Caribe hispano y se baila en pareja con clave rítmica marcada?', '["La salsa", "El tango", "El flamenco", "El fado"]'::jsonb, '"La salsa"'::jsonb, 0, 'Se consolidó en Nueva York y el Caribe entre los años sesenta y setenta.'),
    ('Música', 1, 'multiple_choice', 'elimination', '¿Cuál de estos NO es un instrumento de percusión?', '["Clarinete", "Timbal", "Tambor", "Xilófono"]'::jsonb, '"Clarinete"'::jsonb, 0, 'El clarinete es un instrumento de viento madera.'),
    ('Música', 1, 'multiple_choice', 'fill_blank', 'La escala musical occidental básica tiene ___ notas: do, re, mi, fa, sol, la y si.', '["siete", "cinco", "ocho", "doce"]'::jsonb, '"siete"'::jsonb, 0, 'Con las alteraciones se llega a los doce semitonos de la escala cromática.'),
    ('Música', 1, 'multiple_choice', 'standard', '¿Qué cantante es conocido como el Rey del Pop?', '["Michael Jackson", "Elvis Presley", "Prince", "Freddie Mercury"]'::jsonb, '"Michael Jackson"'::jsonb, 0, 'Thriller sigue siendo uno de los álbumes más vendidos de la historia.')
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
