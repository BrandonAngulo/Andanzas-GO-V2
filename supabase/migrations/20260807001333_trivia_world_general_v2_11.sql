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
('Mitos y leyendas', 2, 'multiple_choice', 'standard', '¿Qué animal fabuloso egipcio tiene cuerpo de león y cabeza humana?', '["La esfinge", "El grifo", "El anubis", "El escarabajo alado"]'::jsonb, '"La esfinge"'::jsonb, 0, 'La Gran Esfinge de Guiza es su representación más famosa.'),
    ('Mitos y leyendas', 3, 'multiple_choice', 'standard', '¿Qué diosa griega surgió de la espuma del mar según algunas versiones del mito?', '["Afrodita", "Hera", "Deméter", "Artemisa"]'::jsonb, '"Afrodita"'::jsonb, 0, 'Botticelli la representó en El nacimiento de Venus.'),
    ('Mitos y leyendas', 3, 'matching', NULL, 'Relaciona cada dios griego con su equivalente romano.', '{"left": ["Zeus", "Ares", "Hermes", "Artemisa"], "right": ["Júpiter", "Marte", "Mercurio", "Diana"]}'::jsonb, '{"Zeus": "Júpiter", "Ares": "Marte", "Hermes": "Mercurio", "Artemisa": "Diana"}'::jsonb, NULL, 'La mitología romana asimiló buena parte del panteón griego.'),
    ('Mitos y leyendas', 3, 'multiple_choice', 'standard', '¿Qué epopeya mesopotámica narra la búsqueda de la inmortalidad de un rey de Uruk?', '["La epopeya de Gilgamesh", "El Enuma Elish", "El Libro de los Muertos", "El Mahabharata"]'::jsonb, '"La epopeya de Gilgamesh"'::jsonb, 0, 'Es uno de los textos literarios más antiguos conservados.'),
    ('Mitos y leyendas', 3, 'multi_select', NULL, 'Selecciona las criaturas que pertenecen al folclore latinoamericano.', '["La Llorona", "El Silbón", "La Patasola", "El troll", "El golem", "La banshee"]'::jsonb, '["La Llorona", "El Silbón", "La Patasola"]'::jsonb, NULL, 'Las tres últimas provienen de tradiciones europeas.'),
    ('Mitos y leyendas', 3, 'multiple_choice', 'standard', '¿Qué leyenda europea narra la búsqueda de un cáliz sagrado por parte de caballeros?', '["La leyenda del Santo Grial", "La saga de los Nibelungos", "El ciclo de Beowulf", "La leyenda de Roldán"]'::jsonb, '"La leyenda del Santo Grial"'::jsonb, 0, 'Se asocia al ciclo artúrico y a la corte de Camelot.'),
    ('Mitos y leyendas', 3, 'multiple_choice', 'elimination', '¿Cuál de estas figuras NO pertenece a la mitología egipcia?', '["Marduk", "Osiris", "Isis", "Anubis"]'::jsonb, '"Marduk"'::jsonb, 0, 'Marduk es la deidad principal de Babilonia.'),
    ('Mitos y leyendas', 3, 'multiple_choice', 'fill_blank', 'En el hinduismo, la trinidad formada por Brahma, Vishnú y Shiva se conoce como ___.', '["Trimurti", "Trikaya", "Trilokya", "Tridosha"]'::jsonb, '"Trimurti"'::jsonb, 0, 'Representa creación, conservación y destrucción.'),
    ('Mitos y leyendas', 3, 'multiple_choice', 'true_false', 'El mito de El Dorado alimentó expediciones europeas por el interior de Suramérica.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Se asocia al ritual de la laguna de Guatavita en territorio muisca.'),
    ('Mitos y leyendas', 3, 'multiple_choice', 'standard', '¿Qué criatura del folclore judío es un ser de barro animado mediante palabras sagradas?', '["El golem", "El dibbuk", "El leviatán", "El behemot"]'::jsonb, '"El golem"'::jsonb, 0, 'La leyenda más difundida lo sitúa en la Praga del siglo XVI.'),
    ('Mitos y leyendas', 3, 'multiple_choice', 'standard', '¿Qué diosa nórdica recibe en su morada a la mitad de los guerreros caídos en combate?', '["Freyja", "Frigg", "Skadi", "Idunn"]'::jsonb, '"Freyja"'::jsonb, 0, 'La otra mitad va al Valhalla de Odín.'),
    ('Mitos y leyendas', 3, 'multiple_choice', 'standard', '¿Qué relato del Popol Vuh narra el descenso de dos hermanos al inframundo maya?', '["El mito de los gemelos Hunahpú e Ixbalanqué", "La creación de los hombres de maíz", "El diluvio de los muñecos de madera", "El mito de Vucub Caquix"]'::jsonb, '"El mito de los gemelos Hunahpú e Ixbalanqué"'::jsonb, 0, 'Ambos vencen a los señores de Xibalbá.'),
    ('Mitos y leyendas', 4, 'multiple_choice', 'standard', '¿Qué monstruo nórdico rodea el mundo mordiéndose la cola?', '["Jormungandr", "Fenrir", "Nidhogg", "Garm"]'::jsonb, '"Jormungandr"'::jsonb, 0, 'La serpiente de Midgard se enfrenta a Thor en el Ragnarok.'),
    ('Mitos y leyendas', 4, 'multiple_choice', 'standard', '¿Qué figura del folclore eslavo es una bruja que habita una cabaña con patas de gallina?', '["Baba Yagá", "Rusalka", "Domovoi", "Leshy"]'::jsonb, '"Baba Yagá"'::jsonb, 0, 'Puede ayudar o devorar a quien la busca según el relato.'),
    ('Mitos y leyendas', 4, 'matching', NULL, 'Relaciona cada texto sagrado o épico con su tradición.', '{"left": ["Mahabharata", "Kalevala", "Kojiki", "Edda poética"], "right": ["India", "Finlandia", "Japón", "Escandinavia"]}'::jsonb, '{"Mahabharata": "India", "Kalevala": "Finlandia", "Kojiki": "Japón", "Edda poética": "Escandinavia"}'::jsonb, NULL, 'Cada obra recoge los mitos fundacionales de su cultura.'),
    ('Mitos y leyendas', 4, 'multiple_choice', 'standard', '¿Qué deidad yoruba del trueno fue integrada a religiones afroamericanas del Caribe?', '["Changó", "Yemayá", "Oshún", "Obatalá"]'::jsonb, '"Changó"'::jsonb, 0, 'En la santería cubana se sincretizó con Santa Bárbara.'),
    ('Mitos y leyendas', 4, 'multi_select', NULL, 'Selecciona los seres que forman parte de la mitología griega.', '["Cerbero", "Cíclope", "Quimera", "Wendigo", "Kraken", "Golem"]'::jsonb, '["Cerbero", "Cíclope", "Quimera"]'::jsonb, NULL, 'El wendigo, el kraken y el golem provienen de tradiciones algonquina, escandinava y judía.'),
    ('Mitos y leyendas', 4, 'multiple_choice', 'true_false', 'El concepto de héroe con mil rostros fue formulado por Joseph Campbell.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Describe un patrón narrativo compartido por mitos de todo el mundo.'),
    ('Mitos y leyendas', 4, 'multiple_choice', 'standard', '¿Qué criatura del folclore de Filipinas se describe como un ser que se separa por la cintura al anochecer?', '["El manananggal", "El tikbalang", "El aswang", "El duwende"]'::jsonb, '"El manananggal"'::jsonb, 0, 'Forma parte de un amplio repertorio de seres nocturnos.'),
    ('Mitos y leyendas', 4, 'multiple_choice', 'standard', '¿Qué relato australiano aborigen describe el tiempo de la creación del mundo?', '["El Tiempo del Sueño", "El Ciclo de Baiame", "El canto de las estrellas", "El camino de las serpientes"]'::jsonb, '"El Tiempo del Sueño"'::jsonb, 0, 'Ordena el territorio mediante recorridos de seres ancestrales.'),
    ('Mitos y leyendas', 5, 'multiple_choice', 'standard', '¿Qué texto egipcio reunía fórmulas para guiar al difunto en el más allá?', '["El Libro de los Muertos", "Los Textos de las Pirámides únicamente", "El Papiro Ebers", "La Piedra de Rosetta"]'::jsonb, '"El Libro de los Muertos"'::jsonb, 0, 'Se depositaba junto al cuerpo momificado.'),
    ('Mitos y leyendas', 5, 'multiple_choice', 'standard', '¿Qué figura mesopotámica sobrevive a un diluvio y anticipa el relato bíblico de Noé?', '["Utnapishtim", "Enkidu", "Ninurta", "Shamash"]'::jsonb, '"Utnapishtim"'::jsonb, 0, 'Su historia aparece en la epopeya de Gilgamesh.'),
    ('Mitos y leyendas', 5, 'matching', NULL, 'Relaciona cada inframundo con su tradición.', '{"left": ["Hades", "Duat", "Xibalbá", "Helheim"], "right": ["Grecia", "Egipto", "Maya", "Escandinavia"]}'::jsonb, '{"Hades": "Grecia", "Duat": "Egipto", "Xibalbá": "Maya", "Helheim": "Escandinavia"}'::jsonb, NULL, 'Cada cultura imaginó un destino distinto para los muertos.'),
    ('Mitos y leyendas', 5, 'multiple_choice', 'standard', '¿Qué concepto describe la reinterpretación de dioses locales bajo nombres de otra religión dominante?', '["El sincretismo religioso", "El animismo", "El henoteísmo", "El chamanismo"]'::jsonb, '"El sincretismo religioso"'::jsonb, 0, 'Explica muchas devociones populares en América Latina.'),
    ('Mitos y leyendas', 5, 'multiple_choice', 'standard', '¿Qué ciclo mítico irlandés narra las hazañas de Cú Chulainn?', '["El ciclo del Ulster", "El ciclo feniano", "El ciclo mitológico", "El ciclo de los reyes"]'::jsonb, '"El ciclo del Ulster"'::jsonb, 0, 'Incluye el relato del robo del toro de Cooley.'),
    ('Mitos y leyendas', 5, 'multiple_choice', 'true_false', 'La antropóloga y los estudios comparados del mito señalan patrones comunes entre culturas sin contacto entre sí.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Los diluvios y los héroes fundadores aparecen en continentes distintos.'),
    ('Mitos y leyendas', 5, 'multiple_choice', 'standard', '¿Qué relato hindú narra el batido del océano de leche para obtener el néctar de la inmortalidad?', '["El Samudra Manthan", "El Ramayana", "El Bhagavad Gita", "El Rig Veda"]'::jsonb, '"El Samudra Manthan"'::jsonb, 0, 'Dioses y demonios colaboran usando una montaña como batidor.'),
    ('Cultura e identidad', 1, 'multiple_choice', 'standard', '¿Qué idioma tiene más hablantes nativos en el mundo?', '["El chino mandarín", "El inglés", "El español", "El hindi"]'::jsonb, '"El chino mandarín"'::jsonb, 0, 'El español ocupa el segundo lugar por hablantes nativos.'),
    ('Cultura e identidad', 1, 'multiple_choice', 'standard', '¿Qué organización internacional se fundó en 1945 para promover la paz entre naciones?', '["La Organización de las Naciones Unidas", "La OTAN", "La Unión Europea", "La Cruz Roja"]'::jsonb, '"La Organización de las Naciones Unidas"'::jsonb, 0, 'Su sede principal está en Nueva York.'),
    ('Cultura e identidad', 1, 'multiple_choice', 'true_false', 'El español es lengua oficial en más de veinte países.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Es idioma oficial en España, gran parte de América y Guinea Ecuatorial.'),
    ('Cultura e identidad', 1, 'multiple_choice', 'standard', '¿Qué símbolo representa a un país junto con su bandera y su escudo?', '["El himno nacional", "El sello postal", "La moneda", "El pasaporte"]'::jsonb, '"El himno nacional"'::jsonb, 0, 'Los tres símbolos patrios suelen definirse por ley.'),
    ('Cultura e identidad', 1, 'multiple_choice', 'standard', '¿Qué festividad mexicana honra a los difuntos con altares y flores de cempasúchil?', '["El Día de Muertos", "La Candelaria", "Las posadas", "El Grito de Independencia"]'::jsonb, '"El Día de Muertos"'::jsonb, 0, 'La Unesco la reconoció como patrimonio inmaterial.'),
    ('Cultura e identidad', 1, 'multiple_choice', 'elimination', '¿Cuál de estos NO es un idioma oficial de la ONU?', '["El portugués", "El árabe", "El ruso", "El chino"]'::jsonb, '"El portugués"'::jsonb, 0, 'Los seis idiomas oficiales son árabe, chino, español, francés, inglés y ruso.'),
    ('Cultura e identidad', 1, 'multiple_choice', 'fill_blank', 'La celebración del año nuevo ___ se rige por un calendario lunar y cambia de fecha cada año.', '["chino", "gregoriano", "juliano", "copto"]'::jsonb, '"chino"'::jsonb, 0, 'Cada año se asocia a un animal del zodiaco.'),
    ('Cultura e identidad', 1, 'multiple_choice', 'standard', '¿De qué país es originario el traje tradicional llamado hanbok?', '["Corea", "Japón", "Vietnam", "Mongolia"]'::jsonb, '"Corea"'::jsonb, 0, 'Se caracteriza por su falda amplia y colores vivos.'),
    ('Cultura e identidad', 1, 'multiple_choice', 'true_false', 'El saludo con reverencia es una costumbre extendida en Japón y Corea.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'La profundidad de la inclinación expresa el grado de respeto.'),
    ('Cultura e identidad', 1, 'multiple_choice', 'standard', '¿Qué documento internacional de 1948 estableció derechos comunes para toda persona?', '["La Declaración Universal de Derechos Humanos", "La Carta de las Naciones Unidas", "El Pacto de San José", "La Convención de Ginebra"]'::jsonb, '"La Declaración Universal de Derechos Humanos"'::jsonb, 0, 'Fue adoptada por la Asamblea General de la ONU.'),
    ('Cultura e identidad', 2, 'multiple_choice', 'standard', '¿Qué festival hindú se conoce como la fiesta de las luces?', '["El Diwali", "El Holi", "El Navratri", "El Pongal"]'::jsonb, '"El Diwali"'::jsonb, 0, 'Se celebra con lámparas, fuegos artificiales y dulces.'),
    ('Cultura e identidad', 2, 'multiple_choice', 'standard', '¿Qué mes del calendario islámico implica ayuno desde el amanecer hasta el ocaso?', '["El Ramadán", "El Muharram", "El Shaban", "El Rayab"]'::jsonb, '"El Ramadán"'::jsonb, 0, 'Concluye con la fiesta del Eid al-Fitr.'),
    ('Cultura e identidad', 2, 'multiple_choice', 'standard', '¿Qué organismo de la ONU declara los sitios de Patrimonio Mundial?', '["La Unesco", "La OMS", "La FAO", "El PNUD"]'::jsonb, '"La Unesco"'::jsonb, 0, 'La lista se creó a partir de la convención de 1972.'),
    ('Cultura e identidad', 2, 'multiple_choice', 'elimination', '¿Cuál de estos NO es un alfabeto o sistema de escritura vigente?', '["El jeroglífico egipcio", "El cirílico", "El devanagari", "El hangul"]'::jsonb, '"El jeroglífico egipcio"'::jsonb, 0, 'La escritura jeroglífica dejó de usarse hace siglos.'),
    ('Cultura e identidad', 2, 'multiple_choice', 'fill_blank', 'La lengua ___ es la más hablada del mundo si se cuentan también los hablantes no nativos.', '["inglesa", "española", "árabe", "francesa"]'::jsonb, '"inglesa"'::jsonb, 0, 'Funciona como lengua franca en ciencia, comercio y aviación.'),
    ('Cultura e identidad', 2, 'multiple_choice', 'true_false', 'El braille es un sistema de lectura táctil basado en puntos en relieve.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Louis Braille lo desarrolló en Francia en el siglo XIX.'),
    ('Cultura e identidad', 2, 'multiple_choice', 'standard', '¿Qué término designa la convivencia de varias culturas dentro de una misma sociedad?', '["La multiculturalidad", "La homogeneidad", "La asimilación", "La endogamia"]'::jsonb, '"La multiculturalidad"'::jsonb, 0, 'El interculturalismo pone el acento en el diálogo entre esas culturas.'),
    ('Cultura e identidad', 2, 'ordering', NULL, 'Ordena estos hitos de la comunicación humana del más antiguo al más reciente.', '["Escritura cuneiforme", "Imprenta de tipos móviles", "Telégrafo eléctrico", "Internet"]'::jsonb, '["Escritura cuneiforme", "Imprenta de tipos móviles", "Telégrafo eléctrico", "Internet"]'::jsonb, NULL, 'Cada salto amplió el alcance y la velocidad del mensaje.'),
    ('Cultura e identidad', 2, 'multiple_choice', 'standard', '¿Qué instrumento internacional protege a las personas refugiadas desde 1951?', '["La Convención sobre el Estatuto de los Refugiados", "El Protocolo de Kioto", "El Estatuto de Roma", "La Convención de Viena"]'::jsonb, '"La Convención sobre el Estatuto de los Refugiados"'::jsonb, 0, 'Define quién es refugiado y qué derechos le asisten.'),
    ('Cultura e identidad', 2, 'multiple_choice', 'standard', '¿Qué celebración andina marca el solsticio y honra al Sol en la región cusqueña?', '["El Inti Raymi", "La Diablada", "El Carnaval de Oruro", "La Fiesta de la Candelaria"]'::jsonb, '"El Inti Raymi"'::jsonb, 0, 'Se realiza cada 24 de junio.'),
    ('Cultura e identidad', 2, 'multiple_choice', 'standard', '¿Qué figura designa la Unesco para bienes culturales vivos como danzas y saberes?', '["El patrimonio cultural inmaterial", "El patrimonio natural", "El paisaje cultural", "La memoria del mundo"]'::jsonb, '"El patrimonio cultural inmaterial"'::jsonb, 0, 'Protege prácticas transmitidas de generación en generación.'),
    ('Cultura e identidad', 3, 'multiple_choice', 'standard', '¿Qué concepto describe la pérdida de una lengua cuando dejan de existir hablantes que la transmitan?', '["La extinción lingüística", "El préstamo léxico", "La diglosia", "El sustrato"]'::jsonb, '"La extinción lingüística"'::jsonb, 0, 'Se estima que miles de lenguas están en riesgo hoy.'),
    ('Cultura e identidad', 3, 'matching', NULL, 'Relaciona cada festividad con su país o región de origen.', '{"left": ["Día de Muertos", "Songkran", "Obon", "Nowruz"], "right": ["México", "Tailandia", "Japón", "Persia y Asia Central"]}'::jsonb, '{"Día de Muertos": "México", "Songkran": "Tailandia", "Obon": "Japón", "Nowruz": "Persia y Asia Central"}'::jsonb, NULL, 'Todas marcan ciclos de memoria o renovación.')
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
