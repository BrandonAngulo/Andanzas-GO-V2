INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's16',
            'Iglesia La Ermita',
            'La Ermita Church',
            'Iglesia',
            'Church',
            3.4535,
            -76.532,
            4.8,
            2100,
            'https://images.unsplash.com/photo-1549643276-8e50b691079d?auto=format&fit=crop&w=800',
            'Una fantasía gótica en el trópico. La Ermita es quizás la postal más reconocida de Cali. Su arquitectura neogótica, inspirada en la Catedral de Ulm (Alemania), contrasta con la modernidad del Bulevar del Río. Sus agujas blancas se elevan hacia el cielo, y su interior alberga vitrales holandeses, campanas francesas y un órgano alemán. Es un símbolo de fe y resiliencia, reconstruida tras el terremoto que destruyó la capilla original.',
            'A Gothic fantasy in the tropics. La Ermita is perhaps Cali''s most recognized postcard. Its neo-Gothic architecture, inspired by Ulm Cathedral (Germany), contrasts with the modernity of the River Boulevard. Its white spires rise towards the sky, and its interior houses Dutch stained glass, French bells, and a German organ. It is a symbol of faith and resilience, rebuilt after the earthquake that destroyed the original chapel.',
            'Hito arquitectónico y religioso más fotografiado de la ciudad.',
            'Most photographed architectural and religious landmark of the city.',
            'La construcción actual se inició en 1930 y finalizó en 1942, reemplazando una capilla del siglo XVII.',
            'The current construction began in 1930 and finished in 1942, replacing a 17th-century chapel.',
            ARRAY['Guarda la imagen del ''Señor de la Caña'', única sobreviviente del terremoto de 1787.','Su reloj musical suena cada hora, alegrando el centro.'],
            ARRAY['It keeps the image of the ''Lord of the Sugarcane'', the only survivor of the 1787 earthquake.','Its musical clock chimes every hour, cheering up the downtown area.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's17',
            'Cristo Rey',
            'Christ the King',
            'Monumento',
            'Monument',
            3.4355,
            -76.56,
            4.7,
            2500,
            'https://images.unsplash.com/photo-1583307525867-27b9264c3915?auto=format&fit=crop&w=800',
            'Vigilando la ciudad desde el Cerro de los Cristales a 1440 msnm, esta imponente estatua de 26 metros abre sus brazos protectores sobre Cali. Subir hasta aquí ofrece la mejor panorámica de 360 grados de la ciudad y el Valle del Cauca. Recientemente renovado con el ''Proyecto Integral Cristo Rey'', el entorno cuenta ahora con senderos ecológicos, miradores y espacios comerciales. El viento aquí arriba es fuerte y refrescante, un alivio perfecto del calor del valle.',
            'Watching over the city from the Cerro de los Cristales at 1440 masl, this imposing 26-meter statue opens its protective arms over Cali. Going up here offers the best 360-degree panoramic view of the city and the Valle del Cauca. Recently renovated with the ''Christ the King Integral Project'', the surroundings now feature ecological trails, viewpoints, and commercial spaces. The wind up here is strong and refreshing, a perfect relief from the valley heat.',
            'Icono religioso y turístico, conmemorativo de los 50 años del final de la Guerra de los Mil Días y símbolo de paz.',
            'Religious and tourist icon, commemorative of the 50 years since the end of the Thousand Days'' War and a symbol of peace.',
            'Inaugurado en 1953. Se utilizaron 35 toneladas de hierro y 1000 sacos de cemento en su construcción.',
            'Inaugurated in 1953. 35 tons of iron and 1000 sacks of cement were used in its construction.',
            ARRAY['Es más alto que el Cristo Redentor de Río de Janeiro si se cuenta la base.','La obra fue esculpida inicialmente en arcilla por el artista italiano Alideo Tazzioli.'],
            ARRAY['It is taller than Christ the Redeemer in Rio de Janeiro if counting the base.','The work was initially sculpted in clay by Italian artist Alideo Tazzioli.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's18',
            'Jardín Botánico de Cali',
            'Cali Botanical Garden',
            'Jardín Botánico',
            'Botanical Garden',
            3.45,
            -76.56,
            4.6,
            500,
            'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800',
            'Un pulmón verde secreto en el oeste de la ciudad. Este espacio está dedicado a la conservación del bosque seco tropical, uno de los ecosistemas más amenazados. Recorrer sus senderos es desconectarse del ruido urbano y entrar en un mundo de mariposas, aves y vegetación nativa. Cuenta con miradores naturales hacia la ciudad y una estación experimental de plantas. Es ideal para el senderismo suave y la educación ambiental.',
            'A secret green lung in the west of the city. This space is dedicated to the conservation of the tropical dry forest, one of the most threatened ecosystems. Walking its trails is disconnecting from urban noise and entering a world of butterflies, birds, and native vegetation. It features natural viewpoints towards the city and an experimental plant station. It is ideal for gentle hiking and environmental education.',
            'Reserva vital del ecosistema de Bosque Seco Tropical dentro del área urbana.',
            'Vital reserve of the Tropical Dry Forest ecosystem within the urban area.',
            'Promovido por la Fundación Zoológica de Cali para expandir la conservación vegetal.',
            'Promoted by the Cali Zoological Foundation to expand plant conservation.',
            ARRAY['Tiene un sendero sensorial para conectar con la naturaleza a través del tacto y el olfato.','Es hogar de muchas especies de aves migratorias.'],
            ARRAY['It has a sensory trail to connect with nature through touch and smell.','It is home to many migratory bird species.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's19',
            'Parque San Antonio',
            'San Antonio Park',
            'Espacio público',
            'Public Space',
            3.443,
            -76.54,
            4.8,
            2200,
            'https://images.unsplash.com/photo-1565538555986-160359859f5f?auto=format&fit=crop&w=800',
            'El pulmón verde y el alma del barrio más antiguo y colonial de Cali. Este parque inclinado es famoso por funcionar como un anfiteatro natural donde la gente se sienta en el pasto a ver caer la tarde, comer mazorcas, beber cerveza y escuchar música. Rodeado de casas coloniales, restaurantes gourmet y la histórica capilla barroca en la cima, es un lugar de encuentro bohemio y relajado imprescindible.',
            'The green lung and soul of Cali''s oldest and most colonial neighborhood. This sloping park is famous for functioning as a natural amphitheater where people sit on the grass to watch the sunset, eat corn, drink beer, and listen to music. Surrounded by colonial houses, gourmet restaurants, and the historic baroque chapel at the top, it is an essential bohemian and relaxed meeting place.',
            'Núcleo del barrio patrimonial de San Antonio y espacio de convivencia ciudadana por excelencia.',
            'Core of the heritage neighborhood of San Antonio and a space for civic coexistence par excellence.',
            'La colina ha sido habitada desde la colonia. El parque tomó su forma actual en el siglo XX, respetando la topografía.',
            'The hill has been inhabited since colonial times. The park took its current form in the 20th century, respecting the topography.',
            ARRAY['Es el lugar favorito de los caleños para elevar cometas en agosto debido a los fuertes vientos.','En sus alrededores viven muchos artistas, escritores y artesanos.'],
            ARRAY['It is the favorite place for Caleños to fly kites in August due to the strong winds.','Many artists, writers, and artisans live in its surroundings.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's20',
            'Ecoparque Río Pance',
            'Pance River Ecopark',
            'Parque Natural',
            'Natural Park',
            3.32,
            -76.55,
            4.8,
            3000,
            'https://images.unsplash.com/photo-1447752875253-b791008657a7?auto=format&fit=crop&w=800',
            'Si quieres saber qué hace un caleño auténtico el domingo, ve a Pance. Este río de aguas frías y cristalinas que baja directamente de los Farallones es el balneario natural y democrático de la ciudad. El ecoparque ofrece senderos para caminar, zonas de picnic, lagos y acceso directo al río. Es un ritual sagrado sumergirse en sus aguas para ''sacarse el calor'' y luego disfrutar de un sancocho de gallina en leña en los restaurantes aledaños.',
            'If you want to know what an authentic Caleño does on Sunday, go to Pance. This river of cold, crystalline waters coming directly down from the Farallones is the city''s natural and democratic spa. The ecopark offers walking trails, picnic areas, lakes, and direct river access. It is a sacred ritual to immerse yourself in its waters to ''beat the heat'' and then enjoy a chicken sancocho cooked on firewood in the nearby restaurants.',
            'Principal fuente hídrica recreativa y corredor ecológico vital de la ciudad.',
            'Main recreational water source and vital ecological corridor of the city.',
            'El río nace en el Parque Nacional Natural Farallones de Cali, una de las zonas más biodiversas.',
            'The river originates in the Farallones de Cali National Natural Park, one of the most biodiverse areas.',
            ARRAY['El agua es notablemente fría, lo que contrasta deliciosamente con el clima cálido de Cali.','Es un excelente lugar para el avistamiento de aves al amanecer.'],
            ARRAY['The water is remarkably cold, which contrasts deliciously with Cali''s warm climate.','It is an excellent place for birdwatching at sunrise.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's21',
            'Plazoleta Jairo Varela',
            'Jairo Varela Square',
            'Monumento',
            'Monument',
            3.454,
            -76.533,
            4.6,
            1400,
            'https://images.unsplash.com/photo-1542300057-0cb85d0d8e95?auto=format&fit=crop&w=800',
            'Un espacio público moderno dedicado a la memoria sonora de la ciudad. Ubicada frente al CAM (Centro Administrativo Municipal), esta plazoleta rinde homenaje al maestro Jairo Varela, creador del legendario Grupo Niche. Su atracción principal es ''Niche'', una escultura sonora monumental en forma de trompetas y campanas. Si te paras debajo de ellas, escucharás los clásicos de la salsa como ''Cali Pachanguero''. Alberga también el Museo Jairo Varela en el segundo piso.',
            'A modern public space dedicated to the city''s sonic memory. Located in front of the CAM (Municipal Administrative Center), this square pays tribute to maestro Jairo Varela, creator of the legendary Grupo Niche. Its main attraction is ''Niche'', a monumental sound sculpture in the shape of trumpets and bells. If you stand under them, you will hear salsa classics like ''Cali Pachanguero''. It also houses the Jairo Varela Museum on the second floor.',
            'Reconocimiento a la identidad salsera de Cali y a su compositor más prolífico.',
            'Recognition of Cali''s salsa identity and its most prolific composer.',
            'Inaugurada en 2013, un año después del fallecimiento del maestro Varela, como regalo a la ciudad.',
            'Inaugurated in 2013, one year after the death of maestro Varela, as a gift to the city.',
            ARRAY['La escultura escribe la palabra ''NICHE'' si se ve desde el aire.','Es un punto de encuentro popular para bailarines de salsa y turistas.'],
            ARRAY['The sculpture spells the word ''NICHE'' if viewed from the air.','It is a popular meeting point for salsa dancers and tourists.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's24',
            'Parque del Perro',
            'Dog''s Park',
            'Zona Gastronómica',
            'Gastronomic Zone',
            3.435,
            -76.545,
            4.7,
            1900,
            'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800',
            'El corazón social y gastronómico del barrio San Fernando. Este pequeño parque triangular, presidido por la estatua de un perro ''Teddy'', es el punto de partida para una noche de diversión. A su alrededor se aglomeran decenas de restaurantes, bares y heladerías que ofrecen desde comida rápida gourmet hasta platos internacionales. El ambiente es joven, vibrante y muy concurrido, especialmente los fines de semana.',
            'The social and gastronomic heart of the San Fernando neighborhood. This small triangular park, presided over by the statue of a dog ''Teddy'', is the starting point for a night of fun. Dozens of restaurants, bars, and ice cream shops cluster around it, offering everything from gourmet fast food to international dishes. The atmosphere is young, vibrant, and very busy, especially on weekends.',
            'Epicentro de la vida social y nocturna del sur de Cali.',
            'Epicenter of social and nightlife in southern Cali.',
            'El monumento al perro Teddy fue instalado en los años 70 en honor a la mascota de una casa vecina que ''cuidaba'' el parque.',
            'The monument to Teddy the dog was installed in the 70s in honor of a neighbor''s pet that ''guarded'' the park.',
            ARRAY['Originalmente el perro miraba hacia otro lado; su orientación ha cambiado con las remodelaciones.','Es famoso por sus puestos de ''cholados'' y ''mazorcas''.'],
            ARRAY['Originally the dog looked the other way; its orientation has changed with renovations.','It is famous for its ''cholados'' and ''mazorcas'' stalls.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's26',
            'Parque Panamericano (Las Banderas)',
            'Pan American Park (The Flags)',
            'Espacio público',
            'Public Space',
            3.428,
            -76.542,
            4.5,
            1200,
            'https://images.unsplash.com/photo-1565538555986-160359859f5f?auto=format&fit=crop&w=800',
            'Un vasto espacio abierto donde ondean las banderas de las naciones de América. Conocido popularmente como el ''Parque de las Banderas'', es la antesala del Estadio Pascual Guerrero. Es un lugar de encuentro masivo, escenario de conciertos, manifestaciones cívicas y ferias. Su amplitud permite sentir la brisa caleña y observar el movimiento de la Calle 5ta. Es un símbolo de la vocación deportiva de la ciudad.',
            'A vast open space where the flags of the nations of the Americas fly. Popularly known as ''The Flags Park'', it is the prelude to the Pascual Guerrero Stadium. It is a massive meeting place, a stage for concerts, civic demonstrations, and fairs. Its breadth allows you to feel the Cali breeze and observe the movement of 5th Street. It is a symbol of the city''s sporting vocation.',
            'Construido para los Juegos Panamericanos de 1971, evento que transformó a Cali.',
            'Built for the 1971 Pan American Games, an event that transformed Cali.',
            'Marcó el inicio de la modernización urbana de Cali hacia el sur.',
            'It marked the beginning of Cali''s urban modernization towards the south.',
            ARRAY['Es el punto de encuentro tradicional para celebrar los triunfos de los equipos de fútbol locales.','Bajo las banderas hay fuentes que refrescan el ambiente.'],
            ARRAY['It is the traditional meeting point to celebrate the triumphs of local soccer teams.','Under the flags there are fountains that cool the environment.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's38',
            'Ecoparque Lago de las Garzas',
            'Lake of the Herons Ecopark',
            'Parque Natural',
            'Natural Park',
            3.325,
            -76.53,
            4.7,
            900,
            'https://images.unsplash.com/photo-1447752875253-b791008657a7?auto=format&fit=crop&w=800',
            'Un humedal tranquilo y hermoso en el sur de la ciudad, ideal para la contemplación y el silencio. El parque gira en torno a un lago rodeado de vegetación espesa donde habitan, como su nombre lo indica, garzas, patos, iguanas y tortugas. Sus senderos de madera y tierra permiten un recorrido relajante bajo la sombra. Es un refugio perfecto para leer, meditar o pasear con niños pequeños en contacto directo con la naturaleza.',
            'A quiet and beautiful wetland in the south of the city, ideal for contemplation and silence. The park revolves around a lake surrounded by thick vegetation inhabited, as its name suggests, by herons, ducks, iguanas, and turtles. Its wooden and dirt paths allow a relaxing tour under the shade. It is a perfect refuge for reading, meditating, or walking with small children in direct contact with nature.',
            'Humedal urbano clave para la regulación hídrica y refugio de fauna silvestre.',
            'Key urban wetland for water regulation and wildlife refuge.',
            'Recuperado por la gestión comunitaria y ambiental para evitar su urbanización.',
            'Recovered by community and environmental management to prevent its urbanization.',
            ARRAY['Es uno de los mejores lugares para el avistamiento de aves acuáticas dentro de la ciudad.','No se permite música ni ruido alto para proteger a la fauna.'],
            ARRAY['It is one of the best places for waterfowl watching within the city.','Music and loud noise are not allowed to protect the wildlife.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's39',
            'Plaza de Cayzedo',
            'Cayzedo Square',
            'Espacio público',
            'Public Space',
            3.451,
            -76.531,
            4.4,
            2000,
            'https://images.unsplash.com/photo-1584464431052-1629857d34d3?auto=format&fit=crop&w=800',
            'El kilómetro cero de Cali. Esta plaza, rodeada de palmeras altísimas ''Roystonea regia'', es el corazón cívico y comercial histórico de la ciudad. A su alrededor se erigen edificios emblemáticos de arquitectura republicana y neoclásica como la Catedral de San Pedro, el Palacio Nacional y el Edificio Otero. Es un lugar vibrante, lleno de vendedores de tinto, lustrabotas y transeúntes, donde se siente el pulso diario de la ciudad y se cruzan todas las historias.',
            'Cali''s kilometer zero. This square, surrounded by towering ''Roystonea regia'' palms, is the historical civic and commercial heart of the city. Around it stand emblematic buildings of Republican and neoclassical architecture such as St. Peter''s Cathedral, the National Palace, and the Otero Building. It is a vibrant place, full of coffee sellers, shoeshine boys, and passersby, where you feel the city''s daily pulse and all stories cross paths.',
            'Centro del poder político, religioso y comercial desde la época colonial.',
            'Center of political, religious, and commercial power since colonial times.',
            'Originalmente era la Plaza de la Constitución. Renombrada en honor al prócer vallecaucano Joaquín de Cayzedo y Cuero.',
            'Originally it was the Constitution Square. Renamed in honor of the Valle del Cauca hero Joaquín de Cayzedo y Cuero.',
            ARRAY['Las palmeras ''reales'' son el sello distintivo de la plaza y algunas son centenarias.','Ha sido escenario de los eventos políticos y sociales más importantes de la historia de Cali.'],
            ARRAY['The ''royal'' palms are the hallmark of the square and some are centennial.','It has been the scene of the most important political and social events in Cali''s history.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;