
import { Ruta, Challenge } from '../types';

export const CULTURAL_ROUTES: Ruta[] = [
    {
        id: 'route-salsa',
        nombre: 'La Clave del Barrio',
        nombre_en: 'The Key of the Neighborhood',
        duracionMin: 240,
        descripcion: "Esta ruta es una peregrinación al corazón sonoro de Cali, la Capital Mundial de la Salsa. Más que un género musical, aquí la salsa es una religión que se baila y se vive en cada esquina. 'La Clave del Barrio' te sumerge en la identidad de un pueblo que transformó un ritmo antillano en su propia bandera cultural. Es un viaje vibrante donde el cuerpo no puede evitar moverse y donde entenderás por qué en Cali, la vida tiene su propia clave.",
        descripcion_en: "This route is a pilgrimage to the sonic heart of Cali, the World Capital of Salsa. More than a musical genre, here salsa is a religion danced and lived on every corner. 'The Key of the Neighborhood' immerses you in the identity of a people who transformed an Antillean rhythm into their own cultural flag. It is a vibrant journey where the body cannot help but move and where you will understand why in Cali, life has its own key.",
        intro_story: 'Cali no se baila, Cali se lee. ¿Estás listo para descifrar el primer capítulo de la salsa?',
        intro_story_en: 'Cali is not just danced, Cali is read. Are you ready to decipher the first chapter of salsa?',
        justificaciones: [
            'La salsa es crónica social cantada.',
            'Conecta el origen barrial con el legado institucional.',
            'Cali es la capital mundial de la salsa.'
        ],
        puntos: ['museo-salsa-obrero', 'plazoleta-jairo-varela', 'audiosca-municipal'],
        reward_badge_id: 'badge-salsa',
        publico: true,
        gamificacion: [
            {
                id: 'chal-salsa-1',
                type: 'TRIVIA',
                title: 'El Origen Fotográfico',
                instruction: 'Busca la foto más antigua en la pared principal.',
                points_reward: 100,
                completed_message: '¡Has conectado con el pasado visual de la salsa!',
                quiz_data: {
                    question: '¿En qué año se fundó el Museo de la Salsa?',
                    options: ['1968', '1980', '1955', '1990'],
                    correct_answer: '1968',
                    fun_fact: 'El museo comenzó en la casa personal del fotógrafo Carlos Molina.'
                }
            },
            {
                id: 'chal-salsa-2',
                type: 'TRIVIA',
                title: 'El Sonido de Niche',
                instruction: 'Párate bajo las campanas del monumento.',
                points_reward: 100,
                completed_message: '¡Has sentido la vibración de Niche!',
                quiz_data: {
                    question: '¿Qué canción suena en las trompetas al medio día?',
                    options: ['Cali Pachanguero', 'Una Aventura', 'Buenaventura y Caney', 'Del Puente Pa Allá'],
                    correct_answer: 'Cali Pachanguero'
                }
            },
            {
                id: 'chal-salsa-3',
                type: 'TRIVIA',
                title: 'Memoria Sonora',
                instruction: 'Escucha la grabación #1 del archivo.',
                points_reward: 100,
                completed_message: '¡Has preservado la memoria auditiva!',
                quiz_data: {
                    question: '¿Cuál fue el primer ritmo antillano en llegar a Cali?',
                    options: ['El Bolero', 'La Pachanga', 'El Son Cubano', 'El Mambo'],
                    correct_answer: 'El Bolero'
                }
            }
        ]
    },
    {
        id: 'route-food',
        nombre: 'Fogones de la Memoria',
        nombre_en: 'Stoves of Memory',
        duracionMin: 180,
        descripcion: "Esta andanza es un festín para los sentidos que te lleva a través de los aromas y sabores que definen nuestra identidad. 'Fogones de la Memoria' celebra las manos que, con amor y tradición, han preservado el legado culinario del Pacífico en cada bocado. Descubre cómo la comida de calle y plaza no es solo sustento, sino un acto profundo de soberanía y resistencia cultural que une a Cali alrededor de la mesa.",
        descripcion_en: "This journey is a feast for the senses that takes you through the aromas and flavors that define our identity. 'Stoves of Memory' celebrates the hands that, with love and tradition, have preserved the culinary legacy of the Pacific in every bite. Discover how street and market food is not just sustenance, but a profound act of sovereignty and cultural resistance that unites Cali around the table.",
        intro_story: 'La historia de un pueblo se cocina a fuego lento. Prueba la resistencia.',
        intro_story_en: 'The history of a people is cooked over low heat. Taste the resistance.',
        justificaciones: ['La alimentación es el vínculo más fuerte con la tierra.', 'Dignificar a las portadoras de tradición.'],
        puntos: ['galeria-alameda', 'bebidas-san-antonio', 'panaderias-centro'],
        reward_badge_id: 'badge-food',
        publico: true,
        gamificacion: [
            { id: 'chal-food-1', type: 'TRIVIA', title: 'Sabores de Plaza', instruction: 'Visita el puesto de Doña Josefina.', points_reward: 100, completed_message: '¡Sabor auténtico!', quiz_data: { question: '¿Qué hierba da el sabor distintivo al encocado?', options: ['Cimarrón', 'Cilantro', 'Laurel', 'Tomillo'], correct_answer: 'Cimarrón' } },
            { id: 'chal-food-2', type: 'TRIVIA', title: 'Refresca la Tarde', instruction: 'Pide una Lulada bien fría.', points_reward: 100, completed_message: '¡Refrescante!', quiz_data: { question: '¿Cuál es el ingrediente secreto de la Lulada aquí?', options: ['Leche Condensada', 'Clavos de Olor', 'Nuez Moscada', 'Melaza'], correct_answer: 'Leche Condensada' } },
            { id: 'chal-food-3', type: 'TRIVIA', title: 'Amasijo Caliente', instruction: 'Busca el horno de leña.', points_reward: 100, completed_message: '¡Crunch!', quiz_data: { question: '¿El Pandebono lleva bocadillo?', options: ['Nunca', 'A veces', 'Siempre'], correct_answer: 'Nunca', fun_fact: 'El verdadero pandebono es solo de queso y almidón.' } }
        ]
    },
    {
        id: 'route-art',
        nombre: 'Pinceles de la Calle Quinta',
        nombre_en: 'Brushes of Fifth Street',
        duracionMin: 150,
        descripcion: "Las paredes de Cali no callan, gritan verdades a todo color. Recorre la Calle Quinta transformada en un lienzo monumental donde el arte urbano narra las luchas, esperanzas y contradicciones de nuestra sociedad. Esta ruta te invita a leer las calles como un libro abierto, donde cada mural es un testimonio de resistencia y cada trazo de aerosol una huella de la juventud que sueña con una ciudad diferente.",
        descripcion_en: "The walls of Cali do not fall silent, they scream truths in full color. Walk along Fifth Street transformed into a monumental canvas where urban art narrates the struggles, hopes, and contradictions of our society. This route invites you to read the streets like an open book, where every mural is a testimony of resistance and every spray stroke a trace of the youth dreaming of a different city.",
        intro_story: 'Si las paredes hablaran, gritarían revolución. Escucha sus colores.',
        intro_story_en: 'If walls could talk, they would scream revolution. Listen to their colors.',
        justificaciones: ['El muralismo en Cali es archivo vivo.', 'La estética de la protesta como arte.'],
        puntos: ['muros-bulevar', 'puente-cerveceria', 'murales-siloe'],
        reward_badge_id: 'badge-art',
        publico: true,
        gamificacion: [
            { id: 'chal-art-1', type: 'TRIVIA', title: 'Trazos de Río', instruction: 'Ubica el mural del gato.', points_reward: 100, completed_message: '¡Arte vivo!', quiz_data: { question: '¿Qué técnica predomina en este muro?', options: ['Aerosol', 'Vinilo', 'Mosaico'], correct_answer: 'Aerosol' } },
            { id: 'chal-art-2', type: 'TRIVIA', title: 'Historia Cervecera', instruction: 'Mira hacia arriba bajo el puente.', points_reward: 100, completed_message: '¡Perspectiva única!', quiz_data: { question: '¿Qué animal aparece en el logo antiguo pintado?', options: ['Águila', 'Tigre', 'Caballo'], correct_answer: 'Águila' } },
            { id: 'chal-art-3', type: 'TRIVIA', title: 'Color de Ladera', instruction: 'Llega al mirador.', points_reward: 100, completed_message: '¡Vista de pájaro!', quiz_data: { question: '¿Qué palabra se repite en los murales?', options: ['Vida', 'Paz', 'Salsa'], correct_answer: 'Vida' } }
        ]
    },
    // Adding remaining routes with simplified structure to save space but maintaining integrity
    {
        id: 'route-lit',
        nombre: 'Cali de Papel',
        duracionMin: 120,
        descripcion: "Adéntrate en las páginas vivas de la 'Caliwood' de los años 70, una época de efervescencia cultural y rebeldía literaria. Siguiendo los pasos de Andrés Caicedo y su generación, esta ruta explora los rincones que inspiraron historias de cine, locura y juventud. Es una invitación a redescubrir la ciudad a través de la mirada crítica y apasionada de quienes la escribieron y la filmaron para la eternidad.",
        intro_story: 'Cali es una ciuda que espera, pero que no le abre la puerta a los desesperados.',
        justificaciones: ['Cali tiene una identidad cinematográfica y literaria única.', 'Rescatar la bohemia y la visión crítica.'],
        puntos: ['teatro-municipal', 'edificio-otero', 'biblioteca-centenario'],
        reward_badge_id: 'badge-lit',
        publico: true,
        gamificacion: []
    },
    {
        id: 'route-afro',
        nombre: 'Herencia de Chonta',
        duracionMin: 200,
        descripcion: "Siente el pulso ancestral que late bajo el asfalto de Cali. 'Herencia de Chonta' es un reconocimiento profundo a la raíz africana que ha moldeado nuestro espíritu, nuestra música y nuestra alegría. Recorre los espacios que honran la diáspora y celebra la fuerza imparable de una cultura que, como la chonta y el cuero del tambor, resuena con orgullo y dignidad en el corazón del Valle.",
        intro_story: 'El tambor llama a la tribu. Siente el latido de la tierra.',
        justificaciones: ['Reparación simbólica y orgullo étnico.', 'Cali es la segunda ciudad con más población afro en Latam.'],
        puntos: ['monumento-piper', 'plaza-afro', 'bulevar-petronio'],
        reward_badge_id: 'badge-afro',
        publico: true,
        gamificacion: []
    },
    {
        id: 'route-arch',
        nombre: 'Piedra y Vitral',
        duracionMin: 90,
        descripcion: "Viaja en el tiempo a través de las fachadas que han visto crecer a Cali. Desde la austeridad colonial hasta la elegancia republicana, 'Piedra y Vitral' te revela los secretos guardados en los muros de nuestros edificios más emblemáticos. Cada estructura cuenta una historia de poder, fe y transformación, permitiéndote entender cómo una pequeña villa se convirtió en la metrópoli moderna que hoy caminamos.",
        intro_story: 'La piedra guarda secretos que el cemento olvidó.',
        justificaciones: ['Los edificios son testigos mudos del poder.', 'Entender la jerarquía de la ciudad.'],
        puntos: ['iglesia-ermita', 'capilla-san-antonio', 'edificio-gobernacion'],
        reward_badge_id: 'badge-arch',
        publico: true,
        gamificacion: []
    },
    {
        id: 'route-eco',
        nombre: 'El Río que Canta',
        duracionMin: 180,
        descripcion: "El Río Cali no es solo un cuerpo de agua, es el alma líquida que atraviesa nuestra historia. Esta ruta te invita a reconectar con la naturaleza en medio del caos urbano, escuchando el canto del río que ha sido testigo mudo de nuestro devenir. Camina por sus orillas, redescubre su biodiversidad y comprende por qué proteger este corredor verde es vital para el futuro y el bienestar de nuestra ciudad.",
        intro_story: 'El agua es el primer habitante de esta ciudad. Salúdalo.',
        justificaciones: ['El cambio climático exige reconectar con el agua.', 'Promover el cuidado del entorno natural.'],
        puntos: ['gato-tejada', 'museo-tertulia', 'zoologico-cali'],
        reward_badge_id: 'badge-eco',
        publico: true,
        gamificacion: []
    },
    {
        id: 'route-theater',
        nombre: 'Tablados y Máscaras',
        duracionMin: 160,
        descripcion: "¡Arriba el telón! Cali respira drama, comedia y pasión en sus escenarios. Esta ruta te lleva tras bambalinas de los teatros históricos e independientes que mantienen viva la llama de las artes escénicas. Descubre los espacios donde la imaginación cobra vida y donde maestros y aprendices han construido, función tras función, una tradición teatral que desafía, entretiene y nos hace vernos en el espejo de la representación.",
        intro_story: 'La vida es teatro, el resto es utilería. ¡Arriba el telón!',
        justificaciones: ['Cali es una ciudad de "cuerpo".', 'Apoyo a la economía naranja.'],
        puntos: ['teatro-jorge-isaacs', 'casa-comedia', 'tecoc'],
        reward_badge_id: 'badge-theater',
        publico: true,
        gamificacion: []
    },
    {
        id: 'route-history',
        nombre: 'Ruta de la Memoria Oculta',
        duracionMin: 210,
        descripcion: "La historia no siempre está en los libros escolares; a veces se esconde en los rincones olvidados. Atrévete a descorrer el velo de lo oficial y explora los relatos silenciados de nuestra ciudad. Esta ruta te guía por lugares cargados de significados profundos y memorias incómodas, invitándote a escuchar las voces de aquellos que, desde los márgenes, también construyeron la Cali que hoy conocemos.",
        intro_story: 'La verdad está en los cajones que nadie abre.',
        justificaciones: ['La memoria se construye desde abajo.', 'Descentralizar la cultura.'],
        puntos: ['museo-salsa-obrero', 'archivo-historico', 'museos-ladera'],
        reward_badge_id: 'badge-history',
        publico: true,
        gamificacion: []
    },
    {
        id: 'route-sport',
        nombre: 'Tribu: El Deporte es Cultura',
        duracionMin: 140,
        descripcion: "En Cali, el deporte es mucho más que competencia; es un rito de unión y superación. 'Tribu' explora cómo las canchas y estadios se convierten en templos sagrados donde se forja el carácter y se teje la paz. Conoce los escenarios donde nacen las leyendas y entiende cómo el esfuerzo físico y la disciplina colectiva han sido herramientas poderosas para transformar vidas y unir a nuestros barrios.",
        intro_story: 'Suda la camiseta, gana el respeto, construye la paz.',
        justificaciones: ['El esfuerzo físico disciplina el espíritu.', 'Creación de tejido social.'],
        puntos: ['canchas-panamericanas', 'polideportivos-barriales'],
        reward_badge_id: 'badge-sport',
        publico: true,
        gamificacion: []
    }
];
