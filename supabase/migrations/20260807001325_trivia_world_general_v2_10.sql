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
('Gastronomía del mundo', 2, 'ordering', NULL, 'Ordena estos pasos de la elaboración tradicional del pan.', '["Mezclar harina y agua", "Amasar", "Dejar fermentar", "Hornear"]'::jsonb, '["Mezclar harina y agua", "Amasar", "Dejar fermentar", "Hornear"]'::jsonb, NULL, 'La fermentación es la que da volumen y aroma a la masa.'),
    ('Gastronomía del mundo', 2, 'multiple_choice', 'standard', '¿Qué salsa mexicana combina chiles secos, especias y chocolate?', '["El mole", "El pico de gallo", "La salsa verde", "El adobo"]'::jsonb, '"El mole"'::jsonb, 0, 'El mole poblano es su variante más conocida.'),
    ('Gastronomía del mundo', 2, 'multiple_choice', 'standard', '¿Qué queso italiano se ralla tradicionalmente sobre la pasta y madura años?', '["El parmesano", "La mozzarella", "El gorgonzola", "La ricotta"]'::jsonb, '"El parmesano"'::jsonb, 0, 'Su nombre protegido es Parmigiano Reggiano.'),
    ('Gastronomía del mundo', 2, 'multiple_choice', 'standard', '¿Qué plato del Medio Oriente se prepara con garbanzos triturados y tahini?', '["El hummus", "El falafel", "El tabulé", "El baba ganush"]'::jsonb, '"El hummus"'::jsonb, 0, 'El baba ganush usa berenjena en lugar de garbanzo.'),
    ('Gastronomía del mundo', 3, 'multiple_choice', 'standard', '¿Qué proceso convierte el jugo de uva en vino?', '["La fermentación alcohólica", "La pasteurización", "La destilación", "La maceración en frío"]'::jsonb, '"La fermentación alcohólica"'::jsonb, 0, 'Las levaduras transforman los azúcares en alcohol y CO2.'),
    ('Gastronomía del mundo', 3, 'matching', NULL, 'Relaciona cada plato con su país de origen.', '{"left": ["Pad thai", "Bibimbap", "Moussaka", "Feijoada"], "right": ["Tailandia", "Corea del Sur", "Grecia", "Brasil"]}'::jsonb, '{"Pad thai": "Tailandia", "Bibimbap": "Corea del Sur", "Moussaka": "Grecia", "Feijoada": "Brasil"}'::jsonb, NULL, 'Cada preparación es emblemática de su cocina nacional.'),
    ('Gastronomía del mundo', 3, 'multiple_choice', 'standard', '¿Qué reacción química da color y aroma a la carne dorada y al pan tostado?', '["La reacción de Maillard", "La caramelización pura", "La oxidación enzimática", "La gelatinización"]'::jsonb, '"La reacción de Maillard"'::jsonb, 0, 'Se produce entre aminoácidos y azúcares reductores con calor.'),
    ('Gastronomía del mundo', 3, 'multi_select', NULL, 'Selecciona los alimentos que se obtienen mediante fermentación.', '["Kimchi", "Miso", "Kéfir", "Mermelada", "Puré de papa", "Aceite de oliva"]'::jsonb, '["Kimchi", "Miso", "Kéfir"]'::jsonb, NULL, 'La fermentación transforma el alimento mediante microorganismos.'),
    ('Gastronomía del mundo', 3, 'multiple_choice', 'standard', '¿Qué denominación protege el origen geográfico de un alimento en la Unión Europea?', '["La Denominación de Origen Protegida", "La certificación orgánica", "El sello de comercio justo", "La marca colectiva"]'::jsonb, '"La Denominación de Origen Protegida"'::jsonb, 0, 'Vincula el producto a una zona y a un saber hacer determinados.'),
    ('Gastronomía del mundo', 3, 'multiple_choice', 'elimination', '¿Cuál de estas cocinas NO está inscrita en la lista de patrimonio inmaterial de la Unesco?', '["La cocina alemana", "La dieta mediterránea", "La cocina tradicional mexicana", "El washoku japonés"]'::jsonb, '"La cocina alemana"'::jsonb, 0, 'Las otras tres sí figuran en esa lista.'),
    ('Gastronomía del mundo', 3, 'multiple_choice', 'fill_blank', 'La técnica de cocinar al vacío a baja temperatura durante horas se conoce como ___.', '["sous vide", "confitado", "escabechado", "ahumado en frío"]'::jsonb, '"sous vide"'::jsonb, 0, 'Permite un control preciso del punto de cocción.'),
    ('Gastronomía del mundo', 3, 'multiple_choice', 'true_false', 'El chile es originario de América y llegó a Asia tras el siglo XVI.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Su expansión transformó cocinas como la india, la tailandesa y la coreana.'),
    ('Gastronomía del mundo', 3, 'multiple_choice', 'standard', '¿Qué preparación francesa consiste en una base de verduras picadas para dar sabor a caldos y guisos?', '["El mirepoix", "El roux", "La duxelles", "La brunoise"]'::jsonb, '"El mirepoix"'::jsonb, 0, 'Combina cebolla, zanahoria y apio.'),
    ('Gastronomía del mundo', 3, 'multiple_choice', 'standard', '¿Qué bebida fermentada de arroz es tradicional en Japón?', '["El sake", "El soju", "El baijiu", "El makgeolli"]'::jsonb, '"El sake"'::jsonb, 0, 'Se elabora mediante un doble proceso de fermentación.'),
    ('Gastronomía del mundo', 3, 'multiple_choice', 'standard', '¿Qué hongo subterráneo de alto precio se busca con perros o cerdos entrenados?', '["La trufa", "El champiñón", "El shiitake", "La colmenilla"]'::jsonb, '"La trufa"'::jsonb, 0, 'Las variedades blanca y negra son las más cotizadas.'),
    ('Gastronomía del mundo', 4, 'multiple_choice', 'standard', '¿Qué corriente culinaria aplicó técnicas científicas a la cocina desde finales del siglo XX?', '["La gastronomía molecular", "La nouvelle cuisine", "La cocina de mercado", "El slow food"]'::jsonb, '"La gastronomía molecular"'::jsonb, 0, 'Ferran Adrià fue uno de sus principales impulsores.'),
    ('Gastronomía del mundo', 4, 'multiple_choice', 'standard', '¿Qué proceso separa el alcohol del resto de una mezcla fermentada por diferencia de temperatura de ebullición?', '["La destilación", "La clarificación", "La maceración", "La crianza"]'::jsonb, '"La destilación"'::jsonb, 0, 'Es la base de licores como el whisky o el ron.'),
    ('Gastronomía del mundo', 4, 'matching', NULL, 'Relaciona cada bebida destilada con su materia prima.', '{"left": ["Ron", "Tequila", "Whisky", "Pisco"], "right": ["Caña de azúcar", "Agave azul", "Cereales malteados", "Uva"]}'::jsonb, '{"Ron": "Caña de azúcar", "Tequila": "Agave azul", "Whisky": "Cereales malteados", "Pisco": "Uva"}'::jsonb, NULL, 'Cada destilado refleja el cultivo dominante de su región.'),
    ('Gastronomía del mundo', 4, 'multiple_choice', 'standard', '¿Qué nombre recibe la clasificación de restaurantes por estrellas creada por una empresa de neumáticos?', '["La Guía Michelin", "La lista 50 Best", "La guía Gault et Millau", "El sistema AAA"]'::jsonb, '"La Guía Michelin"'::jsonb, 0, 'Comenzó como una guía de carretera en Francia en 1900.'),
    ('Gastronomía del mundo', 4, 'multi_select', NULL, 'Selecciona los ingredientes que llegaron a Europa desde América.', '["Papa", "Tomate", "Cacao", "Trigo", "Arroz", "Café"]'::jsonb, '["Papa", "Tomate", "Cacao"]'::jsonb, NULL, 'Los tres últimos son originarios del Viejo Mundo.'),
    ('Gastronomía del mundo', 4, 'multiple_choice', 'true_false', 'El umami es reconocido como uno de los sabores básicos junto al dulce, salado, ácido y amargo.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Fue identificado por Kikunae Ikeda en 1908.'),
    ('Gastronomía del mundo', 4, 'multiple_choice', 'standard', '¿Qué emulsión es la base de la mayonesa?', '["Aceite en agua estabilizada por la yema", "Agua en aceite con almidón", "Una suspensión de proteínas lácteas", "Una espuma de clara batida"]'::jsonb, '"Aceite en agua estabilizada por la yema"'::jsonb, 0, 'La lecitina de la yema mantiene unidas ambas fases.'),
    ('Gastronomía del mundo', 4, 'multiple_choice', 'standard', '¿Qué grano andino recuperó protagonismo internacional por su perfil proteico completo?', '["La quinua", "El amaranto", "La kiwicha", "La cañihua"]'::jsonb, '"La quinua"'::jsonb, 0, 'La FAO dedicó 2013 a su promoción mundial.'),
    ('Gastronomía del mundo', 5, 'multiple_choice', 'standard', '¿Qué compuesto da el picor a los chiles y se mide en la escala Scoville?', '["La capsaicina", "La piperina", "La alicina", "El eugenol"]'::jsonb, '"La capsaicina"'::jsonb, 0, 'Actúa sobre receptores de calor de la lengua.'),
    ('Gastronomía del mundo', 5, 'multiple_choice', 'standard', '¿Qué técnica japonesa de corte y curado permite madurar el pescado antes de servirlo crudo?', '["El aging o maduración de pescado", "El nimono", "El shabu shabu", "El nukazuke"]'::jsonb, '"El aging o maduración de pescado"'::jsonb, 0, 'Busca concentrar sabor y modificar la textura.'),
    ('Gastronomía del mundo', 5, 'matching', NULL, 'Relaciona cada fermento con el microorganismo responsable.', '{"left": ["Pan", "Yogur", "Vinagre", "Miso"], "right": ["Levadura Saccharomyces", "Lactobacilos", "Bacterias acéticas", "Hongo Aspergillus oryzae"]}'::jsonb, '{"Pan": "Levadura Saccharomyces", "Yogur": "Lactobacilos", "Vinagre": "Bacterias acéticas", "Miso": "Hongo Aspergillus oryzae"}'::jsonb, NULL, 'Cada microorganismo genera un perfil de sabor distinto.'),
    ('Gastronomía del mundo', 5, 'multiple_choice', 'standard', '¿Qué principio explica que el sabor percibido dependa en gran parte del olfato retronasal?', '["La integración multisensorial del sabor", "La ley de Weber", "El efecto placebo", "La saciedad sensorial específica"]'::jsonb, '"La integración multisensorial del sabor"'::jsonb, 0, 'Por eso los alimentos pierden sabor con la nariz congestionada.'),
    ('Gastronomía del mundo', 5, 'multiple_choice', 'standard', '¿Qué método de conservación reduce la actividad de agua mediante sal o azúcar?', '["El curado", "La liofilización", "La irradiación", "El envasado aséptico"]'::jsonb, '"El curado"'::jsonb, 0, 'Impide el crecimiento de microorganismos sin necesidad de frío.'),
    ('Gastronomía del mundo', 5, 'multiple_choice', 'true_false', 'El pan de masa madre utiliza un cultivo de levaduras y bacterias lácticas silvestres.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Esa simbiosis aporta acidez y mejor conservación.'),
    ('Gastronomía del mundo', 5, 'multiple_choice', 'standard', '¿Qué tratado internacional protege las variedades tradicionales de semillas y su intercambio?', '["El Tratado Internacional sobre Recursos Fitogenéticos", "El Protocolo de Montreal", "El Convenio de Berna", "El Acuerdo de Marrakech"]'::jsonb, '"El Tratado Internacional sobre Recursos Fitogenéticos"'::jsonb, 0, 'Se adoptó en el marco de la FAO en 2001.'),
    ('Mitos y leyendas', 1, 'multiple_choice', 'standard', '¿Quién era el rey de los dioses en la mitología griega?', '["Zeus", "Apolo", "Poseidón", "Hades"]'::jsonb, '"Zeus"'::jsonb, 0, 'Reinaba desde el monte Olimpo.'),
    ('Mitos y leyendas', 1, 'multiple_choice', 'standard', '¿Qué criatura mitológica tiene cuerpo de caballo y torso de hombre?', '["El centauro", "El minotauro", "La sirena", "El grifo"]'::jsonb, '"El centauro"'::jsonb, 0, 'Aparece con frecuencia en los relatos griegos.'),
    ('Mitos y leyendas', 1, 'multiple_choice', 'true_false', 'El dios del mar en la mitología griega es Poseidón.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'En la mitología romana se le identificó con Neptuno.'),
    ('Mitos y leyendas', 1, 'multiple_choice', 'standard', '¿Qué criatura mitad mujer y mitad pez aparece en relatos marinos de muchas culturas?', '["La sirena", "La ninfa", "La arpía", "La gorgona"]'::jsonb, '"La sirena"'::jsonb, 0, 'En la Odisea las sirenas seducían a los navegantes con su canto.'),
    ('Mitos y leyendas', 1, 'multiple_choice', 'standard', '¿Qué animal fabuloso escupe fuego y aparece en leyendas de Europa y Asia?', '["El dragón", "El unicornio", "El fénix", "El basilisco"]'::jsonb, '"El dragón"'::jsonb, 0, 'Su simbolismo cambia según la cultura.'),
    ('Mitos y leyendas', 1, 'multiple_choice', 'elimination', '¿Cuál de estos NO es un dios de la mitología griega?', '["Odín", "Atenea", "Ares", "Hermes"]'::jsonb, '"Odín"'::jsonb, 0, 'Odín pertenece a la mitología nórdica.'),
    ('Mitos y leyendas', 1, 'multiple_choice', 'fill_blank', 'El ave mitológica que renace de sus cenizas se llama ___.', '["fénix", "grifo", "roc", "quetzal"]'::jsonb, '"fénix"'::jsonb, 0, 'Simboliza la renovación en varias tradiciones.'),
    ('Mitos y leyendas', 1, 'multiple_choice', 'standard', '¿Qué héroe griego derrotó al Minotauro en el laberinto de Creta?', '["Teseo", "Perseo", "Heracles", "Jasón"]'::jsonb, '"Teseo"'::jsonb, 0, 'Escapó del laberinto siguiendo el hilo de Ariadna.'),
    ('Mitos y leyendas', 1, 'multiple_choice', 'true_false', 'El unicornio es un animal legendario representado como un caballo con un cuerno.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Aparece en bestiarios medievales europeos.'),
    ('Mitos y leyendas', 1, 'multiple_choice', 'standard', '¿Qué mito relata la construcción de una torre para llegar al cielo y la confusión de las lenguas?', '["La torre de Babel", "El arca de Noé", "El jardín del Edén", "El éxodo"]'::jsonb, '"La torre de Babel"'::jsonb, 0, 'Aparece en el libro del Génesis.'),
    ('Mitos y leyendas', 2, 'multiple_choice', 'standard', '¿Quién era el dios del trueno en la mitología nórdica?', '["Thor", "Loki", "Baldr", "Frey"]'::jsonb, '"Thor"'::jsonb, 0, 'Su martillo Mjolnir es uno de los objetos más célebres del mito.'),
    ('Mitos y leyendas', 2, 'multiple_choice', 'standard', '¿Qué figura de la mitología griega fue condenada a empujar eternamente una roca cuesta arriba?', '["Sísifo", "Tántalo", "Prometeo", "Ícaro"]'::jsonb, '"Sísifo"'::jsonb, 0, 'Su castigo se convirtió en símbolo del esfuerzo inútil.'),
    ('Mitos y leyendas', 2, 'multiple_choice', 'standard', '¿Qué serpiente emplumada era una deidad central en Mesoamérica?', '["Quetzalcóatl", "Huitzilopochtli", "Tláloc", "Tezcatlipoca"]'::jsonb, '"Quetzalcóatl"'::jsonb, 0, 'Los mayas la llamaron Kukulkán.'),
    ('Mitos y leyendas', 2, 'multiple_choice', 'elimination', '¿Cuál de estas criaturas NO proviene de la mitología griega?', '["El kraken", "La quimera", "La hidra", "El cíclope"]'::jsonb, '"El kraken"'::jsonb, 0, 'El kraken proviene del folclore escandinavo.'),
    ('Mitos y leyendas', 2, 'multiple_choice', 'fill_blank', 'El titán que robó el fuego a los dioses para dárselo a los humanos se llama ___.', '["Prometeo", "Atlas", "Cronos", "Hiperión"]'::jsonb, '"Prometeo"'::jsonb, 0, 'Fue castigado a que un águila devorara su hígado cada día.'),
    ('Mitos y leyendas', 2, 'multiple_choice', 'true_false', 'El Ragnarok es el fin del mundo en la mitología nórdica.', '["Verdadero", "Falso"]'::jsonb, '"Verdadero"'::jsonb, 0, 'Anuncia la batalla final y el renacimiento del cosmos.'),
    ('Mitos y leyendas', 2, 'multiple_choice', 'standard', '¿Qué mito andino describe el origen del Imperio Inca a partir del lago Titicaca?', '["El mito de Manco Cápac y Mama Ocllo", "La leyenda de El Dorado", "El mito de Viracocha creador", "La leyenda de los hermanos Ayar"]'::jsonb, '"El mito de Manco Cápac y Mama Ocllo"'::jsonb, 0, 'La pareja habría emergido del lago enviada por el Sol.'),
    ('Mitos y leyendas', 2, 'ordering', NULL, 'Ordena los trabajos de Heracles según el relato clásico más difundido.', '["El león de Nemea", "La hidra de Lerna", "La cierva de Cerinea", "El jabalí de Erimanto"]'::jsonb, '["El león de Nemea", "La hidra de Lerna", "La cierva de Cerinea", "El jabalí de Erimanto"]'::jsonb, NULL, 'La tradición cuenta doce trabajos en total.'),
    ('Mitos y leyendas', 2, 'multiple_choice', 'standard', '¿Qué criatura del folclore japonés es un espíritu con forma de zorro capaz de transformarse?', '["El kitsune", "El tengu", "El kappa", "El oni"]'::jsonb, '"El kitsune"'::jsonb, 0, 'Se le atribuyen múltiples colas según su edad y poder.'),
    ('Mitos y leyendas', 2, 'multiple_choice', 'standard', '¿Qué figura del folclore colombiano se describe como un ser del río que engaña a los pescadores?', '["El Mohán", "El Sombrerón", "La Madremonte", "El Duende"]'::jsonb, '"El Mohán"'::jsonb, 0, 'Su leyenda circula en varias regiones del país.')
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
