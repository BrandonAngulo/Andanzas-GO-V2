require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const missingSites = [
    {
        id: 'new_siloemuseo',
        nombre: 'Museo Popular de Siloé',
        tipo: 'Museo',
        direccion: 'Calle 9 Oeste #50-18, barrio El Cortijo, Siloé, Comuna 20',
        descripcion: 'En una casa de fachada pintada a mano en el barrio El Cortijo, comuna 20, funciona uno de los museos más singulares de Colombia: un lugar donde está prohibido hacer silencio. El Museo Popular de Siloé no se parece a ningún otro. Aquí se puede gritar, tocar los objetos, tomar fotos, cantar y dejar la propia huella. Sus creadores lo llaman "contramuseo": una apuesta política y estética que le devuelve al barrio el poder de contar su propia historia, contra la lógica del museo tradicional —silencioso, de vitrinas intocables y curaduría de expertos—. Fue fundado en agosto del año 2000 por David Gómez, líder comunitario, guía voluntario e historiador empírico nacido y criado en la ladera, y lo sostiene la misma comunidad: las piezas son donadas por los vecinos y la curaduría nace del diálogo, la memoria y hasta el conflicto.\n\nEs la casa de David, y también es Siloé entero. Zapatos que cuelgan del techo, una bicicleta quemada en la entrada, violines en la pared, fotos de los años 50, máscaras, cascos, un trozo de carbón, disfraces de diablo. Todo aparente caos que se ordena cuando David narra: cada objeto tiene una historia, y esa historia es memoria del territorio. El museo entiende que el barrio mismo es el museo, y por eso su equipo ofrece desde 1998 la Ruta Turística por Siloé y las "caminatas de memoria" por las empinadas calles, gradas y callejones de la comuna. Practican lo que llaman "museología viva": dar la palabra a quienes históricamente fueron silenciados.',
        importancia: 'Una de las experiencias de memoria comunitaria autogestionada más importantes del país, y un referente de cómo un territorio estigmatizado puede reescribir su propio relato. Frente a la imagen que los grandes medios han fijado de Siloé, el museo custodia y visibiliza las múltiples memorias del barrio.',
        datos_historicos: 'El museo narra a Siloé desde sus raíces más hondas: los indígenas yanaconas, los africanos esclavizados y los mineros de Marmato (Caldas) que llegaron atraídos por el carbón —Siloé está literalmente construido sobre socavones—. Guarda una sala dedicada al conflicto armado y a la memoria del M-19.',
        datos_curiosos: [
            "El lema que recibe al visitante: \"Prohibido hacer silencio. Att. La Memoria de Siloé\".",
            "El único requisito para que un objeto entre al museo es que cuente algo, que sea memoria del territorio.",
            "El museo se articula con el recorrido de la ladera que incluye el mirador de La Estrella de Siloé."
        ],
        horario: 'Abierto a toda hora o por cita previa.',
        tarifa: 'Entrada gratuita.',
        lat: 3.4243,
        lng: -76.5492
    },
    {
        id: 'new_barrio_obrero',
        nombre: 'Barrio Obrero',
        tipo: 'Sitio de Interés',
        direccion: 'Sector central de Cali; eje aprox. carrera 11B con calle 24 (zona del Museo de la Salsa)',
        descripcion: 'Si Cali es la capital mundial de la salsa, el barrio Obrero es su corazón. En este sector tradicional del centro, fundado hacia 1919, nació buena parte de la identidad musical de la ciudad. Desde finales de los años 30, el Obrero fue de los primeros en sintonizar la música cubana que llegaba por las frecuencias de onda corta de la radio, y en enamorarse del cine mexicano de rumberas. En las décadas del 50 y 60 se volvió punto de encuentro de melómanos, bailadores y coleccionistas de vinilos, y ese caldo terminó dando forma a lo que hoy conocemos como salsa caleña.\n\nCaminar el Obrero es caminar entre salsotecas, viejotecas y templos del long play, con la música a todo pulmón saliendo de lugares como Nelly Teka, El Chorrito Antillano, La Matraca o Melassa. Es también el barrio de las agua\'e lulo, de los melómanos que discuten a gritos por qué un acetato suena mejor que lo digital, y del parque Eloy Alfaro, donde —cuentan los vecinos— empezaron a reunirse los aficionados que fundarían el América de Cali.',
        importancia: 'El Obrero es uno de los símbolos más entrañables de la caleñidad y cuna reconocida de la salsa en la ciudad. Aquí se formó la Sonora Juventud en 1952, considerada la primera orquesta reconocida de Cali.',
        datos_historicos: 'Fundación del barrio hacia 1919. En 1952 nace la Sonora Juventud. Entre 2025 y 2026, la Alcaldía adelanta una renovación urbana histórica para consolidar el barrio como meca cultural y turística.',
        datos_curiosos: [
            "Su personaje más emblemático es Edulfamid Molina Díaz, \"Piper Pimienta\", quien hoy tiene su propia estatua.",
            "La renovación arrancó por iniciativa de los propios vecinos.",
            "En temporada de Feria, el \"remate\" natural del Encuentro de Melómanos termina en las aceras del Obrero."
        ],
        horario: 'Barrio abierto; la vida salsera se enciende sobre todo de tarde-noche (aprox. 6:00 p. m. a medianoche).',
        tarifa: 'Recorrido libre; consumos y entradas a salsotecas por aparte.',
        lat: 3.4475,
        lng: -76.5160
    },
    {
        id: 'new_teatro_cristales',
        nombre: 'Teatro al Aire Libre Los Cristales',
        tipo: 'Teatro',
        direccion: 'Carrera 14A Oeste #6-00 (noroccidente / ladera occidental)',
        descripcion: 'Trepado en la ladera occidental de Cali, muy cerca de San Antonio, Los Cristales es uno de los escenarios más queridos de la ciudad: un gran anfiteatro al aire libre cuya concha acústica y graderías en terraza forman el marco perfecto para conciertos, cine bajo las estrellas y festivales. Además del escenario, el complejo tiene camerinos, oficinas y, en su parte alta, un amplio parque con nacimiento de agua, flora y una fauna especialmente rica en aves. Por sus tablas han pasado la salsa, el rock, la música clásica, la andina, el jazz y la chirimía.',
        importancia: 'Su concha acústica fue la primera de su tipo en toda Colombia, lo que convierte a Los Cristales en un referente de la infraestructura cultural al aire libre del país.',
        datos_historicos: 'La famosa concha acústica se construyó en 1986, por gestión de Hernando Botero O\'Byrne. Diseñada por el arquitecto Sigifredo Rojas y calculada por el ingeniero Camilo Niño Vélez. En 2025 se logró la titulación del predio a favor del Distrito.',
        datos_curiosos: [
            "El área construida del teatro ronda los 3.920 m²; el aforo teórico se cifra en 15.000 personas.",
            "El escenario mide 10 metros de ancho por dentro y se abre a 25 metros hacia el exterior.",
            "Su parte alta funciona casi como un pequeño ecoparque, con nacimiento de agua y aves."
        ],
        horario: 'Eventos según agenda.',
        tarifa: 'Los eventos públicos suelen ser gratuitos.',
        lat: 3.4468,
        lng: -76.5451
    },
    {
        id: 'new_univalle',
        nombre: 'Universidad del Valle (Ciudad Universitaria Meléndez)',
        tipo: 'Sitio de Interés',
        direccion: 'Ciudad Universitaria Meléndez, Calle 13 #100-00, sur de Cali',
        descripcion: 'Al sur de Cali, entre la avenida Pasoancho y las colinas de Pance, se extiende uno de los campus universitarios más grandes y hermosos de Colombia: la Ciudad Universitaria Meléndez de la Universidad del Valle. Sobre un millón de metros cuadrados que antes fueron cañaduzal, la "Univalle" levantó una ciudad-parque con lago artificial, arboledas y vista a los Farallones. Es la principal institución de educación superior del suroccidente colombiano, pública y de investigación, con más de 30.000 estudiantes, y su emblema —el búho— preside una vida académica y cultural que ha marcado la historia de la ciudad.',
        importancia: 'Fundada en 1945, Univalle "partió en dos la historia del departamento". Su campus de Meléndez es un hito arquitectónico y paisajístico, ganador del Premio Nacional de Arquitectura en 1972.',
        datos_historicos: 'Creada el 11 de junio de 1945 mediante la Ordenanza 12. En 1954 cambia su nombre a Universidad del Valle. Desde 1965 se construye la Ciudad Universitaria de Meléndez. En 1971 sirvió de villa olímpica para los Juegos Panamericanos.',
        datos_curiosos: [
            "El diseño arquitectónico fue coordinado por los arquitectos Jaime Cruz y Diego Peñalosa.",
            "El símbolo de la universidad es el búho, y su biblioteca central lleva el nombre de Mario Carvajal.",
            "Buena parte del campus permanece deliberadamente sin construir, como reserva verde."
        ],
        horario: 'Campus universitario; acceso según normas de la institución.',
        tarifa: 'No aplica.',
        lat: 3.3745,
        lng: -76.5323
    }
];

const updateAlameda = {
    descripcion: 'En el barrio Alameda, en el centro de Cali, hay un mercado que es mucho más que un sitio para comprar: es un viaje de los Andes al Pacífico en pocos pasos. La Galería Alameda —o Plaza de Mercado Alameda— es un laberinto de colores y aromas donde conviven frutas exóticas, verduras fresquísimas, carnes, flores y, sobre todo, la mejor cocina tradicional del Valle y del Pacífico colombiano. Aquí las cocineras venidas de Buenaventura —herederas de saberes culinarios que vienen desde los tiempos de la esclavitud— sirven sancocho de pescado con leche de coco, ceviche de camarón, sudados, rellena y tamal en platos enormes. Recorrerla es entrar en contacto con el espíritu popular, alegre y conversador de los caleños.',
    importancia: 'La Alameda es una de las primeras plazas de mercado de Cali y hoy un verdadero imán del turismo gastronómico, reconocida como guardiana de los sabores populares de la ciudad.',
    datos_historicos: 'El barrio Alameda fue fundado en octubre de 1930. La Plaza de Mercado tiene su origen hacia 1947. Hacia 1970 se levantó la mayor parte del edificio actual. Desde 1994 la maneja ASOALAMEDA.',
    datos_curiosos: [
        "Los primeros vendedores extendían sus productos sobre el piso.",
        "Entre sus tesoros hay frutas poco conocidas: madroño, chachairú, mangostino, zapote, arazá, chirimoya.",
        "Existen 'food tours' que salen desde San Antonio y tienen a la Alameda como parada estrella."
    ],
    horario: 'Abierta a diario; mayor actividad en las mañanas.',
    tarifa: 'Ingreso libre; consumos por aparte.',
    direccion: 'Carrera 26 #8-37, barrio Alameda (comuna 9)',
    descripcion_en: null,
    importancia_en: null,
    datos_historicos_en: null,
    datos_curiosos_en: null
};

async function insertMissing() {
    console.log("Inserting new sites...");
    const { error: insertError } = await supabase.from('sites').insert(missingSites);
    if (insertError) {
        console.error("Error inserting:", insertError);
    } else {
        console.log("Inserted new sites!");
    }

    console.log("Updating Alameda...");
    const { error: updateError } = await supabase.from('sites').update(updateAlameda).eq('id', 's9');
    if (updateError) {
        console.error("Error updating:", updateError);
    } else {
        console.log("Updated Alameda!");
    }
}

insertMissing();
