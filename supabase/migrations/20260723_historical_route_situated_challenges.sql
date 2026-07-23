-- Diversify the Historical Route with situated interactions.
-- The numbered route remains a recommendation: every stop is available from the start.

with situated_content as (
  select jsonb_build_array(
    jsonb_build_object(
      'id', 'chal-ruta2-detail-plaza',
      'type', 'DETAIL_HUNT',
      'title', 'Busca la huella vertical',
      'title_en', 'Find the vertical trace',
      'instruction', 'Recorre un borde de la plaza, mira hacia las copas y encuentra el elemento natural que se repite como una columna viva.',
      'instruction_en', 'Walk along one edge of the square, look up at the crowns, and find the natural element repeated like a living column.',
      'points_reward', 40,
      'completed_message', 'Encontraste una de las siluetas que identifica el corazón de Cali.',
      'completed_message_en', 'You found one of the silhouettes that identifies the heart of Cali.',
      'connection_story', 'La Plaza de Cayzedo fue la antigua Plaza Mayor y continúa siendo un punto de orientación de la ciudad. El Palacio de la Gobernación, el Edificio Otero y sus palmas reales permiten leer distintas capas del centro en una sola mirada.',
      'connection_story_en', 'Cayzedo Square was the former main square and remains a city landmark. The Governorate Palace, the Otero Building, and its royal palms reveal different layers of downtown in a single view.',
      'quiz_data', jsonb_build_object(
        'question', '¿Qué elemento vertical se repite alrededor de la plaza y domina su perfil cuando miras hacia arriba?',
        'question_en', 'Which vertical element repeats around the square and dominates its profile when you look up?',
        'options', jsonb_build_array('Palmas reales', 'Guaduales', 'Ceibas de gran copa', 'Samanes'),
        'options_en', jsonb_build_array('Royal palms', 'Bamboo groves', 'Large-crowned ceibas', 'Rain trees'),
        'correct_answer', 'Palmas reales',
        'correct_answer_en', 'Royal palms',
        'fun_fact', 'Las palmas reales funcionan como una firma visual de la Plaza de Cayzedo y pueden reconocerse desde varios puntos del centro.',
        'fun_fact_en', 'Royal palms act as a visual signature of Cayzedo Square and can be recognized from several points downtown.'
      ),
      'learning_goal', 'Reconocer cómo la vegetación también construye la identidad visual de un espacio patrimonial.',
      'content_source', 'Inventario cultural de Andanzas GO y observación directa del lugar.'
    ),
    jsonb_build_object(
      'id', 'chal-ruta2-observe-merced',
      'type', 'OBSERVATION',
      'title', 'Lee los muros',
      'title_en', 'Read the walls',
      'instruction', 'Acércate sin tocar la estructura y compara el grosor de los muros, los arcos y las superficies con los edificios modernos cercanos.',
      'instruction_en', 'Approach without touching the structure and compare the wall thickness, arches, and surfaces with nearby modern buildings.',
      'points_reward', 40,
      'completed_message', 'Reconociste una técnica constructiva que sobrevivió al crecimiento de la ciudad.',
      'completed_message_en', 'You recognized a building technique that survived the city''s growth.',
      'connection_story', 'La Merced conserva el lugar asociado con la fundación de Cali y con la primera misa celebrada el 25 de julio de 1536. Sus muros anchos y arcos permiten observar una escala constructiva muy distinta a la ciudad contemporánea.',
      'connection_story_en', 'La Merced preserves the place associated with Cali''s founding and the first mass held on July 25, 1536. Its thick walls and arches reveal a building scale very different from the contemporary city.',
      'quiz_data', jsonb_build_object(
        'question', 'Al observar el conjunto, ¿qué rasgo ayuda más a reconocer su arquitectura colonial?',
        'question_en', 'When observing the complex, which feature most clearly reveals its colonial architecture?',
        'options', jsonb_build_array('Muros anchos y arcos de materiales tradicionales', 'Fachadas de vidrio continuo', 'Estructuras metálicas expuestas', 'Paneles prefabricados'),
        'options_en', jsonb_build_array('Thick walls and arches made with traditional materials', 'Continuous glass façades', 'Exposed steel structures', 'Prefabricated panels'),
        'correct_answer', 'Muros anchos y arcos de materiales tradicionales',
        'correct_answer_en', 'Thick walls and arches made with traditional materials',
        'fun_fact', 'La arquitectura colonial regulaba temperatura y estabilidad mediante muros de gran espesor y patios interiores.',
        'fun_fact_en', 'Colonial architecture regulated temperature and stability through very thick walls and interior courtyards.'
      ),
      'learning_goal', 'Distinguir rasgos materiales de la arquitectura colonial mediante observación comparada.',
      'content_source', 'Inventario cultural de Andanzas GO y lectura arquitectónica del conjunto de La Merced.'
    ),
    jsonb_build_object(
      'id', 'chal-ruta2-photo-mudejar',
      'type', 'PHOTO',
      'title', 'Geometría mudéjar',
      'title_en', 'Mudejar geometry',
      'instruction', 'Encuentra en la Torre Mudéjar un encuadre donde dialoguen ladrillo, geometría y color. Registra ese detalle sin invadir espacios restringidos.',
      'instruction_en', 'Find a frame on the Mudejar Tower where brick, geometry, and color interact. Record the detail without entering restricted areas.',
      'points_reward', 40,
      'completed_message', 'Tu fotografía conserva una huella del intercambio cultural visible en la torre.',
      'completed_message_en', 'Your photograph preserves a trace of the cultural exchange visible in the tower.',
      'connection_story', 'La Torre Mudéjar del complejo de San Francisco fue construida en el siglo XVIII. Sus patrones geométricos, el ladrillo limpio y los detalles esmaltados traducen influencias moriscas a materiales y oficios locales.',
      'connection_story_en', 'The Mudejar Tower in the San Francisco complex was built in the eighteenth century. Its geometric patterns, exposed brick, and glazed details translate Moorish influences into local materials and crafts.',
      'photo_data', jsonb_build_object(
        'prompt', 'Fotografía un patrón repetido de la torre: puede ser una trama de ladrillo, un arco o una combinación geométrica.',
        'prompt_en', 'Photograph a repeated pattern on the tower: a brick lattice, an arch, or a geometric combination.',
        'subject_hint', 'Busca ritmo, simetría y contraste. No necesitas fotografiar la torre completa.',
        'subject_hint_en', 'Look for rhythm, symmetry, and contrast. You do not need to photograph the entire tower.',
        'acceptance_text', 'Patrón mudéjar registrado',
        'acceptance_text_en', 'Mudejar pattern recorded'
      ),
      'learning_goal', 'Identificar influencias mudéjares a través de patrones, materiales y composición.',
      'content_source', 'Inventario cultural de Andanzas GO y observación de la Torre Mudéjar.'
    ),
    jsonb_build_object(
      'id', 'chal-ruta2-detail-teatro',
      'type', 'DETAIL_HUNT',
      'title', 'Descifra la fachada',
      'title_en', 'Decode the façade',
      'instruction', 'Toma distancia para ver la fachada completa. Sigue con la mirada sus ejes, vanos y elementos ornamentales antes de elegir.',
      'instruction_en', 'Step back to see the full façade. Follow its axes, openings, and ornamental elements before choosing.',
      'points_reward', 40,
      'completed_message', 'Leíste la fachada como un documento de la Cali republicana.',
      'completed_message_en', 'You read the façade as a document of Republican-era Cali.',
      'connection_story', 'El Teatro Municipal Enrique Buenaventura, inaugurado en 1927, pertenece a la transición entre la Cali republicana y la ciudad moderna. Su fachada y su sala teatral muestran la aspiración de conectar a Cali con los lenguajes escénicos internacionales.',
      'connection_story_en', 'The Enrique Buenaventura Municipal Theater, opened in 1927, belongs to Cali''s transition from a Republican-era city to a modern one. Its façade and auditorium show the ambition to connect Cali with international performing arts.',
      'quiz_data', jsonb_build_object(
        'question', '¿Qué lenguaje arquitectónico predomina en la composición de la fachada?',
        'question_en', 'Which architectural language dominates the façade''s composition?',
        'options', jsonb_build_array('Neoclásico', 'Brutalista', 'Gótico medieval', 'Industrial'),
        'options_en', jsonb_build_array('Neoclassical', 'Brutalist', 'Medieval Gothic', 'Industrial'),
        'correct_answer', 'Neoclásico',
        'correct_answer_en', 'Neoclassical',
        'fun_fact', 'El teatro fue inaugurado en 1927 y conserva una sala en forma de herradura con una destacada ornamentación interior.',
        'fun_fact_en', 'The theater opened in 1927 and preserves a horseshoe-shaped auditorium with remarkable interior ornamentation.'
      ),
      'learning_goal', 'Relacionar la composición de una fachada con el momento histórico que la produjo.',
      'content_source', 'Inventario cultural de Andanzas GO y ficha patrimonial del Teatro Municipal.'
    ),
    jsonb_build_object(
      'id', 'chal-ruta2-decision-bulevar',
      'type', 'DECISION',
      'title', 'Decide cómo contar la transformación',
      'title_en', 'Choose how to tell the transformation',
      'instruction', 'Observa simultáneamente el espacio peatonal, el río y las construcciones históricas. Elige el enfoque con el que abrirías una crónica del lugar.',
      'instruction_en', 'Observe the pedestrian space, the river, and the historic buildings at the same time. Choose the angle that would open your story about this place.',
      'points_reward', 40,
      'completed_message', 'Tu decisión añadió una perspectiva propia al Archivo de Andanzas.',
      'completed_message_en', 'Your decision added a personal perspective to the Andanzas Archive.',
      'connection_story', 'El Bulevar del Río reúne varias épocas: el Puente Ortiz de 1845, la Iglesia de la Ermita, el río y una gran intervención contemporánea que llevó el tránsito vehicular a un túnel para devolver la superficie a los peatones.',
      'connection_story_en', 'The River Boulevard brings together several eras: the 1845 Ortiz Bridge, La Ermita Church, the river, and a major contemporary intervention that moved traffic into a tunnel and returned the surface to pedestrians.',
      'decision_data', jsonb_build_object(
        'question', 'Si tuvieras que explicar por qué este lugar representa una ciudad construida por capas, ¿por dónde comenzarías?',
        'question_en', 'If you had to explain why this place represents a city built in layers, where would you begin?',
        'options', jsonb_build_array(
          jsonb_build_object(
            'label', 'Por el diálogo entre patrimonio y obra contemporánea',
            'label_en', 'With the dialogue between heritage and contemporary infrastructure',
            'response', 'Tu crónica mostrará que conservar no siempre significa congelar: también puede significar crear nuevas relaciones con lo heredado.',
            'response_en', 'Your story will show that preservation does not always mean freezing a place; it can also mean creating new relationships with what was inherited.'
          ),
          jsonb_build_object(
            'label', 'Por la recuperación del espacio para caminar y encontrarse',
            'label_en', 'With the recovery of space for walking and meeting',
            'response', 'Tu crónica pondrá a las personas en el centro y leerá el patrimonio desde la manera en que vuelve a ser habitado.',
            'response_en', 'Your story will place people at the center and read heritage through the ways it becomes inhabited again.'
          ),
          jsonb_build_object(
            'label', 'Por el río como testigo de todas las transformaciones',
            'label_en', 'With the river as witness to every transformation',
            'response', 'Tu crónica usará el paisaje como hilo conductor: la ciudad cambia, mientras el río conecta sus distintas épocas.',
            'response_en', 'Your story will use the landscape as its thread: the city changes while the river connects its different eras.'
          )
        )
      ),
      'learning_goal', 'Interpretar un espacio urbano desde perspectivas múltiples y construir una postura narrativa.',
      'content_source', 'Inventario cultural de Andanzas GO y lectura urbana del Bulevar del Río.'
    ),
    jsonb_build_object(
      'id', 'chal-ruta2-situated-san-antonio',
      'type', 'OBSERVATION',
      'title', 'Lee la ciudad desde la colina',
      'title_en', 'Read the city from the hill',
      'instruction', 'Busca un punto seguro del espacio público desde donde puedas ver la capilla, la pendiente y parte de la ciudad. Relaciona las tres escalas.',
      'instruction_en', 'Find a safe public spot where you can see the chapel, the slope, and part of the city. Connect those three scales.',
      'points_reward', 40,
      'completed_message', 'Conectaste la escala del barrio con el paisaje completo de Cali.',
      'completed_message_en', 'You connected the neighborhood scale with Cali''s wider landscape.',
      'connection_story', 'La Capilla de San Antonio, construida en 1747, corona una colina rodeada por calles inclinadas, casas tradicionales y espacios de encuentro. Su posición permite leer al mismo tiempo el barrio histórico y la ciudad extendida en el valle.',
      'connection_story_en', 'The San Antonio Chapel, built in 1747, crowns a hill surrounded by sloped streets, traditional houses, and gathering places. Its position allows you to read both the historic neighborhood and the city spreading across the valley.',
      'quiz_data', jsonb_build_object(
        'question', 'Al observar desde la colina, ¿qué explica mejor la importancia de la ubicación de la capilla?',
        'question_en', 'When observing from the hill, what best explains the importance of the chapel''s location?',
        'options', jsonb_build_array('Funciona como referencia del barrio y mirador sobre la ciudad', 'Queda oculta y sin relación con el paisaje', 'Fue diseñada para conectarse con una autopista', 'Su posición elimina las pendientes del sector'),
        'options_en', jsonb_build_array('It acts as a neighborhood landmark and viewpoint over the city', 'It remains hidden and unrelated to the landscape', 'It was designed to connect with a highway', 'Its position removes the area''s slopes'),
        'correct_answer', 'Funciona como referencia del barrio y mirador sobre la ciudad',
        'correct_answer_en', 'It acts as a neighborhood landmark and viewpoint over the city',
        'fun_fact', 'La relación entre capilla, colina y barrio convirtió a San Antonio en uno de los paisajes culturales más reconocibles de Cali.',
        'fun_fact_en', 'The relationship among chapel, hill, and neighborhood made San Antonio one of Cali''s most recognizable cultural landscapes.'
      ),
      'learning_goal', 'Relacionar topografía, arquitectura y vida barrial mediante una pregunta situada.',
      'content_source', 'Inventario cultural de Andanzas GO y observación del paisaje de San Antonio.'
    )
  ) as challenges
)
update public.routes r
set
  gamificacion = situated_content.challenges,
  points_reward = 240
from situated_content
where r.id = 'ruta2';

-- Keep the normalized master model synchronized with the public route payload.
update public.route_stops stop
set
  instruction_text = challenge.item->>'instruction',
  story_text = challenge.item->>'connection_story',
  updated_at = timezone('utc', now())
from public.routes r
cross join lateral jsonb_array_elements(r.gamificacion) with ordinality as challenge(item, ordinality)
where r.id = 'ruta2'
  and stop.route_id = r.id
  and stop.order_index = challenge.ordinality::integer - 1;

insert into public.route_challenges (
  route_id,
  stop_id,
  route_stop_id,
  challenge_key,
  order_index,
  challenge_type,
  prompt,
  instruction,
  options,
  correct_answer,
  explanation,
  completed_message,
  connection_story,
  interaction_data,
  alternatives,
  points_reward,
  required,
  status,
  learning_goal,
  content_source
)
select
  r.id,
  stop.site_id,
  stop.id,
  challenge.item->>'id',
  challenge.ordinality::integer - 1,
  challenge.item->>'type',
  coalesce(
    challenge.item#>>'{quiz_data,question}',
    challenge.item#>>'{photo_data,prompt}',
    challenge.item#>>'{decision_data,question}',
    challenge.item->>'instruction'
  ),
  challenge.item->>'instruction',
  challenge.item#>'{quiz_data,options}',
  challenge.item#>>'{quiz_data,correct_answer}',
  challenge.item#>>'{quiz_data,fun_fact}',
  challenge.item->>'completed_message',
  challenge.item->>'connection_story',
  challenge.item,
  '{}'::jsonb,
  coalesce((challenge.item->>'points_reward')::integer, 10),
  true,
  'published',
  challenge.item->>'learning_goal',
  challenge.item->>'content_source'
from public.routes r
cross join lateral jsonb_array_elements(r.gamificacion) with ordinality as challenge(item, ordinality)
join public.route_stops stop
  on stop.route_id = r.id
 and stop.order_index = challenge.ordinality::integer - 1
where r.id = 'ruta2'
on conflict (route_id, challenge_key) where challenge_key is not null
do update set
  stop_id = excluded.stop_id,
  route_stop_id = excluded.route_stop_id,
  order_index = excluded.order_index,
  challenge_type = excluded.challenge_type,
  prompt = excluded.prompt,
  instruction = excluded.instruction,
  options = excluded.options,
  correct_answer = excluded.correct_answer,
  explanation = excluded.explanation,
  completed_message = excluded.completed_message,
  connection_story = excluded.connection_story,
  interaction_data = excluded.interaction_data,
  alternatives = excluded.alternatives,
  points_reward = excluded.points_reward,
  required = excluded.required,
  status = excluded.status,
  learning_goal = excluded.learning_goal,
  content_source = excluded.content_source,
  updated_at = timezone('utc', now());

-- Remove superseded challenge rows from the first pilot version.
delete from public.route_challenges
where route_id = 'ruta2'
  and challenge_key not in (
    'chal-ruta2-detail-plaza',
    'chal-ruta2-observe-merced',
    'chal-ruta2-photo-mudejar',
    'chal-ruta2-detail-teatro',
    'chal-ruta2-decision-bulevar',
    'chal-ruta2-situated-san-antonio'
  );
