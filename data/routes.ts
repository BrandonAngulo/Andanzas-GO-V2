
import { Ruta } from '../types';

export const CULTURAL_ROUTES: Ruta[] = [
    // ─────────────────────────────────────────────────────────────────────────
    // 1. LA CLAVE DEL BARRIO — Salsa
    // Sitios: museo-salsa-obrero → plazoleta-jairo-varela → audiosca-municipal
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'route-salsa',
        nombre: 'La Clave del Barrio',
        nombre_en: 'The Key of the Neighborhood',
        duracionMin: 240,
        descripcion: `Esta ruta es una peregrinación al corazón sonoro de Cali, la Capital Mundial de la Salsa. Más que un género musical, aquí la salsa es una religión que se baila y se vive en cada esquina. 'La Clave del Barrio' te sumerge en la identidad de un pueblo que transformó un ritmo antillano en su propia bandera cultural: desde la habitación donde Carlos Molina guardaba sus primeras fotos, hasta la sala de vinilos donde la Audioteca preserva grabaciones que no existen en ningún otro lugar del mundo. Es un viaje donde el cuerpo no puede evitar moverse y donde entenderás por qué en Cali, la vida tiene su propia clave.`,
        descripcion_en: `This route is a pilgrimage to the sonic heart of Cali, the World Capital of Salsa. More than a musical genre, salsa here is a religion danced and lived on every corner. 'The Key of the Neighborhood' immerses you in the identity of a people who transformed an Antillean rhythm into their own cultural flag — from the room where Carlos Molina kept his first photographs to the vinyl hall where the Audioteca preserves recordings that exist nowhere else in the world.`,
        intro_story: `El Barrio Obrero no se anuncia con letreros. Se anuncia con clave. Antes de entrar, escucha: ¿puedes oír el ritmo que late en las paredes de ladrillo? Aquí nació el estilo caleño, no en un estudio de grabación, sino en los solares y bailaderos de esta cuadrícula popular. Hoy vas a leer la historia que no aparece en los libros.`,
        intro_story_en: `Barrio Obrero doesn't announce itself with signs. It announces itself with rhythm. Before entering, listen: can you hear the beat pulsing through the brick walls? The Cali style was born here — not in a recording studio, but in the courtyards and dance halls of this working-class grid. Today you will read the history that doesn't appear in books.`,
        justificaciones: [
            'La salsa caleña es un lenguaje social propio, distinto al modelo neoyorquino.',
            'El Museo de la Salsa es el repositorio fotográfico salsero más antiguo del mundo.',
            'La Audioteca Municipal guarda grabaciones del Pacífico que no existen en ningún otro archivo global.'
        ],
        justificaciones_en: [
            'Cali salsa is its own social language, distinct from the New York model.',
            'The Salsa Museum is the world\'s oldest salsa photographic repository.',
            'The Municipal Audioteca holds Pacific music recordings that exist in no other global archive.'
        ],
        puntos: ['museo-salsa-obrero', 'plazoleta-jairo-varela', 'audiosca-municipal'],
        reward_badge_id: 'badge-salsa',
        publico: true,
        recomendaciones: [
            {
                tipo: 'Música',
                titulo: 'Tu playlist de la ruta',
                titulo_en: 'Your route playlist',
                descripcion: 'Antes de salir, carga en tu teléfono: "Buenaventura y Caney" (Grupo Niche), "Las Caleñas son como las Flores" (Piper Pimienta) y cualquier álbum de Joe Arroyo. Úsalos como banda sonora entre sitio y sitio — es parte de la experiencia.',
                descripcion_en: 'Before leaving, load on your phone: "Buenaventura y Caney" (Grupo Niche), "Las Caleñas son como las Flores" (Piper Pimienta), and any Joe Arroyo album. Use them as the soundtrack between sites — it\'s part of the experience.',
            },
            {
                tipo: 'Vestuario',
                titulo: 'Calzado de barrio',
                titulo_en: 'Neighborhood footwear',
                descripcion: 'El Barrio Obrero es calles de asfalto y aceras estrechas. Usa zapatos planos de suela suave — si vas a dejarte llevar a bailar en algún solar o tienda de vinilos (es probable que pase), los tacones altos serán un obstáculo, no un accesorio.',
                descripcion_en: 'Barrio Obrero is asphalt streets and narrow sidewalks. Wear flat soft-soled shoes — if you get pulled into dancing at a courtyard or vinyl shop (it will likely happen), high heels will be an obstacle, not an accessory.',
            },
            {
                tipo: 'Mejor Hora',
                titulo: 'Tarde de barrio',
                titulo_en: 'Neighborhood afternoon',
                descripcion: 'Visita el Museo de la Salsa entre las 14:00 y las 18:00, cuando Carlos Molina o sus herederos suelen estar atendiendo y colocando vinilos en el equipo de sonido. Esa es la experiencia completa: ver las fotos mientras suena la música original.',
                descripcion_en: 'Visit the Salsa Museum between 2:00 PM and 6:00 PM, when Carlos Molina or his successors are usually there putting records on the sound system. That\'s the full experience: seeing the photos while the original music plays.',
            },
            {
                tipo: 'Bebida',
                titulo: 'Aguapanela con limón',
                titulo_en: 'Panela water with lemon',
                descripcion: 'En el Barrio Obrero encontrarás tiendas de barrio tradicionales donde sirven aguapanela fría con limón — la bebida de los ensayos y los bailaderos populares de toda la vida. Es la hidratación auténtica de la ruta, no la lulada turística.',
                descripcion_en: 'In Barrio Obrero you will find traditional corner stores serving cold panela water with lemon — the drink of rehearsals and popular dance venues for generations. It\'s the authentic hydration of this route, not the tourist lulada.',
            },
            {
                tipo: 'Foto',
                titulo: 'Foto de la foto',
                titulo_en: 'Photo of the photo',
                descripcion: 'En el Museo de la Salsa, pregunta a Carlos Molina por las fotos de Celia Cruz en Cali (existen varias). La imagen dentro de la imagen — tú fotografiando esa historia — es una de las mejores que te llevarás de la ruta.',
                descripcion_en: 'At the Salsa Museum, ask Carlos Molina for the photos of Celia Cruz in Cali (several exist). The image within the image — you photographing that history — is one of the best shots you\'ll take on this route.',
            },
        ],
        gamificacion: [
            {
                id: 'chal-salsa-1',
                type: 'TRIVIA',
                title: 'El Origen Fotográfico',
                title_en: 'The Photographic Origin',
                instruction: 'Encuentra la fotografía más antigua de la sala principal del Museo de la Salsa y lee la fecha en la esquina inferior.',
                instruction_en: 'Find the oldest photograph in the main hall of the Salsa Museum and read the date in the lower corner.',
                points_reward: 150,
                completed_message: '¡Has conectado con el origen visual de la salsa caleña!',
                completed_message_en: 'You have connected with the visual origin of Cali salsa!',
                connection_story: 'Estás en el Barrio Obrero, cuna del estilo caleño. Entra al Museo de la Salsa, fundado en 1968 por el fotógrafo Carlos Molina. Sus paredes guardan más de 40,000 fotografías analógicas de orquestas, bailadores y leyendas del sonido antillano que pasaron por Cali.',
                connection_story_en: 'You are in Barrio Obrero, the cradle of the Cali style. Enter the Salsa Museum, founded in 1968 by photographer Carlos Molina. Its walls hold over 40,000 analog photographs of orchestras, dancers, and legends of the Antillean sound that passed through Cali.',
                quiz_data: {
                    question: '¿En qué año fundó Carlos Molina el Museo de la Salsa del Barrio Obrero?',
                    question_en: 'In what year did Carlos Molina found the Salsa Museum of Barrio Obrero?',
                    options: ['1955', '1968', '1975', '1980'],
                    options_en: ['1955', '1968', '1975', '1980'],
                    correct_answer: '1968',
                    correct_answer_en: '1968',
                    fun_fact: 'Carlos Molina inició la colección en su propia casa, guardando fotos y recortes de los espectáculos de salsa que llegaban a Juanchito y al Barrio Obrero.',
                    fun_fact_en: 'Carlos Molina started the collection in his own home, saving photos and press clippings of salsa shows that came to Juanchito and Barrio Obrero.'
                }
            },
            {
                id: 'chal-salsa-2',
                type: 'TRIVIA',
                title: 'El Sonido de Niche en el Bronce',
                title_en: 'The Sound of Niche in Bronze',
                instruction: 'Párate dentro de una de las letras de la escultura N-I-C-H-E y escucha el sonido que produce el viento al pasar por las campanas. Luego responde.',
                instruction_en: 'Stand inside one of the letters of the N-I-C-H-E sculpture and listen to the sound the wind makes as it passes through the bells. Then answer.',
                points_reward: 150,
                completed_message: '¡Has sentido la vibración del maestro Jairo Varela!',
                completed_message_en: 'You have felt the vibration of maestro Jairo Varela!',
                connection_story: 'Desde el Barrio Obrero, camina hacia el norte cruzando la Calle Quinta — el eje histórico de la Cali vieja — hasta la Plazoleta Jairo Varela frente al CAM. La escultura "Niche" de 8 metros de bronce fue diseñada para que el viento caleño la convierta en un instrumento de viento monumental.',
                connection_story_en: 'From Barrio Obrero, walk north crossing Calle Quinta — the historic axis of old Cali — to the Plazoleta Jairo Varela in front of the CAM. The 8-meter bronze "Niche" sculpture was designed so the Cali breeze turns it into a monumental wind instrument.',
                quiz_data: {
                    question: '¿En qué año fue grabada "Cali Pachanguero", el himno más famoso del Grupo Niche?',
                    question_en: 'In what year was "Cali Pachanguero" recorded, Grupo Niche\'s most famous anthem?',
                    options: ['1979', '1984', '1988', '1992'],
                    options_en: ['1979', '1984', '1988', '1992'],
                    correct_answer: '1988',
                    correct_answer_en: '1988',
                    fun_fact: '"Cali Pachanguero" fue seleccionada por la FIFA como canción oficial del Mundial de Brasil 2014, llevando el nombre de Cali al planeta.',
                    fun_fact_en: '"Cali Pachanguero" was selected by FIFA as an official song for the 2014 Brazil World Cup, carrying Cali\'s name across the planet.'
                }
            },
            {
                id: 'chal-salsa-3',
                type: 'TRIVIA',
                title: 'Memoria Sonora del Pacífico',
                title_en: 'Pacific Sound Memory',
                instruction: 'En la Audioteca Municipal, pide a un orientador que te muestre la colección de grabaciones de campo del Pacífico. Escucha al menos un fragmento de una grabación de los años 50 o 60.',
                instruction_en: 'At the Municipal Audioteca, ask an advisor to show you the Pacific field recording collection. Listen to at least one excerpt from a 1950s or 60s recording.',
                points_reward: 150,
                completed_message: '¡Has preservado la memoria auditiva de un pueblo!',
                completed_message_en: 'You have preserved the auditory memory of a people!',
                connection_story: 'Cruza el Bulevar del Río y entra al Centro Cultural de Cali, la joya arquitectónica diseñada por Rogelio Salmona. En la planta baja encontrarás la Audioteca Municipal, un repositorio sonoro único que guarda grabaciones del Pacífico colombiano que no existen en ningún otro archivo del mundo.',
                connection_story_en: 'Cross the River Boulevard and enter the Cali Cultural Center, the architectural jewel designed by Rogelio Salmona. On the ground floor you will find the Municipal Audioteca, a unique sound repository holding Colombian Pacific recordings that exist in no other archive in the world.',
                quiz_data: {
                    question: '¿Qué instrumento es el símbolo musical central de las comunidades afrocolombianas del Pacífico y fue declarado Patrimonio Inmaterial por la UNESCO en 2015?',
                    question_en: 'What instrument is the central musical symbol of Afro-Colombian Pacific communities and was declared Intangible Heritage by UNESCO in 2015?',
                    options: ['El Bongó', 'La Marimba de Chonta', 'El Tiple', 'La Guitarra Clásica'],
                    options_en: ['The Bongo', 'The Chonta Marimba', 'The Tiple', 'The Classical Guitar'],
                    correct_answer: 'La Marimba de Chonta',
                    correct_answer_en: 'The Chonta Marimba',
                    fun_fact: 'La marimba de chonta es fabricada con madera de palma de chonta y calabazas secas como resonadores. Cada marimba es única y lleva semanas construirla.',
                    fun_fact_en: 'The chonta marimba is made from chonta palm wood and dried gourds as resonators. Each marimba is unique and takes weeks to build.'
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 2. FOGONES DE LA MEMORIA — Gastronomía
    // Sitios: galeria-alameda → bebidas-san-antonio → panaderias-centro
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'route-food',
        nombre: 'Fogones de la Memoria',
        nombre_en: 'Stoves of Memory',
        duracionMin: 180,
        descripcion: `Esta andanza es un festín para los sentidos que recorre los aromas y sabores que definen la identidad vallecaucana. Desde las manos curtidas que despachan borojo y lulo en la Galería Alameda —la más antigua de la ciudad— hasta el pandebono recién salido del horno de leña de las panaderías del centro, esta ruta celebra a las portadoras de tradición que han preservado el legado culinario del Pacífico y del Valle con una tenacidad silenciosa y poderosa. Aquí, la comida no es solo sustento: es un acto profundo de soberanía y resistencia cultural.`,
        descripcion_en: `This journey is a feast for the senses traversing the aromas and flavors that define Valle del Cauca identity. From the weathered hands dispatching borojo and lulo at the Alameda Market — the city's oldest — to freshly oven-baked pandebono at the downtown bakeries, this route celebrates the tradition-bearers who have preserved the culinary legacy of the Pacific and the Valley with silent, powerful tenacity. Here, food is not just sustenance: it is a profound act of sovereignty and cultural resistance.`,
        intro_story: `La historia de un pueblo se cocina a fuego lento. Antes de entrar a la Galería Alameda, detente un momento en el umbral y aspira: ese aroma complejo de panela, cilantro, maíz húmedo y canela es el aroma de cuatro siglos de cocina mestiza, indígena y afro. Hoy vas a comer historia.`,
        intro_story_en: `The history of a people is cooked over low heat. Before entering the Alameda Market, pause a moment at the threshold and breathe: that complex aroma of panela, cilantro, damp corn, and cinnamon is the fragrance of four centuries of mestizo, indigenous, and Afro cuisine. Today you will eat history.`,
        justificaciones: [
            'La Galería Alameda es el mercado más antiguo de Cali y repositorio vivo de frutas del Pacífico que no se consiguen en ninguna otra parte de la ciudad.',
            'El champús y la lulada son patrimonio gastronómico inmaterial declarado de Cali.',
            'El pandebono auténtico de las panaderías del centro es irreproducible industrialmente.'
        ],
        justificaciones_en: [
            'Galería Alameda is Cali\'s oldest market and a living repository of Pacific fruits found nowhere else in the city.',
            'Champús and lulada are declared intangible gastronomic heritage of Cali.',
            'Authentic pandebono from downtown bakeries is industrially irreproducible.'
        ],
        puntos: ['galeria-alameda', 'bebidas-san-antonio', 'panaderias-centro'],
        reward_badge_id: 'badge-food',
        publico: true,
        recomendaciones: [
            {
                tipo: 'Sabores',
                titulo: 'Come antes de explorar',
                titulo_en: 'Eat before exploring',
                descripcion: 'No desayunes antes de la ruta. La Galería Alameda tiene restaurantes campesinos desde las 6:00 AM donde sirven sancocho de gallina criolla, sudado de bagre y hogao desde $8,000 COP. Ese debe ser tu primer plato del día.',
                descripcion_en: 'Don\'t have breakfast before the route. Galería Alameda has rustic restaurants from 6:00 AM serving creole hen stew, bagre fish stew, and hogao from $8,000 COP. That should be your first meal of the day.',
            },
            {
                tipo: 'Experiencia',
                titulo: 'Háblale a los tenderos',
                titulo_en: 'Talk to the market vendors',
                descripcion: 'En la Galería Alameda, pregunta a los tenderos de frutas por el "borojo": una fruta oscura de olor intenso que crece solo en el Pacífico colombiano y es casi desconocida fuera de él. Pide que te expliquen cómo se come. Esa conversación vale más que cualquier guía turística.',
                descripcion_en: 'At Galería Alameda, ask the fruit vendors about "borojo": a dark, intensely fragrant fruit that grows only in the Colombian Pacific and is virtually unknown outside it. Ask them to explain how it\'s eaten. That conversation is worth more than any tourist guide.',
            },
            {
                tipo: 'Bebida',
                titulo: 'El champús frío vs. el caliente',
                titulo_en: 'Cold champús vs. warm champús',
                descripcion: 'En los puestos de San Antonio, pide champús. Pero pregunta si lo tienen también caliente — en diciembre sirven champús tibio como bebida reconfortante. Si coincides con esa temporada, pide una de cada: la diferencia entre los dos es una experiencia gastronómica completa en sí misma.',
                descripcion_en: 'At the San Antonio stalls, order champús. But ask if they also have it warm — in December they serve warm champús as a comforting drink. If you visit during that season, order one of each: the difference between the two is itself a complete gastronomic experience.',
            },
            {
                tipo: 'Snack',
                titulo: 'El pandebono en los primeros 15 minutos',
                titulo_en: 'Pandebono within the first 15 minutes',
                descripcion: 'El pandebono auténtico debe comerse en los primeros 15 minutos después de salir del horno — esa es la ventana de textura perfecta. Pregunta en la panadería a qué hora es la próxima hornada y planifica tu llegada para ese momento exacto.',
                descripcion_en: 'Authentic pandebono must be eaten within the first 15 minutes after leaving the oven — that\'s the window of perfect texture. Ask the bakery what time the next batch is baked and plan your arrival for that exact moment.',
            },
            {
                tipo: 'Planificación',
                titulo: 'Lleva efectivo en billetes pequeños',
                titulo_en: 'Bring small bills in cash',
                descripcion: 'La Galería Alameda, los puestos de San Antonio y las panaderías del centro operan casi exclusivamente en efectivo. Lleva billetes de $5,000 y $10,000 COP — los tenderos difícilmente tienen cambio para billetes grandes.',
                descripcion_en: 'Galería Alameda, the San Antonio stalls, and downtown bakeries operate almost exclusively in cash. Bring $5,000 and $10,000 COP bills — vendors rarely have change for large bills.',
            },
        ],
        gamificacion: [
            {
                id: 'chal-food-1',
                type: 'TRIVIA',
                title: 'La Fruta del Pacífico',
                title_en: 'The Pacific Fruit',
                instruction: 'Encuentra en la Galería Alameda un puesto que venda borojo o chontaduro. Compra una unidad y pregúntale al tendero de dónde viene.',
                instruction_en: 'Find a stall in Galería Alameda selling borojo or chontaduro. Buy one and ask the vendor where it comes from.',
                points_reward: 150,
                completed_message: '¡Has descubierto el sabor del Pacífico colombiano!',
                completed_message_en: 'You have discovered the flavor of the Colombian Pacific!',
                connection_story: 'Estás en la Galería Alameda, fundada en 1926. Este mercado es el corazón agrícola de Cali: aquí llegan los campesinos del Valle del Cauca y los comerciantes del Pacífico con frutas, verduras y proteínas que no se encuentran en ningún supermercado de la ciudad.',
                connection_story_en: 'You are at Galería Alameda, founded in 1926. This market is Cali\'s agricultural heart: here come farmers from Valle del Cauca and Pacific merchants with fruits, vegetables, and proteins found in no city supermarket.',
                quiz_data: {
                    question: '¿En qué año fue construida la Galería Alameda, el mercado de alimentos más antiguo de Cali?',
                    question_en: 'In what year was Galería Alameda built, Cali\'s oldest food market?',
                    options: ['1910', '1926', '1945', '1960'],
                    options_en: ['1910', '1926', '1945', '1960'],
                    correct_answer: '1926',
                    correct_answer_en: '1926',
                    fun_fact: 'Algunos puestos de frutas de la Galería llevan más de 60 años atendidos por la misma familia. La memoria comercial del mercado es, en sí misma, patrimonio cultural de Cali.',
                    fun_fact_en: 'Some fruit stalls at the Galería have been run by the same family for over 60 years. The market\'s commercial memory is itself cultural heritage of Cali.'
                }
            },
            {
                id: 'chal-food-2',
                type: 'TRIVIA',
                title: 'La Bebida Prehispánica',
                title_en: 'The Pre-Hispanic Drink',
                instruction: 'Pide un champús en los puestos de bebidas de la Colina de San Antonio. Pregunta a quien lo prepare cuáles son sus ingredientes exactos.',
                instruction_en: 'Order a champús at the beverage stalls on San Antonio Hill. Ask whoever prepares it what the exact ingredients are.',
                points_reward: 150,
                completed_message: '¡Has tomado cuatro siglos de historia en un vaso!',
                completed_message_en: 'You have drunk four centuries of history in a glass!',
                connection_story: 'Sube la Colina de San Antonio, el cerro colonial que corona el barrio bohemio de Cali. Los puestos de bebidas que rodean la capilla son atendidos por mujeres de familias que llevan generaciones en este punto. El ritual de tomar una bebida fría mientras cae el sol es uno de los más auténticamente caleños que existen.',
                connection_story_en: 'Climb San Antonio Hill, the colonial hill crowning Cali\'s bohemian neighborhood. The beverage stalls surrounding the chapel are run by women from families with generations in this spot. The ritual of having a cold drink as the sun sets is one of the most authentically Caleño experiences that exists.',
                quiz_data: {
                    question: '¿Qué grano es la base del champús, la bebida tradicional del Valle del Cauca con raíces prehispánicas?',
                    question_en: 'What grain is the base of champús, the traditional Valle del Cauca drink with pre-Hispanic roots?',
                    options: ['Arroz', 'Maíz Quebrado', 'Cebada', 'Trigo'],
                    options_en: ['Rice', 'Broken Corn', 'Barley', 'Wheat'],
                    correct_answer: 'Maíz Quebrado',
                    correct_answer_en: 'Broken Corn',
                    fun_fact: 'El champús se ha preparado en el Valle del Cauca desde antes de la llegada de los españoles. La receta original indígena fue adaptada con canela, panela y lulo — ingredientes coloniales — dando lugar a la versión que se toma hoy.',
                    fun_fact_en: 'Champús has been prepared in Valle del Cauca since before the arrival of the Spanish. The original indigenous recipe was adapted with cinnamon, panela, and lulo — colonial ingredients — giving rise to the version drunk today.'
                }
            },
            {
                id: 'chal-food-3',
                type: 'TRIVIA',
                title: 'El Almidón y el Secreto del Pandebono',
                title_en: 'The Starch and the Pandebono Secret',
                instruction: 'Entra a una panadería tradicional del centro y pide que te muestren (o te expliquen) de qué está hecho el pandebono. Pide uno recién sacado del horno.',
                instruction_en: 'Enter a traditional downtown bakery and ask them to show you (or explain) what pandebono is made of. Order one fresh from the oven.',
                points_reward: 150,
                completed_message: '¡Ahora eres un experto en el bocado más vallecaucano que existe!',
                completed_message_en: 'You are now an expert in the most Valle del Cauca bite that exists!',
                connection_story: 'Las panaderías tradicionales del centro de Cali horneaban desde antes del amanecer cuando el centro aún no despertaba. El pandebono es la pieza más representativa de la repostería vallecaucana, y su receta auténtica — almidón de yuca agria fermentado + queso costeño — es incompatible con la producción industrial.',
                connection_story_en: 'The traditional downtown bakeries were baking before dawn when the center had not yet awakened. Pandebono is the most representative piece of Valle del Cauca baking, and its authentic recipe — fermented sour cassava starch + coastal cheese — is incompatible with industrial production.',
                quiz_data: {
                    question: '¿Cuántos días de fermentación necesita el almidón de yuca agria para poder usarse en la elaboración de un pandebono auténtico?',
                    question_en: 'How many days of fermentation does sour cassava starch need to be used in making an authentic pandebono?',
                    options: ['2 días', '5 días', 'Hasta 15 días', '30 días'],
                    options_en: ['2 days', '5 days', 'Up to 15 days', '30 days'],
                    correct_answer: 'Hasta 15 días',
                    correct_answer_en: 'Up to 15 days',
                    fun_fact: 'Existen más de 30 variedades de pandebono en el Valle del Cauca. Cada subregión — Palmira, Tuluá, Buga, Cartago — tiene su propia receta familiar con proporciones ligeramente distintas.',
                    fun_fact_en: 'There are over 30 varieties of pandebono in Valle del Cauca. Each sub-region — Palmira, Tuluá, Buga, Cartago — has its own family recipe with slightly different proportions.'
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 3. PINCELES DE LA CALLE — Arte Urbano
    // Sitios: muros-bulevar → puente-cerveceria → murales-siloe
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'route-art',
        nombre: 'Pinceles de la Calle',
        nombre_en: 'Brushes of the Street',
        duracionMin: 150,
        descripcion: `Las paredes de Cali no callan: gritan verdades a todo color. Desde el circuito de más de 2 km de murales sobre los muros de contención del río Cali en el Bulevar, pasando bajo el Puente de la Cervecería —cuyas columnas son lienzos monumentales de la historia industrial de la ciudad—, hasta los murales de la ladera de Siloé donde el arte comunitario transformó la narrativa de un barrio históricamente estigmatizado. Esta ruta es una lectura visual de la ciudad que no está en ningún libro: está pintada en sus muros.`,
        descripcion_en: `Cali's walls don't fall silent — they scream truths in full color. From the 2 km+ mural circuit on the flood control walls of the Cali River in the Bulevar, beneath the Puente de la Cervecería — whose columns are monumental canvases of the city's industrial history — to the murals on Siloé's hillside where community art transformed the narrative of a historically stigmatized neighborhood. This route is a visual reading of the city that appears in no book: it's painted on its walls.`,
        intro_story: `Si las paredes hablaran, gritarían revolución. Pero aquí no hablan — pintan. El muralismo caleño no es decoración: es denuncia, memoria y orgullo. Antes de arrancar, mira el primer muro a tu izquierda cuando entres al Bulevar y pregúntate: ¿qué historia te está contando?`,
        intro_story_en: `If walls could talk, they would scream revolution. But here they don't talk — they paint. Cali muralism is not decoration: it is denunciation, memory, and pride. Before starting, look at the first wall to your left when you enter the Bulevar and ask yourself: what story is it telling you?`,
        justificaciones: [
            'El circuito de murales del Bulevar es uno de los más largos de América Latina: más de 2 km continuos.',
            'El Puente de la Cervecería recuerda la primera industria moderna de Cali: la Cervecería Bavaria (1904).',
            'Los murales de Siloé son un modelo internacional de arte comunitario que transformó la narrativa de un barrio.'
        ],
        justificaciones_en: [
            'The Bulevar mural circuit is one of the longest in Latin America: over 2 continuous km.',
            'The Cervecería Bridge recalls Cali\'s first modern industry: Bavaria Brewery (1904).',
            'The Siloé murals are an international model of community art that transformed a neighborhood\'s narrative.'
        ],
        puntos: ['muros-bulevar', 'puente-cerveceria', 'murales-siloe'],
        reward_badge_id: 'badge-art',
        publico: true,
        recomendaciones: [
            {
                tipo: 'Mejor Hora',
                titulo: 'Luz de la tarde para fotografiar',
                titulo_en: 'Afternoon light for photography',
                descripcion: 'Los murales del Bulevar y el Puente de la Cervecería tienen su mejor luz entre las 15:00 y las 17:30, cuando el sol del occidente ilumina de frente las paredes orientales. Los colores saturados y las sombras largas hacen fotos excepcionales en ese rango horario.',
                descripcion_en: 'The Bulevar murals and Cervecería Bridge have their best light between 3:00 PM and 5:30 PM, when the western sun directly illuminates the eastern walls. Saturated colors and long shadows make exceptional photos in that time range.',
            },
            {
                tipo: 'Transporte',
                titulo: 'Bicicleta para el Bulevar, a pie para Siloé',
                titulo_en: 'Bike for the Bulevar, on foot for Siloé',
                descripcion: 'Para el Bulevar del Río, alquila una bicicleta de las estaciones de MiO Bici o Tembici — el circuito de murales se disfruta mejor en dos ruedas. Para Siloé, sube únicamente con un guía comunitario local (se consigue fácil por redes sociales de Ladera Cultura Viva) — ellos conocen los caminos seguros y la historia de cada mural.',
                descripcion_en: 'For the Bulevar del Río, rent a bicycle from the MiO Bici or Tembici stations — the mural circuit is best enjoyed on two wheels. For Siloé, go only with a local community guide (easily found through Ladera Cultura Viva\'s social media) — they know the safe paths and the story behind each mural.',
            },
            {
                tipo: 'Experiencia',
                titulo: 'Pregunta por el artista de cada mural',
                titulo_en: 'Ask about the artist of each mural',
                descripcion: 'En Siloé, los guías comunitarios saben quién pintó cada mural, cuándo lo hizo y qué historia quiso contar. Esa narrativa oral que acompaña a las imágenes es el 80% del valor del recorrido. Sin ella, son solo pinturas bonitas en una pared.',
                descripcion_en: 'In Siloé, the community guides know who painted each mural, when they painted it, and what story they wanted to tell. That oral narrative accompanying the images is 80% of the tour\'s value. Without it, they\'re just pretty paintings on a wall.',
            },
            {
                tipo: 'Foto',
                titulo: 'El mural de las especies endémicas',
                titulo_en: 'The endemic species mural',
                descripcion: 'En el Bulevar del Río busca el mural de gran formato que representa al cóndor de los Andes y al pato careto — dos especies endémicas amenazadas del Valle del Cauca. El contraste entre la megafauna silvestre pintada y el río urbano detrás es visualmente poderoso.',
                descripcion_en: 'On the Bulevar del Río look for the large-format mural representing the Andean condor and the pato careto — two threatened endemic species of Valle del Cauca. The contrast between the painted megafauna and the urban river behind is visually powerful.',
            },
            {
                tipo: 'Seguridad',
                titulo: 'Siloé: siempre con guía local',
                titulo_en: 'Siloé: always with a local guide',
                descripcion: 'El barrio Siloé tiene una comunidad vibrante y un programa de turismo comunitario sólido, pero es un barrio de ladera popular y el visitante que sube sin guía local puede desorientarse fácilmente. Contacta a Ladera Cultura Viva antes del recorrido: @laderacultureviva en Instagram.',
                descripcion_en: 'Siloé has a vibrant community and a solid community tourism program, but it\'s a popular hillside neighborhood and a visitor going up without a local guide can easily get disoriented. Contact Ladera Cultura Viva before the tour: @laderacultureviva on Instagram.',
            },
        ],
        gamificacion: [
            {
                id: 'chal-art-1',
                type: 'TRIVIA',
                title: 'El Río como Lienzo',
                title_en: 'The River as Canvas',
                instruction: 'Encuentra en los murales del Bulevar uno que represente fauna colombiana en peligro de extinción. Fotografíalo e identifica la especie retratada.',
                instruction_en: 'Find in the Bulevar murals one representing endangered Colombian fauna. Photograph it and identify the species portrayed.',
                points_reward: 150,
                completed_message: '¡Has leído el primer capítulo del libro de paredes más largo de Cali!',
                completed_message_en: 'You have read the first chapter of Cali\'s longest wall book!',
                connection_story: 'Estás ante el circuito de murales del Bulevar del Río Cali: más de 2 km de arte público continuo sobre los muros de contención del río. Las primeras intervenciones fueron ilegales, realizadas por colectivos de grafiti en los años 90. Hoy es una galería de arte oficial que renueva sus piezas cada año con el Festival de Arte Urbano de Cali (FAUC).',
                connection_story_en: 'You are before the Bulevar del Río Cali mural circuit: over 2 km of continuous public art on the river\'s retaining walls. The first interventions were illegal, made by graffiti collectives in the 1990s. Today it\'s an official art gallery that renews its pieces annually with the Cali Urban Art Festival (FAUC).',
                quiz_data: {
                    question: '¿Cuántos kilómetros de extensión tiene el circuito de murales del Bulevar del Río Cali, convirtiéndolo en uno de los más largos de América Latina?',
                    question_en: 'How many kilometers long is the Bulevar del Río Cali mural circuit, making it one of the longest in Latin America?',
                    options: ['0.5 km', '1 km', 'Más de 2 km', '5 km'],
                    options_en: ['0.5 km', '1 km', 'More than 2 km', '5 km'],
                    correct_answer: 'Más de 2 km',
                    correct_answer_en: 'More than 2 km',
                    fun_fact: 'Durante el Festival FAUC, artistas de más de 20 países intervienen simultáneamente los muros de la ciudad durante una semana completa.',
                    fun_fact_en: 'During the FAUC Festival, artists from over 20 countries simultaneously work on the city\'s walls for a full week.'
                }
            },
            {
                id: 'chal-art-2',
                type: 'TRIVIA',
                title: 'Memoria Industrial en el Puente',
                title_en: 'Industrial Memory on the Bridge',
                instruction: 'Desde el Puente de la Cervecería, mira las garzas que anidan en los árboles del río Cali. Fotografíalas e identifica de qué especie se trata.',
                instruction_en: 'From the Puente de la Cervecería, watch the herons nesting in the trees along the Cali River. Photograph them and identify the species.',
                points_reward: 150,
                completed_message: '¡Has visto la historia industrial de Cali desde el mejor mirador posible!',
                completed_message_en: 'You have seen Cali\'s industrial history from the best possible viewpoint!',
                connection_story: 'El Puente de la Cervecería toma su nombre de la Cervecería Bavaria, fundada en este sector en 1904 — la primera industria moderna de Cali. Los galpones de ladrillo de Bavaria fueron demolidos en los años 80. Pero el nombre del puente permaneció como memoria popular, y sus columnas se convirtieron en lienzos monumentales del Festival FAUC.',
                connection_story_en: 'The Puente de la Cervecería takes its name from the Bavaria Brewery, founded in this sector in 1904 — Cali\'s first modern industry. The Bavaria brick buildings were demolished in the 1980s. But the bridge\'s name remained as popular memory, and its columns became monumental canvases for the FAUC Festival.',
                quiz_data: {
                    question: '¿En qué año fue fundada la Cervecería Bavaria en Cali, la primera empresa en Colombia en producir cerveza industrial y refrigerada?',
                    question_en: 'In what year was the Bavaria Brewery founded in Cali, the first company in Colombia to produce industrial refrigerated beer?',
                    options: ['1880', '1904', '1920', '1935'],
                    options_en: ['1880', '1904', '1920', '1935'],
                    correct_answer: '1904',
                    correct_answer_en: '1904',
                    fun_fact: 'El mural más grande del Puente de la Cervecería mide 45 metros y fue pintado en una sola noche por un colectivo de artistas durante el FAUC 2019.',
                    fun_fact_en: 'The largest mural on the Cervecería Bridge is 45 meters long and was painted in a single night by an artist collective during FAUC 2019.'
                }
            },
            {
                id: 'chal-art-3',
                type: 'TRIVIA',
                title: 'El Color que Transforma un Barrio',
                title_en: 'The Color That Transforms a Neighborhood',
                instruction: 'En los murales de Siloé, encuentra el mural que homenajea a los mineros de carbón y fotografíate junto a él.',
                instruction_en: 'In the Siloé murals, find the mural honoring the coal miners and take a photo next to it.',
                points_reward: 200,
                completed_message: '¡Has subido a uno de los miradores de arte más poderosos de Cali!',
                completed_message_en: 'You have climbed to one of Cali\'s most powerful art viewpoints!',
                connection_story: 'Siloé fue fundado en los años 20 por familias mineras que extraían carbón de la ladera occidental de Cali. Hasta los años 90, era considerado el barrio más peligroso de la ciudad. La organización Ladera Cultura Viva inició el proceso de transformación en 2010 a través de los murales y el turismo comunitario. Hoy es un destino cultural reconocido internacionalmente.',
                connection_story_en: 'Siloé was founded in the 1920s by mining families who extracted coal from Cali\'s western hillside. Until the 1990s, it was considered the city\'s most dangerous neighborhood. The organization Ladera Cultura Viva began the transformation process in 2010 through murals and community tourism. Today it\'s an internationally recognized cultural destination.',
                quiz_data: {
                    question: '¿En qué año comenzó el proceso de transformación cultural de Siloé a través del arte y el turismo comunitario impulsado por Ladera Cultura Viva?',
                    question_en: 'In what year did Siloé\'s cultural transformation process through art and community tourism, driven by Ladera Cultura Viva, begin?',
                    options: ['1995', '2003', '2010', '2018'],
                    options_en: ['1995', '2003', '2010', '2018'],
                    correct_answer: '2010',
                    correct_answer_en: '2010',
                    fun_fact: 'Varios de los murales de Siloé fueron pintados por jóvenes que nunca habían tomado un pincel antes de ingresar al programa de arte de Ladera Cultura Viva.',
                    fun_fact_en: 'Several of Siloé\'s murals were painted by young people who had never picked up a brush before joining the Ladera Cultura Viva art program.'
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 4. CALI DE PAPEL — Literatura y Cine (Caliwood)
    // Sitios: teatro-municipal → edificio-otero → biblioteca-centenario
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'route-lit',
        nombre: 'Cali de Papel',
        nombre_en: 'Cali on Paper',
        duracionMin: 120,
        descripcion: `Adéntrate en las páginas vivas de la Cali de los años 70, la época del movimiento "Caliwood" y la efervescencia literaria de Andrés Caicedo. Siguiendo los pasos de una generación de escritores, directores y soñadores que hicieron de la ciudad su musa y su campo de batalla, esta ruta explora los rincones del centro histórico que inspiraron historias de cine, locura y juventud. El Teatro Municipal donde Buenaventura inventó un nuevo teatro latinoamericano. El Edificio Otero que vio pasar a García Márquez. La Biblioteca Centenario donde reposan los manuscritos de Jorge Isaacs. Cali no se escribe, se vive — pero aquí aprenderás a leerla.`,
        descripcion_en: `Venture into the living pages of 1970s Cali, the era of the "Caliwood" movement and the literary fervor of Andrés Caicedo. Following the footsteps of a generation of writers, directors, and dreamers who made the city their muse and battlefield, this route explores the corners of the historic center that inspired stories of film, madness, and youth. The Municipal Theater where Buenaventura invented a new Latin American theater. The Otero Building that saw García Márquez pass through. The Centenario Library where Jorge Isaacs' manuscripts rest.`,
        intro_story: `Cali es una ciudad que espera, pero que no le abre la puerta a los desesperados. Lo escribió Andrés Caicedo antes de morir a los 25 años, con "¡Qué viva la música!" recién publicada. Hoy caminarás por la ciudad que él amó y odió en partes iguales, y entenderás por qué esa tensión la convirtió en literatura.`,
        intro_story_en: `Cali is a city that waits, but doesn't open its door to the desperate. Andrés Caicedo wrote this before dying at 25, with "¡Qué viva la música!" just published. Today you will walk through the city he loved and hated in equal parts, and understand why that tension turned it into literature.`,
        justificaciones: [
            'Enrique Buenaventura y el TEC inventaron el teatro moderno colombiano en el Teatro Municipal.',
            '"Caliwood" fue uno de los movimientos cinematográficos más influyentes de América Latina del siglo XX.',
            'La Biblioteca Centenario guarda los únicos manuscritos originales de Jorge Isaacs en Colombia.'
        ],
        puntos: ['teatro-municipal', 'edificio-otero', 'biblioteca-centenario'],
        reward_badge_id: 'badge-lit',
        publico: true,
        recomendaciones: [
            {
                tipo: 'Experiencia',
                titulo: 'Lee antes de caminar',
                titulo_en: 'Read before walking',
                descripcion: 'Si no has leído "¡Qué viva la música!" de Andrés Caicedo, lee aunque sea el primer capítulo antes de esta ruta. El libro está ambientado en los mismos sectores que vas a caminar y lo convierte en una experiencia de lectura viva.',
                descripcion_en: 'If you haven\'t read Andrés Caicedo\'s "¡Qué viva la música!", read at least the first chapter before this route. The book is set in the same sectors you\'ll walk and turns it into a living reading experience.',
            },
            {
                tipo: 'Mejor Hora',
                titulo: 'Mañana para leer, tarde para el teatro',
                titulo_en: 'Morning for reading, afternoon for theater',
                descripcion: 'La Biblioteca Centenario y sus archivos históricos son más accesibles en la mañana, cuando hay personal que puede orientar la consulta. Deja el Teatro Municipal para la tarde — si hay ensayo o visita guiada programada, podrás entrar a la sala principal.',
                descripcion_en: 'Centenario Library and its historical archives are more accessible in the morning, when staff are available to guide consultations. Leave the Municipal Theater for the afternoon — if there\'s a rehearsal or scheduled guided tour, you can enter the main hall.',
            },
            {
                tipo: 'Foto',
                titulo: 'La sala de la ópera',
                titulo_en: 'The opera hall',
                descripcion: 'Si logras entrar al Teatro Municipal Enrique Buenaventura, fotografía el plafón central: los frescos al temple del italiano Mauricio Ramelli con escenas de la Divina Comedia son los únicos de autoría italiana republicana en Colombia.',
                descripcion_en: 'If you manage to enter the Enrique Buenaventura Municipal Theater, photograph the central ceiling: the tempera frescoes by Italian artist Mauricio Ramelli with scenes from the Divine Comedy are the only ones of Italian Republican authorship in Colombia.',
            },
            {
                tipo: 'Planificación',
                titulo: 'Consulta la cartelera del Teatro Municipal',
                titulo_en: 'Check the Municipal Theater schedule',
                descripcion: 'Revisa en redes sociales del Teatro Municipal (@teatromunicipalcali) si hay función ese día. Ver una obra en ese escenario — aunque sea un ensayo de la Escuela de Bellas Artes — es el cierre perfecto para esta ruta literaria.',
                descripcion_en: 'Check the Municipal Theater\'s social media (@teatromunicipalcali) if there\'s a show that day. Seeing a performance at that venue — even a rehearsal from the Bellas Artes school — is the perfect close for this literary route.',
            },
        ],
        gamificacion: [
            {
                id: 'chal-lit-1',
                type: 'TRIVIA',
                title: 'El Teatro que Inventó un Método',
                title_en: 'The Theater That Invented a Method',
                instruction: 'Frente al Teatro Municipal Enrique Buenaventura, fotografía la fachada neoclásica y cuenta los pisos y las columnas que la componen.',
                instruction_en: 'In front of the Enrique Buenaventura Municipal Theater, photograph the neoclassical facade and count the floors and columns that compose it.',
                points_reward: 150,
                completed_message: '¡Estás parado frente a la joya máxima de la escena colombiana!',
                completed_message_en: 'You are standing in front of the crown jewel of Colombian theater!',
                connection_story: 'El Teatro Municipal Enrique Buenaventura fue inaugurado en 1927 con la ópera "Aida" de Verdi, interpretada por una compañía italiana traída exclusivamente para la ocasión. Su fachada neoclásica y su sala en herradura lo convierten en el único teatro de la región con capacidad técnica para producir ópera completa.',
                connection_story_en: 'The Enrique Buenaventura Municipal Theater was inaugurated in 1927 with Verdi\'s opera "Aida", performed by an Italian company brought exclusively for the occasion. Its neoclassical facade and horseshoe hall make it the only theater in the region technically capable of producing full opera.',
                quiz_data: {
                    question: '¿En qué año fue inaugurado el Teatro Municipal Enrique Buenaventura de Cali y con qué ópera?',
                    question_en: 'In what year was the Enrique Buenaventura Municipal Theater of Cali inaugurated and with what opera?',
                    options: ['1910 con Carmen', '1927 con Aida', '1935 con La Traviata', '1945 con Madama Butterfly'],
                    options_en: ['1910 with Carmen', '1927 with Aida', '1935 with La Traviata', '1945 with Madama Butterfly'],
                    correct_answer: '1927 con Aida',
                    correct_answer_en: '1927 with Aida',
                    fun_fact: 'Los frescos del plafón del teatro son obra del pintor italiano Mauricio Ramelli y representan escenas de la Divina Comedia de Dante. Son los únicos de ese tipo en Colombia.',
                    fun_fact_en: 'The theater\'s ceiling frescoes are by Italian painter Mauricio Ramelli and represent scenes from Dante\'s Divine Comedy. They are the only ones of that type in Colombia.'
                }
            },
            {
                id: 'chal-lit-2',
                type: 'TRIVIA',
                title: 'El Hotel de los Famosos',
                title_en: 'The Hotel of the Famous',
                instruction: 'Observa con detención la fachada del Edificio Otero sobre la Plaza de Cayzedo. Cuenta los detalles ornamentales de yeso: guirnaldas, pilastras, medallones.',
                instruction_en: 'Carefully observe the facade of the Otero Building on Plaza de Cayzedo. Count the plaster ornamental details: garlands, pilasters, medallions.',
                points_reward: 150,
                completed_message: '¡Has leído la fachada más elegante del centro histórico de Cali!',
                completed_message_en: 'You have read the most elegant facade in Cali\'s historic center!',
                connection_story: 'El Edificio Otero, construido en 1926 sobre una esquina de la Plaza de Cayzedo, albergó en su época dorada el Hotel Europa — el más lujoso de Cali. Por sus habitaciones pasaron figuras como García Márquez en sus visitas a la ciudad en los años 50. Hoy es uno de los pocos inmuebles republicanos del centro que conserva su volumetría original intacta.',
                connection_story_en: 'The Otero Building, built in 1926 on a corner of Plaza de Cayzedo, housed in its golden era the Hotel Europa — the most luxurious in Cali. Figures like García Márquez passed through its rooms during his city visits in the 1950s. Today it\'s one of the few Republican buildings in the center preserving its original volume intact.',
                quiz_data: {
                    question: '¿Qué importante escritor colombiano fue uno de los huéspedes del Hotel Europa, que funcionó en el Edificio Otero?',
                    question_en: 'What important Colombian writer was one of the guests at Hotel Europa, which operated in the Otero Building?',
                    options: ['Jorge Isaacs', 'Gabriel García Márquez', 'Tomás González', 'Álvaro Mutis'],
                    options_en: ['Jorge Isaacs', 'Gabriel García Márquez', 'Tomás González', 'Álvaro Mutis'],
                    correct_answer: 'Gabriel García Márquez',
                    correct_answer_en: 'Gabriel García Márquez',
                    fun_fact: 'La Plaza de Cayzedo, frente al Edificio Otero, es el kilómetro cero de Cali: todas las distancias de la ciudad se miden desde este punto.',
                    fun_fact_en: 'Plaza de Cayzedo, in front of the Otero Building, is Cali\'s kilometer zero: all distances in the city are measured from this point.'
                }
            },
            {
                id: 'chal-lit-3',
                type: 'TRIVIA',
                title: 'El Manuscrito del Valle',
                title_en: 'The Manuscript of the Valley',
                instruction: 'En la Biblioteca Centenario, pide al personal que te muestre la sección de fondos históricos o el archivo de Jorge Isaacs. Fotografía un documento histórico (con permiso del personal).',
                instruction_en: 'At Centenario Library, ask the staff to show you the historical collections section or the Jorge Isaacs archive. Photograph a historical document (with staff permission).',
                points_reward: 200,
                completed_message: '¡Has tocado la memoria literaria escrita más antigua de Cali!',
                completed_message_en: 'You have touched Cali\'s oldest written literary memory!',
                connection_story: 'La Biblioteca Centenario fue inaugurada en 1910 para conmemorar el primer siglo de la Independencia de Colombia. En sus fondos históricos reposan manuscritos originales de Jorge Isaacs — el autor de "María", la novela más importante del romanticismo latinoamericano — junto con documentos que datan de 1875.',
                connection_story_en: 'Centenario Library was inaugurated in 1910 to commemorate the first century of Colombia\'s Independence. In its historical collections rest original manuscripts by Jorge Isaacs — author of "María", the most important novel of Latin American Romanticism — along with documents dating from 1875.',
                quiz_data: {
                    question: '¿En qué año fue publicada "María" de Jorge Isaacs, la novela más importante del romanticismo latinoamericano, ambientada en las haciendas del Valle del Cauca?',
                    question_en: 'In what year was Jorge Isaacs\' "María" published, the most important novel of Latin American Romanticism, set in the Valle del Cauca haciendas?',
                    options: ['1845', '1867', '1890', '1910'],
                    options_en: ['1845', '1867', '1890', '1910'],
                    correct_answer: '1867',
                    correct_answer_en: '1867',
                    fun_fact: '"María" fue el primer best-seller latinoamericano: se agotó en pocas semanas en Colombia y fue traducida al francés en 1876, convirtiéndose en una de las primeras novelas latinoamericanas publicadas en Europa.',
                    fun_fact_en: '"María" was Latin America\'s first best-seller: it sold out in weeks in Colombia and was translated into French in 1876, becoming one of the first Latin American novels published in Europe.'
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 5. HERENCIA DE CHONTA — Afrocolombianidad
    // Sitios: monumento-piper → plaza-afro → bulevar-petronio
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'route-afro',
        nombre: 'Herencia de Chonta',
        nombre_en: 'Chonta Heritage',
        duracionMin: 200,
        descripcion: `Siente el pulso ancestral que late bajo el asfalto de Cali. 'Herencia de Chonta' es un reconocimiento profundo a la raíz africana que ha moldeado el espíritu, la música y la alegría de esta ciudad. Desde la estatua de bronce de Piper Pimienta — el cantante que hizo de las caleñas una canción universal — hasta la Plaza de la Afrocolombianidad donde se celebra la diáspora, y el Bulevar del Río donde cada agosto el Festival Petronio Álvarez convierte la ciudad en el epicentro mundial de la música del Pacífico. Esta ruta es una celebración con conciencia.`,
        descripcion_en: `Feel the ancestral pulse beating beneath Cali's asphalt. 'Chonta Heritage' is a deep acknowledgment of the African root that has shaped this city's spirit, music, and joy. From Piper Pimienta's bronze statue — the singer who made Caleñas a universal song — to the Plaza de la Afrocolombianidad celebrating the diaspora, and the Bulevar del Río where every August the Petronio Álvarez Festival turns the city into the world's epicenter of Pacific music. This route is a celebration with consciousness.`,
        intro_story: `El tambor llama a la tribu. Antes de comenzar esta ruta, descarga en tu teléfono una pieza de marimba de chonta — el instrumento declarado Patrimonio Inmaterial de la Humanidad por la UNESCO en 2015. Escúchala mientras caminas. Eso que sientes en el pecho es cuatro siglos de diáspora resonando.`,
        intro_story_en: `The drum calls the tribe. Before starting this route, download a chonta marimba piece on your phone — the instrument declared Intangible Heritage of Humanity by UNESCO in 2015. Listen to it as you walk. What you feel in your chest is four centuries of diaspora resonating.`,
        justificaciones: [
            'Cali tiene la mayor concentración de población afrodescendiente de una ciudad en Colombia: más de 500,000 personas.',
            'El Festival Petronio Álvarez es el festival de música del Pacífico más grande del mundo.',
            'La marimba de chonta es Patrimonio Inmaterial de la Humanidad (UNESCO 2015).'
        ],
        puntos: ['monumento-piper', 'plaza-afro', 'bulevar-petronio'],
        reward_badge_id: 'badge-afro',
        publico: true,
        recomendaciones: [
            {
                tipo: 'Música',
                titulo: 'Playlist del Pacífico',
                titulo_en: 'Pacific Playlist',
                descripcion: 'Para esta ruta, escucha: "Las Caleñas son como las Flores" (Piper Pimienta), cualquier álbum de Herencia de Timbiquí, y "El Marequipe" del Grupo Bahía. Es la banda sonora exacta que necesita este recorrido.',
                descripcion_en: 'For this route, listen to: "Las Caleñas son como las Flores" (Piper Pimienta), any album by Herencia de Timbiquí, and "El Marequipe" by Grupo Bahía. It\'s the exact soundtrack this walk needs.',
            },
            {
                tipo: 'Sabor',
                titulo: 'Gastronomía del Pacífico en el Bulevar',
                titulo_en: 'Pacific gastronomy at the Bulevar',
                descripcion: 'Cerca del Bulevar del Río, busca restaurantes de cocina del Pacífico: arroz con coco, encocado de camarón y pescado frito con patacón y ensalada. En agosto, durante el Petronio Álvarez, los puestos de comida del festival son una experiencia gastronómica única que no existe en ningún otro momento del año.',
                descripcion_en: 'Near the Bulevar del Río, look for Pacific cuisine restaurants: rice with coconut, coconut shrimp stew, and fried fish with patacón and salad. In August, during the Petronio Álvarez, the festival food stalls are a unique gastronomic experience that doesn\'t exist at any other time of year.',
            },
            {
                tipo: 'Experiencia',
                titulo: 'Si visitas en agosto: el Petronio',
                titulo_en: 'If visiting in August: the Petronio',
                descripcion: 'El Festival Petronio Álvarez se celebra en agosto en el Bulevar del Río. Recibe más de 150,000 visitantes. Si tu visita coincide, esta ruta se convierte en una experiencia transformadora: el Bulevar entero se transforma en un espacio de músicas, sabores y danzas del Pacífico colombiano.',
                descripcion_en: 'The Petronio Álvarez Festival takes place in August on the Bulevar del Río. It receives over 150,000 visitors. If your visit coincides, this route becomes a transformative experience: the entire Bulevar transforms into a space of Colombian Pacific music, flavors, and dances.',
            },
        ],
        gamificacion: [
            {
                id: 'chal-afro-1',
                type: 'TRIVIA',
                title: 'El Himno de las Caleñas',
                title_en: 'The Hymn of the Caleñas',
                instruction: 'Frente al Monumento a Piper Pimienta, reproduce en tu teléfono "Las Caleñas son como las Flores" y escúchala completa en ese lugar.',
                instruction_en: 'In front of the Piper Pimienta Monument, play "Las Caleñas son como las Flores" on your phone and listen to it in full at that location.',
                points_reward: 150,
                completed_message: '¡Has escuchado el himno más popular de Cali en su lugar de nacimiento!',
                completed_message_en: 'You have listened to Cali\'s most popular anthem at its birthplace!',
                connection_story: 'El Monumento a Piper Pimienta, en el Barrio Obrero, rinde homenaje a Edulfamid Molina Díaz, el cantante caleño que grabó en 1979 "Las Caleñas son como las Flores" — la canción que se convirtió en el himno popular más reconocible de Cali en todo el mundo de la salsa.',
                connection_story_en: 'The Piper Pimienta Monument in Barrio Obrero pays tribute to Edulfamid Molina Díaz, the Cali singer who recorded in 1979 "Las Caleñas son como las Flores" — the song that became Cali\'s most recognizable popular anthem throughout the salsa world.',
                quiz_data: {
                    question: '¿Cuántos artistas diferentes han grabado versiones de "Las Caleñas son como las Flores", convirtiéndola en una de las canciones de salsa más versionadas de la historia?',
                    question_en: 'How many different artists have recorded versions of "Las Caleñas son como las Flores", making it one of the most covered salsa songs in history?',
                    options: ['Más de 5', 'Más de 15', 'Más de 40', 'Más de 100'],
                    options_en: ['More than 5', 'More than 15', 'More than 40', 'More than 100'],
                    correct_answer: 'Más de 40',
                    correct_answer_en: 'More than 40',
                    fun_fact: 'Piper Pimienta era conocido por su estilo de baile: movía los hombros y los pies de forma completamente independiente, un rasgo que se convirtió en característica definitoria del baile caleño.',
                    fun_fact_en: 'Piper Pimienta was known for his dancing style: he moved his shoulders and feet completely independently, a trait that became a defining characteristic of Cali dancing.'
                }
            },
            {
                id: 'chal-afro-2',
                type: 'TRIVIA',
                title: 'La Diáspora en el Corazón de la Ciudad',
                title_en: 'The Diaspora at the Heart of the City',
                instruction: 'En la Plaza de la Afrocolombianidad, lee las placas conmemorativas y busca el nombre de Benkos Biohó. Fotografía el texto que lo menciona.',
                instruction_en: 'At the Plaza de la Afrocolombianidad, read the commemorative plaques and look for the name Benkos Biohó. Photograph the text mentioning him.',
                points_reward: 150,
                completed_message: '¡Has honrado la memoria de los líderes de la diáspora africana en Colombia!',
                completed_message_en: 'You have honored the memory of the African diaspora leaders in Colombia!',
                connection_story: 'La Plaza de la Afrocolombianidad fue inaugurada el 21 de mayo de 2001, el Día de la Afrocolombianidad. Cali es la ciudad con mayor concentración de población afrodescendiente de Colombia — más de 500,000 personas — y esta plaza es el símbolo de ese reconocimiento en el corazón de la ciudad.',
                connection_story_en: 'The Plaza de la Afrocolombianidad was inaugurated on May 21, 2001, Afro-Colombian Day. Cali is Colombia\'s city with the highest Afro-descendant population concentration — over 500,000 people — and this plaza is the symbol of that recognition at the heart of the city.',
                quiz_data: {
                    question: '¿Cuál es el instrumento musical principal de las comunidades afrocolombianas del Pacífico que fue declarado Patrimonio Inmaterial de la Humanidad por la UNESCO en 2015?',
                    question_en: 'What is the main musical instrument of Afro-Colombian Pacific communities that was declared Intangible Heritage of Humanity by UNESCO in 2015?',
                    options: ['El Bongó', 'La Marimba de Chonta', 'El Cuatro', 'La Gaita'],
                    options_en: ['The Bongo', 'The Chonta Marimba', 'The Cuatro', 'The Gaita'],
                    correct_answer: 'La Marimba de Chonta',
                    correct_answer_en: 'The Chonta Marimba',
                    fun_fact: 'Cali tiene la segunda mayor concentración de población afrodescendiente de América del Sur en una sola ciudad, después de Salvador de Bahía en Brasil.',
                    fun_fact_en: 'Cali has the second largest concentration of Afro-descendant population in South America in a single city, after Salvador de Bahia in Brazil.'
                }
            },
            {
                id: 'chal-afro-3',
                type: 'TRIVIA',
                title: 'El Festival Más Grande del Pacífico',
                title_en: 'The Largest Pacific Festival',
                instruction: 'En el Bulevar del Río (Sector Petronio), busca la placa conmemorativa del Festival Petronio Álvarez y fotografíala.',
                instruction_en: 'On the Bulevar del Río (Petronio Sector), look for the commemorative plaque of the Petronio Álvarez Festival and photograph it.',
                points_reward: 150,
                completed_message: '¡Estás parado en el escenario del festival de música del Pacífico más grande del mundo!',
                completed_message_en: 'You are standing on the stage of the world\'s largest Pacific music festival!',
                connection_story: 'El Bulevar del Río fue diseñado en 2009 por el arquitecto Giancarlo Mazzanti. El tramo que recorre esta ruta es conocido como el "Sector Petronio" porque aquí se instala cada agosto el escenario principal del Festival Petronio Álvarez, que convierte el Bulevar en el epicentro mundial de la música afropacífica.',
                connection_story_en: 'The Bulevar del Río was designed in 2009 by architect Giancarlo Mazzanti. The stretch on this route is known as the "Petronio Sector" because every August the main stage of the Petronio Álvarez Festival is set up here, transforming the Bulevar into the world\'s epicenter of Afro-Pacific music.',
                quiz_data: {
                    question: '¿Cuántos visitantes recibe aproximadamente el Festival Petronio Álvarez cada año, convirtiéndolo en el festival de música del Pacífico más grande del mundo?',
                    question_en: 'How many visitors does the Petronio Álvarez Festival receive approximately each year, making it the world\'s largest Pacific music festival?',
                    options: ['20,000', '50,000', 'Más de 150,000', 'Más de 500,000'],
                    options_en: ['20,000', '50,000', 'More than 150,000', 'More than 500,000'],
                    correct_answer: 'Más de 150,000',
                    correct_answer_en: 'More than 150,000',
                    fun_fact: 'El Festival Petronio Álvarez fue creado en 1997 y desde 2014 se realiza en el Bulevar del Río. Su nombre rinde homenaje a Petronio Álvarez, un compositor afrocolombiano del Pacífico nacido en 1864.',
                    fun_fact_en: 'The Petronio Álvarez Festival was created in 1997 and since 2014 has been held on the Bulevar del Río. Its name honors Petronio Álvarez, an Afro-Colombian Pacific composer born in 1864.'
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 6. PIEDRA Y VITRAL — Arquitectura colonial y republicana
    // Sitios: iglesia-ermita → capilla-san-antonio → edificio-gobernacion
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'route-arch',
        nombre: 'Piedra y Vitral',
        nombre_en: 'Stone and Stained Glass',
        duracionMin: 90,
        descripcion: `Viaja en el tiempo a través de las fachadas que han visto crecer a Cali durante cuatro siglos. Desde la aguja neogótica de La Ermita — guardiana del Señor de la Caña sobreviviente del terremoto de 1925 — hasta la espadaña colonial de la Capilla de San Antonio (1747), que corona la colina con vista panorámica a toda la ciudad, y los murales de mosaico del Palacio de la Gobernación que narran la historia agraria e industrial del Valle del Cauca. Esta ruta es un viaje a través de piedra, cal, vidrio y bronce que revela cómo una villa colonial se convirtió en metrópoli moderna.`,
        descripcion_en: `Travel through time across the facades that have seen Cali grow over four centuries. From La Ermita's neo-Gothic spire — guardian of the Lord of the Cane who survived the 1925 earthquake — to the colonial bell tower of San Antonio Chapel (1747) crowning the hill with panoramic city views, and the mosaic murals of the Government Palace narrating Valle del Cauca's agricultural and industrial history. This route is a journey through stone, lime, glass, and bronze.`,
        intro_story: `La piedra guarda secretos que el cemento olvidó. Cada fachada que vas a ver hoy fue construida por manos que ya no existen, en una ciudad que ya no existe — pero cuyos cimientos todavía pisas. Cuando entres a La Ermita, busca la grieta que dejó el terremoto de 1925 en el piso original: es la cicatriz que la ciudad nunca terminó de sanar.`,
        intro_story_en: `Stone holds secrets that cement forgot. Every facade you'll see today was built by hands that no longer exist, in a city that no longer exists — but whose foundations you still walk on. When you enter La Ermita, look for the crack left by the 1925 earthquake in the original floor: it's the scar the city never quite healed.`,
        justificaciones: [
            'La Ermita es el ícono arquitectónico más reproducido de Cali en el mundo.',
            'La Capilla de San Antonio (1747) es el edificio colonial mejor conservado de la ciudad.',
            'El conjunto de San Francisco concentra en media cuadra edificios de los siglos XVII, XVIII y XX.'
        ],
        puntos: ['iglesia-ermita', 'capilla-san-antonio', 'edificio-gobernacion'],
        reward_badge_id: 'badge-arch',
        publico: true,
        recomendaciones: [
            {
                tipo: 'Mejor Hora',
                titulo: 'Atardecer en La Ermita y San Antonio',
                titulo_en: 'Sunset at La Ermita and San Antonio',
                descripcion: 'Esta ruta tiene su momento mágico entre las 17:30 y las 19:00. La aguja de La Ermita se recorta contra el cielo naranja del Pacífico, y desde la Colina de San Antonio la vista panorámica al atardecer es simplemente una de las más bellas de Colombia.',
                descripcion_en: 'This route has its magic moment between 5:30 PM and 7:00 PM. La Ermita\'s spire is silhouetted against the Pacific orange sky, and from San Antonio Hill the panoramic sunset view is simply one of the most beautiful in Colombia.',
            },
            {
                tipo: 'Foto',
                titulo: 'La Ermita al atardecer desde el Bulevar',
                titulo_en: 'La Ermita at sunset from the Bulevar',
                descripcion: 'La mejor foto de La Ermita se toma desde el Bulevar del Río, a unos 100 metros al norte, con el río en primer plano y la aguja de 58 metros al fondo. A las 18:30 en días claros, la luz es perfecta para esa postal.',
                descripcion_en: 'The best photo of La Ermita is taken from the Bulevar del Río, about 100 meters to the north, with the river in the foreground and the 58-meter spire in the background. At 6:30 PM on clear days, the light is perfect for that postcard shot.',
            },
            {
                tipo: 'Experiencia',
                titulo: 'El Señor de la Caña',
                titulo_en: 'The Lord of the Cane',
                descripcion: 'Dentro de La Ermita, busca en el altar central la imagen del Señor de la Caña — el único objeto sobreviviente del terremoto de 1925. La historia de cómo fue encontrado entre los escombros sostenido por una caña de azúcar es uno de los relatos fundacionales de la identidad religiosa caleña.',
                descripcion_en: 'Inside La Ermita, look at the central altar for the image of the Lord of the Cane — the only object surviving the 1925 earthquake. The story of how it was found in the rubble supported by a sugarcane stalk is one of the founding narratives of Cali\'s religious identity.',
            },
            {
                tipo: 'Transporte',
                titulo: 'La ruta es totalmente caminable',
                titulo_en: 'The route is fully walkable',
                descripcion: 'La Ermita, el Bulevar y la Gobernación están a menos de 500 metros entre sí. La Capilla de San Antonio requiere subir la Colina a pie — el camino es empedrado y empinado, unos 10 minutos de caminata moderada. Vale la pena completamente.',
                descripcion_en: 'La Ermita, the Bulevar, and the Government building are less than 500 meters apart. San Antonio Chapel requires climbing the hill on foot — the path is cobblestone and steep, about 10 minutes of moderate walking. Completely worth it.',
            },
        ],
        gamificacion: [
            {
                id: 'chal-arch-1',
                type: 'TRIVIA',
                title: 'El Sobreviviente del Terremoto',
                title_en: 'The Earthquake Survivor',
                instruction: 'Entra a La Ermita y busca el altar central. Encuentra la imagen del "Señor de la Caña" y fotografíala (el interior del templo lo permite fuera de los servicios religiosos).',
                instruction_en: 'Enter La Ermita and find the central altar. Find the image of the "Lord of the Cane" and photograph it (the temple interior allows this outside of religious services).',
                points_reward: 150,
                completed_message: '¡Has conocido al único sobreviviente material del terremoto de 1925!',
                completed_message_en: 'You have met the only material survivor of the 1925 earthquake!',
                connection_story: 'La Iglesia de La Ermita fue construida entre 1942 y 1948 para reemplazar la estructura colonial del siglo XVII destruida por el terremoto del 18 de junio de 1925, magnitud 6.4. La imagen del Señor de la Caña fue el único objeto rescatado intacto entre los escombros.',
                connection_story_en: 'La Ermita Church was built between 1942 and 1948 to replace the 17th-century colonial structure destroyed by the earthquake of June 18, 1925, magnitude 6.4. The image of the Lord of the Cane was the only object rescued intact from the rubble.',
                quiz_data: {
                    question: '¿Cuántos metros de altura tiene la aguja central de La Ermita, convirtiéndola en uno de los campanarios más altos del suroccidente colombiano?',
                    question_en: 'How many meters tall is La Ermita\'s central spire, making it one of the tallest bell towers in southwestern Colombia?',
                    options: ['28 metros', '45 metros', '58 metros', '80 metros'],
                    options_en: ['28 meters', '45 meters', '58 meters', '80 meters'],
                    correct_answer: '58 metros',
                    correct_answer_en: '58 meters',
                    fun_fact: 'Las campanas de La Ermita fueron fundidas en Francia en 1898, antes de que se construyera el edificio actual. Viajaron de Francia a Cali en barco y en tren, llegando décadas antes que la iglesia que las albergaría.',
                    fun_fact_en: 'La Ermita\'s bells were cast in France in 1898, before the current building was constructed. They traveled from France to Cali by ship and train, arriving decades before the church that would house them.'
                }
            },
            {
                id: 'chal-arch-2',
                type: 'TRIVIA',
                title: 'La Capilla en la Cima del Tiempo',
                title_en: 'The Chapel at the Summit of Time',
                instruction: 'Sube la Colina de San Antonio. Desde el atrio de la capilla, fotografía la panorámica de 180 grados sobre Cali. Identifica en la foto el Cristo Rey en el cerro del occidente.',
                instruction_en: 'Climb San Antonio Hill. From the chapel\'s atrium, photograph the 180-degree panorama over Cali. Identify Cristo Rey on the western hill in the photo.',
                points_reward: 200,
                completed_message: '¡Has conquistado el mirador colonial más bello de Cali!',
                completed_message_en: 'You have conquered Cali\'s most beautiful colonial viewpoint!',
                connection_story: 'La Capilla de San Antonio fue construida en 1747 por los frailes franciscanos como oratorio para los campesinos y mineros de las laderas occidentales. Es el edificio colonial mejor conservado de Cali. Las imágenes de su interior fueron talladas en Quito y transportadas a lomo de mula por las rutas coloniales del Pacífico.',
                connection_story_en: 'San Antonio Chapel was built in 1747 by Franciscan friars as an oratory for the farmers and miners of the western slopes. It is Cali\'s best-preserved colonial building. The images in its interior were carved in Quito and transported by mule along colonial Pacific routes.',
                quiz_data: {
                    question: '¿En qué año fue construida la Capilla de San Antonio, el edificio colonial más antiguo y mejor conservado de Cali?',
                    question_en: 'In what year was San Antonio Chapel built, the oldest and best-preserved colonial building in Cali?',
                    options: ['1602', '1700', '1747', '1820'],
                    options_en: ['1602', '1700', '1747', '1820'],
                    correct_answer: '1747',
                    correct_answer_en: '1747',
                    fun_fact: 'El árbol de ceiba gigante que crece junto a la capilla tiene más de 200 años y es declarado árbol patrimonial de Cali. Sus raíces son anteriores a la Independencia colombiana.',
                    fun_fact_en: 'The giant ceiba tree growing next to the chapel is over 200 years old and is declared a heritage tree of Cali. Its roots predate Colombian Independence.'
                }
            },
            {
                id: 'chal-arch-3',
                type: 'TRIVIA',
                title: 'Los Murales del Valle',
                title_en: 'The Murals of the Valley',
                instruction: 'En la fachada del Palacio de la Gobernación, observa los murales de mosaico de gran formato. Identifica en ellos la representación de la caña de azúcar o la producción agraria del Valle.',
                instruction_en: 'On the Government Palace facade, observe the large-format mosaic murals. Identify in them the representation of sugarcane or agricultural production of the Valle.',
                points_reward: 150,
                completed_message: '¡Has leído la historia agraria del Valle del Cauca en una fachada!',
                completed_message_en: 'You have read the agricultural history of Valle del Cauca on a facade!',
                connection_story: 'El Palacio de la Gobernación, sede del gobierno departamental del Valle del Cauca, fue construido en los años 60 demoliendo parcialmente el histórico Convento de San Francisco del siglo XVII. Sus murales de mosaico son obra de Pedro Nel Gómez, el mismo muralista que decoró el Palacio Municipal de Medellín.',
                connection_story_en: 'The Government Palace, headquarters of the Valle del Cauca departmental government, was built in the 1960s partially demolishing the historic 17th-century San Francisco Convent. Its mosaic murals are by Pedro Nel Gómez, the same muralist who decorated Medellín\'s Municipal Palace.',
                quiz_data: {
                    question: '¿Quién es el autor de los murales de mosaico de la fachada del Palacio de la Gobernación del Valle del Cauca?',
                    question_en: 'Who is the author of the mosaic murals on the Valle del Cauca Government Palace facade?',
                    options: ['Gustavo Zalamea', 'Pedro Nel Gómez', 'Omar Rayo', 'Carlos Correa'],
                    options_en: ['Gustavo Zalamea', 'Pedro Nel Gómez', 'Omar Rayo', 'Carlos Correa'],
                    correct_answer: 'Pedro Nel Gómez',
                    correct_answer_en: 'Pedro Nel Gómez',
                    fun_fact: 'La Iglesia de San Francisco, al lado del Palacio, conserva una de las torres barrocas más bellas de toda Colombia — la Torre Mudéjar de ladrillo limpio del siglo XVIII, declarada Monumento Nacional.',
                    fun_fact_en: 'The San Francisco Church, next to the Palace, preserves one of the most beautiful baroque towers in all of Colombia — the 18th-century clean-brick Mudejar Tower, declared a National Monument.'
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 7. EL RÍO QUE CANTA — Naturaleza y río urbano
    // Sitios: gato-tejada → museo-tertulia → zoologico-cali
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'route-eco',
        nombre: 'El Río que Canta',
        nombre_en: 'The River That Sings',
        duracionMin: 180,
        descripcion: `El Río Cali no es solo un cuerpo de agua: es el alma líquida que atraviesa cuatro siglos de historia urbana. Esta ruta recorre sus orillas desde la escultura del Gato de Tejada —símbolo cívico-artístico más querido de la ciudad—, pasando por el Museo La Tertulia —nacido en 1956 en el lugar donde los caleños se bañaban en el siglo XIX—, hasta el Zoológico de Cali, el único acreditado por la AZA en Colombia, donde un tramo del río fluye entre los hábitats de jaguares, manatíes y cóndores andinos. Es una ruta que reconcilia ciudad y naturaleza.`,
        descripcion_en: `The Cali River is not just a body of water: it is the liquid soul traversing four centuries of urban history. This route walks its banks from the Gato de Tejada sculpture — the city's most beloved civic-artistic symbol — through La Tertulia Museum — born in 1956 at the spot where Caleños bathed in the 19th century — to the Cali Zoo, the only AZA-accredited one in Colombia, where a stretch of the river flows between habitats of jaguars, manatees, and Andean condors.`,
        intro_story: `El agua es el primer habitante de esta ciudad. Antes de empezar, párate en el borde del río Cali y escucha: ese murmullo de agua entre la piedra lleva siglos ahí. Las iguanas que ves en los jardines de La Tertulia llegaron aquí antes que la arquitectura. El río no espera — sigue fluyendo. Acompáñalo.`,
        intro_story_en: `Water is the city's first resident. Before starting, stand at the edge of the Cali River and listen: that murmur of water over stone has been there for centuries. The iguanas you'll see in La Tertulia's gardens arrived before the architecture. The river doesn't wait — it keeps flowing. Join it.`,
        justificaciones: [
            'El Gato de Tejada es el símbolo cívico más querido de Cali, obra de Hernando Tejada (1925-2009).',
            'La Tertulia fue el epicentro del movimiento Caliwood, uno de los más influyentes de América Latina.',
            'El Zoológico de Cali es el único acreditado por la AZA (Asociación de Zoológicos y Acuarios) en Colombia.'
        ],
        puntos: ['gato-tejada', 'museo-tertulia', 'zoologico-cali'],
        reward_badge_id: 'badge-eco',
        publico: true,
        recomendaciones: [
            {
                tipo: 'Mejor Hora',
                titulo: 'Mañana para el zoo, tarde para el gato',
                titulo_en: 'Morning for the zoo, afternoon for the cat',
                descripcion: 'Empieza en el Zoológico a las 9:00 AM — los animales están más activos en la mañana fresca. Recorre el paseo del Gato de Tejada y termina en La Tertulia para la Cinemateca de la tarde (funciones desde las 15:00). Es el orden ideal de la ruta.',
                descripcion_en: 'Start at the Zoo at 9:00 AM — the animals are most active in the cool morning. Walk the Gato de Tejada promenade and finish at La Tertulia for the afternoon Cinemateca (screenings from 3:00 PM). It\'s the ideal route order.',
            },
            {
                tipo: 'Experiencia',
                titulo: 'Las Gatas Novias: búscalas todas',
                titulo_en: 'The Girlfriend Cats: find them all',
                descripcion: 'En el paseo del río hay 19 "gatas novias" del Gato de Tejada, cada una pintada por un artista diferente. Convierte la visita en una búsqueda: ¿cuál es tu favorita? Algunas están semiocultas entre la vegetación del sendero.',
                descripcion_en: 'On the river promenade there are 19 "girlfriend cats" of Gato de Tejada, each painted by a different artist. Turn the visit into a scavenger hunt: which is your favorite? Some are semi-hidden in the path\'s vegetation.',
            },
            {
                tipo: 'Foto',
                titulo: 'Las iguanas de La Tertulia',
                titulo_en: 'The iguanas of La Tertulia',
                descripcion: 'Los jardines del Museo La Tertulia tienen una colonia permanente de iguanas verdes que conviven pacíficamente con los visitantes. Se acercan sorprendentemente. La foto de una iguana con la arquitectura del museo al fondo es una de las más singulares que te llevarás de Cali.',
                descripcion_en: 'La Tertulia Museum\'s gardens have a permanent colony of green iguanas that peacefully coexist with visitors. They get surprisingly close. A photo of an iguana with the museum\'s architecture in the background is one of the most singular shots you\'ll take in Cali.',
            },
            {
                tipo: 'Planificación',
                titulo: 'La Cinemateca La Tertulia',
                titulo_en: 'Cinemateca La Tertulia',
                descripcion: 'Consulta la cartelera de la Cinemateca La Tertulia (cinematecalatertulia.org) antes de la ruta. Si hay función de cine independiente o de los clásicos de Caliwood ese día, quédate. Es la sala de cine de autor más importante del suroccidente colombiano.',
                descripcion_en: 'Check the Cinemateca La Tertulia schedule (cinematecalatertulia.org) before the route. If there\'s an independent film or Caliwood classic screening that day, stay. It\'s the most important auteur cinema in southwestern Colombia.',
            },
        ],
        gamificacion: [
            {
                id: 'chal-eco-1',
                type: 'TRIVIA',
                title: 'El Gato y sus Novias',
                title_en: 'The Cat and His Girlfriends',
                instruction: 'Encuentra al Gato de Tejada y cuenta cuántas "gatas novias" hay a lo largo del sendero peatonal del río. Fotografía al menos tres de ellas.',
                instruction_en: 'Find the Gato de Tejada and count how many "girlfriend cats" are along the river pedestrian path. Photograph at least three of them.',
                points_reward: 150,
                completed_message: '¡Has encontrado las novias del gato más famoso de Cali!',
                completed_message_en: 'You have found the girlfriends of Cali\'s most famous cat!',
                connection_story: 'El Gato del Río fue donado a la ciudad en 1996 por el escultor caleño Hernando Tejada. En 2006 se sumaron 19 "gatas novias" — esculturas idénticas en forma pero pintadas e intervenidas por reconocidos artistas nacionales. Cada una tiene una identidad visual única que representa una faceta diferente de la identidad caleña.',
                connection_story_en: 'The Gato del Río was donated to the city in 1996 by Cali sculptor Hernando Tejada. In 2006, 19 "girlfriend cats" were added — sculptures identical in shape but painted and customized by recognized national artists. Each has a unique visual identity representing a different facet of Caleño identity.',
                quiz_data: {
                    question: '¿Cuánto pesa la escultura original del Gato de Tejada en bronce?',
                    question_en: 'How much does the original Gato de Tejada bronze sculpture weigh?',
                    options: ['500 kilogramos', '1 tonelada', '3 toneladas', '5 toneladas'],
                    options_en: ['500 kilograms', '1 ton', '3 tons', '5 tons'],
                    correct_answer: '3 toneladas',
                    correct_answer_en: '3 tons',
                    fun_fact: 'Hernando Tejada se inspiró en los gatos callejeros del barrio El Peñón, donde vivió durante más de 30 años. La escultura tardó más de 6 meses en fundirse en bronce.',
                    fun_fact_en: 'Hernando Tejada was inspired by the stray cats of El Peñón neighborhood, where he lived for over 30 years. The sculpture took over 6 months to cast in bronze.'
                }
            },
            {
                id: 'chal-eco-2',
                type: 'TRIVIA',
                title: 'La Casa del Cine Independiente',
                title_en: 'The Home of Independent Cinema',
                instruction: 'En el Museo La Tertulia, busca la sala de la Cinemateca. Lee la cartelera de funciones. Fotografía el nombre de la película o evento más próximo.',
                instruction_en: 'At La Tertulia Museum, find the Cinemateca hall. Read the screening schedule. Photograph the name of the next upcoming film or event.',
                points_reward: 150,
                completed_message: '¡Has encontrado el corazón cinematográfico de Cali!',
                completed_message_en: 'You have found the cinematographic heart of Cali!',
                connection_story: 'El Museo La Tertulia fue fundado en 1956 por Maritza Uribe de Urdinola. La Cinemateca La Tertulia fue el cuartel general del grupo Caliwood — Luis Ospina, Carlos Mayolo y Andrés Caicedo — en los años 70, cuando produjeron películas de culto que hoy se estudian en escuelas de cine de todo el mundo.',
                connection_story_en: 'La Tertulia Museum was founded in 1956 by Maritza Uribe de Urdinola. Cinemateca La Tertulia was the headquarters of the Caliwood group — Luis Ospina, Carlos Mayolo, and Andrés Caicedo — in the 1970s, when they produced cult films now studied in film schools worldwide.',
                quiz_data: {
                    question: '¿En qué año fue fundado el Museo La Tertulia, el principal museo de arte moderno y contemporáneo del suroccidente colombiano?',
                    question_en: 'In what year was La Tertulia Museum founded, the main museum of modern and contemporary art in southwestern Colombia?',
                    options: ['1940', '1956', '1968', '1975'],
                    options_en: ['1940', '1956', '1968', '1975'],
                    correct_answer: '1956',
                    correct_answer_en: '1956',
                    fun_fact: 'La colección de obra gráfica sobre papel de La Tertulia incluye grabados originales de Picasso, Miró y Botero, donados por los propios artistas en visitas a Colombia.',
                    fun_fact_en: 'La Tertulia\'s graphic work collection includes original prints by Picasso, Miró, and Botero, donated by the artists themselves during visits to Colombia.'
                }
            },
            {
                id: 'chal-eco-3',
                type: 'TRIVIA',
                title: 'El Único Manatí de Colombia en Cautiverio',
                title_en: 'Colombia\'s Only Captive Manatee',
                instruction: 'En el Zoológico de Cali, encuentra el hábitat del manatí antillano — el único en cautiverio de Colombia. Fotografíalo.',
                instruction_en: 'At the Cali Zoo, find the Antillean manatee habitat — the only captive one in Colombia. Photograph it.',
                points_reward: 200,
                completed_message: '¡Has visto al único manatí en cautiverio de Colombia!',
                completed_message_en: 'You have seen Colombia\'s only captive manatee!',
                connection_story: 'El Zoológico de Cali fue fundado en 1969 y en 1993 se convirtió en el primer y único zoológico de Colombia acreditado por la AZA (Asociación de Zoológicos y Acuarios de Norteamérica). Un tramo del río Cali fluye a través del zoológico, integrando el ecosistema fluvial natural en el recorrido de los visitantes.',
                connection_story_en: 'The Cali Zoo was founded in 1969 and in 1993 became Colombia\'s first and only zoo accredited by the AZA (Association of Zoos and Aquariums of North America). A stretch of the Cali River flows through the zoo, integrating the natural river ecosystem into the visitor experience.',
                quiz_data: {
                    question: '¿Cuántos cóndores andinos ha reintroducido a su hábitat natural el programa de conservación del Zoológico de Cali en los últimos 20 años?',
                    question_en: 'How many Andean condors has the Cali Zoo\'s conservation program reintroduced to their natural habitat in the last 20 years?',
                    options: ['5 cóndores', '15 cóndores', 'Más de 30 cóndores', 'Más de 100 cóndores'],
                    options_en: ['5 condors', '15 condors', 'More than 30 condors', 'More than 100 condors'],
                    correct_answer: 'Más de 30 cóndores',
                    correct_answer_en: 'More than 30 condors',
                    fun_fact: 'El zoológico tiene el único manatí antillano en cautiverio de Colombia, nacido en el propio zoológico. El manatí antillano está en peligro crítico de extinción en todo el Caribe y el Pacífico colombiano.',
                    fun_fact_en: 'The zoo has Colombia\'s only captive Antillean manatee, born at the zoo itself. The Antillean manatee is critically endangered throughout the Caribbean and Colombian Pacific.'
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 8. TABLADOS Y MÁSCARAS — Teatro
    // Sitios: teatro-jorge-isaacs → casa-comedia → tec-teatro-experimental
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'route-theater',
        nombre: 'Tablados y Máscaras',
        nombre_en: 'Stages and Masks',
        duracionMin: 160,
        descripcion: `¡Arriba el telón! Cali respira drama, comedia y pasión en sus escenarios desde 1927. Esta ruta te lleva por tres universos teatrales radicalmente distintos: el art déco aristocrático del Teatro Jorge Isaacs, donde la élite caleña vio las primeras películas de Hollywood y hoy vibra con conciertos de jazz; la intimidad irreverente de Casa Comedia, el único espacio de Colombia dedicado exclusivamente a las artes cómicas con "risa garantizada"; y la sede del TEC de Enrique Buenaventura, la institución que inventó el teatro moderno colombiano y cuyo método de Creación Colectiva se enseña hoy en universidades de todo el mundo.`,
        descripcion_en: `Curtain up! Cali has breathed drama, comedy, and passion on its stages since 1927. This route takes you through three radically different theatrical worlds: the aristocratic art deco of Teatro Jorge Isaacs, where Cali's elite saw Hollywood's first films and today vibrates with jazz concerts; the irreverent intimacy of Casa Comedia, Colombia's only space exclusively dedicated to comic arts with "guaranteed laughter"; and the TEC headquarters of Enrique Buenaventura, the institution that invented modern Colombian theater whose Collective Creation method is taught today at universities worldwide.`,
        intro_story: `La vida es teatro, el resto es utilería. Pero no todo teatro es igual: el Jorge Isaacs fue la puerta de Hollywood a Cali; el TEC fue la puerta de la revolución cultural; Casa Comedia es la puerta de la verdad que solo puede decirse con humor. Hoy vas a cruzar las tres.`,
        intro_story_en: `Life is theater, the rest is props. But not all theater is equal: the Jorge Isaacs was Hollywood's door to Cali; TEC was the door of cultural revolution; Casa Comedia is the door of truth that can only be told through humor. Today you\'ll cross all three.`,
        justificaciones: [
            'El Teatro Jorge Isaacs es el último teatro art déco en pie de Cali y uno de los pocos de Colombia.',
            'El TEC de Enrique Buenaventura lleva más de 70 años de actividad ininterrumpida: la compañía teatral más antigua del país.',
            'Casa Comedia es la única sala concertada especializada en humor del suroccidente colombiano.'
        ],
        puntos: ['teatro-jorge-isaacs', 'casa-comedia', 'tec-teatro-experimental'],
        reward_badge_id: 'badge-theater',
        publico: true,
        recomendaciones: [
            {
                tipo: 'Planificación',
                titulo: 'Compra boletas antes de salir',
                titulo_en: 'Buy tickets before leaving',
                descripcion: 'Revisa la cartelera del Teatro Jorge Isaacs y de Casa Comedia antes de hacer la ruta. Las funciones de los jueves y viernes en ambos lugares se agotan con frecuencia. Si puedes ver una obra en cualquiera de los dos durante el mismo día de la ruta, hazlo.',
                descripcion_en: 'Check the Teatro Jorge Isaacs and Casa Comedia schedule before doing the route. Thursday and Friday shows at both venues often sell out. If you can see a show at either during the same day as the route, do it.',
            },
            {
                tipo: 'Experiencia',
                titulo: 'El Open Mic de Casa Comedia',
                titulo_en: 'The Casa Comedia Open Mic',
                descripcion: 'Los viernes de "Open Mic" en Casa Comedia son completamente gratuitos: cualquier persona puede subir al escenario 5 minutos a contar sus chistes. Si tienes algo que decir, sube. La sala es tu red de seguridad.',
                descripcion_en: 'Friday "Open Mic" nights at Casa Comedia are completely free: anyone can take the stage for 5 minutes to tell their jokes. If you have something to say, go up. The room is your safety net.',
            },
            {
                tipo: 'Foto',
                titulo: 'La cúpula de estrellas del Jorge Isaacs',
                titulo_en: 'The star dome of the Jorge Isaacs',
                descripcion: 'Si logras entrar al Teatro Jorge Isaacs, mira hacia arriba: la cúpula interior tiene una pintura de estrellas que se ilumina con luz ultravioleta durante los espectáculos nocturnos. Pregunta al personal si la pueden encender durante la visita.',
                descripcion_en: 'If you get inside Teatro Jorge Isaacs, look up: the interior dome has a star painting that lights up with ultraviolet light during evening performances. Ask the staff if they can turn it on during the visit.',
            },
            {
                tipo: 'Mejor Hora',
                titulo: 'Tarde-noche para los teatros',
                titulo_en: 'Afternoon-evening for the theaters',
                descripcion: 'El Teatro Jorge Isaacs y Casa Comedia tienen sus actividades principales en la tarde-noche (funciones desde las 19:00-20:00). Visita el TEC en la mañana cuando hay ensayos (y a veces los permiten observar), y deja los otros dos para cuando caiga la noche.',
                descripcion_en: 'Teatro Jorge Isaacs and Casa Comedia have their main activities in the afternoon-evening (shows from 7:00-8:00 PM). Visit TEC in the morning when rehearsals happen (and sometimes observers are allowed), and leave the other two for when night falls.',
            },
        ],
        gamificacion: [
            {
                id: 'chal-theater-1',
                type: 'TRIVIA',
                title: 'El Último Art Déco en Pie',
                title_en: 'The Last Standing Art Deco',
                instruction: 'Frente al Teatro Jorge Isaacs, identifica en la fachada al menos tres elementos del estilo art déco: motivos geométricos, franjas de azulejos, o detalles de hierro forjado.',
                instruction_en: 'In front of Teatro Jorge Isaacs, identify on the facade at least three art deco style elements: geometric motifs, tile strips, or wrought iron details.',
                points_reward: 150,
                completed_message: '¡Has leído el arte de los años 30 en una fachada del centro de Cali!',
                completed_message_en: 'You have read the 1930s art on a downtown Cali facade!',
                connection_story: 'El Teatro Jorge Isaacs fue inaugurado en 1936 por Bavaria Cinema como sala exclusiva de estreno de películas de Hollywood. En los años 40 fue el único lugar en Cali donde se proyectaban filmes en formato 35mm con sonido sincronizado. Hoy restaurado como sala de artes escénicas, es el último teatro art déco en pie de la ciudad.',
                connection_story_en: 'Teatro Jorge Isaacs was inaugurated in 1936 by Bavaria Cinema as an exclusive premiere hall for Hollywood films. In the 1940s it was the only place in Cali where films were projected in 35mm format with synchronized sound. Now restored as a performing arts hall, it is the last standing art deco theater in the city.',
                quiz_data: {
                    question: '¿Qué estilo arquitectónico define la fachada del Teatro Jorge Isaacs, construido en 1936 por Bavaria Cinema?',
                    question_en: 'What architectural style defines the facade of Teatro Jorge Isaacs, built in 1936 by Bavaria Cinema?',
                    options: ['Neoclásico', 'Art Déco', 'Modernismo Brutalista', 'Barroco Colonial'],
                    options_en: ['Neoclassical', 'Art Deco', 'Brutalist Modernism', 'Colonial Baroque'],
                    correct_answer: 'Art Déco',
                    correct_answer_en: 'Art Deco',
                    fun_fact: 'Jorge Isaacs nació en Cali en 1837. Su novela "María" fue el primer libro colombiano en ser traducido al francés, publicado en París en 1876.',
                    fun_fact_en: 'Jorge Isaacs was born in Cali in 1837. His novel "María" was the first Colombian book translated into French, published in Paris in 1876.'
                }
            },
            {
                id: 'chal-theater-2',
                type: 'TRIVIA',
                title: 'La Risa Garantizada',
                title_en: 'The Guaranteed Laugh',
                instruction: 'En Casa Comedia, busca en la pared de entrada el listado de artistas que han pasado por el escenario. Cuenta cuántos nombres reconoces.',
                instruction_en: 'At Casa Comedia, find the list of artists who have performed on the stage on the entrance wall. Count how many names you recognize.',
                points_reward: 150,
                completed_message: '¡Bienvenido al único espacio de Colombia donde el humor es tomado muy en serio!',
                completed_message_en: 'Welcome to the only space in Colombia where humor is taken very seriously!',
                connection_story: 'Casa Comedia fue fundada en 2005 por el actor y director caleño Tato Torres. En 2012 fue reconocida por el Ministerio de Cultura como Sala de Teatro Concertada — la única especializada en humor del suroccidente colombiano. Más de 30 comediantes que hoy tienen proyección nacional e internacional tuvieron aquí su primer escenario.',
                connection_story_en: 'Casa Comedia was founded in 2005 by Cali actor and director Tato Torres. In 2012 it was recognized by the Ministry of Culture as a Concerted Theater Hall — the only one specializing in humor in southwestern Colombia. Over 30 comedians who today have national and international reach had their first stage here.',
                quiz_data: {
                    question: '¿Cuántos minutos tiene cada participante del "Open Mic" gratuito de los viernes en Casa Comedia para contar sus chistes?',
                    question_en: 'How many minutes does each participant in Casa Comedia\'s free Friday "Open Mic" have to tell their jokes?',
                    options: ['2 minutos', '5 minutos', '10 minutos', '15 minutos'],
                    options_en: ['2 minutes', '5 minutes', '10 minutes', '15 minutes'],
                    correct_answer: '5 minutos',
                    correct_answer_en: '5 minutes',
                    fun_fact: 'Casa Comedia tiene una política única en Colombia: si el espectador no ríe en ningún momento durante la función, le devuelven el valor de la boleta.',
                    fun_fact_en: 'Casa Comedia has a policy unique in Colombia: if the spectator doesn\'t laugh at any point during the show, they get their ticket price refunded.'
                }
            },
            {
                id: 'chal-theater-3',
                type: 'TRIVIA',
                title: 'El Método que Cambió el Teatro',
                title_en: 'The Method That Changed Theater',
                instruction: 'En la sede del TEC, busca información sobre el método de Creación Colectiva de Enrique Buenaventura. Si hay ensayo visible, obsérvalo unos minutos.',
                instruction_en: 'At TEC headquarters, find information about Enrique Buenaventura\'s Collective Creation method. If there\'s a visible rehearsal, observe it for a few minutes.',
                points_reward: 200,
                completed_message: '¡Has conocido la institución que inventó el teatro moderno colombiano!',
                completed_message_en: 'You have met the institution that invented modern Colombian theater!',
                connection_story: 'El Teatro Experimental de Cali (TEC) fue fundado en 1955 por Enrique Buenaventura. Su obra "Los Papeles del Infierno" (1967) fue censurada por el gobierno colombiano y se convirtió en símbolo de la resistencia cultural. El TEC representó a Colombia en festivales de Francia, Alemania, Polonia y México durante los años 70 y 80.',
                connection_story_en: 'The Teatro Experimental de Cali (TEC) was founded in 1955 by Enrique Buenaventura. His work "Los Papeles del Infierno" (1967) was censored by the Colombian government and became a symbol of cultural resistance. TEC represented Colombia at festivals in France, Germany, Poland, and Mexico during the 1970s and 80s.',
                quiz_data: {
                    question: '¿En qué año fundó Enrique Buenaventura el Teatro Experimental de Cali (TEC), la compañía teatral más antigua de Colombia?',
                    question_en: 'In what year did Enrique Buenaventura found the Teatro Experimental de Cali (TEC), Colombia\'s oldest theater company?',
                    options: ['1945', '1955', '1965', '1972'],
                    options_en: ['1945', '1955', '1965', '1972'],
                    correct_answer: '1955',
                    correct_answer_en: '1955',
                    fun_fact: 'El método de Creación Colectiva del TEC influyó directamente en el surgimiento de grupos de teatro político en Chile, Argentina y Venezuela en los años 70, y se enseña hoy en universidades de teatro de Europa y Estados Unidos.',
                    fun_fact_en: 'TEC\'s Collective Creation method directly influenced the emergence of political theater groups in Chile, Argentina, and Venezuela in the 1970s, and is taught today at theater universities in Europe and the United States.'
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 9. RUTA DE LA MEMORIA OCULTA — Historia popular y archivos
    // Sitios: museo-salsa-obrero → archivo-historico → museos-ladera
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'route-history',
        nombre: 'Ruta de la Memoria Oculta',
        nombre_en: 'Route of Hidden Memory',
        duracionMin: 210,
        descripcion: `La historia no siempre está en los libros escolares — a veces se esconde en los cajones de un archivo centenario, en los álbumes de fotografías de un músico de barrio o en los objetos cotidianos que los vecinos de una ladera han donado a su propio museo. Esta ruta desanda el camino de la memoria oficial para encontrar la historia que se construye desde abajo: el Museo de la Salsa donde Carlos Molina guardó la historia de un pueblo en imágenes; el Archivo Histórico con documentos que datan de 1536; y los Museos de Ladera donde las comunidades de la ladera occidental de Cali son las curadoras de su propia historia.`,
        descripcion_en: `History is not always in school textbooks — sometimes it hides in the drawers of a century-old archive, in the photo albums of a neighborhood musician, or in the everyday objects that hillside neighbors have donated to their own museum. This route traces the path of official memory to find the history built from below: the Salsa Museum where Carlos Molina preserved a people's history in images; the Historical Archive with documents dating from 1536; and the Ladera Museums where the communities of Cali's western hillside curate their own history.`,
        intro_story: `La verdad está en los cajones que nadie abre. El Archivo Histórico de Cali guarda documentos del año 1536 — apenas 9 años después de la fundación de la ciudad. ¿Quiénes eran los que firmaban esas actas? ¿Qué tenían en la mente? Hoy vas a abrir algunos de esos cajones.`,
        intro_story_en: `The truth is in the drawers nobody opens. Cali's Historical Archive holds documents from 1536 — just 9 years after the city's founding. Who were the ones signing those records? What was on their minds? Today you\'ll open some of those drawers.`,
        justificaciones: [
            'El Archivo Histórico de Cali guarda documentos desde 1536 — los más antiguos de la historia escrita de la ciudad.',
            'El Museo de la Salsa de Carlos Molina es el repositorio fotográfico salsero más antiguo del mundo.',
            'Los Museos de Ladera son un modelo internacional de museología comunitaria autogestionada.'
        ],
        puntos: ['museo-salsa-obrero', 'archivo-historico', 'museos-ladera'],
        reward_badge_id: 'badge-history',
        publico: true,
        recomendaciones: [
            {
                tipo: 'Planificación',
                titulo: 'Contacta los Museos de Ladera con anticipación',
                titulo_en: 'Contact the Ladera Museums in advance',
                descripcion: 'Los Museos de Ladera abren los sábados y domingos de 10:00 a 16:00, y los grupos de lunes a viernes con cita previa. Si visitas entre semana, contacta a Ladera Cultura Viva (@laderacultureviva en Instagram) con al menos un día de anticipación.',
                descripcion_en: 'The Ladera Museums open Saturdays and Sundays 10:00 AM to 4:00 PM, and groups Monday to Friday by appointment. If visiting on a weekday, contact Ladera Cultura Viva (@laderacultureviva on Instagram) at least one day in advance.',
            },
            {
                tipo: 'Experiencia',
                titulo: 'Pide la consulta de fondos históricos en el Archivo',
                titulo_en: 'Request historical records consultation at the Archive',
                descripcion: 'En el Archivo Histórico de Cali, pide a un archivista que te muestre el documento más antiguo que tienen: el acta notarial de 1536. No está en vitrina — está en una caja de conservación. Esa experiencia no tiene precio.',
                descripcion_en: 'At Cali\'s Historical Archive, ask an archivist to show you the oldest document they have: the 1536 notarial record. It\'s not in a display case — it\'s in a conservation box. That experience is priceless.',
            },
            {
                tipo: 'Foto',
                titulo: 'El primer documento de Cali',
                titulo_en: 'Cali\'s first document',
                descripcion: 'El acta notarial de 1536 del Archivo Histórico — si te permiten fotografiarla con cuidado — es la foto más poderosa que puedes traerte de esta ruta. Tiene 490 años y en ella está escrita la historia del primer año de existencia de Cali.',
                descripcion_en: 'The 1536 notarial record from the Historical Archive — if you\'re allowed to photograph it carefully — is the most powerful photo you can take on this route. It\'s 490 years old and in it is written the history of Cali\'s first year of existence.',
            },
        ],
        gamificacion: [
            {
                id: 'chal-history-1',
                type: 'TRIVIA',
                title: 'El Archivo más Antiguo de la Ciudad',
                title_en: 'The City\'s Oldest Archive',
                instruction: 'Visita el Archivo Histórico de Cali en el Centro Cultural. Pregunta por el documento más antiguo de su colección y anota el año en que fue escrito.',
                instruction_en: 'Visit Cali\'s Historical Archive at the Cultural Center. Ask about the oldest document in their collection and note the year it was written.',
                points_reward: 200,
                completed_message: '¡Has tocado el primer capítulo escrito de la historia de Cali!',
                completed_message_en: 'You have touched the first written chapter of Cali\'s history!',
                connection_story: 'El Archivo Histórico de Cali, en el Centro Cultural (antigua sede de la FES), alberga documentos desde 1536 — apenas 9 años después de la fundación de Cali por Sebastián de Belalcázar. Sus fondos incluyen las primeras actas del cabildo, testamentos coloniales y los primeros libros de bautismo de la Catedral de San Pedro.',
                connection_story_en: 'Cali\'s Historical Archive, at the Cultural Center (former FES headquarters), holds documents from 1536 — just 9 years after Cali\'s founding by Sebastián de Belalcázar. Its collections include the first town council minutes, colonial wills, and the first baptism books of San Pedro Cathedral.',
                quiz_data: {
                    question: '¿En qué año data el documento escrito más antiguo del Archivo Histórico de Cali?',
                    question_en: 'What year is the oldest written document in Cali\'s Historical Archive from?',
                    options: ['1492', '1536', '1600', '1710'],
                    options_en: ['1492', '1536', '1600', '1710'],
                    correct_answer: '1536',
                    correct_answer_en: '1536',
                    fun_fact: 'El proceso de digitalización del Archivo Histórico de Cali, iniciado en 2010, ha puesto en línea más de 500,000 folios históricos accesibles para cualquier persona en el mundo.',
                    fun_fact_en: 'Cali Historical Archive\'s digitization process, started in 2010, has put over 500,000 historical folios online, accessible to anyone in the world.'
                }
            },
            {
                id: 'chal-history-2',
                type: 'TRIVIA',
                title: 'La Historia en Imágenes del Barrio Obrero',
                title_en: 'Barrio Obrero\'s History in Images',
                instruction: 'En el Museo de la Salsa, busca la foto más antigua de la colección. Pregunta al fundador o al personal qué año tiene esa fotografía.',
                instruction_en: 'At the Salsa Museum, find the oldest photo in the collection. Ask the founder or staff what year that photograph is from.',
                points_reward: 150,
                completed_message: '¡Has visto el primer fotograma de la historia visual de la salsa en Cali!',
                completed_message_en: 'You have seen the first frame of Cali salsa\'s visual history!',
                connection_story: 'El Museo de la Salsa del Barrio Obrero tiene más de 40,000 fotografías analógicas originales. Carlos Molina comenzó a coleccionar en los años 60 cuando todavía era imposible imaginar que ese gesto personal se convertiría en el archivo fotográfico salsero más antiguo del mundo.',
                connection_story_en: 'Barrio Obrero\'s Salsa Museum holds over 40,000 original analog photographs. Carlos Molina began collecting in the 1960s when it was still impossible to imagine that personal gesture would become the world\'s oldest salsa photographic archive.',
                quiz_data: {
                    question: '¿Cuántas fotografías analógicas originales guarda el Museo de la Salsa del Barrio Obrero?',
                    question_en: 'How many original analog photographs does Barrio Obrero\'s Salsa Museum hold?',
                    options: ['1,000', '10,000', 'Más de 40,000', 'Más de 200,000'],
                    options_en: ['1,000', '10,000', 'More than 40,000', 'More than 200,000'],
                    correct_answer: 'Más de 40,000',
                    correct_answer_en: 'More than 40,000',
                    fun_fact: 'En la colección del Museo de la Salsa hay vinilos firmados por Celia Cruz, Willie Colón y Rubén Blades, donados por los propios artistas durante sus visitas a Cali.',
                    fun_fact_en: 'The Salsa Museum\'s collection includes vinyls signed by Celia Cruz, Willie Colón, and Rubén Blades, donated by the artists themselves during their visits to Cali.'
                }
            },
            {
                id: 'chal-history-3',
                type: 'TRIVIA',
                title: 'El Museo que Hizo su Propio Pueblo',
                title_en: 'The Museum Made by Its Own People',
                instruction: 'En los Museos de Ladera, encuentra y fotografía el objeto más antiguo de la exposición. Pregunta a los guías comunitarios quién lo donó.',
                instruction_en: 'At the Ladera Museums, find and photograph the oldest object in the exhibition. Ask the community guides who donated it.',
                points_reward: 200,
                completed_message: '¡Has conocido la memoria más viva y honesta de Cali popular!',
                completed_message_en: 'You have met the most alive and honest memory of popular Cali!',
                connection_story: 'Los Museos de Ladera en la ladera occidental de Cali son un proyecto pionero de museología comunitaria autogestionada. El primer museo fue inaugurado en 2008 en Siloé por la organización Ladera Cultura Viva. El proyecto fue finalista del Premio Iberoamericano de Patrimonio Inmaterial en 2019.',
                connection_story_en: 'The Ladera Museums on Cali\'s western hillside are a pioneering self-managed community museology project. The first museum was inaugurated in 2008 in Siloé by the Ladera Cultura Viva organization. The project was a finalist for the Ibero-American Intangible Heritage Award in 2019.',
                quiz_data: {
                    question: '¿En qué año fue inaugurado el primer Museo de Ladera en el barrio Siloé de Cali?',
                    question_en: 'In what year was the first Ladera Museum inaugurated in Cali\'s Siloé neighborhood?',
                    options: ['1998', '2004', '2008', '2015'],
                    options_en: ['1998', '2004', '2008', '2015'],
                    correct_answer: '2008',
                    correct_answer_en: '2008',
                    fun_fact: 'Uno de los Museos de Ladera exhibe más de 200 herramientas de minería artesanal de carbón que datan de los años 40, donadas por familias de mineros del barrio Siloé.',
                    fun_fact_en: 'One of the Ladera Museums exhibits over 200 artisanal coal mining tools dating from the 1940s, donated by mining families from the Siloé neighborhood.'
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 10. TRIBU: EL DEPORTE ES CULTURA — Deporte y comunidad
    // Sitios: canchas-panamericanas → polideportivos-barriales
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'route-sport',
        nombre: 'Tribu: El Deporte es Cultura',
        nombre_en: 'Tribe: Sport Is Culture',
        duracionMin: 140,
        descripcion: `En Cali, el deporte no es entretenimiento — es un rito de transformación y un proyecto político de ciudad. La "Capital Deportiva de América" lo es por la densidad de sus campeones, sí, pero sobre todo por la densidad de sus escenarios deportivos barriales: espacios donde cada tarde se forjan liderazgos, se construye tejido social y se aleja a los jóvenes de la violencia. Esta ruta explora el velódromo que produce ciclistas olímpicos y los polideportivos que los formaron, para entender cómo el deporte se convirtió en la política pública más exitosa de Cali.`,
        descripcion_en: `In Cali, sport is not entertainment — it's a rite of transformation and a political city project. The "Sports Capital of America" earns that title not only from its density of champions but above all from the density of its neighborhood sports facilities: spaces where every afternoon, leaderships are forged, social fabric is built, and youth are kept away from violence. This route explores the velodrome that produces Olympic cyclists and the neighborhood sports centers that trained them.`,
        intro_story: `Suda la camiseta, gana el respeto, construye la paz. El Estadio Pascual Guerrero, las Canchas Panamericanas y los polideportivos de barrio forman una red que va desde la élite deportiva hasta el fútbol de domingo en potrero. Hoy vas a caminar por ambos extremos de esa red.`,
        intro_story_en: `Sweat your jersey, earn respect, build peace. Pascual Guerrero Stadium, the Canchas Panamericanas, and neighborhood sports centers form a network stretching from sporting elite to Sunday soccer on a dirt field. Today you\'ll walk both ends of that network.`,
        justificaciones: [
            'Los VII Juegos Panamericanos de Cali (1971) fueron los primeros en celebrarse en una ciudad hispanohablante.',
            'El velódromo de las Canchas Panamericanas es considerado uno de los tres mejores del mundo para ciclismo de pista.',
            'Los polideportivos barriales de Cali tienen la red más densa de Colombia: 1 por cada 8,000 habitantes.'
        ],
        puntos: ['canchas-panamericanas', 'polideportivos-barriales'],
        reward_badge_id: 'badge-sport',
        publico: true,
        recomendaciones: [
            {
                tipo: 'Mejor Hora',
                titulo: 'Sábado al mediodía para los polideportivos',
                titulo_en: 'Saturday midday for sports centers',
                descripcion: 'Los sábados a partir de las 11:00 AM los polideportivos barriales tienen sus torneos de microfútbol más intensos. Es cuando se despliega todo el tejido social del barrio alrededor del deporte: familias, barras, vendedores de fritanga. Es la sociedad caleña en miniatura.',
                descripcion_en: 'On Saturdays from 11:00 AM the neighborhood sports centers have their most intense indoor soccer tournaments. That\'s when all the neighborhood\'s social fabric unfolds around sport: families, fan groups, fried food vendors. It\'s Caleño society in miniature.',
            },
            {
                tipo: 'Experiencia',
                titulo: 'Si puedes ver una competencia de ciclismo de pista',
                titulo_en: 'If you can watch a track cycling competition',
                descripcion: 'Consulta en el velódromo de las Canchas Panamericanas si hay competencia de pista ese día — la Federación Colombiana de Ciclismo organiza pruebas con frecuencia. Ver a los ciclistas caleños en el velódromo es una experiencia de intensidad acústica y visual que no existe en ninguna otra disciplina deportiva.',
                descripcion_en: 'Check at the Canchas Panamericanas velodrome if there\'s a track competition that day — the Colombian Cycling Federation organizes events frequently. Watching Caleño cyclists in the velodrome is an acoustic and visual intensity experience that doesn\'t exist in any other sport.',
            },
            {
                tipo: 'Foto',
                titulo: 'El velódromo desde adentro',
                titulo_en: 'The velodrome from inside',
                descripcion: 'El velódromo cubierto de las Canchas Panamericanas tiene una estructura interior de madera laminada con curvas de peralte de 45 grados que son únicas en América Latina. La fotografía desde el centro de la pista hacia arriba, con la cubierta y las curvas como marco, es extraordinaria.',
                descripcion_en: 'The Canchas Panamericanas covered velodrome has an interior laminated wood structure with 45-degree banked curves unique in Latin America. The photo from the center of the track looking up, with the roof and curves as frame, is extraordinary.',
            },
        ],
        gamificacion: [
            {
                id: 'chal-sport-1',
                type: 'TRIVIA',
                title: 'El Velódromo Más Rápido del Mundo',
                title_en: 'The World\'s Fastest Velodrome',
                instruction: 'En el velódromo de las Canchas Panamericanas, entra al recinto y fotografía la pista de madera con sus curvas de peralte. Mide visualmente el ángulo de inclinación de las curvas.',
                instruction_en: 'At the Canchas Panamericanas velodrome, enter the venue and photograph the wooden track with its banked curves. Visually estimate the angle of inclination of the curves.',
                points_reward: 200,
                completed_message: '¡Estás parado en uno de los tres mejores velódromos del mundo!',
                completed_message_en: 'You are standing in one of the three best velodromes in the world!',
                connection_story: 'Las Canchas Panamericanas (Unidad Deportiva Jaime Aparicio) fueron construidas para los VII Juegos Panamericanos de 1971 — los primeros en celebrarse en una ciudad hispanohablante. Sus 14 escenarios deportivos transformaron para siempre el modelo de infraestructura deportiva de Cali y de Colombia.',
                connection_story_en: 'The Canchas Panamericanas (Jaime Aparicio Sports Complex) were built for the VII Pan American Games of 1971 — the first to take place in a Spanish-speaking city. Its 14 sports venues forever transformed the model of sports infrastructure in Cali and Colombia.',
                quiz_data: {
                    question: '¿En qué año se realizaron los VII Juegos Panamericanos en Cali, siendo los primeros en una ciudad hispanohablante?',
                    question_en: 'In what year were the VII Pan American Games held in Cali, being the first in a Spanish-speaking city?',
                    options: ['1963', '1967', '1971', '1975'],
                    options_en: ['1963', '1967', '1971', '1975'],
                    correct_answer: '1971',
                    correct_answer_en: '1971',
                    fun_fact: 'Los Juegos Panamericanos de Cali 1971 fueron los primeros en toda América en transmitirse en color por televisión.',
                    fun_fact_en: 'The Cali 1971 Pan American Games were the first in all of the Americas to be broadcast in color on television.'
                }
            },
            {
                id: 'chal-sport-2',
                type: 'TRIVIA',
                title: 'El Polideportivo como Política de Paz',
                title_en: 'The Sports Center as Peace Policy',
                instruction: 'Visita un polideportivo barrial activo. Observa qué actividades se desarrollan en ese momento y habla con un instructor o usuario habitual.',
                instruction_en: 'Visit an active neighborhood sports center. Observe what activities are taking place at that moment and talk with an instructor or regular user.',
                points_reward: 150,
                completed_message: '¡Has entendido por qué el deporte es la política pública más poderosa de Cali!',
                completed_message_en: 'You have understood why sport is Cali\'s most powerful public policy!',
                connection_story: 'La red de polideportivos barriales de Cali es la más densa de Colombia: hay uno por cada 8,000 habitantes en promedio. Investigaciones de la Universidad del Valle han demostrado que en los barrios con polideportivo activo los índices de violencia juvenil son hasta un 40% menores que en los que no tienen infraestructura deportiva.',
                connection_story_en: 'Cali\'s neighborhood sports center network is Colombia\'s densest: one for every 8,000 residents on average. Research from Universidad del Valle has shown that neighborhoods with an active sports center have youth violence rates up to 40% lower than those without sports infrastructure.',
                quiz_data: {
                    question: '¿En cuánto se reduce el índice de violencia juvenil en los barrios de Cali que tienen un polideportivo activo, según la investigación de la Universidad del Valle?',
                    question_en: 'By how much are youth violence rates reduced in Cali neighborhoods with an active sports center, according to Universidad del Valle research?',
                    options: ['10%', '20%', 'Hasta 40%', 'Hasta 70%'],
                    options_en: ['10%', '20%', 'Up to 40%', 'Up to 70%'],
                    correct_answer: 'Hasta 40%',
                    correct_answer_en: 'Up to 40%',
                    fun_fact: 'Varios campeones mundiales de boxeo y ciclismo caleños comenzaron su formación en los polideportivos barriales de sus comunas, sin ninguna instalación técnica especial — solo canchas, entrenadores y voluntad.',
                    fun_fact_en: 'Several Cali world boxing and cycling champions began their training at the neighborhood sports centers of their communes, with no special technical facilities — just courts, coaches, and willpower.'
                }
            }
        ]
    }
];
