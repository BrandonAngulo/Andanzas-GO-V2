INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's36',
            'Hacienda El Paraíso',
            'El Paraíso Hacienda',
            'Casa Museo',
            'House Museum',
            3.65,
            -76.15,
            4.9,
            3000,
            'https://images.unsplash.com/photo-1594833959828-9c6310cb8617?auto=format&fit=crop&w=800',
            'El ícono más romántico del Valle del Cauca. Ubicada en el municipio de El Cerrito, cerca de Cali, esta hacienda es mundialmente famosa por ser el escenario de ''María'', la obra cumbre de Jorge Isaacs. La casa museo está restaurada con exquisito detalle, recreando la atmósfera del siglo XIX con sus jardines de rosas, sus habitaciones ventiladas y el paisaje inigualable del valle geográfico a sus pies. Es una peregrinación obligada para los amantes de la literatura y el amor.',
            'The most romantic icon of Valle del Cauca. Located in the municipality of El Cerrito, near Cali, this hacienda is world-famous for being the setting of ''María'', the masterpiece by Jorge Isaacs. The house museum is restored with exquisite detail, recreating the 19th-century atmosphere with its rose gardens, airy rooms, and the unmatched landscape of the geographic valley at its feet. It is a mandatory pilgrimage for lovers of literature and romance.',
            'Símbolo del romanticismo latinoamericano y patrimonio cultural.',
            'Symbol of Latin American romanticism and cultural heritage.',
            'Construida entre 1816 y 1828. Fue adquirida por el padre de Jorge Isaacs en 1854.',
            'Built between 1816 and 1828. It was acquired by Jorge Isaacs'' father in 1854.',
            ARRAY['La piedra donde Efraín y María se sentaban aún se conserva en el jardín.','Los rosales son cuidados meticulosamente para evocar la novela.'],
            ARRAY['The stone where Efraín and María sat is still preserved in the garden.','The rose bushes are meticulously cared for to evoke the novel.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's50',
            'Museo Aéreo Fénix',
            'Fénix Air Museum',
            'Museo',
            'Museum',
            3.51,
            -76.38,
            4.7,
            600,
            'https://images.unsplash.com/photo-1559628236-485637cca3ef?auto=format&fit=crop&w=800',
            'Ubicado estratégicamente cerca al aeropuerto Alfonso Bonilla Aragón, este museo es el sueño hecho realidad de un apasionado piloto. Grandes hangares albergan aviones reales históricos, desde aeronaves de combate de la Segunda Guerra Mundial hasta jets ejecutivos y avionetas civiles, muchos de ellos restaurados a condición de vuelo. También cuenta con una impresionante maqueta ferroviaria funcional y una colección de trajes de vuelo. Es una experiencia inmersiva única para los amantes de la ingeniería y la aviación.',
            'Strategically located near the Alfonso Bonilla Aragón airport, this museum is a passionate pilot''s dream come true. Large hangars house real historical planes, from World War II combat aircraft to executive jets and civil light aircraft, many of them restored to flying condition. It also features an impressive functional model railway and a collection of flight suits. It is a unique immersive experience for lovers of engineering and aviation.',
            'Único museo en Colombia con aeronaves históricas en estado de vuelo.',
            'Only museum in Colombia with historical aircraft in flying condition.',
            'Fundado por el capitán Raymond Lee, quien recuperó muchas de las aeronaves.',
            'Founded by Captain Raymond Lee, who recovered many of the aircraft.',
            ARRAY['El avión Douglas DC-3 está impecable y puedes entrar en él.','La maqueta de trenes es una de las más grandes y detalladas de Latinoamérica.'],
            ARRAY['The Douglas DC-3 plane is impeccable and you can enter it.','The model train set is one of the largest and most detailed in Latin America.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's74',
            'Museo de la Caña',
            'Sugarcane Museum',
            'Museo',
            'Museum',
            3.6,
            -76.25,
            4.6,
            450,
            'https://images.unsplash.com/photo-1600122822473-b3c99a53755b?auto=format&fit=crop&w=800',
            'Un extenso museo al aire libre que narra la historia dulce, compleja y transformadora del desarrollo agroindustrial del Valle del Cauca. Ubicado en la histórica Hacienda Piedechinche, ofrece un recorrido entre hermosos jardines botánicos y exhibiciones de antiguos trapiches (molinos de caña) traídos de todas las regiones de Colombia. Muestra la evolución tecnológica desde la tracción animal y los molinos de agua hasta la moderna industria azucarera.',
            'An extensive open-air museum telling the sweet, complex, and transformative history of Valle del Cauca''s agro-industrial development. Located in the historic Hacienda Piedechinche, it offers a tour through beautiful botanical gardens and exhibits of old trapiches (sugar mills) brought from all regions of Colombia. It shows the technological evolution from animal traction and water mills to the modern sugar industry.',
            'Conserva la memoria de la agroindustria que definió la economía de la región.',
            'Preserves the memory of the agro-industry that defined the region''s economy.',
            'Fundado en 1981. La casa de la hacienda data del siglo XVIII y es una joya colonial.',
            'Founded in 1981. The hacienda house dates from the 18th century and is a colonial jewel.',
            ARRAY['Puedes ver cómo se hacía la panela artesanalmente.','Sus jardines son un santuario de aves y flora nativa.'],
            ARRAY['You can see how artisanal panela was made.','Its gardens are a sanctuary for native birds and flora.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's75',
            'MULI - Museo Libre de Arte Público',
            'MULI - Free Museum of Public Art',
            'Museo de Arte',
            'Art Museum',
            3.486,
            -76.518,
            4.5,
            800,
            'https://images.unsplash.com/photo-1572916292271-477d853e3432?auto=format&fit=crop&w=800',
            'El museo más grande de Colombia, porque su techo es el cielo. El MULI transformó a Cali en una galería a cielo abierto, gestionando cientos de murales y mosaicos artísticos en puentes, edificios y calles. Su sede principal ofrece exposiciones, pero su verdadera colección está dispersa por la ciudad, especialmente en el norte. Es una iniciativa que busca democratizar el arte y embellecer el entorno urbano.',
            'The largest museum in Colombia, because its roof is the sky. MULI transformed Cali into an open-air gallery, managing hundreds of murals and artistic mosaics on bridges, buildings, and streets. Its main headquarters offers exhibitions, but its true collection is scattered throughout the city, especially in the north. It is an initiative seeking to democratize art and beautify the urban environment.',
            'Pionero en la gestión masiva de arte urbano y muralismo en la ciudad.',
            'Pioneer in the massive management of urban art and muralism in the city.',
            'Surgió en 2012 para la Cumbre de las Américas, interviniendo los espacios grises de la ciudad.',
            'Emerged in 2012 for the Summit of the Americas, intervening in the city''s gray spaces.',
            ARRAY['Organizan la Bienal Internacional de Muralismo de Cali.','Muchos murales incorporan materiales reciclados y técnicas de mosaico.'],
            ARRAY['They organize the Cali International Muralism Biennial.','Many murals incorporate recycled materials and mosaic techniques.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's2',
            'Teatro Municipal Enrique Buenaventura',
            'Enrique Buenaventura Municipal Theater',
            'Teatro',
            'Theater',
            3.451,
            -76.5335,
            4.8,
            980,
            'https://images.unsplash.com/photo-1514306191717-452ec28c7f91?auto=format&fit=crop&w=800',
            'El máximo templo de las artes escénicas en Cali y uno de los más bellos de Latinoamérica. Este majestuoso edificio de estilo republicano con influencia francesa es un monumento nacional que respira historia. Su sala principal, adornada con frescos del maestro Ricardo Richinimy, lámparas de cristal y terciopelo rojo, ha recibido a las compañías de ópera, ballet y teatro más importantes del mundo. Su acústica es legendaria, considerada una de las mejores del continente, permitiendo apreciar cada nota y susurro.',
            'The supreme temple of performing arts in Cali and one of the most beautiful in Latin America. This majestic Republican-style building with French influence is a national monument that breathes history. Its main hall, adorned with frescoes by master Ricardo Richinimy, crystal chandeliers, and red velvet, has hosted the most important opera, ballet, and theater companies in the world. Its acoustics are legendary, considered among the best on the continent, allowing every note and whisper to be appreciated.',
            'Es el escenario cultural más prestigioso y antiguo de la ciudad en funcionamiento.',
            'It is the most prestigious and oldest operating cultural stage in the city.',
            'Inaugurado en 1927. Fue rebautizado en honor al gran dramaturgo caleño Enrique Buenaventura, padre del Nuevo Teatro Colombiano.',
            'Inaugurated in 1927. It was renamed in honor of the great Cali playwright Enrique Buenaventura, father of the New Colombian Theater.',
            ARRAY['El telón de boca fue pintado por el artista italiano Ricardo Richinimy y es una obra de arte en sí mismo.','Tiene capacidad para más de 1.000 espectadores en sus diversas localidades.'],
            ARRAY['The main curtain was painted by Italian artist Ricardo Richinimy and is a work of art in itself.','It has a capacity for over 1,000 spectators in its various seating areas.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's14',
            'Teatro La Máscara',
            'La Máscara Theater',
            'Teatro Experimental',
            'Experimental Theater',
            3.4485,
            -76.536,
            4.6,
            300,
            'https://images.unsplash.com/photo-1503095392237-73621391a0a1?auto=format&fit=crop&w=800',
            'Ubicado en el corazón del bohemio y patrimonial barrio San Antonio, La Máscara es un referente histórico del teatro independiente y socialmente comprometido. Funciona en una hermosa casa colonial adaptada que ofrece un ambiente íntimo y cercano entre actores y público. Se especializa en teatro con enfoque de género y propuestas experimentales que retan al espectador, promoviendo el debate y la reflexión. Es un lugar vibrante donde el arte y el activismo social se encuentran.',
            'Located in the heart of the bohemian and heritage San Antonio neighborhood, La Máscara is a historical benchmark for independent and socially committed theater. It operates in a beautiful adapted colonial house offering an intimate and close atmosphere between actors and audience. It specializes in gender-focused theater and experimental proposals that challenge the viewer, promoting debate and reflection. It is a vibrant place where art and social activism meet.',
            'Pioneras en el teatro hecho por mujeres y con temáticas de diversidad y género en la región.',
            'Pioneers in theater made by women and with themes of diversity and gender in the region.',
            'Fundado en 1972, es uno de los grupos teatrales más antiguos y persistentes de la ciudad, sobreviviendo por décadas gracias a su calidad.',
            'Founded in 1972, it is one of the oldest and most persistent theater groups in the city, surviving for decades thanks to its quality.',
            ARRAY['Organizan anualmente un festival internacional de mujeres en escena.','Su sala permite una interacción muy directa, casi visceral, con los actores.'],
            ARRAY['They annually organize an international festival of women on stage.','Their hall allows for very direct, almost visceral, interaction with the actors.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's22',
            'Teatro Jorge Isaacs',
            'Jorge Isaacs Theater',
            'Teatro',
            'Theater',
            3.4525,
            -76.531,
            4.7,
            800,
            'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=800',
            'Con su imponente fachada de estilo neoclásico francés y sus delicados detalles ornamentales, el Jorge Isaacs es una joya arquitectónica en pleno centro de Cali. Su interior es aún más sorprendente, con una distribución clásica de palcos en forma de herradura y una ornamentación exquisita que evoca la Belle Époque. Es el escenario favorito para conciertos íntimos, espectáculos de comedia y grandes producciones musicales debido a su ambiente elegante, romántico y nostálgico.',
            'With its imposing French neoclassical facade and delicate ornamental details, the Jorge Isaacs is an architectural jewel right in downtown Cali. Its interior is even more surprising, with a classic horseshoe-shaped box layout and exquisite ornamentation evoking the Belle Époque. It is the favorite venue for intimate concerts, comedy shows, and major musical productions due to its elegant, romantic, and nostalgic atmosphere.',
            'Monumento Nacional y homenaje al autor de ''María'', la novela cumbre del romanticismo latinoamericano.',
            'National Monument and tribute to the author of ''María'', the pinnacle novel of Latin American romanticism.',
            'Abrió sus puertas en 1931. Estuvo cerrado y en ruinas durante años hasta su gloriosa restauración en los años 80, salvándolo de la demolición.',
            'Opened its doors in 1931. It was closed and in ruins for years until its glorious restoration in the 80s, saving it from demolition.',
            ARRAY['Su acústica y visibilidad son excelentes desde cualquier punto de la herradura.','Fue uno de los primeros edificios altos de la ciudad, símbolo de modernidad en su época.'],
            ARRAY['Its acoustics and visibility are excellent from any point of the horseshoe.','It was one of the first tall buildings in the city, a symbol of modernity in its time.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's41',
            'Teatro Calima',
            'Calima Theater',
            'Teatro',
            'Theater',
            3.455,
            -76.529,
            4.5,
            700,
            'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=800',
            'El Teatro Calima es un magnífico sobreviviente de la época dorada de los grandes cines de mediados de siglo XX. Su arquitectura modernista, caracterizada por líneas limpias y espacios amplios, junto con su enorme aforo, lo hacen único en la ciudad. Tras una cuidadosa restauración que le devolvió su esplendor original, ha vuelto a ser un epicentro cultural, acogiendo desde conciertos sinfónicos hasta shows de stand-up comedy. Su amplio lobby y fachada son inconfundibles en la Avenida Sexta.',
            'The Calima Theater is a magnificent survivor of the golden age of mid-20th-century grand cinemas. Its modernist architecture, characterized by clean lines and ample spaces, along with its enormous capacity, make it unique in the city. After careful restoration that returned it to its original splendor, it has once again become a cultural epicenter, hosting everything from symphonic concerts to stand-up comedy shows. Its spacious lobby and facade are unmistakable on Sixth Avenue.',
            'Es uno de los Bienes de Interés Cultural más importantes del norte de Cali y un referente de la arquitectura moderna.',
            'It is one of the most important Assets of Cultural Interest in northern Cali and a benchmark of modern architecture.',
            'Inaugurado en 1963, fue durante décadas el cine más elegante y tecnológico de la ciudad.',
            'Inaugurated in 1963, it was for decades the most elegant and technological cinema in the city.',
            ARRAY['Es uno de los teatros con mayor capacidad de aforo en la ciudad (más de 1200 sillas).','Conserva el estilo retro de los años 60, incluyendo su tipografía y acabados.'],
            ARRAY['It is one of the theaters with the largest capacity in the city (over 1200 seats).','Preserves the retro style of the 60s, including its typography and finishes.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's42',
            'Teatro Esquina Latina',
            'Esquina Latina Theater',
            'Teatro Comunitario',
            'Community Theater',
            3.418,
            -76.545,
            4.7,
            400,
            'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?auto=format&fit=crop&w=800',
            'Más que un simple teatro, Esquina Latina es un movimiento social y cultural con décadas de trayectoria. Ubicado cerca a la Universidad del Valle, este espacio se caracteriza por sus métodos de creación colectiva que abordan problemáticas sociales, políticas y juveniles del entorno. Su ambiente es vibrante, rebelde y profundamente comprometido con la comunidad. Aquí el teatro se utiliza como una poderosa herramienta de construcción de paz, memoria y reflexión crítica.',
            'More than just a theater, Esquina Latina is a social and cultural movement with decades of history. Located near the Universidad del Valle, this space is characterized by its collective creation methods addressing social, political, and youth issues of the environment. Its atmosphere is vibrant, rebellious, and deeply committed to the community. Here theater is used as a powerful tool for peacebuilding, memory, and critical reflection.',
            'Referente nacional del teatro comunitario y la intervención social a través del arte.',
            'National benchmark for community theater and social intervention through art.',
            'Nació en 1973 como un grupo estudiantil de la Universidad del Valle y se consolidó como fundación independiente.',
            'Born in 1973 as a student group at Universidad del Valle and consolidated as an independent foundation.',
            ARRAY['Su programa ''Jóvenes, Teatro y Comunidad'' ha impactado miles de vidas en zonas vulnerables.','Sus obras suelen tener música en vivo y mucha energía física.'],
            ARRAY['Its ''Youth, Theater, and Community'' program has impacted thousands of lives in vulnerable areas.','Their plays usually have live music and high physical energy.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's44',
            'Tienda Teatral',
            'Theater Shop',
            'Teatro Experimental',
            'Experimental Theater',
            3.445,
            -76.54,
            4.5,
            250,
            'https://images.unsplash.com/photo-1595131838595-3154b9f4452b?auto=format&fit=crop&w=800',
            'Un espacio íntimo, cálido y acogedor en el barrio San Antonio, diseñado específicamente para el teatro de pequeño formato o ''de cámara''. La cercanía con los actores es tal que puedes sentir su respiración y ver cada gesto. Se especializa en montajes minimalistas, talleres de formación actoral y lecturas dramáticas. Es el lugar perfecto para descubrir nuevos talentos locales y disfrutar de una velada artística tranquila con un buen café.',
            'An intimate, warm, and cozy space in the San Antonio neighborhood, specifically designed for small-format or ''chamber'' theater. The proximity to the actors is such that you can feel their breath and see every gesture. It specializes in minimalist productions, acting training workshops, and dramatic readings. It is the perfect place to discover new local talent and enjoy a quiet artistic evening with a good coffee.',
            'Plataforma vital para la circulación de obras de pequeño formato, monólogos y experimentación.',
            'Vital platform for the circulation of small-format plays, monologues, and experimentation.',
            'Creado por artistas locales con la necesidad de descentralizar la oferta teatral.',
            'Created by local artists with the need to decentralize the theatrical offer.',
            ARRAY['Funciona también como una ''tienda'' real de servicios artísticos y libros.','El café del lugar es punto de encuentro frecuente de actores y directores.'],
            ARRAY['It also functions as a real ''shop'' for artistic services and books.','The on-site cafe is a frequent meeting point for actors and directors.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;