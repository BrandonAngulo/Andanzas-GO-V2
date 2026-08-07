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
('Arte y cultura', 1, 'multiple_choice', 'standard', '¿Qué artista español pintó el Guernica?', '["Pablo Picasso", "Salvador Dalí", "Joan Miró", "Francisco de Goya"]'::jsonb, '"Pablo Picasso"'::jsonb, 0, 'Denuncia el bombardeo de la villa vasca en 1937.'),
    ('Arte y cultura', 1, 'multiple_choice', 'standard', '¿Qué escultura de Miguel Ángel representa a un joven guerrero bíblico?', '["El David", "La Piedad", "Moisés", "El Pensador"]'::jsonb, '"El David"'::jsonb, 0, 'Se conserva en la Galería de la Academia de Florencia.'),
    ('Arte y cultura', 1, 'multiple_choice', 'elimination', '¿Cuál de estos NO es un instrumento de cuerda?', '["Trompeta", "Violín", "Guitarra", "Arpa"]'::jsonb, '"Trompeta"'::jsonb, 0, 'La trompeta es un instrumento de viento metal.'),
    ('Arte y cultura', 1, 'multiple_choice', 'fill_blank', 'El techo de la Capilla ___ fue pintado por Miguel Ángel.', '["Sixtina", "Palatina", "Medici", "Scrovegni"]'::jsonb, '"Sixtina"'::jsonb, 0, 'Trabajó en él entre 1508 y 1512.'),
    ('Arte y cultura', 1, 'multiple_choice', 'standard', '¿Qué arte combina movimiento corporal y música sobre un escenario?', '["La danza", "La escultura", "El grabado", "La cerámica"]'::jsonb, '"La danza"'::jsonb, 0, 'Incluye desde el ballet clásico hasta las danzas tradicionales.'),
    ('Arte y cultura', 1, 'multiple_choice', 'true_false', 'La fotografía se considera una disciplina artística.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Desde el siglo XIX ha desarrollado sus propios lenguajes y corrientes.'),
    ('Arte y cultura', 1, 'multiple_choice', 'standard', '¿Qué edificio parisino diseñado por Gustave Eiffel se levantó para la Exposición de 1889?', '["La Torre Eiffel", "El Arco del Triunfo", "El Panteón", "La Ópera Garnier"]'::jsonb, '"La Torre Eiffel"'::jsonb, 0, 'Iba a ser temporal y terminó siendo el símbolo de la ciudad.'),
    ('Arte y cultura', 2, 'multiple_choice', 'standard', '¿Qué movimiento artístico buscó captar la luz y el instante con pinceladas sueltas?', '["El impresionismo", "El cubismo", "El barroco", "El neoclasicismo"]'::jsonb, '"El impresionismo"'::jsonb, 0, 'Monet, Renoir y Degas fueron algunos de sus referentes.'),
    ('Arte y cultura', 2, 'multiple_choice', 'standard', '¿Qué pintora mexicana es célebre por sus autorretratos simbólicos?', '["Frida Kahlo", "Remedios Varo", "Leonora Carrington", "María Izquierdo"]'::jsonb, '"Frida Kahlo"'::jsonb, 0, 'Su obra combina dolor personal, mito y cultura popular mexicana.'),
    ('Arte y cultura', 2, 'multiple_choice', 'standard', '¿Qué museo madrileño alberga Las meninas de Velázquez?', '["El Museo del Prado", "El Reina Sofía", "El Thyssen-Bornemisza", "El Museo Arqueológico"]'::jsonb, '"El Museo del Prado"'::jsonb, 0, 'Es la obra más emblemática de su colección.'),
    ('Arte y cultura', 2, 'multiple_choice', 'elimination', '¿Cuál de estos NO es un estilo arquitectónico histórico europeo?', '["Art déco tropical", "Gótico", "Románico", "Barroco"]'::jsonb, '"Art déco tropical"'::jsonb, 0, 'Los otros tres son periodos consecutivos de la arquitectura europea.'),
    ('Arte y cultura', 2, 'multiple_choice', 'fill_blank', 'El arquitecto catalán Antoni ___ diseñó la Sagrada Familia de Barcelona.', '["Gaudí", "Bofill", "Sert", "Calatrava"]'::jsonb, '"Gaudí"'::jsonb, 0, 'Dedicó las últimas décadas de su vida al templo.'),
    ('Arte y cultura', 2, 'multiple_choice', 'true_false', 'El teatro griego antiguo distinguía entre tragedia y comedia.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Ambos géneros se representaban en festivales dedicados a Dioniso.'),
    ('Arte y cultura', 2, 'multiple_choice', 'standard', '¿Qué técnica pictórica se aplica sobre muros con pintura fresca sobre yeso húmedo?', '["El fresco", "El óleo", "La acuarela", "El grabado"]'::jsonb, '"El fresco"'::jsonb, 0, 'Fue la técnica dominante en los murales renacentistas.'),
    ('Arte y cultura', 2, 'multiple_choice', 'standard', '¿Qué museo de Nueva York tiene una rampa helicoidal diseñada por Frank Lloyd Wright?', '["El Guggenheim", "El MoMA", "El Whitney", "El Metropolitan"]'::jsonb, '"El Guggenheim"'::jsonb, 0, 'Su forma en espiral se inauguró en 1959.'),
    ('Arte y cultura', 2, 'ordering', NULL, 'Ordena estos periodos artísticos del más antiguo al más reciente.', '["Renacimiento", "Barroco", "Romanticismo", "Impresionismo"]'::jsonb, '["Renacimiento", "Barroco", "Romanticismo", "Impresionismo"]'::jsonb, NULL, 'La secuencia recorre del siglo XV al XIX.'),
    ('Arte y cultura', 2, 'multiple_choice', 'standard', '¿Qué escritor y dramaturgo inglés escribió Romeo y Julieta?', '["William Shakespeare", "Christopher Marlowe", "Ben Jonson", "John Webster"]'::jsonb, '"William Shakespeare"'::jsonb, 0, 'La tragedia se estrenó a finales del siglo XVI.'),
    ('Arte y cultura', 2, 'multiple_choice', 'standard', '¿Qué arte tradicional japonés consiste en plegar papel sin cortarlo?', '["El origami", "El ikebana", "El kintsugi", "El sumi-e"]'::jsonb, '"El origami"'::jsonb, 0, 'Con un solo cuadrado se logran figuras complejas.'),
    ('Arte y cultura', 2, 'multiple_choice', 'standard', '¿Qué corriente artística fundada por André Breton exploraba el inconsciente y los sueños?', '["El surrealismo", "El futurismo", "El expresionismo", "El constructivismo"]'::jsonb, '"El surrealismo"'::jsonb, 0, 'Su manifiesto se publicó en 1924.'),
    ('Arte y cultura', 3, 'multiple_choice', 'standard', '¿Qué pintor holandés del siglo XVII destacó por su dominio del claroscuro en retratos y escenas bíblicas?', '["Rembrandt", "Johannes Vermeer", "Frans Hals", "Jan van Eyck"]'::jsonb, '"Rembrandt"'::jsonb, 0, 'La ronda de noche es una de sus obras más conocidas.'),
    ('Arte y cultura', 3, 'matching', NULL, 'Relaciona cada obra con su autor.', '{"left": ["El grito", "La persistencia de la memoria", "El nacimiento de Venus", "La joven de la perla"], "right": ["Edvard Munch", "Salvador Dalí", "Sandro Botticelli", "Johannes Vermeer"]}'::jsonb, '{"El grito": "Edvard Munch", "La persistencia de la memoria": "Salvador Dalí", "El nacimiento de Venus": "Sandro Botticelli", "La joven de la perla": "Johannes Vermeer"}'::jsonb, NULL, 'Cuatro iconos de la pintura occidental.'),
    ('Arte y cultura', 3, 'multiple_choice', 'standard', '¿Qué movimiento del siglo XX descompuso los objetos en planos geométricos simultáneos?', '["El cubismo", "El fauvismo", "El dadaísmo", "El pop art"]'::jsonb, '"El cubismo"'::jsonb, 0, 'Picasso y Braque lo desarrollaron desde 1907.'),
    ('Arte y cultura', 3, 'multi_select', NULL, 'Selecciona las disciplinas consideradas artes escénicas.', '["Teatro", "Danza", "Ópera", "Grabado", "Cerámica", "Fotografía"]'::jsonb, '["Teatro", "Danza", "Ópera"]'::jsonb, NULL, 'Las artes escénicas requieren representación en vivo ante público.'),
    ('Arte y cultura', 3, 'multiple_choice', 'standard', '¿Qué arquitecto suizo-francés formuló los cinco puntos de la arquitectura moderna?', '["Le Corbusier", "Mies van der Rohe", "Walter Gropius", "Oscar Niemeyer"]'::jsonb, '"Le Corbusier"'::jsonb, 0, 'Entre ellos están la planta libre y la fachada libre.'),
    ('Arte y cultura', 3, 'multiple_choice', 'elimination', '¿Cuál de estos museos NO está en Europa?', '["El Museo Metropolitano de Arte", "El Louvre", "El Rijksmuseum", "La Galería Uffizi"]'::jsonb, '"El Museo Metropolitano de Arte"'::jsonb, 0, 'El Metropolitan está en Nueva York.'),
    ('Arte y cultura', 3, 'multiple_choice', 'standard', '¿Qué técnica japonesa repara cerámica rota con laca y polvo de oro?', '["El kintsugi", "El raku", "El shibori", "El washi"]'::jsonb, '"El kintsugi"'::jsonb, 0, 'Convierte la fractura en parte visible de la historia del objeto.'),
    ('Arte y cultura', 3, 'multiple_choice', 'true_false', 'El muralismo mexicano tuvo en Diego Rivera a uno de sus principales exponentes.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Junto a Orozco y Siqueiros formó los llamados tres grandes.'),
    ('Arte y cultura', 3, 'multiple_choice', 'fill_blank', 'El estilo arquitectónico caracterizado por arcos apuntados y vitrales es el ___.', '["gótico", "románico", "bizantino", "barroco"]'::jsonb, '"gótico"'::jsonb, 0, 'Se desarrolló en Europa desde el siglo XII.'),
    ('Arte y cultura', 3, 'multiple_choice', 'standard', '¿Qué bienal de arte contemporáneo se celebra desde 1895 en una ciudad italiana?', '["La Bienal de Venecia", "Documenta", "La Bienal de São Paulo", "La Feria de Basilea"]'::jsonb, '"La Bienal de Venecia"'::jsonb, 0, 'Es la más antigua de las grandes citas del arte contemporáneo.'),
    ('Arte y cultura', 3, 'multiple_choice', 'standard', '¿Qué artista estadounidense convirtió latas de sopa y retratos serigrafiados en iconos del pop art?', '["Andy Warhol", "Roy Lichtenstein", "Jasper Johns", "Jackson Pollock"]'::jsonb, '"Andy Warhol"'::jsonb, 0, 'Su Factory redefinió la relación entre arte y consumo.'),
    ('Arte y cultura', 4, 'multiple_choice', 'standard', '¿Qué pintora barroca italiana firmó Judit decapitando a Holofernes?', '["Artemisia Gentileschi", "Sofonisba Anguissola", "Lavinia Fontana", "Elisabetta Sirani"]'::jsonb, '"Artemisia Gentileschi"'::jsonb, 0, 'Su obra reinterpretó escenas bíblicas desde una mirada propia.'),
    ('Arte y cultura', 4, 'multiple_choice', 'standard', '¿Qué movimiento alemán de entreguerras unió arte, artesanía y diseño industrial?', '["La Bauhaus", "El Jugendstil", "La Secesión vienesa", "El Werkbund"]'::jsonb, '"La Bauhaus"'::jsonb, 0, 'Fundada por Walter Gropius en Weimar en 1919.'),
    ('Arte y cultura', 4, 'matching', NULL, 'Relaciona cada arquitecto con una obra emblemática.', '{"left": ["Frank Gehry", "Zaha Hadid", "Oscar Niemeyer", "Jorn Utzon"], "right": ["Museo Guggenheim de Bilbao", "Centro Heydar Aliyev", "Catedral de Brasilia", "Ópera de Sídney"]}'::jsonb, '{"Frank Gehry": "Museo Guggenheim de Bilbao", "Zaha Hadid": "Centro Heydar Aliyev", "Oscar Niemeyer": "Catedral de Brasilia", "Jorn Utzon": "Ópera de Sídney"}'::jsonb, NULL, 'Cuatro edificios que redefinieron sus ciudades.'),
    ('Arte y cultura', 4, 'multiple_choice', 'standard', '¿Qué técnica de grabado utiliza una plancha metálica mordida con ácido?', '["El aguafuerte", "La xilografía", "La litografía", "La serigrafía"]'::jsonb, '"El aguafuerte"'::jsonb, 0, 'Goya la empleó en series como Los caprichos.'),
    ('Arte y cultura', 4, 'multi_select', NULL, 'Selecciona los pintores asociados al impresionismo.', '["Claude Monet", "Camille Pissarro", "Berthe Morisot", "Caravaggio", "El Greco", "Alberto Durero"]'::jsonb, '["Claude Monet", "Camille Pissarro", "Berthe Morisot"]'::jsonb, NULL, 'Los tres últimos pertenecen a periodos anteriores.'),
    ('Arte y cultura', 4, 'multiple_choice', 'true_false', 'El Museo del Louvre fue originalmente una fortaleza y luego palacio real.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Se convirtió en museo público tras la Revolución Francesa.'),
    ('Arte y cultura', 4, 'multiple_choice', 'standard', '¿Qué escultor francés creó El pensador como parte de un conjunto mayor?', '["Auguste Rodin", "Camille Claudel", "Aristide Maillol", "Antoine Bourdelle"]'::jsonb, '"Auguste Rodin"'::jsonb, 0, 'Formaba parte del proyecto de La puerta del infierno.'),
    ('Arte y cultura', 4, 'multiple_choice', 'standard', '¿Qué corriente artística rechazó la lógica y el buen gusto tras la Primera Guerra Mundial?', '["El dadaísmo", "El simbolismo", "El purismo", "El realismo social"]'::jsonb, '"El dadaísmo"'::jsonb, 0, 'Nació en el Cabaret Voltaire de Zúrich en 1916.'),
    ('Arte y cultura', 5, 'multiple_choice', 'standard', '¿Qué pintor flamenco del siglo XV perfeccionó el óleo en obras como El matrimonio Arnolfini?', '["Jan van Eyck", "Rogier van der Weyden", "Hans Memling", "El Bosco"]'::jsonb, '"Jan van Eyck"'::jsonb, 0, 'Su dominio del detalle marcó la pintura del norte de Europa.'),
    ('Arte y cultura', 5, 'multiple_choice', 'standard', '¿Qué concepto acuñó Walter Benjamin para describir lo que pierde una obra al ser reproducida en serie?', '["El aura", "El habitus", "La mímesis", "El sublime"]'::jsonb, '"El aura"'::jsonb, 0, 'Lo desarrolló en su ensayo sobre la obra de arte en la era de la reproductibilidad técnica.'),
    ('Arte y cultura', 5, 'matching', NULL, 'Relaciona cada vanguardia con su país de origen.', '{"left": ["Futurismo", "Constructivismo", "De Stijl", "Vorticismo"], "right": ["Italia", "Rusia", "Países Bajos", "Reino Unido"]}'::jsonb, '{"Futurismo": "Italia", "Constructivismo": "Rusia", "De Stijl": "Países Bajos", "Vorticismo": "Reino Unido"}'::jsonb, NULL, 'Cada movimiento respondió al contexto político de su país.'),
    ('Arte y cultura', 5, 'multiple_choice', 'standard', '¿Qué artista serbia realizó la performance La artista está presente en el MoMA en 2010?', '["Marina Abramovic", "Yoko Ono", "Ana Mendieta", "Carolee Schneemann"]'::jsonb, '"Marina Abramovic"'::jsonb, 0, 'Permaneció sentada en silencio frente a los visitantes durante semanas.'),
    ('Arte y cultura', 5, 'multiple_choice', 'standard', '¿Qué templo japonés de Kioto está recubierto de pan de oro y refleja su imagen sobre un estanque?', '["El Kinkaku-ji", "El Ryoan-ji", "El Todai-ji", "El Fushimi Inari"]'::jsonb, '"El Kinkaku-ji"'::jsonb, 0, 'También se conoce como Pabellón Dorado.'),
    ('Arte y cultura', 5, 'multiple_choice', 'true_false', 'El término barroco se usó inicialmente con sentido despectivo.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Aludía a una perla irregular y solo después se aceptó como categoría estilística.'),
    ('Arte y cultura', 5, 'multiple_choice', 'standard', '¿Qué pintor español del siglo XVII fue maestro de la perspectiva aérea en Las hilanderas?', '["Diego Velázquez", "Francisco de Zurbarán", "Bartolomé Esteban Murillo", "José de Ribera"]'::jsonb, '"Diego Velázquez"'::jsonb, 0, 'Su tratamiento del espacio y la luz anticipó soluciones modernas.'),
    ('Literatura', 1, 'multiple_choice', 'standard', '¿En qué pueblo imaginario transcurre Cien años de soledad?', '["Macondo", "Comala", "Santa María", "Yoknapatawpha"]'::jsonb, '"Macondo"'::jsonb, 0, 'Macondo es el pueblo fundado por los Buendía en la novela de García Márquez.'),
    ('Literatura', 1, 'multiple_choice', 'standard', '¿Qué autor creó al detective Sherlock Holmes?', '["Arthur Conan Doyle", "Agatha Christie", "Edgar Allan Poe", "G. K. Chesterton"]'::jsonb, '"Arthur Conan Doyle"'::jsonb, 0, 'Su primera aparición fue en Estudio en escarlata, de 1887.'),
    ('Literatura', 1, 'multiple_choice', 'true_false', 'Don Quijote de la Mancha fue escrito por Miguel de Cervantes.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'La primera parte se publicó en 1605.'),
    ('Literatura', 1, 'multiple_choice', 'standard', '¿Qué saga de libros creada por J. K. Rowling narra la vida de un joven mago?', '["Harry Potter", "Percy Jackson", "Crónicas de Narnia", "El Señor de los Anillos"]'::jsonb, '"Harry Potter"'::jsonb, 0, 'El primer libro apareció en 1997.'),
    ('Literatura', 1, 'multiple_choice', 'standard', '¿Qué género literario se escribe en verso y busca la musicalidad del lenguaje?', '["La poesía", "La novela", "El ensayo", "La crónica"]'::jsonb, '"La poesía"'::jsonb, 0, 'Se organiza en estrofas y suele apoyarse en el ritmo.')
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
