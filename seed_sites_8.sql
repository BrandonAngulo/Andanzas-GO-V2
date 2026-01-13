INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's31',
            'Ringlete',
            'Ringlete',
            'Gastronomía',
            'Gastronomy',
            3.455,
            -76.533,
            4.8,
            750,
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800',
            'El lugar donde la cocina de la abuela se viste de gala. Ringlete se ha dedicado a investigar y rescatar recetas tradicionales vallecaucanas que estaban desapareciendo de las mesas, sirviéndolas con una presentación impecable y moderna. El sancocho, el aborrajado, las marranitas y el arroz clavado saben aquí a historia y hogar. Ubicado en una casa acogedora del barrio Granada, es una parada obligatoria para entender a qué sabe realmente el Valle del Cauca.',
            'The place where grandma''s cooking dresses up. Ringlete has dedicated itself to researching and rescuing traditional Valle del Cauca recipes that were disappearing from tables, serving them with impeccable and modern presentation. Sancocho, aborrajado, marranitas, and arroz clavado taste like history and home here. Located in a cozy house in the Granada neighborhood, it is a mandatory stop to understand what Valle del Cauca really tastes like.',
            'Rescate, investigación y elevación del patrimonio gastronómico local.',
            'Rescue, research, and elevation of local gastronomic heritage.',
            'Fundado por la chef Martha Jaramillo con la misión de dignificar la cocina criolla y sus ingredientes.',
            'Founded by chef Martha Jaramillo with the mission of dignifying creole cuisine and its ingredients.',
            ARRAY['Sus meseros están capacitados para explicar el origen y los ingredientes de cada plato.','El dulce de brevas con manjar blanco es legendario y se sirve de forma tradicional.'],
            ARRAY['Their waiters are trained to explain the origin and ingredients of each dish.','The candied figs with manjar blanco is legendary and served traditionally.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's37',
            'El Peñón',
            'El Peñón',
            'Zona Gastronómica',
            'Gastronomic Zone',
            3.448,
            -76.544,
            4.6,
            2000,
            'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800',
            'El barrio más cosmopolita y gastronómico de Cali. Sus calles arboladas y pendientes suaves albergan la mayor concentración de restaurantes de autor, cafés de especialidad, heladerías artesanales y bares de diseño. Aquí puedes cenar comida italiana, peruana, japonesa, mexicana o fusión en un radio de pocas cuadras. Es el lugar para ver y ser visto, con un ambiente vibrante, sofisticado y seguro para caminar de noche.',
            'Cali''s most cosmopolitan and gastronomic neighborhood. Its tree-lined streets and gentle slopes house the highest concentration of signature restaurants, specialty cafes, artisanal ice cream shops, and design bars. Here you can dine on Italian, Peruvian, Japanese, Mexican, or fusion food within a few blocks radius. It is the place to see and be seen, with a vibrant, sophisticated, and safe atmosphere for walking at night.',
            'Motor de la innovación gastronómica y el turismo urbano de alto nivel en la ciudad.',
            'Engine of gastronomic innovation and high-end urban tourism in the city.',
            'Originalmente una zona residencial de familias tradicionales, se transformó comercialmente en los años 90 sin perder su encanto.',
            'Originally a residential area for traditional families, it transformed commercially in the 90s without losing its charm.',
            ARRAY['El Parque del Peñón es su corazón, famoso por las exposiciones de arte dominicales.','Muchos restaurantes funcionan en casas patrimoniales adaptadas, conservando la arquitectura.'],
            ARRAY['El Peñón Park is its heart, famous for Sunday art exhibitions.','Many restaurants operate in adapted heritage houses, preserving the architecture.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's61',
            'Barrio Granada',
            'Granada Neighborhood',
            'Zona Gastronómica',
            'Gastronomic Zone',
            3.456,
            -76.534,
            4.5,
            1800,
            'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800',
            'La ''Zona Rosa'' tradicional y elegante de Cali. Granada combina la arquitectura señorial de sus mansiones de mediados de siglo con una oferta inagotable de boutiques de moda y restaurantes de alta cocina. Es un barrio para caminar, vitrinear y disfrutar de la buena mesa. La Avenida 9 Norte es su columna vertebral, llena de vida nocturna, terrazas al aire libre y un ambiente festivo pero sofisticado.',
            'Cali''s traditional and elegant ''Pink Zone''. Granada combines the stately architecture of its mid-century mansions with an endless offer of fashion boutiques and haute cuisine restaurants. It is a neighborhood for walking, window shopping, and enjoying fine dining. 9th North Avenue is its backbone, full of nightlife, open-air terraces, and a festive yet sophisticated atmosphere.',
            'Primer barrio de expansión moderna de Cali y actual distrito de moda y gastronomía.',
            'First modern expansion neighborhood of Cali and current fashion and gastronomy district.',
            'Se desarrolló en los años 40 y 50 inspirándose en barrios europeos, con amplios antejardines.',
            'It developed in the 40s and 50s inspired by European neighborhoods, with large front gardens.',
            ARRAY['Conserva muchas casas de arquitectura neoclásica y art déco.','Es famoso por sus tiendas de diseñadores locales independientes.'],
            ARRAY['It preserves many neoclassical and Art Deco houses.','It is famous for its independent local designer shops.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's62',
            'Ciudad Jardín',
            'Garden City',
            'Zona Gastronómica',
            'Gastronomic Zone',
            3.35,
            -76.53,
            4.6,
            1500,
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800',
            'El sur moderno, verde y expansivo de Cali. Ciudad Jardín es un oasis de amplias avenidas y mucha vegetación donde se encuentran los restaurantes más grandes y lujosos de la ciudad. Es ideal para familias y grandes grupos debido a la amplitud de sus locales y facilidades de parqueo. Aquí la gastronomía se mezcla con centros comerciales al aire libre y lagos artificiales, ofreciendo una experiencia tipo ''resort'' urbano.',
            'Cali''s modern, green, and expansive south. Ciudad Jardín is an oasis of wide avenues and lots of greenery where the city''s largest and most luxurious restaurants are found. It is ideal for families and large groups due to the spaciousness of its venues and parking facilities. Here gastronomy mixes with open-air shopping centers and artificial lakes, offering an urban ''resort'' type experience.',
            'Polo de desarrollo del sur de Cali, integrando naturaleza, vivienda de lujo y comercio.',
            'Development pole of southern Cali, integrating nature, luxury housing, and commerce.',
            'Nació como un proyecto de urbanización campestre en los años 70, buscando calidad de vida.',
            'Born as a country urbanization project in the 70s, seeking quality of life.',
            ARRAY['Es común ver guatines, ardillas y aves silvestres cruzando las calles.','Concentra la mayor oferta de cocina internacional de alta gama de la ciudad.'],
            ARRAY['It is common to see agoutis, squirrels, and wild birds crossing the streets.','It concentrates the city''s largest offer of high-end international cuisine.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's6',
            'Centro Cultural de Cali',
            'Cali Cultural Center',
            'Centro Cultural',
            'Cultural Center',
            3.4533,
            -76.5325,
            4.5,
            950,
            'https://images.unsplash.com/photo-1470723710355-171b443c6589?auto=format&fit=crop&w=800',
            'Una impresionante fortaleza de ladrillo dedicada a la cultura. Antigua sede de la FES, este edificio es una obra maestra de la arquitectura colombiana, diseñado por el aclamado Rogelio Salmona. Sus patios interiores, espejos de agua, rampas y el uso magistral del ladrillo invitan a la exploración y la calma. Alberga la Secretaría de Cultura, una biblioteca, salas de exposición y el valioso Archivo Histórico de Cali. Es un refugio de silencio y belleza en pleno centro.',
            'An impressive brick fortress dedicated to culture. Former headquarters of the FES, this building is a masterpiece of Colombian architecture, designed by the acclaimed Rogelio Salmona. Its interior courtyards, water mirrors, ramps, and masterful use of brick invite exploration and calm. It houses the Secretariat of Culture, a library, exhibition halls, and the valuable Historical Archive of Cali. It is a refuge of silence and beauty right downtown.',
            'Hito arquitectónico y sede administrativa de la gestión cultural municipal.',
            'Architectural landmark and administrative headquarters of municipal cultural management.',
            'Inaugurado en 1990. Su diseño reinterpreta la arquitectura islámica y precolombina.',
            'Inaugurated in 1990. Its design reinterprets Islamic and pre-Columbian architecture.',
            ARRAY['Tiene una acústica especial: el sonido del agua te aísla del ruido de la calle.','Desde sus terrazas se tienen vistas únicas de la ciudad y los cerros.'],
            ARRAY['It has special acoustics: the sound of water isolates you from street noise.','From its terraces, you have unique views of the city and hills.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's15',
            'Biblioteca Departamental Jorge Garcés Borrero',
            'Jorge Garcés Borrero Departmental Library',
            'Biblioteca',
            'Library',
            3.435,
            -76.54,
            4.8,
            1200,
            'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800',
            'El cerebro y corazón intelectual de la ciudad. Más que una biblioteca, es un complejo cultural gigantesco conocido como la ''Manzana del Saber''. Cuenta con la colección de libros más grande de la región, el Museo Interactivo Abrakadabra, un observatorio astronómico, salas de exposiciones y auditorios. Su arquitectura moderna y sus amplios espacios abiertos la convierten en el lugar favorito de estudiantes, investigadores y curiosos de todas las edades.',
            'The intellectual brain and heart of the city. More than a library, it is a gigantic cultural complex known as the ''Apple of Knowledge''. It features the region''s largest book collection, the Abrakadabra Interactive Museum, an astronomical observatory, exhibition halls, and auditoriums. Its modern architecture and wide open spaces make it the favorite place for students, researchers, and curious people of all ages.',
            'Principal centro de gestión del conocimiento y patrimonio bibliográfico del Valle del Cauca.',
            'Main center for knowledge management and bibliographic heritage of Valle del Cauca.',
            'Fundada en 1953. Su transformación radical en la ''Manzana del Saber'' comenzó en los años 90.',
            'Founded in 1953. Its radical transformation into the ''Apple of Knowledge'' began in the 90s.',
            ARRAY['Tiene la sala ''Hellen Keller'' especializada para personas con discapacidad visual.','Su cúpula astronómica ofrece funciones de proyección estelar semanales.'],
            ARRAY['It has the ''Hellen Keller'' room specialized for visually impaired people.','Its astronomical dome offers weekly star projection shows.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's32',
            'Instituto Departamental de Bellas Artes',
            'Fine Arts Departmental Institute',
            'Universidad',
            'University',
            3.45,
            -76.535,
            4.7,
            600,
            'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800',
            'El lugar donde nacen los artistas de Cali. Este hermoso edificio de estilo republicano es la escuela de artes más prestigiosa y antigua de la región. De sus aulas han salido grandes músicos, pintores y actores que han dado gloria a la ciudad. El sonido de pianos, violines y coros se escapa constantemente por sus ventanas hacia la calle. Alberga la Sala Beethoven, el escenario de música clásica por excelencia de la ciudad.',
            'The place where Cali''s artists are born. This beautiful Republican-style building is the region''s most prestigious and oldest art school. Great musicians, painters, and actors who have brought glory to the city have emerged from its classrooms. The sound of pianos, violins, and choirs constantly escapes through its windows into the street. It houses the Beethoven Hall, the city''s classical music venue par excellence.',
            'Alma mater de la cultura caleña y Monumento Nacional.',
            'Alma mater of Cali culture and National Monument.',
            'Fundado en 1933 como conservatorio. El edificio actual se terminó en 1937.',
            'Founded in 1933 as a conservatory. The current building was completed in 1937.',
            ARRAY['Ofrece una temporada de conciertos gratuitos de muy alta calidad (Beethoven 7:30).','Su fachada blanca inmaculada es un icono del barrio Centenario.'],
            ARRAY['It offers a season of very high-quality free concerts (Beethoven 7:30).','Its immaculate white facade is an icon of the Centenario neighborhood.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's33',
            'Tecnocentro Cultural Somos Pacífico',
            'Somos Pacífico Cultural Technocenter',
            'Centro Cultural Comunitario',
            'Community Cultural Center',
            3.42,
            -76.48,
            4.8,
            500,
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800',
            'Un faro de esperanza, tecnología y creatividad en el corazón del Distrito de Aguablanca. Este moderno centro utiliza la tecnología y el arte para transformar vidas. Cuenta con estudios de grabación de última generación, salas de danza, cocina tradicional, artes plásticas y computación. Aquí se forman los próximos grandes artistas y productores musicales de la ciudad, demostrando el poder del talento sobre la adversidad.',
            'A beacon of hope, technology, and creativity in the heart of the Aguablanca District. This modern center uses technology and art to transform lives. It features state-of-the-art recording studios, dance halls, traditional cooking, visual arts, and computer rooms. Here the city''s next great artists and music producers are trained, demonstrating the power of talent over adversity.',
            'Modelo exitoso de innovación social y formación técnica para jóvenes en zonas vulnerables.',
            'Successful model of social innovation and technical training for youth in vulnerable areas.',
            'Inaugurado en 2013 gracias a la alianza público-privada liderada por la Fundación Alvaralice.',
            'Inaugurated in 2013 thanks to the public-private partnership led by the Alvaralice Foundation.',
            ARRAY['La banda ChocQuibTown ha apoyado fuertemente este proyecto.','Tienen su propia escuela de música y cocina tradicional certificada.'],
            ARRAY['The band ChocQuibTown has strongly supported this project.','They have their own certified school of music and traditional cooking.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's43',
            'La Linterna',
            'La Linterna',
            'Taller Artesanal',
            'Artisanal Workshop',
            3.442,
            -76.538,
            4.9,
            650,
            'https://images.unsplash.com/photo-1603539268673-f6551b8c2876?auto=format&fit=crop&w=800',
            'El lugar más ''hipster'', auténtico y colorido de San Antonio. La Linterna es un taller de impresión tipográfica tradicional que se negó a morir ante lo digital. Sus enormes máquinas Heidelberg del siglo XIX siguen rugiendo, imprimiendo carteles que definen la estética gráfica de Cali. Lo que era una imprenta comercial en crisis se convirtió en un templo del diseño gráfico y el arte callejero, colaborando con artistas modernos.',
            'The most ''hipster'', authentic, and colorful place in San Antonio. La Linterna is a traditional letterpress printing workshop that refused to die in the face of digital technology. Its huge 19th-century Heidelberg machines keep roaring, printing posters that define Cali''s graphic aesthetic. What was a commercial printing press in crisis became a temple of graphic design and street art, collaborating with modern artists.',
            'Patrimonio vivo de las artes gráficas en Colombia y ejemplo de reinvención.',
            'Living heritage of graphic arts in Colombia and an example of reinvention.',
            'Fundada en 1934. Fue salvada de la quiebra en 2017 gracias a la unión de sus trabajadores veteranos y diseñadores jóvenes.',
            'Founded in 1934. It was saved from bankruptcy in 2017 thanks to the union of its veteran workers and young designers.',
            ARRAY['Sus carteles de conciertos de rock y salsa son icónicos y objetos de colección.','Puedes ver a los maestros impresores trabajando en vivo y comprar arte original.'],
            ARRAY['Its rock and salsa concert posters are iconic and collectibles.','You can see the master printers working live and buy original art.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's45',
            'Cinemateca La Tertulia',
            'La Tertulia Cinematheque',
            'Cine',
            'Cinema',
            3.4495,
            -76.546,
            4.8,
            900,
            'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800',
            'El refugio sagrado de los cinéfilos caleños. Esta sala, parte del complejo del Museo La Tertulia, es la ventana de Cali al cine mundial que no llega a las salas comerciales. Documentales, cine europeo, latinoamericano y clásicos restaurados se proyectan aquí con la mejor calidad. Su arquitectura íntima y su programación curada con rigor la convierten en un lugar de culto para quienes ven el cine como arte.',
            'The sacred refuge of Cali cinephiles. This theater, part of the La Tertulia Museum complex, is Cali''s window to world cinema that doesn''t reach commercial theaters. Documentaries, European, Latin American cinema, and restored classics are screened here with the best quality. Its intimate architecture and rigorously curated programming make it a cult place for those who see cinema as art.',
            'Espacio vital para la formación de públicos y la difusión del cine colombiano e independiente.',
            'Vital space for audience education and the dissemination of Colombian and independent cinema.',
            'Fundada en 1975, ha sido sede de festivales internacionales de cine por décadas.',
            'Founded in 1975, it has hosted international film festivals for decades.',
            ARRAY['Es la sede principal del Festival Internacional de Cine de Cali (FICCALI).','Ofrece funciones al aire libre en los jardines del museo (''Cine al Río'').'],
            ARRAY['It is the main venue for the Cali International Film Festival (FICCALI).','It offers outdoor screenings in the museum gardens (''Cinema by the River'').']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;