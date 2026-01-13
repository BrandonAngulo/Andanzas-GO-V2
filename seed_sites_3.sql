INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's66',
            'Teatro Salamandra',
            'Salamandra Theater',
            'Centro Cultural',
            'Cultural Center',
            3.428,
            -76.538,
            4.6,
            350,
            'https://images.unsplash.com/photo-1514533248912-c96053fa4819?auto=format&fit=crop&w=800',
            'Enclavado en el tradicional barrio San Fernando, el Teatro Salamandra del Barco Ebrio es un verdadero bastión de la resistencia cultural caleña. Fundado y dirigido por la dramaturga Beatriz Monsalve, este espacio no es solo una sala de teatro, sino un laboratorio de creación donde convergen el cine independiente, la literatura, la música y las artes escénicas. Su arquitectura interior, cálida y revestida de madera, evoca la bodega de un barco donde se gestan sueños artísticos. Es sede del Festival Internacional de Teatro de Cali y un refugio seguro para el pensamiento crítico.',
            'Nestled in the traditional San Fernando neighborhood, the Salamandra Theater of the Drunken Boat (Barco Ebrio) is a true bastion of Cali''s cultural resistance. Founded and directed by playwright Beatriz Monsalve, this space is not just a theater, but a creation laboratory where independent cinema, literature, music, and performing arts converge. Its interior architecture, warm and wood-paneled, evokes the hold of a ship where artistic dreams are brewed. It hosts the Cali International Theater Festival and is a safe haven for critical thinking.',
            'Epicentro del teatro independiente y organizador de eventos culturales de talla internacional.',
            'Epicenter of independent theater and organizer of world-class cultural events.',
            'La Fundación Barco Ebrio se estableció en 1994, consolidando al Salamandra como su sede permanente.',
            'The Barco Ebrio Foundation was established in 1994, consolidating Salamandra as its permanent headquarters.',
            ARRAY['Su nombre completo rinde homenaje al poema ''El Barco Ebrio'' de Arthur Rimbaud.','Cuentan con una programación de cineclub muy selecta y con conversatorios profundos.'],
            ARRAY['Its full name pays tribute to the poem ''The Drunken Boat'' by Arthur Rimbaud.','They have a very select film club program with deep discussions.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's67',
            'Casa de los Títeres',
            'Puppet House',
            'Teatro',
            'Theater',
            3.444,
            -76.542,
            4.9,
            500,
            'https://images.unsplash.com/photo-1535572290543-960a8046f5af?auto=format&fit=crop&w=800',
            'Un mundo mágico y colorido dedicado exclusivamente al arte de los títeres y las marionetas. Al cruzar sus puertas, tanto niños como adultos entran en un universo de fantasía. Es la sede del renombrado grupo ''Pequeño Teatro de Muñecos'' y cuenta con una sala de teatro íntima, una tienda de juguetes artesanales y una maravillosa exposición permanente de títeres de todo el mundo. Es el plan familiar perfecto para el fin de semana, donde la imaginación es la protagonista.',
            'A magical and colorful world dedicated exclusively to the art of puppets and marionettes. Upon entering, both children and adults step into a universe of fantasy. It is the home of the renowned ''Little Puppet Theater'' group and features an intimate theater hall, a handmade toy shop, and a wonderful permanent exhibition of puppets from around the world. It is the perfect family plan for the weekend, where imagination plays the lead role.',
            'Principal impulsor del teatro de animación y objetos en el occidente colombiano.',
            'Main driver of animation and object theater in western Colombia.',
            'Fundada en 1998, han mantenido viva la tradición oral y visual por décadas, formando nuevas generaciones de público.',
            'Founded in 1998, they have kept the oral and visual tradition alive for decades, training new generations of audiences.',
            ARRAY['Organizan la ''Feria de los Títeres'' cada año, trayendo grupos de todo el mundo.','Los títeres que ves en exhibición han sido usados en obras históricas del grupo.'],
            ARRAY['They organize the ''Puppet Fair'' every year, bringing groups from all over the world.','The puppets you see on display have been used in historical plays of the group.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's68',
            'Domus Teatro',
            'Domus Theater',
            'Teatro',
            'Theater',
            3.441,
            -76.541,
            4.6,
            300,
            'https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=800',
            'Una casa tradicional transformada en un escenario vibrante. Domus Teatro se caracteriza por su atmósfera familiar, acogedora y su extrema cercanía con el público. Es un espacio que apuesta decididamente por la dramaturgia propia y contemporánea, ofreciendo obras que reflexionan sobre la cotidianidad, el humor y la condición humana. Su patio interior y su pequeño café son ideales para charlar con los artistas después de la función.',
            'A traditional house transformed into a vibrant stage. Domus Theater is characterized by its family-friendly, cozy atmosphere and extreme proximity to the audience. It is a space strongly committed to original and contemporary dramaturgy, offering plays that reflect on everyday life, humor, and the human condition. Its interior courtyard and small cafe are ideal for chatting with the artists after the show.',
            'Espacio vital para la circulación de nuevos grupos teatrales y dramaturgos caleños.',
            'Vital space for the circulation of new theater groups and Cali playwrights.',
            'Surgió como una iniciativa independiente para descentralizar el teatro y ofrecer espacios alternativos.',
            'Emerged as an independent initiative to decentralize theater and offer alternative spaces.',
            ARRAY['El escenario está casi al mismo nivel del público, rompiendo la ''cuarta pared''.','Ofrecen talleres de teatro terapéutico y para no actores.'],
            ARRAY['The stage is almost at the same level as the audience, breaking the ''fourth wall''.','They offer therapeutic theater workshops and workshops for non-actors.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's69',
            'Cali Teatro',
            'Cali Theater',
            'Teatro',
            'Theater',
            3.449,
            -76.538,
            4.7,
            400,
            'https://images.unsplash.com/photo-1513106580091-1d82408b8cd8?auto=format&fit=crop&w=800',
            'Ubicado en una imponente y hermosa casona de arquitectura republicana en las faldas de San Antonio, Cali Teatro combina la elegancia del pasado con la vitalidad del teatro moderno. Dirigido por el maestro Álvaro Arcos, se destaca por montajes de altísima calidad técnica y estética, que van desde clásicos universales hasta adaptaciones de literatura colombiana. Es un espacio con una mística y tradición únicas en la ciudad.',
            'Located in an imposing and beautiful Republican-architecture mansion on the slopes of San Antonio, Cali Theater combines the elegance of the past with the vitality of modern theater. Directed by master Álvaro Arcos, it stands out for productions of very high technical and aesthetic quality, ranging from universal classics to adaptations of Colombian literature. It is a space with unique mystique and tradition in the city.',
            'Referente indiscutible de calidad escénica y formación de actores profesionales en la ciudad.',
            'Undisputable benchmark of scenic quality and professional actor training in the city.',
            'Fundado en 1989, ocupa y conserva una casa patrimonial de finales del siglo XIX.',
            'Founded in 1989, it occupies and preserves a heritage house from the late 19th century.',
            ARRAY['La sala tiene una pendiente y acústica diseñadas específicamente para proyectar la voz hablada sin micrófonos.','Sus camerinos guardan historias y firmas de grandes actores nacionales.'],
            ARRAY['The hall has a slope and acoustics designed specifically to project the spoken voice without microphones.','Its dressing rooms hold stories and signatures of great national actors.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's70',
            'Teatro del Presagio',
            'Presagio Theater',
            'Teatro Experimental',
            'Experimental Theater',
            3.454,
            -76.53,
            4.5,
            300,
            'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=800',
            'Un verdadero laboratorio escénico ubicado en el barrio Granada. El Teatro del Presagio es conocido por su apuesta radical por la investigación y la creación colectiva. Sus obras suelen mezclar diversos lenguajes artísticos, desde lo visual hasta lo sonoro, buscando constantemente nuevas formas de narrar. Es sede frecuente de la Universidad del Valle para sus muestras de tesis, lo que garantiza frescura y vanguardia en su programación.',
            'A true scenic laboratory located in the Granada neighborhood. Presagio Theater is known for its radical commitment to research and collective creation. Its plays often mix diverse artistic languages, from visual to sonic, constantly seeking new ways to narrate. It is a frequent venue for Universidad del Valle for its thesis showcases, guaranteeing freshness and avant-garde in its programming.',
            'Puente fundamental entre el teatro académico experimental y el público general.',
            'Fundamental bridge between experimental academic theater and the general public.',
            'El grupo se fundó en el año 2000, consolidando su sala propia años después para tener libertad creativa.',
            'The group was founded in 2000, consolidating its own venue years later to have creative freedom.',
            ARRAY['Tienen una franja infantil muy querida los domingos por la mañana.','Su fachada colorida y artística es inconfundible en la Avenida 9N.'],
            ARRAY['They have a beloved children''s slot on Sunday mornings.','Its colorful and artistic facade is unmistakable on 9N Avenue.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's96',
            'TEC - Teatro Experimental de Cali',
            'TEC - Cali Experimental Theater',
            'Teatro Experimental',
            'Experimental Theater',
            3.4505,
            -76.5345,
            4.8,
            500,
            'https://images.unsplash.com/photo-1595131838595-3154b9f4452b?auto=format&fit=crop&w=800',
            'La cuna del teatro moderno en Colombia. Fundado por el maestro Enrique Buenaventura, el TEC no es solo un teatro, es una escuela de pensamiento y creación colectiva. Sus obras han recorrido el mundo llevando la identidad vallecaucana y la crítica social. Ubicado en el centro histórico, sigue siendo un faro de resistencia cultural y rigor artístico, manteniendo vivo el legado de la Creación Colectiva.',
            'The cradle of modern theater in Colombia. Founded by master Enrique Buenaventura, the TEC is not just a theater, it is a school of thought and collective creation. Its plays have toured the world carrying the Valle del Cauca identity and social criticism. Located in the historic center, it remains a beacon of cultural resistance and artistic rigor, keeping the legacy of Collective Creation alive.',
            'Institución teatral más influyente en la historia de las artes escénicas de Colombia.',
            'Most influential theatrical institution in the history of performing arts in Colombia.',
            'Fundado en 1955. Enrique Buenaventura desarrolló aquí su método de creación colectiva estudiado mundialmente.',
            'Founded in 1955. Enrique Buenaventura developed his globally studied collective creation method here.',
            ARRAY['Su estatua frente al teatro ''vigila'' la entrada.','Aún conservan libretos originales escritos a mano por el maestro.'],
            ARRAY['His statue in front of the theater ''guards'' the entrance.','They still preserve original scripts handwritten by the master.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's3',
            'Bulevar del Río',
            'River Boulevard',
            'Espacio público',
            'Public Space',
            3.453,
            -76.532,
            4.6,
            1520,
            'https://images.unsplash.com/photo-1626127027476-3392eedd9427?auto=format&fit=crop&w=800',
            'Es la ''sala de recibo'' moderna de Cali. Un extenso y ventilado paseo peatonal a orillas del río que transformó el centro de la ciudad. Aquí la brisa de la tarde es la protagonista. Es el lugar democrático donde convergen caleños de todas las edades y clases sociales para caminar, tomar un café, escuchar música espontánea o simplemente ver pasar la vida. Conecta la arquitectura histórica del Puente Ortiz y la Ermita con la modernidad del centro administrativo.',
            'It is Cali''s modern ''living room''. An extensive and breezy pedestrian promenade along the riverbanks that transformed the city center. Here, the afternoon breeze is the protagonist. It is the democratic place where Cali residents of all ages and social classes converge to walk, have a coffee, listen to spontaneous music, or simply watch life go by. It connects the historical architecture of the Ortiz Bridge and La Ermita with the modernity of the administrative center.',
            'La obra de renovación urbana más importante del siglo XXI en Cali, recuperando el espacio público para el peatón.',
            'The most important urban renewal project of the 21st century in Cali, reclaiming public space for pedestrians.',
            'Inaugurado en 2013. Se construyó sobre el túnel de la Avenida Colombia, el túnel urbano más largo del país en su momento.',
            'Inaugurated in 2013. Built over the Colombia Avenue tunnel, the longest urban tunnel in the country at the time.',
            ARRAY['Es el epicentro del alumbrado navideño cada diciembre.','A lo largo del bulevar encontrarás esculturas y restos visibles del antiguo Puente Ortiz.'],
            ARRAY['It is the epicenter of Christmas lighting every December.','Along the boulevard, you will find sculptures and visible remains of the old Ortiz Bridge.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's5',
            'Monumento a Sebastián de Belalcázar',
            'Sebastián de Belalcázar Monument',
            'Monumento',
            'Monument',
            3.4407,
            -76.5492,
            4.7,
            1800,
            'https://images.unsplash.com/photo-1555523908-410a054859a7?auto=format&fit=crop&w=800',
            'El mirador por excelencia de la ciudad. La estatua de bronce del fundador español señala con su mano derecha hacia el occidente (la salida al mar Pacífico), mientras que a sus pies se extiende la panorámica de Cali en todo su esplendor. Es un lugar de encuentro tradicional, famoso por las ventas de mazorca asada, chontaduro y artesanías locales. Ideal para ir al atardecer y ver cómo se encienden las luces del valle mientras corre un viento fresco.',
            'The city''s viewpoint par excellence. The bronze statue of the Spanish founder points with his right hand towards the west (the exit to the Pacific Ocean), while at his feet stretches the panoramic view of Cali in all its splendor. It is a traditional meeting place, famous for stalls selling roasted corn, chontaduro, and local crafts. Ideal for going at sunset and watching the valley lights turn on while a fresh breeze blows.',
            'Hito geográfico y símbolo controvertido pero central de la fundación hispánica de Santiago de Cali.',
            'Geographic landmark and controversial but central symbol of the Hispanic foundation of Santiago de Cali.',
            'La estatua fue fundida en España y traída a Cali en 1937 para conmemorar el IV centenario de la fundación de la ciudad.',
            'The statue was cast in Spain and brought to Cali in 1937 to commemorate the 4th centenary of the city''s founding.',
            ARRAY['La inscripción en el pedestal lleva el escudo de armas otorgado a la ciudad.','Es un punto de referencia visual visible desde casi toda la ciudad.'],
            ARRAY['The inscription on the pedestal bears the coat of arms granted to the city.','It is a visual landmark visible from almost the entire city.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's8',
            'Parque del Gato de Tejada',
            'Tejada''s Cat Park',
            'Escultura',
            'Sculpture',
            3.45,
            -76.545,
            4.6,
            1600,
            'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800',
            'Una deliciosa galería de arte a cielo abierto a orillas del río Cali. Presidida por el monumental ''Gato del Río'', una obra en bronce del maestro Hernando Tejada, esta zona verde se convirtió en el hogar de sus ''novias'': una colección de más de 15 gatas esculpidas e intervenidas pictóricamente por reconocidos artistas colombianos (como Maripaz Jaramillo, Omar Rayo, etc.). Cada gata tiene una personalidad, historia y diseño único. Es un paseo colorido, artístico y refrescante.',
            'A delightful open-air art gallery on the banks of the Cali River. Presided over by the monumental ''River Cat'', a bronze work by master Hernando Tejada, this green area became the home of his ''girlfriends'': a collection of over 15 female cats sculpted and pictorially intervened by renowned Colombian artists (such as Maripaz Jaramillo, Omar Rayo, etc.). Each cat has a unique personality, history, and design. It is a colorful, artistic, and refreshing walk.',
            'Recuperación exitosa de la ribera del río a través del arte público masivo y de calidad.',
            'Successful recovery of the riverbank through massive and high-quality public art.',
            'El Gato fue donado por el artista en 1996. Las ''novias del gato'' se añadieron años después como parte de un proyecto de la Cámara de Comercio.',
            'The Cat was donated by the artist in 1996. The ''cat''s girlfriends'' were added years later as part of a Chamber of Commerce project.',
            ARRAY['El Gato pesa 3.5 toneladas y está fundido en bronce.','Las gatas son pintadas periódicamente o restauradas, por lo que el parque siempre ofrece algo nuevo.'],
            ARRAY['The Cat weighs 3.5 tons and is cast in bronze.','The female cats are periodically painted or restored, so the park always offers something new.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's11',
            'Loma de la Cruz',
            'Hill of the Cross',
            'Artesanías',
            'Crafts',
            3.439,
            -76.542,
            4.5,
            1300,
            'https://images.unsplash.com/photo-1590059533324-5d2f62b6048c?auto=format&fit=crop&w=800',
            'El corazón de la artesanía y la cultura bohemia en Cali. Este parque artesanal, construido arquitectónicamente en niveles sobre una colina, está lleno de casetas donde artesanos locales fabrican y venden joyas, trabajos en cuero, madera e instrumentos musicales. Pero más que un mercado, es un centro cultural vivo: los jueves son noches de narración oral (cuenteros), y los fines de semana hay danzas folclóricas y música andina en vivo. Un espacio de resistencia cultural.',
            'The heart of craftsmanship and bohemian culture in Cali. This artisan park, architecturally built in tiers on a hill, is full of stalls where local artisans make and sell jewelry, leather work, wood, and musical instruments. But more than a market, it is a living cultural center: Thursdays are storytelling nights, and weekends feature folk dances and live Andean music. A space of cultural resistance.',
            'Espacio vital para la economía de los artesanos y la preservación de tradiciones orales y manuales.',
            'Vital space for the artisans'' economy and the preservation of oral and manual traditions.',
            'Inaugurado en 1987. El lugar tiene una leyenda colonial sobre una ''mano negra'' que señalaba la loma, donde se puso una cruz para conjurar el miedo.',
            'Inaugurated in 1987. The place has a colonial legend about a ''black hand'' pointing to the hill, where a cross was placed to ward off fear.',
            ARRAY['Es uno de los pocos parques diseñados arquitectónicamente específicamente para la venta de artesanías.','Aquí se consiguen los mejores instrumentos musicales andinos de la ciudad.'],
            ARRAY['It is one of the few parks architecturally designed specifically for selling crafts.','Here you can get the best Andean musical instruments in the city.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;