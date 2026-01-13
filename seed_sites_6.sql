INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's63',
            'Capilla de San Antonio',
            'San Antonio Chapel',
            'Iglesia',
            'Church',
            3.4435,
            -76.5405,
            4.8,
            2000,
            'https://images.unsplash.com/photo-1565538555986-160359859f5f?auto=format&fit=crop&w=800',
            'La joya de la corona del barrio San Antonio. Esta pequeña capilla barroca, ubicada en la cima de la colina, es uno de los monumentos más antiguos y queridos de Cali. Su fachada blanca y sus gradas de piedra son el escenario perfecto para bodas y fotos. En su interior reposan altares de madera tallada y santos de la época colonial. Es un remanso de paz con una vista inigualable.',
            'The jewel in the crown of the San Antonio neighborhood. This small Baroque chapel, located at the top of the hill, is one of the oldest and most beloved monuments in Cali. Its white facade and stone steps are the perfect setting for weddings and photos. Inside rest carved wooden altars and colonial-era saints. It is a haven of peace with an unmatched view.',
            'Hito fundacional y arquitectónico del barrio más tradicional de Cali.',
            'Foundational and architectural landmark of Cali''s most traditional neighborhood.',
            'Construida en 1747 en honor a San Antonio de Padua.',
            'Built in 1747 in honor of Saint Anthony of Padua.',
            ARRAY['Las gradas frente a la iglesia son un punto de encuentro social espontáneo.','Alberga una valiosa colección de arte religioso quiteño.'],
            ARRAY['The steps in front of the church are a spontaneous social meeting point.','It houses a valuable collection of religious art from Quito.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's64',
            'Catedral de San Pedro Apóstol',
            'St. Peter the Apostle Cathedral',
            'Iglesia',
            'Church',
            3.451,
            -76.5315,
            4.6,
            1800,
            'https://images.unsplash.com/photo-1584464431052-1629857d34d3?auto=format&fit=crop&w=800',
            'Imponente y majestuosa, la Catedral domina el costado oriental de la Plaza de Cayzedo. Su fachada de estilo neoclásico es un testimonio de la fe y la historia de la ciudad. En su interior, destacan sus enormes lámparas de cristal, su órgano tubular traído de Alemania y sus altares de mármol. Es la sede de la Arquidiócesis de Cali y un lugar de silencio y recogimiento en medio del bullicio del centro.',
            'Imposing and majestic, the Cathedral dominates the eastern side of Cayzedo Square. Its neoclassical facade is a testimony to the city''s faith and history. Inside, its huge crystal chandeliers, its pipe organ brought from Germany, and its marble altars stand out. It is the seat of the Archdiocese of Cali and a place of silence and recollection amidst the downtown bustle.',
            'Templo católico principal de la ciudad y Bien de Interés Cultural.',
            'Main Catholic temple of the city and Asset of Cultural Interest.',
            'La construcción actual data de finales del siglo XVIII, aunque ha sufrido varias remodelaciones tras terremotos.',
            'The current construction dates from the late 18th century, although it has undergone several renovations after earthquakes.',
            ARRAY['Guarda pinturas de la escuela quiteña de gran valor.','Sus puertas de bronce repujado narran escenas bíblicas.'],
            ARRAY['It holds highly valuable paintings from the Quito school.','Its embossed bronze doors narrate biblical scenes.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's65',
            'Cerro de las Tres Cruces',
            'Three Crosses Hill',
            'Parque Natural',
            'Natural Park',
            3.458,
            -76.55,
            4.8,
            2800,
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800',
            'El reto físico por excelencia de los caleños. Subir a las Tres Cruces es un ritual matutino de fin de semana para miles de personas. El sendero es empinado y exige esfuerzo físico, pero la recompensa es una vista inigualable de la ciudad y un jugo de naranja fresco en la cima. Las tres grandes cruces de concreto dominan el paisaje y protegen, según la leyenda, a la ciudad del demonio ''Buziraco''.',
            'The physical challenge par excellence for Caleños. Climbing Las Tres Cruces is a weekend morning ritual for thousands of people. The trail is steep and demands physical effort, but the reward is an unmatched view of the city and fresh orange juice at the top. The three large concrete crosses dominate the landscape and protect, according to legend, the city from the demon ''Buziraco''.',
            'Principal escenario de deporte al aire libre y senderismo urbano masivo.',
            'Main setting for outdoor sports and massive urban hiking.',
            'Construidas en 1938 para ''exorcizar'' al demonio que supuestamente habitaba el cerro y causaba pestes y desgracias.',
            'Built in 1938 to ''exorcise'' the demon that supposedly inhabited the hill and caused plagues and misfortunes.',
            ARRAY['Se dice que el diablo (Buziraco) está atrapado bajo las cruces.','Hay gimnasios al aire libre improvisados en la cima.'],
            ARRAY['It is said that the devil (Buziraco) is trapped under the crosses.','There are improvised outdoor gyms at the top.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's76',
            'Monumento a la Solidaridad',
            'Solidarity Monument',
            'Monumento',
            'Monument',
            3.475,
            -76.515,
            4.4,
            600,
            'https://images.unsplash.com/photo-1596541223126-7d90d00d282e?auto=format&fit=crop&w=800',
            'Una escultura monumental que captura el espíritu cívico de Cali. Representa a un grupo de personas de diversas razas y condiciones uniendo fuerzas para levantar una estructura, simbolizando que el progreso se logra solo en comunidad y cooperación. Ubicada en una glorieta del norte, es un recordatorio visual potente de la fuerza colectiva y la ayuda mutua.',
            'A monumental sculpture capturing Cali''s civic spirit. It represents a group of people of diverse races and conditions joining forces to lift a structure, symbolizing that progress is achieved only in community and cooperation. Located in a northern roundabout, it is a powerful visual reminder of collective strength and mutual aid.',
            'Símbolo del civismo y la unidad caleña.',
            'Symbol of civic spirit and Cali unity.',
            'Inaugurado en 1995, obra del escultor cartagenero Héctor Lombana.',
            'Inaugurated in 1995, work of sculptor Héctor Lombana from Cartagena.',
            ARRAY['Está hecho de bronce, pizarra y cuarzo.','Es uno de los monumentos más grandes y pesados de la ciudad.'],
            ARRAY['It is made of bronze, slate, and quartz.','It is one of the largest and heaviest monuments in the city.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's86',
            'Bulevar de Oriente',
            'Boulevard of the East',
            'Espacio público',
            'Public Space',
            3.422,
            -76.485,
            4.9,
            2500,
            'https://images.unsplash.com/photo-1626127027476-3392eedd9427?auto=format&fit=crop&w=800',
            'Un milagro de transformación urbana en el Distrito de Aguablanca. Lo que antes era un canal de aguas lluvias y tierra divisoria, hoy es un parque lineal vibrante de 1.1 kilómetros lleno de color, canchas, juegos y arte. Es el nuevo orgullo del oriente de Cali, un espacio de reconciliación donde la comunidad se encuentra, hace deporte y celebra la vida. Sus murales cuentan la historia de resistencia y esperanza del barrio.',
            'A miracle of urban transformation in the Aguablanca District. What was once a rainwater channel and dividing dirt strip is now a vibrant 1.1-kilometer linear park full of color, courts, games, and art. It is the new pride of eastern Cali, a space for reconciliation where the community meets, plays sports, and celebrates life. Its murals tell the neighborhood''s story of resistance and hope.',
            'Modelo internacional de cómo el urbanismo social puede reducir la violencia y mejorar la calidad de vida.',
            'International model of how social urbanism can reduce violence and improve quality of life.',
            'Inaugurado recientemente como parte del proyecto ''5 Parques para la Vida'', transformando una zona de frontera invisible.',
            'Recently inaugurated as part of the ''5 Parks for Life'' project, transforming an invisible border zone.',
            ARRAY['Ha ganado premios internacionales de arquitectura y diseño urbano.','Los propios vecinos cuidan celosamente sus jardines y equipamiento.'],
            ARRAY['It has won international architecture and urban design awards.','Neighbors themselves jealously guard its gardens and equipment.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's87',
            'Unidad Deportiva Alberto Galindo',
            'Alberto Galindo Sports Unit',
            'Estadio',
            'Stadium',
            3.4155,
            -76.5505,
            4.7,
            5000,
            'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=800',
            'Un complejo gigantesco donde el deporte se encuentra con la cultura. Aquí conviven el Coliseo El Pueblo (con su icónico techo estilo ''nave espacial''), el patinódromo mundialista, pistas de skate, muros de escalada y amplias zonas verdes. Pero su magia explota en agosto, cuando se convierte en la ciudadela del Festival de Música del Pacífico Petronio Álvarez, llenándose de marimbas, viche y la mejor gastronomía afrocolombiana.',
            'A gigantic complex where sports meet culture. Here coexist the El Pueblo Coliseum (with its iconic ''spaceship'' style roof), the world-class skating rink, skate parks, climbing walls, and vast green areas. But its magic explodes in August, when it becomes the citadel of the Petronio Álvarez Pacific Music Festival, filling with marimbas, viche, and the best Afro-Colombian gastronomy.',
            'Epicentro de grandes eventos deportivos mundiales y del festival afro más grande del continente.',
            'Epicenter of major global sporting events and the continent''s largest Afro festival.',
            'Construida para los Juegos Panamericanos de 1971, un evento que modernizó a Cali.',
            'Built for the 1971 Pan American Games, an event that modernized Cali.',
            ARRAY['El Coliseo El Pueblo es famoso por su acústica y diseño futurista.','Es el lugar favorito de los skaters y bikers de la ciudad.'],
            ARRAY['El Pueblo Coliseum is famous for its acoustics and futuristic design.','It is the favorite place for the city''s skaters and bikers.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's88',
            'Arena Cañaveralejo',
            'Cañaveralejo Arena',
            'Centro de Eventos',
            'Event Center',
            3.4135,
            -76.552,
            4.6,
            3000,
            'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800',
            'Una estructura icónica de concreto que parece flotar gracias a su ingeniería de vanguardia. Originalmente la plaza de toros de la ciudad, hoy se ha reinventado como el principal centro de espectáculos del suroccidente colombiano. Su diseño en forma de copa permite una visibilidad perfecta desde cualquier ángulo. Aquí se viven los conciertos más grandes de la Feria de Cali y eventos internacionales.',
            'An iconic concrete structure that seems to float thanks to its avant-garde engineering. Originally the city''s bullring, today it has reinvented itself as the main entertainment center of southwestern Colombia. Its bowl-shaped design allows perfect visibility from any angle. The biggest concerts of the Cali Fair and international events are experienced here.',
            'Joya de la ingeniería colombiana y Monumento Nacional por su audaz diseño estructural.',
            'Jewel of Colombian engineering and National Monument for its bold structural design.',
            'Inaugurada en 1957. Su construcción fue un hito por usar elementos prefabricados innovadores para la época.',
            'Inaugurated in 1957. Its construction was a milestone for using innovative prefabricated elements for the time.',
            ARRAY['Su estructura es antisísmica y abierta, permitiendo la circulación del viento.','Ya no se usa para corridas de toros, enfocándose totalmente en la cultura y el entretenimiento.'],
            ARRAY['Its structure is earthquake-resistant and open, allowing wind circulation.','It is no longer used for bullfights, focusing entirely on culture and entertainment.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's7',
            'La Topa Tolondra',
            'La Topa Tolondra',
            'Música en Vivo',
            'Live Music',
            3.4488,
            -76.5398,
            4.8,
            1100,
            'https://images.unsplash.com/photo-1545959720-333d6b38c227?auto=format&fit=crop&w=800',
            'No es solo una discoteca, es una institución cultural de la salsa. La Topa Tolondra es el lugar democrático donde locales y extranjeros se encuentran en la pista de baile. Famosa mundialmente por sus ''Lunes de Salsa'', rompe el mito de que los lunes son aburridos. El ambiente es inclusivo, sudoroso y auténtico. Aquí no importa si eres experto o principiante, lo importante es sentir la clave. Paredes llenas de historia salsera y una programación musical curada con maestría.',
            'It''s not just a nightclub, it''s a cultural institution of salsa. La Topa Tolondra is the democratic place where locals and foreigners meet on the dance floor. World-famous for its ''Salsa Mondays'', it breaks the myth that Mondays are boring. The atmosphere is inclusive, sweaty, and authentic. Here it doesn''t matter if you are an expert or a beginner, the important thing is to feel the beat. Walls full of salsa history and masterfully curated musical programming.',
            'Responsable de revitalizar la rumba salsera en el centro y atraer turismo internacional masivo.',
            'Responsible for revitalizing the salsa party downtown and attracting massive international tourism.',
            'Comenzó como un pequeño bar en la Calle 5ta y creció hasta convertirse en el templo actual frente al Parque Jovita.',
            'Started as a small bar on 5th Street and grew to become the current temple facing Parque Jovita.',
            ARRAY['Sus clases de baile gratuitas antes de la rumba son legendarias.','El dueño, Carlos ''El Tribuno'', es un personaje icónico de la noche caleña.'],
            ARRAY['Its free dance classes before the party are legendary.','The owner, Carlos ''El Tribuno'', is an iconic figure of Cali nightlife.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's27',
            'Swing Latino',
            'Swing Latino',
            'Escuela de Salsa',
            'Salsa School',
            3.4285,
            -76.5385,
            4.9,
            400,
            'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&w=800',
            'La casa de los campeones mundiales indiscutibles. Swing Latino es la escuela fundada por ''El Mulato'', el visionario bailarín que llevó el vertiginoso estilo caleño a los escenarios globales (incluyendo el show del Super Bowl con JLo). Aquí el entrenamiento es riguroso, atlético y apasionado. Es el lugar ideal para ver ensayos de nivel profesional o tomar una clase y entender la velocidad y acrobacia que caracteriza el baile de Cali.',
            'The home of the undisputed world champions. Swing Latino is the school founded by ''El Mulato'', the visionary dancer who took the vertiginous Cali style to global stages (including the Super Bowl show with JLo). Here training is rigorous, athletic, and passionate. It is the ideal place to watch professional-level rehearsals or take a class and understand the speed and acrobatics that characterize Cali dance.',
            'Embajadores culturales de Colombia ante el mundo y creadores del estilo caleño espectáculo.',
            'Cultural ambassadors of Colombia to the world and creators of the show-style Cali dance.',
            'Fundada a finales de los 90, revolucionó la forma de bailar salsa integrando acrobacias y vestuarios de lujo.',
            'Founded in the late 90s, it revolutionized the way of dancing salsa integrating acrobatics and luxury costumes.',
            ARRAY['Han ganado múltiples veces el World Salsa Summit.','Muchos de sus bailarines provienen de barrios populares, transformando sus vidas a través del baile.'],
            ARRAY['They have won the World Salsa Summit multiple times.','Many of their dancers come from popular neighborhoods, transforming their lives through dance.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's28',
            'Zaperoco Bar',
            'Zaperoco Bar',
            'Música en Vivo',
            'Live Music',
            3.456,
            -76.5295,
            4.7,
            900,
            'https://images.unsplash.com/photo-1514525253440-b393452e2729?auto=format&fit=crop&w=800',
            'El templo de la salsa en el norte de Cali. Zaperoco es un espacio íntimo, con una estética que evoca los años 70 y 80 en Nueva York y Puerto Rico. Aquí la salsa se respeta y se vive con intensidad y conocimiento. Es famoso por sus jueves de música en vivo y por ser el refugio de los melómanos que prefieren escuchar y apreciar la música tanto como bailarla. Su atmósfera es densa, cálida y llena de tradición.',
            'The temple of salsa in northern Cali. Zaperoco is an intimate space, with an aesthetic that evokes the 70s and 80s in New York and Puerto Rico. Here salsa is respected and lived with intensity and knowledge. It is famous for its live music Thursdays and for being the refuge of music lovers who prefer to listen and appreciate the music as much as dance it. Its atmosphere is dense, warm, and full of tradition.',
            'Bastión de la identidad salsera tradicional frente a las modas comerciales.',
            'Bastion of traditional salsa identity against commercial trends.',
            'Fundado en 1993, ha resistido el paso del tiempo manteniendo su esencia pura.',
            'Founded in 1993, it has withstood the test of time maintaining its pure essence.',
            ARRAY['Sus paredes están forradas de afiches autografiados por leyendas de la salsa que han visitado el lugar.','Es un lugar imperdible para los músicos que visitan la ciudad.'],
            ARRAY['Its walls are lined with posters autographed by salsa legends who have visited the place.','It is a must-visit place for musicians visiting the city.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;