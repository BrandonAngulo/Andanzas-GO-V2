
INSERT INTO public.routes (
    id, nombre, nombre_en, puntos, duracion_min, 
    descripcion, descripcion_en, justificaciones, justificaciones_en, 
    recomendaciones, gamificacion, is_published
) VALUES (
    'ruta1',
    'Ruta de la Salsa y el Sabor',
    'Salsa and Flavor Route',
    ARRAY['s25','s21','s7','s28','s46','s27'],
    240,
    'Esta ruta es una peregrinación al corazón sonoro de Cali, la Capital Mundial de la Salsa. Más que un género musical, aquí la salsa es una religión que se baila y se vive en cada esquina. ''La Ruta de la Salsa y el Sabor'' te sumerge en la identidad de un pueblo que transformó un ritmo antillano en su propia bandera cultural. Es un viaje vibrante donde el cuerpo no puede evitar moverse y donde entenderás por qué en Cali, la vida tiene su propia clave.',
    'This route is a pilgrimage to the sonic heart of Cali, the Salsa Capital of the World. More than a musical genre, salsa here is a religion danced and lived on every corner. ''The Salsa and Flavor Route'' immerses you in the identity of a people who transformed an Antillean rhythm into their own cultural flag. It is a vibrant journey where the body cannot help but move and where you will understand why in Cali, life has its own beat.',
    ARRAY['El origen histórico y fotográfico de la salsa.','Homenaje al Grupo Niche y Jairo Varela.','El lugar más democrático para bailar salsa hoy.','El templo de la salsa tradicional y el vinilo.','Espectáculo tipo cabaret de talla mundial.','La escuela de los campeones mundiales.'],
    ARRAY['The historical and photographic origin of salsa.','Tribute to Grupo Niche and Jairo Varela.','The most democratic place to dance salsa today.','The temple of traditional salsa and vinyl.','World-class cabaret-style show.','The school of world champions.'],
    '[{"tipo":"Música","tipo_en":"Music","titulo":"Playlist Salsera","titulo_en":"Salsa Playlist","descripcion":"Escucha ''Cali Pachanguero'' del Grupo Niche para entrar en ambiente.","descripcion_en":"Listen to ''Cali Pachanguero'' by Grupo Niche to get in the mood."},{"tipo":"Vestuario","tipo_en":"Attire","titulo":"Zapatos de Baile","titulo_en":"Dancing Shoes","descripcion":"Usa calzado cómodo y sujeto, evita sandalias sueltas para bailar mejor.","descripcion_en":"Wear comfortable, secure shoes; avoid loose sandals to dance better."},{"tipo":"Bebida","tipo_en":"Drink","titulo":"Hidratación Local","titulo_en":"Local Hydration","descripcion":"Prueba una ''Lulada'' bien fría en el intermedio de los sitios.","descripcion_en":"Try a cold ''Lulada'' in between sites."}]'::jsonb,
    '[{"pregunta":"¿Cómo se llama el fundador del Museo de la Salsa?","pregunta_en":"What is the name of the founder of the Salsa Museum?","opciones":["Jairo Varela","Carlos Molina","Piper Pimienta","El Mulato"],"opciones_en":["Jairo Varela","Carlos Molina","Piper Pimienta","El Mulato"],"respuestaCorrecta":"Carlos Molina","respuestaCorrecta_en":"Carlos Molina","datoCurioso":"Carlos Molina tiene una de las colecciones de fotos de salsa más grandes del mundo.","datoCurioso_en":"Carlos Molina has one of the largest salsa photo collections in the world.","reto":"Tómate una foto imitando una pose de baile frente al museo.","reto_en":"Take a photo imitating a dance pose in front of the museum."}]'::jsonb,
    TRUE
) ON CONFLICT (id) DO UPDATE SET 
    nombre = EXCLUDED.nombre,
    nombre_en = EXCLUDED.nombre_en,
    puntos = EXCLUDED.puntos,
    duracion_min = EXCLUDED.duracion_min,
    descripcion = EXCLUDED.descripcion,
    descripcion_en = EXCLUDED.descripcion_en,
    justificaciones = EXCLUDED.justificaciones,
    justificaciones_en = EXCLUDED.justificaciones_en,
    recomendaciones = EXCLUDED.recomendaciones,
    gamificacion = EXCLUDED.gamificacion;


INSERT INTO public.routes (
    id, nombre, nombre_en, puntos, duracion_min, 
    descripcion, descripcion_en, justificaciones, justificaciones_en, 
    recomendaciones, gamificacion, is_published
) VALUES (
    'ruta2',
    'Ruta Histórica y Colonial',
    'Historical and Colonial Route',
    ARRAY['s39','s12','s57','s2','s3','s19'],
    180,
    'Esta ruta es un viaje en el tiempo hacia los cimientos mismos de Santiago de Cali. Caminar por el centro histórico es leer las páginas de la ''Sucursal del Cielo'' escritas en piedra y cal. Descubrirás la hidalguía de una ciudad que supo ser colonial, republicana y moderna sin perder su esencia. Desde la fe de sus templos hasta el poder de sus plazas, este recorrido es esencial para conectar con la memoria colectiva y entender cómo el pasado ha moldeado la sociedad caleña actual.

El itinerario te guiará por el corazón cívico en la Plaza de Cayzedo, pasando por la joya mudéjar de la Torre Mudéjar y la majestuosidad del Teatro Municipal. Cada fachada narra historias de independencia, arte y desarrollo. Visitarás el complejo religioso de San Francisco y La Merced, donde literalmente nació la ciudad, para luego conectar con el Río Cali, testigo silencioso de siglos de evolución.

Al finalizar, sentirás una profunda reverencia por el legado arquitectónico de Cali. Es una experiencia de contemplación y aprendizaje, ideal para ser combinada con un café tradicional en el Bulevar. Te llevarás no solo fotos de edificios hermosos, sino la comprensión de que Cali es una ciudad de capas, donde la historia sigue viva y dialogando con el presente.',
    'This route is a journey back in time to the very foundations of Santiago de Cali. Walking through the historic center is reading the pages of the ''Branch of Heaven'' written in stone and lime. You will discover the nobility of a city that managed to be colonial, republican, and modern without losing its essence. From the faith of its temples to the power of its squares, this tour is essential to connect with collective memory and understand how the past has shaped current Caleño society.

The itinerary will guide you through the civic heart at Plaza de Cayzedo, passing by the Mudejar jewel of the Mudejar Tower and the majesty of the Municipal Theater. Every facade tells stories of independence, art, and development. You will visit the religious complex of San Francisco and La Merced, where the city was literally born, to then connect with the Cali River, a silent witness to centuries of evolution.

By the end, you will feel a deep reverence for Cali''s architectural legacy. It is an experience of contemplation and learning, ideal to be combined with a traditional coffee on the Boulevard. You will take away not just photos of beautiful buildings, but the understanding that Cali is a city of layers, where history is still alive and dialoguing with the present.',
    ARRAY['El corazón cívico de la ciudad.','El edificio más antiguo de Cali (Siglo XVI).','La joya arquitectónica mudéjar única en el país.','Máximo escenario cultural de estilo republicano.','Conexión moderna con la historia del río.','Barrio fundacional con arquitectura colonial preservada.'],
    ARRAY['The civic heart of the city.','The oldest building in Cali (16th Century).','Unique Mudejar architectural jewel in the country.','Top cultural venue in Republican style.','Modern connection with the river''s history.','Foundational neighborhood with preserved colonial architecture.'],
    '[{"tipo":"Mejor Hora","tipo_en":"Best Time","titulo":"Mañana Temprano","titulo_en":"Early Morning","descripcion":"Inicia a las 9:00 AM para evitar el calor fuerte del mediodía.","descripcion_en":"Start at 9:00 AM to avoid the strong midday heat."},{"tipo":"Snack","tipo_en":"Snack","titulo":"Pandebono Caliente","titulo_en":"Warm Pandebono","descripcion":"Imperdible comer un pandebono cerca a la Plaza de Cayzedo.","descripcion_en":"Must eat a pandebono near Plaza de Cayzedo."},{"tipo":"Seguridad","tipo_en":"Safety","titulo":"Cuidado Personal","titulo_en":"Personal Care","descripcion":"Mantén tus pertenencias a la vista en zonas concurridas del centro.","descripcion_en":"Keep your belongings in sight in busy downtown areas."}]'::jsonb,
    '[{"pregunta":"¿Qué árboles característicos rodean la Plaza de Cayzedo?","pregunta_en":"What characteristic trees surround Cayzedo Square?","opciones":["Robles","Palmas de Cera","Palmas Reales","Ceibas"],"opciones_en":["Oaks","Wax Palms","Royal Palms","Ceibas"],"respuestaCorrecta":"Palmas Reales","respuestaCorrecta_en":"Royal Palms","datoCurioso":"Estas palmas son tan altas que se ven desde varios puntos del centro.","datoCurioso_en":"These palms are so tall they can be seen from various points downtown.","reto":"Encuentra la placa con la fecha de fundación de la plaza.","reto_en":"Find the plaque with the square''s founding date."}]'::jsonb,
    TRUE
) ON CONFLICT (id) DO UPDATE SET 
    nombre = EXCLUDED.nombre,
    nombre_en = EXCLUDED.nombre_en,
    puntos = EXCLUDED.puntos,
    duracion_min = EXCLUDED.duracion_min,
    descripcion = EXCLUDED.descripcion,
    descripcion_en = EXCLUDED.descripcion_en,
    justificaciones = EXCLUDED.justificaciones,
    justificaciones_en = EXCLUDED.justificaciones_en,
    recomendaciones = EXCLUDED.recomendaciones,
    gamificacion = EXCLUDED.gamificacion;


INSERT INTO public.routes (
    id, nombre, nombre_en, puntos, duracion_min, 
    descripcion, descripcion_en, justificaciones, justificaciones_en, 
    recomendaciones, gamificacion, is_published
) VALUES (
    'ruta3',
    'Ruta del Arte y la Bohemia',
    'Art and Bohemian Route',
    ARRAY['s1','s8','s23','s4','s55','s61'],
    200,
    'Esta ruta es mucho más que un paseo; es una inmersión sensorial en la faceta más cosmopolita y vibrante de la ciudad. ''La Ruta del Arte y la Bohemia'' te invita a descubrir cómo el Oeste de Cali ha tejido una identidad única donde la brisa del río Cali dialoga con la vanguardia artística, la arquitectura histórica y una escena gastronómica de primer nivel. Es el recorrido esencial para entender por qué Cali es un epicentro cultural que va más allá de la salsa, revelando un espíritu intelectual y relajado que seduce al caminante.

Tu viaje comienza explorando los pilares del arte moderno y contemporáneo. Desde el icónico Museo La Tertulia, joya arquitectónica que respira cine y artes plásticas, el camino te lleva por un corredor visual a orillas del río, custodiado por el famoso Gato de Tejada y sus novias. Pero la ruta profundiza más: descubrirás espacios de pensamiento crítico como ''Lugar a Dudas'' y la transformación de la arquitectura doméstica en recintos culturales como la Casa Obeso Mejía, demostrando cómo el arte en Cali se vive tanto en los museos como en las calles y casas.

La experiencia culmina fusionando la estética con el estilo de vida. La influencia internacional de la Alianza Francesa sirve de puente hacia el efervescente Barrio Granada. Aquí, la ''bohemia'' cobra vida entre mansiones restauradas que hoy albergan lo mejor de la moda, el diseño y, sobre todo, la alta gastronomía caleña. Esta ruta es una invitación a caminar sin prisa, a contemplar la belleza urbana y a conectar íntimamente con una ciudad que se reinventa constantemente a través de su creatividad.',
    'This route is much more than a walk; it is a sensory immersion into the city''s most cosmopolitan and vibrant facet. ''The Art and Bohemian Route'' invites you to discover how Western Cali has woven a unique identity where the Cali River breeze dialogues with artistic avant-garde, historic architecture, and a top-tier gastronomic scene. It is the essential tour to understand why Cali is a cultural epicenter going beyond salsa, revealing an intellectual and relaxed spirit that seduces the walker.

Your journey begins exploring the pillars of modern and contemporary art. From the iconic La Tertulia Museum, an architectural jewel breathing cinema and visual arts, the path takes you along a visual corridor by the riverbanks, guarded by the famous Tejada''s Cat and his girlfriends. But the route goes deeper: you will discover critical thinking spaces like ''Lugar a Dudas'' and the transformation of domestic architecture into cultural venues like Casa Obeso Mejía, demonstrating how art in Cali is lived both in museums and on streets and houses.

The experience culminates by fusing aesthetics with lifestyle. The international influence of the Alliance Française serves as a bridge to the effervescent Granada Neighborhood. Here, ''bohemia'' comes to life among restored mansions that today house the best of fashion, design, and, above all, Caleño haute cuisine. This route is an invitation to walk without haste, to contemplate urban beauty, and to intimately connect with a city that constantly reinvents itself through its creativity.',
    ARRAY['Referente del arte moderno y el cine.','Galería de arte público a orillas del río.','Arquitectura doméstica convertida en arte.','Centro de pensamiento artístico contemporáneo.','Foco de cultura francesa y exposiciones.','Arquitectura, moda y gastronomía en un solo lugar.'],
    ARRAY['Benchmark of modern art and cinema.','Public art gallery on the riverbanks.','Domestic architecture turned into art.','Center for contemporary artistic thought.','Focus of French culture and exhibitions.','Architecture, fashion, and gastronomy in one place.'],
    '[{"tipo":"Sabor","tipo_en":"Flavor","titulo":"Café de Origen","titulo_en":"Single Origin Coffee","descripcion":"El barrio Granada y Peñón tienen los mejores cafés de especialidad.","descripcion_en":"The Granada and Peñón neighborhoods have the best specialty coffees."},{"tipo":"Foto","tipo_en":"Photo","titulo":"Las Gatas","titulo_en":"The Cats","descripcion":"Elige tu ''Gata'' favorita en el río y tómate una selfie artística.","descripcion_en":"Choose your favorite ''Gata'' by the river and take an artistic selfie."},{"tipo":"Transporte","tipo_en":"Transport","titulo":"Caminata","titulo_en":"Walking","descripcion":"Es una ruta 100% caminable y segura para disfrutar el paisaje.","descripcion_en":"It is a 100% walkable and safe route to enjoy the scenery."}]'::jsonb,
    NULL,
    TRUE
) ON CONFLICT (id) DO UPDATE SET 
    nombre = EXCLUDED.nombre,
    nombre_en = EXCLUDED.nombre_en,
    puntos = EXCLUDED.puntos,
    duracion_min = EXCLUDED.duracion_min,
    descripcion = EXCLUDED.descripcion,
    descripcion_en = EXCLUDED.descripcion_en,
    justificaciones = EXCLUDED.justificaciones,
    justificaciones_en = EXCLUDED.justificaciones_en,
    recomendaciones = EXCLUDED.recomendaciones,
    gamificacion = EXCLUDED.gamificacion;


INSERT INTO public.routes (
    id, nombre, nombre_en, puntos, duracion_min, 
    descripcion, descripcion_en, justificaciones, justificaciones_en, 
    recomendaciones, gamificacion, is_published
) VALUES (
    'ruta4',
    'Ruta de la Naturaleza Urbana',
    'Urban Nature Route',
    ARRAY['s20','s30','s65','s5'],
    300,
    'Cali es un ''privilegio verde'' abrazado por la cordillera de los Farallones. Esta ruta es un escape vital y necesario para reconectar con la tierra sin salir de la urbe. ''La Ruta de la Naturaleza Urbana'' te ofrece un respiro del asfalto, llevándote a través de los pulmones que oxigenan la ciudad. Es una travesía de salud mental y física, diseñada para quienes entienden que la verdadera riqueza de Cali reside en su exuberante biodiversidad y sus paisajes imponentes.

Experimentarás una transición ecológica fascinante: desde la frescura cristalina del Río Pance, el balneario natural por excelencia de los caleños, hasta el bosque seco tropical conservado en el Jardín Botánico y el Zoológico. El desafío físico llega con el ascenso al Cerro de las Tres Cruces, un ritual deportivo local que premia el esfuerzo con la mejor vista panorámica del Valle del Cauca. Es un recorrido donde el canto de las aves reemplaza al ruido del tráfico.

Terminarás este recorrido renovado, con los pulmones llenos de aire puro y la retina cargada de los atardeceres más famosos de Colombia. Esta ruta te recordará por qué Cali es una potencia mundial de avistamiento de aves y naturaleza. Es una invitación a sudar, a respirar profundo y a sentir la energía vital de una ciudad que florece todo el año.',
    'Cali is a ''green privilege'' embraced by the Farallones mountain range. This route is a vital and necessary escape to reconnect with the earth without leaving the city. ''The Urban Nature Route'' offers you a respite from the asphalt, taking you through the lungs that oxygenate the city. It is a journey of mental and physical health, designed for those who understand that Cali''s true wealth lies in its exuberant biodiversity and imposing landscapes.

You will experience a fascinating ecological transition: from the crystalline freshness of the Pance River, the natural spa par excellence of the Caleños, to the tropical dry forest preserved in the Botanical Garden and the Zoo. The physical challenge comes with the ascent to the Hill of the Three Crosses, a local sports ritual that rewards effort with the best panoramic view of the Valle del Cauca. It is a tour where the song of birds replaces traffic noise.

You will finish this tour renewed, lungs full of fresh air and eyes loaded with Colombia''s most famous sunsets. This route will remind you why Cali is a world power in bird watching and nature. It is an invitation to sweat, breathe deep, and feel the vital energy of a city that blooms all year round.',
    ARRAY['El balneario natural de los caleños.','Conocimiento sobre la biodiversidad local.','Reto físico y la mejor vista de la ciudad.','Atardecer con brisa y vista al valle.'],
    ARRAY['The natural spa of the Caleños.','Knowledge about local biodiversity.','Physical challenge and the best view of the city.','Sunset with breeze and valley view.'],
    '[{"tipo":"Vestuario","tipo_en":"Attire","titulo":"Deportivo","titulo_en":"Sporty","descripcion":"Ropa ligera, tenis de agarre y gorra son obligatorios.","descripcion_en":"Light clothing, grip sneakers, and a cap are mandatory."},{"tipo":"Salud","tipo_en":"Health","titulo":"Protección Solar","titulo_en":"Sun Protection","descripcion":"El sol de Cali es fuerte, usa bloqueador solar.","descripcion_en":"Cali''s sun is strong, use sunscreen."},{"tipo":"Horario","tipo_en":"Schedule","titulo":"Amanecer","titulo_en":"Sunrise","descripcion":"Para las Tres Cruces, sube antes de las 7:00 AM.","descripcion_en":"For Tres Cruces, climb before 7:00 AM."}]'::jsonb,
    NULL,
    TRUE
) ON CONFLICT (id) DO UPDATE SET 
    nombre = EXCLUDED.nombre,
    nombre_en = EXCLUDED.nombre_en,
    puntos = EXCLUDED.puntos,
    duracion_min = EXCLUDED.duracion_min,
    descripcion = EXCLUDED.descripcion,
    descripcion_en = EXCLUDED.descripcion_en,
    justificaciones = EXCLUDED.justificaciones,
    justificaciones_en = EXCLUDED.justificaciones_en,
    recomendaciones = EXCLUDED.recomendaciones,
    gamificacion = EXCLUDED.gamificacion;


INSERT INTO public.routes (
    id, nombre, nombre_en, puntos, duracion_min, 
    descripcion, descripcion_en, justificaciones, justificaciones_en, 
    recomendaciones, gamificacion, is_published
) VALUES (
    'ruta5',
    'Ruta de los Teatros y la Escena Viva',
    'Route of Theaters and Living Scene',
    ARRAY['s2','s22','s96','s69','s14','s67'],
    180,
    'Cali respira dramaturgia y pasión escénica. ''La Ruta de los Teatros y la Escena Viva'' es un homenaje a las tablas que han narrado la historia de la ciudad y del país. Este recorrido te invita a descubrir la magia que ocurre cuando se apagan las luces y se levanta el telón. Es una inmersión en la tradición teatral caleña, reconocida por su vanguardia, su compromiso social y su capacidad de conmover hasta la fibra más profunda.

El viaje te llevará por un espectro fascinante de escenarios: desde la majestuosidad neoclásica del Teatro Municipal Enrique Buenaventura, donde resuenan óperas y conciertos, hasta la intimidad creativa de las salas independientes en el barrio San Antonio, como el Teatro La Máscara y la Casa de los Títeres. Conocerás el legado del TEC (Teatro Experimental de Cali) y cómo estos espacios han sido trincheras de resistencia cultural y creatividad desbordante durante décadas.

Al caer la tarde, entenderás que el teatro en Cali no es solo entretenimiento, es un espejo de su sociedad. Finalizar esta ruta es una invitación a la bohemia intelectual, a debatir sobre la obra vista con una copa de vino y a celebrar el talento de dramaturgos y actores locales. Te llevarás la certeza de que en Cali, la vida misma es una puesta en escena maravillosa.',
    'Cali breathes dramaturgy and scenic passion. ''The Route of Theaters and Living Scene'' is a tribute to the stages that have narrated the city''s and country''s history. This tour invites you to discover the magic that happens when the lights go down and the curtain goes up. It is an immersion into the Caleño theatrical tradition, recognized for its avant-garde, social commitment, and ability to move to the deepest fiber.

The journey will take you through a fascinating spectrum of stages: from the neoclassical majesty of the Enrique Buenaventura Municipal Theater, where operas and concerts resonate, to the creative intimacy of independent halls in the San Antonio neighborhood, like Teatro La Máscara and Casa de los Títeres. You will learn about the legacy of the TEC (Experimental Theater of Cali) and how these spaces have been trenches of cultural resistance and overflowing creativity for decades.

At dusk, you will understand that theater in Cali is not just entertainment, it is a mirror of its society. Finishing this route is an invitation to intellectual bohemia, to debate the play seen over a glass of wine, and to celebrate the talent of local playwrights and actors. You will take away the certainty that in Cali, life itself is a wonderful performance.',
    ARRAY['El máximo escenario cultural, joya arquitectónica.','Teatro clásico de estilo neoclásico francés.','Cuna del teatro moderno colombiano (TEC).','Espacio íntimo de creación en San Antonio.','Teatro de larga trayectoria y formación.','Un mundo mágico dedicado a los títeres.'],
    ARRAY['The ultimate cultural venue, an architectural jewel.','Classic theater in French Neoclassical style.','Cradle of modern Colombian theater (TEC).','Intimate creation space in San Antonio.','Theater with a long trajectory and training.','A magical world dedicated to puppets.'],
    '[{"tipo":"Planificación","tipo_en":"Planning","titulo":"Cartelera","titulo_en":"Billboard","descripcion":"Revisa la programación de las obras antes de ir.","descripcion_en":"Check the play schedule before going."},{"tipo":"Ubicación","tipo_en":"Location","titulo":"San Antonio","titulo_en":"San Antonio","descripcion":"Aprovecha para cenar en San Antonio tras la función.","descripcion_en":"Take the opportunity to dine in San Antonio after the show."}]'::jsonb,
    NULL,
    TRUE
) ON CONFLICT (id) DO UPDATE SET 
    nombre = EXCLUDED.nombre,
    nombre_en = EXCLUDED.nombre_en,
    puntos = EXCLUDED.puntos,
    duracion_min = EXCLUDED.duracion_min,
    descripcion = EXCLUDED.descripcion,
    descripcion_en = EXCLUDED.descripcion_en,
    justificaciones = EXCLUDED.justificaciones,
    justificaciones_en = EXCLUDED.justificaciones_en,
    recomendaciones = EXCLUDED.recomendaciones,
    gamificacion = EXCLUDED.gamificacion;


INSERT INTO public.routes (
    id, nombre, nombre_en, puntos, duracion_min, 
    descripcion, descripcion_en, justificaciones, justificaciones_en, 
    recomendaciones, gamificacion, is_published
) VALUES (
    'ruta6',
    'Ruta de Monumentos y Postales Caleñas',
    'Route of Monuments and Caleño Postcards',
    ARRAY['s17','s5','s16','s40','s52','s59'],
    220,
    'Prepara tu cámara y tu sentido de la maravilla para inmortalizar los gigantes que definen el horizonte de Cali. ''La Ruta de Monumentos y Postales Caleñas'' es un recorrido visual por los íconos que dan identidad a la ciudad ante el mundo. Esta ruta conecta los puntos cardinales de la fe, la historia y la modernidad, ofreciéndote una comprensión geográfica y simbólica completa de la urbe. Es el tour definitivo para llevarse a Cali en el corazón y en la memoria fotográfica.

Tu lente capturará contrastes impresionantes: desde la serenidad protectora de Cristo Rey, que domina todo el valle con sus brazos abiertos, hasta la aguja gótica de la Iglesia La Ermita, que se refleja poéticamente en el río. Visitarás a Sebastián de Belalcázar señalando el camino al mar y te sentirás diminuto ante la Torre de Cali, símbolo de nuestra aspiración moderna. Cada parada es un hito, una historia petrificada en bronce o concreto que explica nuestros mitos fundacionales.

Al finalizar, tendrás mucho más que un álbum de fotos perfecto para tus redes sociales; tendrás un mapa mental claro de la ciudad y sus referentes. Entenderás cómo la topografía y el arte urbano se unen para crear la atmósfera única de Cali. Es una ruta para mirar hacia arriba, para admirar la grandeza y para sentirse parte del paisaje caleño.',
    'Prepare your camera and your sense of wonder to immortalize the giants that define Cali''s skyline. ''The Route of Monuments and Caleño Postcards'' is a visual tour of the icons that give the city its identity to the world. This route connects the cardinal points of faith, history, and modernity, offering you a complete geographic and symbolic understanding of the city. It is the definitive tour to take Cali in your heart and in your photographic memory.

Your lens will capture impressive contrasts: from the protective serenity of Cristo Rey, dominating the entire valley with open arms, to the Gothic spire of La Ermita Church, rising poetically by the river. You will visit Sebastián de Belalcázar pointing the way to the sea and feel tiny before the Cali Tower, symbol of our modern aspiration. Each stop is a landmark, a story petrified in bronze or concrete explaining our foundational myths.

By the end, you will have much more than a perfect photo album for your social networks; you will have a clear mental map of the city and its references. You will understand how topography and urban art come together to create Cali''s unique atmosphere. It is a route to look up, to admire greatness, and to feel part of the Caleño landscape.',
    ARRAY['El guardián de la ciudad con vista panorámica 360°.','El fundador señalando el camino al mar.','Ícono gótico imprescindible de la fotografía caleña.','El edificio más alto, símbolo de modernidad.','La reina infinita de la simpatía caleña.','El puente histórico que unió a la ciudad.'],
    ARRAY['The city guardian with a 360° panoramic view.','The founder pointing the way to the sea.','Essential Gothic icon of Caleño photography.','The tallest building, symbol of modernity.','The infinite queen of Caleño sympathy.','The historic bridge that united the city.'],
    '[{"tipo":"Foto","tipo_en":"Photo","titulo":"Hora Dorada","titulo_en":"Golden Hour","descripcion":"Visita Cristo Rey al atardecer para fotos increíbles.","descripcion_en":"Visit Cristo Rey at sunset for incredible photos."},{"tipo":"Transporte","tipo_en":"Transport","titulo":"Vehículo","titulo_en":"Vehicle","descripcion":"Necesitarás transporte para subir a los miradores.","descripcion_en":"You will need transport to go up to the viewpoints."}]'::jsonb,
    NULL,
    TRUE
) ON CONFLICT (id) DO UPDATE SET 
    nombre = EXCLUDED.nombre,
    nombre_en = EXCLUDED.nombre_en,
    puntos = EXCLUDED.puntos,
    duracion_min = EXCLUDED.duracion_min,
    descripcion = EXCLUDED.descripcion,
    descripcion_en = EXCLUDED.descripcion_en,
    justificaciones = EXCLUDED.justificaciones,
    justificaciones_en = EXCLUDED.justificaciones_en,
    recomendaciones = EXCLUDED.recomendaciones,
    gamificacion = EXCLUDED.gamificacion;

