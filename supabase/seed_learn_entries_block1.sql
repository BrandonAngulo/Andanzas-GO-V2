-- SQL script to insert Block 1 entries into learn_entries

INSERT INTO public.learn_entries (
    title,
    city,
    tags,
    content_full,
    sabias_que,
    trivia,
    site_ids,
    route_ids,
    cta,
    fuentes
) VALUES 
(
    '¿Por qué a Cali le dicen "la sucursal del cielo"?',
    'Cali',
    ARRAY['identidad', 'historia', 'religión', 'salsa', 'música'],
    'Por tres razones que se abrazan: el clima de verano eterno con esa brisa que baja de los Farallones al atardecer, la calidez de una gente que recibe al forastero como si lo conociera de toda la vida, y una canción que volvió el apodo un juramento. En 1984, el Grupo Niche cerró "Cali Pachanguero" nombrando a Cali la sucursal del cielo, y de ahí no se despegó jamás.

Pero la frase es más vieja que la canción, y tiene un nacimiento que casi nadie conoce: la Iglesia. En 1948, Cali fue sede del Congreso Eucarístico Bolivariano, un evento gigantesco que levantó El Templete, en el sur, y trajo peregrinos de media Suramérica. Cuenta la tradición que al tercer día —el "Día Blanco"— 25.000 niños hicieron la primera comunión, y a todo el mundo le pidieron vestirse de blanco; al ver esa marea blanca, alguien soltó la frase que quedó: "esto se parece al cielo". Ahí habría nacido la idea de Cali como una sucursal del cielo. (Ojo: no lo confundás con la visita del Papa Pablo VI, que fue otra cosa, en 1968 y en Bogotá.)

Décadas después, la frase reapareció en la música, pero ni siquiera hablando de Cali: en 1970, los venezolanos Billos Caracas Boys se la cantaban a Caracas, y todavía hoy hay quien la reclama como caraqueña. Hasta que un chocoano, Jairo Varela, la agarró, sentó a Cali en la misma mesa que Barranquilla, París y Nueva York, y la clavó en un himno que baila el mundo entero. No fue el primero en decirla: fue el que la dijo tan bien que ya nadie se la puede quitar.

Y ahí está lo bonito: el apodo no tiene un origen, tiene tres, y cada quien reclama el suyo. La Iglesia dice que nació de la fe; los melómanos, que de la salsa; y cualquier caleño te dirá que basta con sentir la brisa de las seis. Un apodo no es de quien lo dice primero, sino de quien lo hace suyo con más fuerza — y Cali lo hizo suyo tres veces. No heredó el cielo: se lo apropió rezando, cantando y viviendo.',
    ARRAY[
        '¿Sabías que "sucursal del cielo" habría nacido en 1948, en un congreso religioso, cuando 25.000 niños de blanco parecían un cielo en la tierra?',
        '¿Sabías que antes de ser de Cali, "la sucursal del cielo" se la cantaban a Caracas?',
        '¿Sabías que Jairo Varela, el que volvió eterno el apodo, era chocoano, no caleño?'
    ],
    '{
        "question": "Según la tradición de la Iglesia, ¿en qué evento nació la idea de Cali como ''sucursal del cielo''?",
        "options": ["El Congreso Eucarístico de 1948", "La Feria de Cali", "Los Juegos Panamericanos del 71", "Un concierto de Niche"],
        "correct_index": 0,
        "feedback_fail": "Fue en 1948, con 25.000 niños vestidos de blanco. Pero hay otras dos versiones… metete a la entrada completa."
    }'::jsonb,
    ARRAY['site-templete', 'site-plazoleta-jairo-varela', 'site-barrio-obrero'],
    ARRAY['route-history', 'route-salsa'],
    'El Templete, donde habría nacido la frase, y la Plazoleta Jairo Varela, donde se hizo eterna, están a un paso en la Ruta Histórica. Andá a pisar las dos puntas de la historia.',
    'Entrevista al padre Diego Cortés, párroco de El Templete, El País (may. 2024): origen en el "Día Blanco" del Congreso Eucarístico Bolivariano; Templete terminado el 1 de mayo de 1948. Billos Caracas Boys, "El Pajarillo" (1970). Grupo Niche, "Cali Pachanguero" (Jairo Varela, 1984). Origen disputado: se cuenta en capas a propósito. No confundir con el Congreso Eucarístico Internacional de 1968 (Bogotá, Pablo VI).'
),
(
    '¿Qué es el chontaduro y por qué es tan caleño?',
    'Cali',
    ARRAY['sabores', 'Pacífico', 'identidad', 'afro'],
    'Es el fruto de una palma del Pacífico (la Bactris gasipaes): del tamaño de un durazno, naranja o rojo, que se come cocido y se sirve con sal y miel. En Cali lo ves en cada esquina, en el carrito o en el "platón" que las vendedoras cargan sobre la cabeza. Hasta el nombre lo delata: viene del quechua chonta (palma) y duro, por lo durísimo que es crudo.

Pero el chontaduro no es una moda gastronómica: es comida ancestral. Las comunidades indígenas del Pacífico y la Amazonía lo cultivan desde antes de la conquista, y las comunidades afro lo volvieron sustento, símbolo y resistencia. Cuando te comés un chontaduro en Cali, no estás probando una fruta "caleña" a secas: estás probando la presencia viva del Pacífico —negro e indígena— en la ciudad. Cali es el gran mercado adonde baja el chontaduro del Cauca, el Chocó y Buenaventura.

Y nutricionalmente es una bestia: le dicen "el huevo vegetal" porque tiene tanta proteína, grasa buena y vitaminas que investigadores de la Universidad del Valle han dicho que con tres chontaduros almorzás. También carga fama de afrodisíaco —"el viagra de los pobres"—, aunque la ciencia no lo ha probado del todo; lo más seguro es que mejore el flujo de sangre, y el resto lo pongan las ganas.

Detrás de cada chontaduro hay, casi siempre, una mujer del Pacífico —muchas de Buenaventura—, heredera de una tradición de siglos. Cali les hizo hasta un monumento, "La negra del chontaduro", y les dedicó un parque. Por eso comerse uno acá no es solo comer: es morder un pedacito del Pacífico.',
    ARRAY[
        '¿Sabías que con tres chontaduros almorzás? La Universidad del Valle lo llama "el huevo vegetal" por su valor nutritivo.',
        '¿Sabías que "chontaduro" viene del quechua: chonta (palma) + duro?',
        '¿Sabías que en Cali es costumbre regalar chontaduros a los enfermos en el hospital, para que se recuperen?'
    ],
    '{
        "question": "¿Con qué se come tradicionalmente el chontaduro en Cali?",
        "options": ["Con sal y miel", "Con limón y sal", "Con leche condensada", "Frito"],
        "correct_index": 0,
        "feedback_fail": "Con sal y miel, siempre. Metete a la entrada y enterate por qué le dicen ''el huevo vegetal''."
    }'::jsonb,
    ARRAY['site-galeria-alameda', 'site-barrio-obrero'],
    ARRAY['route-salsa'],
    'Andá a la Galería Alameda a probarlo de la mano de las cocineras del Pacífico. Es parada obligada de la Ruta de la Salsa y el Sabor.',
    'Bactris gasipaes (Wikipedia / iNaturalist Colombia); Universidad del Valle, "El Chontapower" (Prof. Jaime Restrepo); Picoloro Ecoturismo; El País; cali.gov.co ("Chontaduro, un fruto de orgullo para Cali"). Propiedad afrodisíaca: creencia popular, sin evidencia científica concluyente.'
),
(
    '¿Por qué la salsa es de Cali, si no nació ahí?',
    'Cali',
    ARRAY['salsa', 'música', 'identidad', 'historia'],
    'Porque Cali la adoptó como nadie. La salsa nació en Nueva York en los años sesenta —con raíces cubanas, puertorriqueñas y africanas— y llegó a Cali por el puerto de Buenaventura, en los discos que traían los marineros. De ahí subió a las discotiendas, a la radio y, sobre todo, al Barrio Obrero, donde los vecinos sacaban los parlantes al andén. Cali no la inventó: la hizo tan suya que se volvió su capital mundial.

Y le puso algo que no existía en ningún lado: un estilo de baile propio, con los pies a una velocidad de locos, giros y acrobacias. Cuenta la tradición que nació de un accidente: en los años sesenta, el melómano Licímaco Paz puso sin querer un disco de 33 revoluciones a la velocidad de 45, y salió un ritmo endemoniado; a la gente le fascinó, y los bailadores de barrio empezaron a competir por quién bailaba más rápido y con los pies más enredados. Así nació la "salsa estilo caleño".

Es, en el fondo, la misma historia que "la sucursal del cielo": una cosa que Cali no parió, pero que agarró con tal devoción que ya es imposible quitársela. Los caleños no solo bailaron la salsa: la estudiaron —los melómanos y coleccionistas guardan aquí el archivo discográfico de salsa más grande del mundo—, la enseñaron en más de cien escuelas, la volvieron industria y hasta la declararon patrimonio de la ciudad.

Hoy la salsa suena en los taxis, en las tiendas de barrio, en las casas. Se celebra en la Feria de Cali —con su Salsódromo—, en las salsotecas del Obrero, en el Museo de la Salsa y en la Plazoleta Jairo Varela. En Cali la salsa no es un recuerdo: es un idioma que se habla con los pies.',
    ARRAY[
        '¿Sabías que la salsa entró a Cali por barco, por el puerto de Buenaventura?',
        '¿Sabías que el estilo veloz caleño habría nacido de un disco puesto, sin querer, a la velocidad equivocada?',
        '¿Sabías que Cali guarda el archivo discográfico de salsa más grande del mundo?'
    ],
    '{
        "question": "¿Por dónde entró la salsa a Cali?",
        "options": ["El puerto de Buenaventura", "El aeropuerto", "La frontera con Ecuador", "La radio de Medellín"],
        "correct_index": 0,
        "feedback_fail": "Por Buenaventura, en los discos de los marineros. Leé cómo terminó siendo la capital mundial de la salsa."
    }'::jsonb,
    ARRAY['site-barrio-obrero', 'site-museo-salsa', 'site-plazoleta-jairo-varela'],
    ARRAY['route-salsa'],
    'Seguile el rastro en la Ruta de la Salsa y el Sabor: el Barrio Obrero, el Museo de la Salsa y la Plazoleta Jairo Varela.',
    'cali.gov.co, "La salsa caleña… única en el mundo" (jul. 2022); El País, "El origen de la salsa en Cali"; Esquire Colombia; Salsa Vida; Colombia Travel. El episodio de Licímaco Paz y el disco acelerado es el relato tradicional del origen del estilo caleño.'
),
(
    '¿Qué es una viejoteca (y el agua''e lulo)?',
    'Cali',
    ARRAY['salsa', 'tradición', 'baile', 'identidad'],
    'Una viejoteca es una fiesta caleña para bailar la salsa de la vieja guardia —la "salsa dura", los boleros, la pachanga— de día o de tarde, sin trasnochar. Nacieron en Cali en 1993, pensadas al principio para la gente de más de 40 que quería volver a la música con la que aprendió a bailar, y tuvieron tanto éxito que se regaron por todo el país.

Pero la viejoteca tiene un abuelo: el agua''e lulo (o agüelulo). En los años sesenta y setenta, los jóvenes caleños armaban fiestas en las tardes, en las casas, sin una sola gota de licor —"rumba sana"—, donde en vez de trago corría el jugo, la gaseosa y el agua de lulo. Ahí se bailaba salsa con una intensidad tremenda; de hecho, fue en esos agüelulos donde los caleños empezaron a acelerar los discos porque la música les parecía lenta. O sea que del agua''e lulo salió, en buena parte, el estilo veloz que hizo famosa a Cali.

Las dos cosas dicen algo lindo de la ciudad: que aquí la salsa no es solo rumba de discoteca y de madrugada. Es cosa de familia, de barrio, de tarde, de todas las edades. El agua''e lulo revive cada Feria de Cali en el Barrio Obrero, con miles de personas bailando a plena luz del día. Es la prueba de que acá no se necesita ni trago ni noche para gozar: basta un buen disco, un vaso de agua''e lulo y ganas de mover los pies.',
    ARRAY[
        '¿Sabías que las viejotecas nacieron en Cali, en 1993, y de ahí se regaron por toda Colombia?',
        '¿Sabías que en los agüelulos no se tomaba licor? Se tomaba agua de lulo — de ahí el nombre.',
        '¿Sabías que del agua''e lulo salió parte del estilo veloz de la salsa caleña?'
    ],
    '{
        "question": "En un agüelulo tradicional, ¿qué se tomaba en vez de licor?",
        "options": ["Agua de lulo", "Aguardiente", "Cerveza", "Vino"],
        "correct_index": 0,
        "feedback_fail": "Agua de lulo, pura rumba sana. Enterate de cómo de ahí salió el baile más rápido del mundo."
    }'::jsonb,
    ARRAY['site-barrio-obrero'],
    ARRAY['route-salsa'],
    'Si venís en diciembre, caé al Agua''e lulo del Barrio Obrero en la Feria de Cali. El resto del año, la salsa te espera en la Ruta de la Salsa y el Sabor.',
    'cali.gov.co (Agua''e lulo del Barrio Obrero, Feria 2025; Encuentro de Viejotecas); El País ("Cali sigue de aguaelulo": origen de los agüelulos en los años 60-70, sin licor); Ociolatino (viejotecas nacidas en Cali en 1993).'
);
