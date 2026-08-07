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
('Geografía y territorio', 5, 'multiple_choice', 'standard', '¿Qué país sudamericano tiene la costa continental más larga sobre el océano Pacífico?', '["Chile", "Perú", "Colombia", "Ecuador"]'::jsonb, '"Chile"'::jsonb, 0, 'El litoral chileno se extiende a lo largo de más de 4.000 km.'),
    ('Naturaleza y ambiente', 1, 'multiple_choice', 'standard', '¿Cuál es el animal terrestre más alto del mundo?', '["La jirafa", "El elefante africano", "El alce", "El camello"]'::jsonb, '"La jirafa"'::jsonb, 0, 'Una jirafa adulta puede superar los cinco metros de altura.'),
    ('Naturaleza y ambiente', 1, 'multiple_choice', 'standard', '¿En qué parte de la célula vegetal ocurre la fotosíntesis?', '["En los cloroplastos", "En el núcleo", "En la mitocondria", "En la pared celular"]'::jsonb, '"En los cloroplastos"'::jsonb, 0, 'Los cloroplastos contienen la clorofila que capta la luz solar.'),
    ('Naturaleza y ambiente', 1, 'multiple_choice', 'true_false', 'La ballena azul es el animal más grande que ha existido en la Tierra.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Puede superar los 30 metros de longitud y las 150 toneladas.'),
    ('Naturaleza y ambiente', 1, 'multiple_choice', 'standard', '¿Qué insecto produce la miel?', '["Abeja", "Avispa", "Hormiga", "Mariposa"]'::jsonb, '"Abeja"'::jsonb, 0, 'Las abejas melíferas transforman el néctar en miel dentro de la colmena.'),
    ('Naturaleza y ambiente', 1, 'multiple_choice', 'elimination', '¿Cuál de estos animales NO es un mamífero?', '["Pingüino", "Delfín", "Murciélago", "Ballena"]'::jsonb, '"Pingüino"'::jsonb, 0, 'El pingüino es un ave marina no voladora.'),
    ('Naturaleza y ambiente', 1, 'multiple_choice', 'standard', '¿Qué etapa del ciclo de la mariposa ocurre dentro de la crisálida?', '["La pupa", "El huevo", "La larva", "El estado adulto"]'::jsonb, '"La pupa"'::jsonb, 0, 'Dentro de la crisálida el cuerpo de la oruga se reorganiza por completo.'),
    ('Naturaleza y ambiente', 1, 'multiple_choice', 'fill_blank', 'El árbol más alto del mundo pertenece a la especie ___ o secuoya roja.', '["Sequoia sempervirens", "Baobab", "Ceiba", "Eucalipto"]'::jsonb, '"Sequoia sempervirens"'::jsonb, 0, 'Algunos ejemplares en California superan los 115 metros.'),
    ('Naturaleza y ambiente', 1, 'multiple_choice', 'standard', '¿Qué animal es conocido como el rey de la selva?', '["León", "Tigre", "Leopardo", "Jaguar"]'::jsonb, '"León"'::jsonb, 0, 'Es un apodo cultural, aunque los leones habitan sabanas más que selvas.'),
    ('Naturaleza y ambiente', 1, 'multiple_choice', 'true_false', 'Los corales son animales, no plantas.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Los pólipos coralinos son animales que forman colonias calcáreas.'),
    ('Naturaleza y ambiente', 1, 'multiple_choice', 'standard', '¿Qué recurso natural se agota al talar bosques sin reponerlos?', '["La cobertura forestal", "El petróleo", "El carbón mineral", "El gas natural"]'::jsonb, '"La cobertura forestal"'::jsonb, 0, 'La deforestación reduce la capacidad del planeta de capturar carbono.'),
    ('Naturaleza y ambiente', 2, 'multiple_choice', 'standard', '¿Qué fenómeno climático periódico calienta las aguas del Pacífico ecuatorial?', '["El Niño", "El monzón", "El ciclón polar", "La corriente de Humboldt"]'::jsonb, '"El Niño"'::jsonb, 0, 'El Niño altera lluvias y temperaturas en gran parte del mundo.'),
    ('Naturaleza y ambiente', 2, 'multiple_choice', 'standard', '¿Qué capa de la atmósfera nos protege de la radiación ultravioleta?', '["Capa de ozono", "Troposfera", "Exosfera", "Ionosfera"]'::jsonb, '"Capa de ozono"'::jsonb, 0, 'El ozono estratosférico filtra buena parte de la radiación UV.'),
    ('Naturaleza y ambiente', 2, 'multiple_choice', 'standard', '¿Cuál es el ave más veloz del mundo en vuelo en picado?', '["Halcón peregrino", "Águila real", "Avestruz", "Colibrí"]'::jsonb, '"Halcón peregrino"'::jsonb, 0, 'El halcón peregrino supera los 300 km/h al lanzarse sobre su presa.'),
    ('Naturaleza y ambiente', 2, 'multiple_choice', 'elimination', '¿Cuál de estos NO es un gas de efecto invernadero?', '["Argón", "Dióxido de carbono", "Metano", "Óxido nitroso"]'::jsonb, '"Argón"'::jsonb, 0, 'El argón es un gas noble inerte y no atrapa calor.'),
    ('Naturaleza y ambiente', 2, 'multiple_choice', 'standard', '¿Qué bioma se caracteriza por musgos, líquenes y suelo permanentemente congelado?', '["Tundra", "Sabana", "Manglar", "Selva templada"]'::jsonb, '"Tundra"'::jsonb, 0, 'El permafrost define el subsuelo de la tundra ártica.'),
    ('Naturaleza y ambiente', 2, 'multiple_choice', 'true_false', 'Los tiburones son peces cartilaginosos y no tienen huesos.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Su esqueleto está formado por cartílago, más ligero que el hueso.'),
    ('Naturaleza y ambiente', 2, 'multiple_choice', 'standard', '¿Qué ecosistema costero actúa como barrera contra tormentas y cría de peces?', '["Manglar", "Páramo", "Estepa", "Taiga"]'::jsonb, '"Manglar"'::jsonb, 0, 'Las raíces de los mangles amortiguan el oleaje y refugian juveniles de muchas especies.'),
    ('Naturaleza y ambiente', 2, 'multiple_choice', 'fill_blank', 'El fenómeno por el que una especie desaparece por completo del planeta se llama ___.', '["extinción", "migración", "hibernación", "mutación"]'::jsonb, '"extinción"'::jsonb, 0, 'Una especie extinta ya no tiene individuos vivos en ningún lugar.'),
    ('Naturaleza y ambiente', 2, 'multiple_choice', 'standard', '¿Qué animal marino tiene ocho brazos y tres corazones?', '["Pulpo", "Calamar", "Medusa", "Estrella de mar"]'::jsonb, '"Pulpo"'::jsonb, 0, 'Dos corazones branquiales y uno sistémico bombean su sangre azulada.'),
    ('Naturaleza y ambiente', 2, 'ordering', NULL, 'Ordena estos niveles de organización biológica de menor a mayor.', '["Célula", "Tejido", "Órgano", "Organismo"]'::jsonb, '["Célula", "Tejido", "Órgano", "Organismo"]'::jsonb, NULL, 'Cada nivel integra estructuras del nivel anterior.'),
    ('Naturaleza y ambiente', 2, 'multiple_choice', 'standard', '¿Qué gran arrecife de coral es visible desde el espacio y está frente a Australia?', '["Gran Barrera de Coral", "Arrecife de Belice", "Arrecife de Tubbataha", "Atolón de Aldabra"]'::jsonb, '"Gran Barrera de Coral"'::jsonb, 0, 'Se extiende por más de 2.300 km frente a Queensland.'),
    ('Naturaleza y ambiente', 2, 'multiple_choice', 'standard', '¿Qué animal es el mamífero terrestre más rápido?', '["Guepardo", "Antílope", "Caballo", "Galgo"]'::jsonb, '"Guepardo"'::jsonb, 0, 'El guepardo alcanza cerca de 110 km/h en carreras cortas.'),
    ('Naturaleza y ambiente', 3, 'multiple_choice', 'standard', '¿Qué nombre recibe la relación en la que dos especies se benefician mutuamente?', '["Mutualismo", "Parasitismo", "Comensalismo", "Depredación"]'::jsonb, '"Mutualismo"'::jsonb, 0, 'En el mutualismo ambas partes obtienen ventaja, como abejas y flores.'),
    ('Naturaleza y ambiente', 3, 'multi_select', NULL, 'Selecciona los países considerados megadiversos por su riqueza biológica.', '["Colombia", "Brasil", "Indonesia", "Islandia", "Irlanda", "Bélgica"]'::jsonb, '["Colombia", "Brasil", "Indonesia"]'::jsonb, NULL, 'Los países megadiversos concentran la mayor parte de las especies del planeta.'),
    ('Naturaleza y ambiente', 3, 'multiple_choice', 'standard', '¿Qué ecosistema andino de alta montaña funciona como esponja que regula el agua?', '["Páramo", "Manglar", "Sabana inundable", "Bosque seco"]'::jsonb, '"Páramo"'::jsonb, 0, 'Los páramos captan humedad y alimentan los ríos de las ciudades andinas.'),
    ('Naturaleza y ambiente', 3, 'multiple_choice', 'standard', '¿Qué mamífero pone huevos?', '["Ornitorrinco", "Koala", "Perezoso", "Armadillo"]'::jsonb, '"Ornitorrinco"'::jsonb, 0, 'El ornitorrinco es un monotrema, mamífero ovíparo de Australia.'),
    ('Naturaleza y ambiente', 3, 'matching', NULL, 'Relaciona cada animal con su tipo de desplazamiento migratorio.', '{"left": ["Ballena jorobada", "Mariposa monarca", "Charrán ártico", "Ñu"], "right": ["Migración oceánica estacional", "Migración continental multigeneracional", "Migración de polo a polo", "Migración circular en sabana"]}'::jsonb, '{"Ballena jorobada": "Migración oceánica estacional", "Mariposa monarca": "Migración continental multigeneracional", "Charrán ártico": "Migración de polo a polo", "Ñu": "Migración circular en sabana"}'::jsonb, NULL, 'Cada especie recorre distancias enormes por razones de alimento o reproducción.'),
    ('Naturaleza y ambiente', 3, 'multiple_choice', 'true_false', 'El agua dulce representa menos del 3 por ciento del agua total del planeta.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Y la mayor parte de ese porcentaje está congelada en glaciares.'),
    ('Naturaleza y ambiente', 3, 'multiple_choice', 'standard', '¿Qué proceso libera dióxido de carbono cuando se quema madera o carbón?', '["Combustión", "Fotosíntesis", "Evaporación", "Condensación"]'::jsonb, '"Combustión"'::jsonb, 0, 'La combustión oxida el carbono almacenado y lo devuelve a la atmósfera.'),
    ('Naturaleza y ambiente', 3, 'multiple_choice', 'elimination', '¿Cuál de estas especies NO está clasificada como felino?', '["Hiena", "Serval", "Caracal", "Ocelote"]'::jsonb, '"Hiena"'::jsonb, 0, 'La hiena pertenece a una familia propia más cercana a las mangostas.'),
    ('Naturaleza y ambiente', 3, 'multiple_choice', 'standard', '¿Qué acuerdo internacional de 2015 fijó metas para limitar el calentamiento global?', '["Acuerdo de París", "Protocolo de Kioto", "Convenio de Basilea", "Tratado Antártico"]'::jsonb, '"Acuerdo de París"'::jsonb, 0, 'El Acuerdo de París busca contener el aumento por debajo de 2 grados.'),
    ('Naturaleza y ambiente', 3, 'multiple_choice', 'fill_blank', 'La pérdida de hábitat causada por la fragmentación de bosques se llama efecto de ___.', '["borde", "invernadero", "isla de calor", "marea roja"]'::jsonb, '"borde"'::jsonb, 0, 'El efecto de borde altera las condiciones internas de los fragmentos de bosque.'),
    ('Naturaleza y ambiente', 3, 'multiple_choice', 'standard', '¿Qué animal es el principal polinizador de la mayoría de cultivos alimentarios?', '["Las abejas", "Los colibríes", "Los murciélagos", "Las hormigas"]'::jsonb, '"Las abejas"'::jsonb, 0, 'La polinización por abejas sostiene buena parte de la producción agrícola mundial.'),
    ('Naturaleza y ambiente', 4, 'multiple_choice', 'standard', '¿Qué nombre recibe la extinción masiva ocurrida hace unos 66 millones de años?', '["Extinción Cretácico-Paleógeno", "Extinción del Pérmico", "Extinción del Ordovícico", "Extinción del Devónico"]'::jsonb, '"Extinción Cretácico-Paleógeno"'::jsonb, 0, 'Ese evento marcó el fin de los dinosaurios no avianos.'),
    ('Naturaleza y ambiente', 4, 'multiple_choice', 'standard', '¿Qué microorganismos fijan el nitrógeno atmosférico en las raíces de las leguminosas?', '["Bacterias del género Rhizobium", "Algas verdes", "Hongos micorrícicos", "Protozoos ciliados"]'::jsonb, '"Bacterias del género Rhizobium"'::jsonb, 0, 'Los rizobios convierten el nitrógeno del aire en formas asimilables.'),
    ('Naturaleza y ambiente', 4, 'multi_select', NULL, 'Selecciona los procesos que forman parte del ciclo del agua.', '["Evaporación", "Condensación", "Precipitación", "Fotólisis", "Nitrificación", "Sedimentación química"]'::jsonb, '["Evaporación", "Condensación", "Precipitación"]'::jsonb, NULL, 'Los tres primeros describen el movimiento del agua entre atmósfera y superficie.'),
    ('Naturaleza y ambiente', 4, 'multiple_choice', 'standard', '¿Cuál es el organismo vivo más grande del mundo conocido por su extensión?', '["Un hongo del género Armillaria", "La ballena azul", "La secuoya General Sherman", "Un arrecife de coral"]'::jsonb, '"Un hongo del género Armillaria"'::jsonb, 0, 'Un ejemplar de Armillaria en Oregón cubre varios kilómetros cuadrados.'),
    ('Naturaleza y ambiente', 4, 'multiple_choice', 'standard', '¿Qué fenómeno provoca la acidificación de los océanos?', '["La absorción de dióxido de carbono por el agua marina", "El vertido de plásticos", "La pesca de arrastre", "El deshielo de los polos"]'::jsonb, '"La absorción de dióxido de carbono por el agua marina"'::jsonb, 0, 'El CO2 disuelto forma ácido carbónico y baja el pH del mar.'),
    ('Naturaleza y ambiente', 4, 'ordering', NULL, 'Ordena estos niveles de la clasificación biológica del más amplio al más específico.', '["Reino", "Filo", "Clase", "Orden"]'::jsonb, '["Reino", "Filo", "Clase", "Orden"]'::jsonb, NULL, 'La jerarquía continúa con familia, género y especie.'),
    ('Naturaleza y ambiente', 4, 'multiple_choice', 'standard', '¿Qué se mide con el índice de biodiversidad de Shannon?', '["La diversidad de especies en una comunidad", "La temperatura del suelo", "El caudal de un río", "La densidad de la madera"]'::jsonb, '"La diversidad de especies en una comunidad"'::jsonb, 0, 'Combina riqueza de especies y equidad en su abundancia.'),
    ('Naturaleza y ambiente', 4, 'multiple_choice', 'true_false', 'La Amazonía produce la mayor parte del oxígeno del planeta.', '["Verdadero", "Falso"]'::jsonb, '"Falso"'::jsonb, 1, 'El fitoplancton oceánico aporta cerca de la mitad del oxígeno atmosférico.'),
    ('Naturaleza y ambiente', 4, 'multiple_choice', 'standard', '¿Qué categoría de la UICN indica que una especie está en riesgo extremo de desaparecer?', '["En Peligro Crítico", "Vulnerable", "Casi Amenazada", "Preocupación Menor"]'::jsonb, '"En Peligro Crítico"'::jsonb, 0, 'Es el nivel más alto de amenaza antes de la extinción en estado silvestre.'),
    ('Naturaleza y ambiente', 5, 'multiple_choice', 'standard', '¿Qué nombre recibe la zona del océano sin luz solar entre 1.000 y 4.000 metros de profundidad?', '["Zona batial o de medianoche", "Zona epipelágica", "Zona nerítica", "Zona intermareal"]'::jsonb, '"Zona batial o de medianoche"'::jsonb, 0, 'Por debajo de los 1.000 metros la luz solar es prácticamente nula.'),
    ('Naturaleza y ambiente', 5, 'multiple_choice', 'standard', '¿Qué proceso permite a algunas bacterias obtener energía sin luz en fuentes hidrotermales?', '["Quimiosíntesis", "Fotosíntesis", "Fermentación láctica", "Respiración anaerobia"]'::jsonb, '"Quimiosíntesis"'::jsonb, 0, 'La quimiosíntesis aprovecha compuestos como el sulfuro de hidrógeno.'),
    ('Naturaleza y ambiente', 5, 'matching', NULL, 'Relaciona cada ciclo biogeoquímico con un proceso clave.', '{"left": ["Ciclo del nitrógeno", "Ciclo del carbono", "Ciclo del fósforo", "Ciclo del azufre"], "right": ["Fijación bacteriana", "Fotosíntesis", "Meteorización de rocas", "Emisiones volcánicas"]}'::jsonb, '{"Ciclo del nitrógeno": "Fijación bacteriana", "Ciclo del carbono": "Fotosíntesis", "Ciclo del fósforo": "Meteorización de rocas", "Ciclo del azufre": "Emisiones volcánicas"}'::jsonb, NULL, 'Cada ciclo mueve un elemento entre la biosfera y el medio físico.'),
    ('Naturaleza y ambiente', 5, 'multiple_choice', 'standard', '¿Qué término describe una especie cuya desaparición desestabiliza todo su ecosistema?', '["Especie clave", "Especie endémica", "Especie invasora", "Especie pionera"]'::jsonb, '"Especie clave"'::jsonb, 0, 'El lobo en Yellowstone es el ejemplo más citado de especie clave.'),
    ('Naturaleza y ambiente', 5, 'multiple_choice', 'standard', '¿Qué gas de efecto invernadero tiene mayor potencial de calentamiento por molécula entre los citados?', '["Hexafluoruro de azufre", "Dióxido de carbono", "Metano", "Vapor de agua"]'::jsonb, '"Hexafluoruro de azufre"'::jsonb, 0, 'El SF6 tiene un potencial de calentamiento miles de veces superior al CO2.'),
    ('Naturaleza y ambiente', 5, 'multiple_choice', 'standard', '¿Qué se entiende por sucesión ecológica primaria?', '["La colonización de un terreno sin suelo previo", "La recuperación tras un incendio", "El reemplazo de una especie invasora", "La migración estacional de aves"]'::jsonb, '"La colonización de un terreno sin suelo previo"'::jsonb, 0, 'Ocurre sobre roca desnuda o lava reciente, sin suelo formado.'),
    ('Naturaleza y ambiente', 5, 'multiple_choice', 'true_false', 'El permafrost almacena más carbono que el que hay actualmente en la atmósfera.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Su deshielo es uno de los grandes puntos de inflexión climáticos.')
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
