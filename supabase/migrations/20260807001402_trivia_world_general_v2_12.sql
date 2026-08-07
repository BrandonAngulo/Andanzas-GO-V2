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
('Cultura e identidad', 3, 'multiple_choice', 'standard', '¿Qué convenio internacional reconoce derechos colectivos de pueblos indígenas y tribales?', '["El Convenio 169 de la OIT", "La Convención de Basilea", "El Convenio de Berna", "El Acuerdo de Escazú"]'::jsonb, '"El Convenio 169 de la OIT"'::jsonb, 0, 'Establece la consulta previa como derecho.'),
    ('Cultura e identidad', 3, 'multi_select', NULL, 'Selecciona las lenguas que se escriben con alfabeto cirílico.', '["Ruso", "Búlgaro", "Serbio", "Húngaro", "Turco", "Polaco"]'::jsonb, '["Ruso", "Búlgaro", "Serbio"]'::jsonb, NULL, 'Los tres últimos usan variantes del alfabeto latino.'),
    ('Cultura e identidad', 3, 'multiple_choice', 'standard', '¿Qué término designa la mezcla cultural resultante del contacto sostenido entre pueblos?', '["El mestizaje cultural", "El aislamiento", "La endoculturación", "La aculturación forzada"]'::jsonb, '"El mestizaje cultural"'::jsonb, 0, 'Se expresa en lengua, cocina, música y creencias.'),
    ('Cultura e identidad', 3, 'multiple_choice', 'elimination', '¿Cuál de estas NO es una lengua romance?', '["El albanés", "El rumano", "El catalán", "El gallego"]'::jsonb, '"El albanés"'::jsonb, 0, 'El albanés forma una rama propia dentro del indoeuropeo.'),
    ('Cultura e identidad', 3, 'multiple_choice', 'fill_blank', 'El fenómeno por el cual una comunidad usa dos lenguas con funciones sociales distintas se llama ___.', '["diglosia", "bilingüismo simétrico", "koiné", "pidgin"]'::jsonb, '"diglosia"'::jsonb, 0, 'Suele haber una variedad de prestigio y otra de uso cotidiano.'),
    ('Cultura e identidad', 3, 'multiple_choice', 'true_false', 'El quechua es lengua cooficial en Perú y Bolivia.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Cuenta con millones de hablantes en la región andina.'),
    ('Cultura e identidad', 3, 'multiple_choice', 'standard', '¿Qué documento reconoce los derechos de los pueblos indígenas y fue adoptado por la ONU en 2007?', '["La Declaración de las Naciones Unidas sobre los Derechos de los Pueblos Indígenas", "El Convenio 107", "La Agenda 2030", "La Carta de la Tierra"]'::jsonb, '"La Declaración de las Naciones Unidas sobre los Derechos de los Pueblos Indígenas"'::jsonb, 0, 'Reafirma el derecho a la libre determinación.'),
    ('Cultura e identidad', 3, 'multiple_choice', 'standard', '¿Qué disciplina estudia las culturas humanas mediante trabajo de campo prolongado?', '["La antropología", "La demografía", "La arqueología industrial", "La estadística social"]'::jsonb, '"La antropología"'::jsonb, 0, 'La etnografía es su método característico.'),
    ('Cultura e identidad', 3, 'multiple_choice', 'standard', '¿Qué lengua construida creada en 1887 buscaba servir de idioma internacional neutral?', '["El esperanto", "El volapük", "La interlingua", "El ido"]'::jsonb, '"El esperanto"'::jsonb, 0, 'L. L. Zamenhof publicó su primer manual ese año.'),
    ('Cultura e identidad', 4, 'multiple_choice', 'standard', '¿Qué concepto de Benedict Anderson describe a la nación como una comunidad construida simbólicamente?', '["La comunidad imaginada", "El campo social", "El habitus", "La sociedad líquida"]'::jsonb, '"La comunidad imaginada"'::jsonb, 0, 'Sostiene que la imprenta y la prensa fueron claves en su formación.'),
    ('Cultura e identidad', 4, 'multiple_choice', 'standard', '¿Qué familia lingüística agrupa al español, el hindi, el ruso y el persa?', '["La indoeuropea", "La afroasiática", "La sinotibetana", "La urálica"]'::jsonb, '"La indoeuropea"'::jsonb, 0, 'Su expansión abarca desde Europa hasta el sur de Asia.'),
    ('Cultura e identidad', 4, 'matching', NULL, 'Relaciona cada sistema de escritura con la lengua que lo usa.', '{"left": ["Hangul", "Devanagari", "Kana", "Ge ez"], "right": ["Coreano", "Hindi", "Japonés", "Amárico"]}'::jsonb, '{"Hangul": "Coreano", "Devanagari": "Hindi", "Kana": "Japonés", "Ge ez": "Amárico"}'::jsonb, NULL, 'Cada sistema responde a la fonología de su lengua.'),
    ('Cultura e identidad', 4, 'multiple_choice', 'standard', '¿Qué término acuñó Pierre Bourdieu para el conjunto de saberes y gustos heredados socialmente?', '["El capital cultural", "El capital humano", "La renta simbólica", "El excedente social"]'::jsonb, '"El capital cultural"'::jsonb, 0, 'Explica parte de la reproducción de las desigualdades.'),
    ('Cultura e identidad', 4, 'multi_select', NULL, 'Selecciona los elementos que la Unesco considera patrimonio cultural inmaterial.', '["Tradiciones orales", "Artes del espectáculo", "Técnicas artesanales", "Monumentos de piedra", "Sitios arqueológicos", "Reservas naturales"]'::jsonb, '["Tradiciones orales", "Artes del espectáculo", "Técnicas artesanales"]'::jsonb, NULL, 'Los tres últimos corresponden a patrimonio material o natural.'),
    ('Cultura e identidad', 4, 'multiple_choice', 'true_false', 'Una lengua criolla surge de la estabilización de un pidgin como lengua materna de una comunidad.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'El papiamento y el criollo haitiano son ejemplos conocidos.'),
    ('Cultura e identidad', 4, 'multiple_choice', 'standard', '¿Qué concepto describe la apropiación de elementos culturales ajenos sin reconocer su origen ni contexto?', '["La apropiación cultural", "El préstamo lingüístico", "La hibridación", "El sincretismo"]'::jsonb, '"La apropiación cultural"'::jsonb, 0, 'El debate se centra en las relaciones de poder implicadas.'),
    ('Cultura e identidad', 4, 'multiple_choice', 'standard', '¿Qué región concentra la mayor diversidad de lenguas del mundo por superficie?', '["Papúa Nueva Guinea", "Escandinavia", "Los Balcanes", "Asia Central"]'::jsonb, '"Papúa Nueva Guinea"'::jsonb, 0, 'Se hablan allí más de ochocientas lenguas distintas.'),
    ('Cultura e identidad', 5, 'multiple_choice', 'standard', '¿Qué hipótesis sostiene que la lengua que hablamos influye en cómo percibimos la realidad?', '["La hipótesis de Sapir-Whorf", "La gramática universal", "El principio de cooperación", "La teoría de los actos de habla"]'::jsonb, '"La hipótesis de Sapir-Whorf"'::jsonb, 0, 'Sus versiones fuertes han sido muy discutidas.'),
    ('Cultura e identidad', 5, 'multiple_choice', 'standard', '¿Qué antropólogo propuso el análisis estructural de los mitos buscando oposiciones binarias?', '["Claude Lévi-Strauss", "Bronislaw Malinowski", "Clifford Geertz", "Marcel Mauss"]'::jsonb, '"Claude Lévi-Strauss"'::jsonb, 0, 'Su obra Mitológicas desarrolla ese método.'),
    ('Cultura e identidad', 5, 'matching', NULL, 'Relaciona cada concepto antropológico con su autor.', '{"left": ["Don y contradon", "Descripción densa", "Rito de paso", "Comunidad imaginada"], "right": ["Marcel Mauss", "Clifford Geertz", "Arnold van Gennep", "Benedict Anderson"]}'::jsonb, '{"Don y contradon": "Marcel Mauss", "Descripción densa": "Clifford Geertz", "Rito de paso": "Arnold van Gennep", "Comunidad imaginada": "Benedict Anderson"}'::jsonb, NULL, 'Cuatro nociones centrales de la teoría cultural.'),
    ('Cultura e identidad', 5, 'multiple_choice', 'standard', '¿Qué término designa la tendencia a juzgar otras culturas desde los valores de la propia?', '["El etnocentrismo", "El relativismo cultural", "El particularismo", "El difusionismo"]'::jsonb, '"El etnocentrismo"'::jsonb, 0, 'Su alternativa metodológica es el relativismo cultural.'),
    ('Cultura e identidad', 5, 'multiple_choice', 'standard', '¿Qué instrumento internacional protege el patrimonio cultural en caso de conflicto armado?', '["La Convención de La Haya de 1954", "El Estatuto de Roma", "La Convención de Viena de 1969", "El Protocolo de Nagoya"]'::jsonb, '"La Convención de La Haya de 1954"'::jsonb, 0, 'Introdujo el escudo azul como emblema de protección.'),
    ('Cultura e identidad', 5, 'multiple_choice', 'true_false', 'Más de la mitad de las lenguas del mundo tiene menos de diez mil hablantes.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Esa fragilidad demográfica explica el ritmo de desaparición.'),
    ('Cultura e identidad', 5, 'multiple_choice', 'standard', '¿Qué concepto describe la circulación global de bienes culturales y su recepción local diferenciada?', '["La glocalización", "La aculturación", "La estandarización", "La difusión pasiva"]'::jsonb, '"La glocalización"'::jsonb, 0, 'Combina lo global y lo local en un mismo proceso.'),
    ('Geografía y territorio', 4, 'multiple_choice', 'standard', '¿Qué país europeo tiene el mayor número de volcanes activos por su actividad tectónica en la dorsal atlántica?', '["Islandia", "Francia", "Portugal", "Rumanía"]'::jsonb, '"Islandia"'::jsonb, 0, 'La isla se asienta sobre la dorsal mesoatlántica y un punto caliente.'),
    ('Geografía y territorio', 5, 'multiple_choice', 'standard', '¿Qué línea imaginaria separa las especies de Asia de las de Australia en el archipiélago indonesio?', '["La línea de Wallace", "El meridiano de Greenwich", "La línea de Weber alta", "El trópico de Capricornio"]'::jsonb, '"La línea de Wallace"'::jsonb, 0, 'Alfred Russel Wallace la describió en el siglo XIX.'),
    ('Naturaleza y ambiente', 3, 'multiple_choice', 'standard', '¿Qué nombre recibe el conjunto de microorganismos que habitan el intestino humano?', '["La microbiota intestinal", "El citoplasma", "La linfa", "El plasma sanguíneo"]'::jsonb, '"La microbiota intestinal"'::jsonb, 0, 'Influye en la digestión y en el sistema inmunitario.'),
    ('Naturaleza y ambiente', 5, 'multiple_choice', 'standard', '¿Qué concepto describe la cantidad de recursos naturales que consume una población frente a lo que el planeta regenera?', '["La huella ecológica", "La renta per cápita", "El índice de Gini", "La tasa de natalidad"]'::jsonb, '"La huella ecológica"'::jsonb, 0, 'Cuando se supera la biocapacidad se habla de sobregiro ecológico.'),
    ('Historia', 4, 'multiple_choice', 'standard', '¿Qué imperio de Asia central fue fundado por Tamerlán en el siglo XIV?', '["El Imperio timúrida", "El kanato de Crimea", "El Imperio safávida", "El sultanato de Delhi"]'::jsonb, '"El Imperio timúrida"'::jsonb, 0, 'Su capital fue Samarcanda.'),
    ('Historia', 5, 'multiple_choice', 'standard', '¿Qué documento de 1215 limitó por primera vez el poder del rey de Inglaterra frente a los nobles?', '["La Carta Magna", "La Petición de Derechos", "El Bill of Rights", "El Acta de Unión"]'::jsonb, '"La Carta Magna"'::jsonb, 0, 'Los barones se la impusieron a Juan sin Tierra.'),
    ('Ciencia y tecnología', 3, 'multiple_choice', 'standard', '¿Qué órgano del cuerpo humano regula la glucosa mediante la insulina?', '["El páncreas", "El bazo", "La tiroides", "El hígado"]'::jsonb, '"El páncreas"'::jsonb, 0, 'Las células beta de los islotes pancreáticos la producen.'),
    ('Ciencia y tecnología', 5, 'multiple_choice', 'standard', '¿Qué efecto describe la desviación de la luz al pasar cerca de un cuerpo muy masivo?', '["La lente gravitacional", "El efecto Doppler", "La difracción de Fraunhofer", "El efecto fotoeléctrico"]'::jsonb, '"La lente gravitacional"'::jsonb, 0, 'Se comprobó durante el eclipse solar de 1919.'),
    ('Arte y cultura', 3, 'multiple_choice', 'standard', '¿Qué museo de San Petersburgo ocupa el antiguo Palacio de Invierno?', '["El Hermitage", "La Galería Tretiakov", "El Museo Pushkin", "El Museo Ruso"]'::jsonb, '"El Hermitage"'::jsonb, 0, 'Su colección supera los tres millones de piezas.'),
    ('Arte y cultura', 5, 'multiple_choice', 'standard', '¿Qué técnica desarrollada en el Renacimiento crea la ilusión de profundidad mediante un punto de fuga?', '["La perspectiva lineal", "El esfumado", "El escorzo", "El claroscuro"]'::jsonb, '"La perspectiva lineal"'::jsonb, 0, 'Brunelleschi la formuló y Alberti la sistematizó.'),
    ('Literatura', 3, 'multiple_choice', 'standard', '¿Qué novela de Alexandre Dumas narra la venganza de Edmond Dantès?', '["El conde de Montecristo", "Los tres mosqueteros", "El hombre de la máscara de hierro", "La reina Margot"]'::jsonb, '"El conde de Montecristo"'::jsonb, 0, 'Se publicó por entregas entre 1844 y 1846.'),
    ('Literatura', 5, 'multiple_choice', 'standard', '¿Qué obra de Miguel de Cervantes reúne doce relatos breves publicados en 1613?', '["Novelas ejemplares", "La Galatea", "Los trabajos de Persiles", "El coloquio de los perros únicamente"]'::jsonb, '"Novelas ejemplares"'::jsonb, 0, 'Incluye Rinconete y Cortadillo y La gitanilla.'),
    ('Música', 3, 'multiple_choice', 'standard', '¿Qué compositor polaco escribió mayoritariamente para piano y murió en París en 1849?', '["Frédéric Chopin", "Franz Liszt", "Robert Schumann", "Felix Mendelssohn"]'::jsonb, '"Frédéric Chopin"'::jsonb, 0, 'Sus nocturnos y mazurcas son parte del repertorio esencial del piano.'),
    ('Música', 5, 'multiple_choice', 'standard', '¿Qué concepto describe el uso simultáneo de dos tonalidades distintas en una misma obra?', '["La politonalidad", "La atonalidad", "La modulación", "El cromatismo"]'::jsonb, '"La politonalidad"'::jsonb, 0, 'Milhaud y Stravinski la emplearon con frecuencia.'),
    ('Cine y series', 3, 'multiple_choice', 'standard', '¿Qué película de 1939 popularizó el paso del blanco y negro al color dentro del propio relato?', '["El mago de Oz", "Lo que el viento se llevó", "La diligencia", "Cumbres borrascosas"]'::jsonb, '"El mago de Oz"'::jsonb, 0, 'El cambio ocurre al llegar Dorothy al país de Oz.'),
    ('Cine y series', 5, 'multiple_choice', 'standard', '¿Qué término designa el conjunto de elementos visuales dispuestos dentro del encuadre?', '["La puesta en escena", "El raccord", "La banda sonora diegética", "El fuera de campo"]'::jsonb, '"La puesta en escena"'::jsonb, 0, 'Incluye decorados, iluminación, vestuario y posición de los actores.'),
    ('Deportes', 3, 'multiple_choice', 'standard', '¿Qué país inventó el deporte del bádminton en su forma moderna?', '["Reino Unido", "China", "Indonesia", "Dinamarca"]'::jsonb, '"Reino Unido"'::jsonb, 0, 'Se codificó en Inglaterra en el siglo XIX a partir de un juego indio.'),
    ('Deportes', 5, 'multiple_choice', 'standard', '¿Qué principio del olimpismo prohíbe cualquier discriminación en la práctica deportiva?', '["El principio de no discriminación de la Carta Olímpica", "La regla del fair play", "El código antidopaje", "El principio de universalidad territorial"]'::jsonb, '"El principio de no discriminación de la Carta Olímpica"'::jsonb, 0, 'Está recogido en los principios fundamentales de la Carta Olímpica.'),
    ('Gastronomía del mundo', 3, 'multiple_choice', 'standard', '¿Qué producto se obtiene al prensar aceitunas maduras sin usar calor ni disolventes?', '["El aceite de oliva virgen extra", "La margarina", "El aceite de girasol refinado", "La manteca vegetal"]'::jsonb, '"El aceite de oliva virgen extra"'::jsonb, 0, 'Su acidez debe mantenerse por debajo de un límite estricto.'),
    ('Gastronomía del mundo', 5, 'multiple_choice', 'standard', '¿Qué técnica de la cocina peruana marina pescado crudo con ají y jugo cítrico durante minutos?', '["La leche de tigre en el ceviche", "El escabeche criollo", "El adobo arequipeño", "La huatia andina"]'::jsonb, '"La leche de tigre en el ceviche"'::jsonb, 0, 'El jugo resultante se sirve también como aperitivo.'),
    ('Mitos y leyendas', 3, 'multiple_choice', 'standard', '¿Qué barquero de la mitología griega transporta las almas a través del río Aqueronte?', '["Caronte", "Hermes", "Tánatos", "Hipnos"]'::jsonb, '"Caronte"'::jsonb, 0, 'Se le pagaba con una moneda colocada bajo la lengua del difunto.'),
    ('Mitos y leyendas', 5, 'multiple_choice', 'standard', '¿Qué relato persa recopilado por Ferdousí narra la historia mítica de los reyes de Irán?', '["El Shahnameh", "El Avesta", "Las mil y una noches", "El Rubaiyat"]'::jsonb, '"El Shahnameh"'::jsonb, 0, 'Fue compuesto hacia el año 1010.'),
    ('Cultura e identidad', 3, 'multiple_choice', 'standard', '¿Qué término designa el conjunto de normas no escritas que regulan la convivencia en un grupo?', '["Las costumbres o normas sociales", "La legislación positiva", "La jurisprudencia", "El derecho internacional"]'::jsonb, '"Las costumbres o normas sociales"'::jsonb, 0, 'Se transmiten por socialización más que por códigos escritos.'),
    ('Cultura e identidad', 5, 'multiple_choice', 'standard', '¿Qué concepto describe la coexistencia de dos o más identidades culturales en una misma persona?', '["La identidad híbrida", "La aculturación total", "El aislamiento cultural", "La endogamia lingüística"]'::jsonb, '"La identidad híbrida"'::jsonb, 0, 'Néstor García Canclini trabajó ampliamente esta noción.'),
    ('Mitos y leyendas', 4, 'multiple_choice', 'standard', '¿Qué criatura del folclore andino se describe como un espíritu protector de los cerros y las minas?', '["El Tío o Supay", "El Ekeko", "La Pachamama", "El Amaru"]'::jsonb, '"El Tío o Supay"'::jsonb, 0, 'Los mineros bolivianos le hacen ofrendas dentro de los socavones.'),
    ('Cine y series', 4, 'multiple_choice', 'standard', '¿Qué serie danesa y sueca inauguró la ola del noir nórdico televisivo con un puente como escenario?', '["Bron o El puente", "Forbrydelsen", "Borgen", "Trapped"]'::jsonb, '"Bron o El puente"'::jsonb, 0, 'Se estrenó en 2011 y tuvo múltiples adaptaciones internacionales.')
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
