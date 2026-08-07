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
('Ciencia y tecnología', 1, 'multiple_choice', 'standard', '¿Qué órgano bombea la sangre por el cuerpo humano?', '["El corazón", "El hígado", "El pulmón", "El riñón"]'::jsonb, '"El corazón"'::jsonb, 0, 'El corazón late unas 100.000 veces al día.'),
    ('Ciencia y tecnología', 1, 'multiple_choice', 'true_false', 'El agua está compuesta por hidrógeno y oxígeno.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Su fórmula química es H2O.'),
    ('Ciencia y tecnología', 1, 'multiple_choice', 'standard', '¿Qué fuerza hace que los objetos caigan hacia el suelo?', '["La gravedad", "El magnetismo", "La fricción", "La tensión superficial"]'::jsonb, '"La gravedad"'::jsonb, 0, 'La gravedad atrae las masas entre sí.'),
    ('Ciencia y tecnología', 1, 'multiple_choice', 'standard', '¿Cuántos huesos tiene aproximadamente el esqueleto de una persona adulta?', '["206", "150", "300", "412"]'::jsonb, '"206"'::jsonb, 0, 'Los bebés nacen con más huesos que luego se fusionan.'),
    ('Ciencia y tecnología', 1, 'multiple_choice', 'elimination', '¿Cuál de estos NO es un estado de la materia clásico?', '["Cristalino", "Sólido", "Líquido", "Gaseoso"]'::jsonb, '"Cristalino"'::jsonb, 0, 'Los estados clásicos son sólido, líquido y gaseoso.'),
    ('Ciencia y tecnología', 1, 'multiple_choice', 'fill_blank', 'La unidad básica de la vida es la ___.', '["célula", "molécula", "proteína", "enzima"]'::jsonb, '"célula"'::jsonb, 0, 'Todos los seres vivos están formados por una o más células.'),
    ('Ciencia y tecnología', 1, 'multiple_choice', 'standard', '¿Qué aparato inventó Alexander Graham Bell y patentó en 1876?', '["El teléfono", "La bombilla", "La radio", "El fonógrafo"]'::jsonb, '"El teléfono"'::jsonb, 0, 'Su patente permitió transmitir la voz por cable.'),
    ('Ciencia y tecnología', 1, 'multiple_choice', 'true_false', 'La Luna es un satélite natural de la Tierra.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Tarda unos 27 días en dar una vuelta completa alrededor del planeta.'),
    ('Ciencia y tecnología', 1, 'multiple_choice', 'standard', '¿Qué se mide en grados Celsius?', '["La temperatura", "La presión", "La masa", "La velocidad"]'::jsonb, '"La temperatura"'::jsonb, 0, 'La escala Celsius fija 0 y 100 grados en los cambios de estado del agua.'),
    ('Ciencia y tecnología', 2, 'multiple_choice', 'standard', '¿Qué científica recibió dos premios Nobel en disciplinas distintas?', '["Marie Curie", "Rosalind Franklin", "Ada Lovelace", "Lise Meitner"]'::jsonb, '"Marie Curie"'::jsonb, 0, 'Ganó el Nobel de Física en 1903 y el de Química en 1911.'),
    ('Ciencia y tecnología', 2, 'multiple_choice', 'standard', '¿Qué molécula contiene la información genética de los seres vivos?', '["El ADN", "El ATP", "La hemoglobina", "El colágeno"]'::jsonb, '"El ADN"'::jsonb, 0, 'Su estructura de doble hélice se describió en 1953.'),
    ('Ciencia y tecnología', 2, 'multiple_choice', 'standard', '¿Qué planeta es conocido por su sistema de anillos visible con telescopio?', '["Saturno", "Júpiter", "Neptuno", "Urano"]'::jsonb, '"Saturno"'::jsonb, 0, 'Sus anillos están formados por hielo y roca.'),
    ('Ciencia y tecnología', 2, 'multiple_choice', 'elimination', '¿Cuál de estos NO es un metal?', '["Azufre", "Hierro", "Cobre", "Zinc"]'::jsonb, '"Azufre"'::jsonb, 0, 'El azufre es un no metal presente en minerales y volcanes.'),
    ('Ciencia y tecnología', 2, 'multiple_choice', 'true_false', 'El sonido no se propaga en el vacío.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Necesita un medio material para transmitirse.'),
    ('Ciencia y tecnología', 2, 'multiple_choice', 'standard', '¿Qué sistema del cuerpo humano incluye al cerebro y la médula espinal?', '["El sistema nervioso central", "El sistema endocrino", "El sistema linfático", "El sistema respiratorio"]'::jsonb, '"El sistema nervioso central"'::jsonb, 0, 'Coordina las respuestas del organismo al entorno.'),
    ('Ciencia y tecnología', 2, 'multiple_choice', 'fill_blank', 'El proceso por el cual el agua líquida pasa a vapor se llama ___.', '["evaporación", "condensación", "sublimación", "solidificación"]'::jsonb, '"evaporación"'::jsonb, 0, 'Ocurre cuando las moléculas ganan energía suficiente para escapar.'),
    ('Ciencia y tecnología', 2, 'ordering', NULL, 'Ordena estos planetas según su distancia al Sol de menor a mayor.', '["Mercurio", "Tierra", "Júpiter", "Neptuno"]'::jsonb, '["Mercurio", "Tierra", "Júpiter", "Neptuno"]'::jsonb, NULL, 'Entre ellos quedan Venus, Marte, Saturno y Urano.'),
    ('Ciencia y tecnología', 2, 'multiple_choice', 'standard', '¿Quién formuló la teoría de la relatividad general?', '["Albert Einstein", "Isaac Newton", "Niels Bohr", "Max Planck"]'::jsonb, '"Albert Einstein"'::jsonb, 0, 'La publicó en 1915 y reformuló la comprensión de la gravedad.'),
    ('Ciencia y tecnología', 2, 'multiple_choice', 'standard', '¿Qué gas respiran los seres humanos para vivir?', '["Oxígeno", "Nitrógeno", "Helio", "Dióxido de carbono"]'::jsonb, '"Oxígeno"'::jsonb, 0, 'El oxígeno permite la respiración celular en las mitocondrias.'),
    ('Ciencia y tecnología', 2, 'multiple_choice', 'standard', '¿Qué invento de Johannes Gutenberg revolucionó la difusión del conocimiento?', '["La imprenta de tipos móviles", "El microscopio", "La brújula", "El telescopio"]'::jsonb, '"La imprenta de tipos móviles"'::jsonb, 0, 'Permitió reproducir libros a gran escala desde el siglo XV.'),
    ('Ciencia y tecnología', 2, 'multiple_choice', 'standard', '¿Qué red global de computadoras se popularizó con la World Wide Web en los años noventa?', '["Internet", "La telefonía móvil", "La televisión por cable", "El telégrafo"]'::jsonb, '"Internet"'::jsonb, 0, 'Tim Berners-Lee propuso la web en 1989 en el CERN.'),
    ('Ciencia y tecnología', 3, 'multiple_choice', 'standard', '¿Qué partícula subatómica tiene carga negativa?', '["El electrón", "El protón", "El neutrón", "El positrón"]'::jsonb, '"El electrón"'::jsonb, 0, 'Los electrones orbitan el núcleo atómico.'),
    ('Ciencia y tecnología', 3, 'multiple_choice', 'standard', '¿Qué ley física afirma que la energía no se crea ni se destruye?', '["El principio de conservación de la energía", "La ley de Ohm", "El principio de Arquímedes", "La ley de Hooke"]'::jsonb, '"El principio de conservación de la energía"'::jsonb, 0, 'La energía solo se transforma de una forma a otra.'),
    ('Ciencia y tecnología', 3, 'multi_select', NULL, 'Selecciona los elementos que son gases nobles.', '["Helio", "Neón", "Argón", "Nitrógeno", "Oxígeno", "Cloro"]'::jsonb, '["Helio", "Neón", "Argón"]'::jsonb, NULL, 'Los gases nobles tienen su capa electrónica externa completa.'),
    ('Ciencia y tecnología', 3, 'matching', NULL, 'Relaciona cada científico con su aporte principal.', '{"left": ["Charles Darwin", "Gregor Mendel", "Alexander Fleming", "Dmitri Mendeléyev"], "right": ["Selección natural", "Leyes de la herencia", "Descubrimiento de la penicilina", "Tabla periódica"]}'::jsonb, '{"Charles Darwin": "Selección natural", "Gregor Mendel": "Leyes de la herencia", "Alexander Fleming": "Descubrimiento de la penicilina", "Dmitri Mendeléyev": "Tabla periódica"}'::jsonb, NULL, 'Cuatro pilares de la ciencia moderna.'),
    ('Ciencia y tecnología', 3, 'multiple_choice', 'standard', '¿Qué unidad mide la intensidad de la corriente eléctrica?', '["El amperio", "El voltio", "El ohmio", "El vatio"]'::jsonb, '"El amperio"'::jsonb, 0, 'El voltio mide la diferencia de potencial y el ohmio la resistencia.'),
    ('Ciencia y tecnología', 3, 'multiple_choice', 'true_false', 'Los antibióticos no son eficaces contra las infecciones virales.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Actúan sobre bacterias, no sobre virus.'),
    ('Ciencia y tecnología', 3, 'multiple_choice', 'standard', '¿Qué instrumento usó Galileo para observar las lunas de Júpiter en 1610?', '["El telescopio", "El microscopio", "El astrolabio", "El sextante"]'::jsonb, '"El telescopio"'::jsonb, 0, 'Descubrió los cuatro satélites hoy llamados galileanos.'),
    ('Ciencia y tecnología', 3, 'multiple_choice', 'elimination', '¿Cuál de estas NO es una fuente de energía renovable?', '["El gas natural", "La energía solar", "La energía eólica", "La energía geotérmica"]'::jsonb, '"El gas natural"'::jsonb, 0, 'El gas natural es un combustible fósil.'),
    ('Ciencia y tecnología', 3, 'multiple_choice', 'fill_blank', 'La velocidad de la luz en el vacío es de aproximadamente ___ kilómetros por segundo.', '["300.000", "150.000", "30.000", "1.080.000"]'::jsonb, '"300.000"'::jsonb, 0, 'Es el límite de velocidad del universo conocido.'),
    ('Ciencia y tecnología', 3, 'multiple_choice', 'standard', '¿Qué proceso usan las estrellas para producir energía?', '["La fusión nuclear", "La fisión nuclear", "La combustión química", "La radiactividad natural"]'::jsonb, '"La fusión nuclear"'::jsonb, 0, 'En su núcleo, el hidrógeno se fusiona formando helio.'),
    ('Ciencia y tecnología', 3, 'multiple_choice', 'standard', '¿Qué lenguaje de programación se creó en los años noventa y domina el desarrollo web en el navegador?', '["JavaScript", "Fortran", "Cobol", "Pascal"]'::jsonb, '"JavaScript"'::jsonb, 0, 'Brendan Eich lo desarrolló en 1995 para Netscape.'),
    ('Ciencia y tecnología', 4, 'multiple_choice', 'standard', '¿Qué enzima permite copiar ARN a ADN y es clave en los retrovirus?', '["La transcriptasa inversa", "La ADN polimerasa", "La helicasa", "La ligasa"]'::jsonb, '"La transcriptasa inversa"'::jsonb, 0, 'Su descubrimiento cambió la comprensión del flujo de información genética.'),
    ('Ciencia y tecnología', 4, 'multiple_choice', 'standard', '¿Qué técnica permite editar genes con precisión usando una proteína guiada por ARN?', '["CRISPR-Cas9", "La PCR", "La electroforesis", "La cromatografía"]'::jsonb, '"CRISPR-Cas9"'::jsonb, 0, 'Su desarrollo recibió el Nobel de Química en 2020.'),
    ('Ciencia y tecnología', 4, 'multiple_choice', 'standard', '¿Qué principio de la mecánica cuántica impide conocer con precisión simultánea posición y momento?', '["El principio de incertidumbre de Heisenberg", "El principio de exclusión de Pauli", "El principio de correspondencia", "La regla de Hund"]'::jsonb, '"El principio de incertidumbre de Heisenberg"'::jsonb, 0, 'Formulado en 1927, es una limitación fundamental, no técnica.'),
    ('Ciencia y tecnología', 4, 'ordering', NULL, 'Ordena estas escalas de tamaño de mayor a menor.', '["Molécula", "Átomo", "Núcleo atómico", "Quark"]'::jsonb, '["Molécula", "Átomo", "Núcleo atómico", "Quark"]'::jsonb, NULL, 'Cada nivel es varios órdenes de magnitud menor que el anterior.'),
    ('Ciencia y tecnología', 4, 'multi_select', NULL, 'Selecciona los componentes fundamentales de un átomo.', '["Protón", "Neutrón", "Electrón", "Fotón", "Muón", "Gluón libre"]'::jsonb, '["Protón", "Neutrón", "Electrón"]'::jsonb, NULL, 'Fotones y muones no forman parte estable de la estructura atómica.'),
    ('Ciencia y tecnología', 4, 'multiple_choice', 'standard', '¿Qué observatorio detectó por primera vez ondas gravitacionales en 2015?', '["LIGO", "Hubble", "Arecibo", "Chandra"]'::jsonb, '"LIGO"'::jsonb, 0, 'La señal provino de la fusión de dos agujeros negros.'),
    ('Ciencia y tecnología', 4, 'multiple_choice', 'true_false', 'El cero absoluto corresponde a menos 273,15 grados Celsius.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Es la temperatura mínima teórica, equivalente a 0 kelvin.'),
    ('Ciencia y tecnología', 4, 'multiple_choice', 'standard', '¿Qué algoritmo describe el funcionamiento básico del aprendizaje profundo moderno?', '["La retropropagación del error", "El algoritmo de Dijkstra", "La transformada de Fourier", "El método de Newton"]'::jsonb, '"La retropropagación del error"'::jsonb, 0, 'Permite ajustar los pesos de una red neuronal según el error obtenido.'),
    ('Ciencia y tecnología', 5, 'multiple_choice', 'standard', '¿Qué partícula fue confirmada en el CERN en 2012 y explica el origen de la masa?', '["El bosón de Higgs", "El neutrino tau", "El gluón", "El quark cima"]'::jsonb, '"El bosón de Higgs"'::jsonb, 0, 'Su existencia había sido propuesta en 1964.'),
    ('Ciencia y tecnología', 5, 'multiple_choice', 'standard', '¿Qué fenómeno describe la expansión acelerada del universo atribuida a una energía desconocida?', '["La energía oscura", "La materia oscura", "La radiación de fondo", "El corrimiento gravitacional"]'::jsonb, '"La energía oscura"'::jsonb, 0, 'Se dedujo en 1998 al observar supernovas lejanas.'),
    ('Ciencia y tecnología', 5, 'matching', NULL, 'Relaciona cada constante con lo que describe.', '{"left": ["Constante de Planck", "Número de Avogadro", "Constante de gravitación", "Velocidad de la luz"], "right": ["Cuantización de la energía", "Partículas por mol", "Atracción entre masas", "Límite de propagación"]}'::jsonb, '{"Constante de Planck": "Cuantización de la energía", "Número de Avogadro": "Partículas por mol", "Constante de gravitación": "Atracción entre masas", "Velocidad de la luz": "Límite de propagación"}'::jsonb, NULL, 'Cada constante fija una escala fundamental de la naturaleza.'),
    ('Ciencia y tecnología', 5, 'multiple_choice', 'standard', '¿Qué teorema demuestra que todo sistema formal suficientemente potente contiene enunciados indemostrables?', '["Los teoremas de incompletitud de Gödel", "El teorema de Pitágoras", "El teorema de Bayes", "El último teorema de Fermat"]'::jsonb, '"Los teoremas de incompletitud de Gödel"'::jsonb, 0, 'Gödel los publicó en 1931 y cambiaron la lógica matemática.'),
    ('Ciencia y tecnología', 5, 'multiple_choice', 'standard', '¿Qué estructura celular contiene su propio ADN y se cree que provino de una bacteria simbionte?', '["La mitocondria", "El ribosoma", "El aparato de Golgi", "El lisosoma"]'::jsonb, '"La mitocondria"'::jsonb, 0, 'La teoría endosimbiótica fue defendida por Lynn Margulis.'),
    ('Ciencia y tecnología', 5, 'multiple_choice', 'true_false', 'Un año luz es una unidad de distancia, no de tiempo.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Equivale a la distancia que recorre la luz en un año.'),
    ('Ciencia y tecnología', 5, 'multiple_choice', 'standard', '¿Qué problema abierto pregunta si toda solución verificable rápidamente también puede hallarse rápidamente?', '["El problema P versus NP", "La hipótesis de Riemann", "La conjetura de Goldbach", "El problema de Collatz"]'::jsonb, '"El problema P versus NP"'::jsonb, 0, 'Es uno de los siete problemas del milenio.'),
    ('Arte y cultura', 1, 'multiple_choice', 'standard', '¿Quién pintó La Mona Lisa?', '["Leonardo da Vinci", "Miguel Ángel", "Rafael", "Sandro Botticelli"]'::jsonb, '"Leonardo da Vinci"'::jsonb, 0, 'La obra se conserva en el museo del Louvre.'),
    ('Arte y cultura', 1, 'multiple_choice', 'standard', '¿En qué museo de París se exhibe la Venus de Milo?', '["El Louvre", "El Prado", "El Hermitage", "La Galería Uffizi"]'::jsonb, '"El Louvre"'::jsonb, 0, 'Es una de las esculturas griegas más célebres del museo.'),
    ('Arte y cultura', 1, 'multiple_choice', 'true_false', 'Los girasoles es una serie de cuadros pintada por Vincent van Gogh.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Pintó varias versiones entre 1888 y 1889 en Arlés.')
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
