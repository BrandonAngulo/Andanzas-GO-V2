INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's40',
            'Torre de Cali',
            'Cali Tower',
            'Monumento',
            'Monument',
            3.458,
            -76.53,
            4.3,
            1000,
            'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800',
            'El rascacielos que define el perfil urbano de la ciudad. Con 45 pisos y 183 metros de altura, la Torre de Cali es el edificio más alto de la ciudad y uno de los más altos de Colombia. Ubicada a orillas del río Cali en el barrio Versalles, alberga un hotel de lujo y oficinas. Su silueta es inconfundible y sirve de brújula para orientarse en la ciudad. Desde sus pisos altos, la vista del valle y los farallones es sobrecogedora.',
            'The skyscraper that defines the city''s skyline. With 45 floors and 183 meters in height, the Cali Tower is the tallest building in the city and one of the tallest in Colombia. Located on the banks of the Cali River in the Versalles neighborhood, it houses a luxury hotel and offices. Its silhouette is unmistakable and serves as a compass for orientation in the city. From its upper floors, the view of the valley and the Farallones is breathtaking.',
            'Hito de la arquitectura moderna y símbolo del desarrollo empresarial de Cali.',
            'Landmark of modern architecture and symbol of Cali''s business development.',
            'Inaugurada en 1984, fue durante años el edificio más alto del país fuera de Bogotá.',
            'Inaugurated in 1984, it was for years the tallest building in the country outside Bogotá.',
            ARRAY['Tiene un ''Sky Bar'' en el piso 41 con vista panorámica nocturna.','Su construcción marcó la consolidación del norte como zona financiera.'],
            ARRAY['It has a ''Sky Bar'' on the 41st floor with a panoramic night view.','Its construction marked the consolidation of the north as a financial zone.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's47',
            'Parque de la Música',
            'Music Park',
            'Espacio público',
            'Public Space',
            3.46,
            -76.525,
            4.3,
            600,
            'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800',
            'Un complejo arquitectónico moderno en el norte de Cali, diseñado específicamente para celebrar la vocación musical de la ciudad. Con fuentes de agua interactivas, plazoletas amplias y espacios verdes, es ideal para eventos al aire libre y descanso urbano. Su diseño contemporáneo contrasta con la zona industrial aledaña, ofreciendo un oasis cultural y recreativo cerca del río Cali.',
            'A modern architectural complex in northern Cali, specifically designed to celebrate the city''s musical vocation. With interactive water fountains, wide squares, and green spaces, it is ideal for outdoor events and urban rest. Its contemporary design contrasts with the surrounding industrial area, offering a cultural and recreational oasis near the Cali river.',
            'Ejemplo de recuperación urbana de una antigua zona industrial para el uso cultural y recreativo.',
            'Example of urban recovery of a former industrial area for cultural and recreational use.',
            'Construido sobre los antiguos predios de una fábrica de licores abandonada.',
            'Built on the former grounds of an abandoned liquor factory.',
            ARRAY['Suele ser sede de festivales de rock, hip hop y música del Pacífico.','Las fuentes se iluminan de noche, creando un espectáculo visual.'],
            ARRAY['It often hosts rock, hip hop, and Pacific music festivals.','The fountains light up at night, creating a visual spectacle.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's48',
            'Parque del Ingenio',
            'El Ingenio Park',
            'Parque Natural/Cultural',
            'Natural/Cultural Park',
            3.385,
            -76.538,
            4.8,
            2500,
            'https://images.unsplash.com/photo-1596541223126-7d90d00d282e?auto=format&fit=crop&w=800',
            'El gimnasio al aire libre más grande y querido de Cali. Este extenso parque lineal bordea el río Meléndez y es el epicentro de la vida deportiva en el sur. Desde la madrugada hasta la noche, está lleno de gente trotando, montando bicicleta, haciendo yoga o disfrutando de sus famosas ''cholados'' y jugos naturales. Sus grandes árboles samanes ofrecen sombra perfecta para picnics familiares.',
            'The largest and most beloved open-air gym in Cali. This extensive linear park borders the Meléndez River and is the epicenter of sports life in the south. From dawn till night, it is full of people jogging, cycling, doing yoga, or enjoying its famous ''cholados'' and natural juices. Its large saman trees offer perfect shade for family picnics.',
            'Espacio vital para la recreación activa y la salud pública de los caleños.',
            'Vital space for active recreation and public health of Caleños.',
            'Surgió de la donación de terrenos del antiguo ingenio azucarero Meléndez.',
            'Emerged from the donation of lands from the old Meléndez sugar mill.',
            ARRAY['Es famoso por sus puestos de jugos de naranja y caña recién exprimidos.','Los fines de semana se llena de familias con mascotas.'],
            ARRAY['It is famous for its fresh orange and cane juice stalls.','On weekends it fills with families with pets.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's49',
            'Kilómetro 18',
            'Kilometer 18',
            'Parque Natural',
            'Natural Park',
            3.5,
            -76.6,
            4.8,
            3000,
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800',
            'La ''nevera'' de Cali. A solo 30 minutos de la ciudad, subiendo por la vía al mar, el clima cambia drásticamente a frío y neblina. El Km 18 es el plan tradicional para escapar del calor, ponerse ruana y tomar aguapanela con queso caliente y arepa de choclo. Además de la gastronomía, es un paraíso mundial para el avistamiento de aves, con especies únicas de colibríes y tángaras que se ven fácilmente.',
            'Cali''s ''fridge''. Just 30 minutes from the city, going up the road to the sea, the weather changes drastically to cold and fog. Km 18 is the traditional plan to escape the heat, put on a poncho, and drink aguapanela with hot cheese and sweet corn arepa. In addition to gastronomy, it is a world paradise for bird watching, with unique species of hummingbirds and tanagers easily seen.',
            'Zona de importancia mundial para el avistamiento de aves (birdwatching) y turismo gastronómico.',
            'Area of global importance for birdwatching and gastronomic tourism.',
            'Históricamente fue el paso obligado de arrieros entre el Valle y el Pacífico.',
            'Historically it was the obligatory passage for muleteers between the Valley and the Pacific.',
            ARRAY['Aquí se encuentra el ''Bosque de Niebla de San Antonio'', un ecosistema único.','Es famoso por el chocolate caliente con queso.'],
            ARRAY['Here is the ''San Antonio Cloud Forest'', a unique ecosystem.','It is famous for hot chocolate with cheese.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's52',
            'Monumento a Jovita',
            'Jovita Monument',
            'Monumento',
            'Monument',
            3.44,
            -76.535,
            4.5,
            1200,
            'https://images.unsplash.com/photo-1555523908-410a054859a7?auto=format&fit=crop&w=800',
            'Un homenaje a la reina eterna y loca de la ciudad. Ubicado en el Parque de los Estudiantes, frente al histórico Colegio Santa Librada, este monumento celebra a Jovita Feijóo, un personaje popular que se creía reina y que los caleños adoptaron con cariño. La escultura captura su elegancia y extravagancia. Es un punto de referencia cultural y bohemio, rodeado de bares y vida universitaria.',
            'A tribute to the eternal and mad queen of the city. Located in the Students'' Park, in front of the historic Santa Librada College, this monument celebrates Jovita Feijóo, a popular character who believed herself to be queen and whom Caleños adopted with affection. The sculpture captures her elegance and extravagance. It is a cultural and bohemian landmark, surrounded by bars and university life.',
            'Símbolo de la cultura popular caleña y la aceptación de la locura como parte de la identidad.',
            'Symbol of Cali popular culture and the acceptance of madness as part of identity.',
            'Jovita fue nombrada ''Reina de la Simpatía'' en un acto público masivo en los años 70.',
            'Jovita was named ''Queen of Sympathy'' in a massive public act in the 70s.',
            ARRAY['La estatua siempre tiene flores frescas que le dejan los estudiantes.','Es el punto de encuentro para marchas estudiantiles y carnaval.'],
            ARRAY['The statue always has fresh flowers left by students.','It is the meeting point for student marches and carnival.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's56',
            'Parque del Avión',
            'Airplane Park',
            'Espacio público',
            'Public Space',
            3.465,
            -76.52,
            4.4,
            900,
            'https://images.unsplash.com/photo-1559628236-485637cca3ef?auto=format&fit=crop&w=800',
            'Un parque icónico del norte de Cali donde aterriza la historia. Su atracción central es un avión real, un Douglas DC-6, instalado en medio de zonas verdes y juegos infantiles. Es un lugar nostálgico para muchas generaciones de caleños que crecieron jugando bajo sus alas. Recientemente renovado, ofrece un espacio seguro para la recreación familiar y el deporte.',
            'An iconic park in northern Cali where history lands. Its central attraction is a real plane, a Douglas DC-6, installed amidst green areas and playgrounds. It is a nostalgic place for many generations of Caleños who grew up playing under its wings. Recently renovated, it offers a safe space for family recreation and sports.',
            'Hito urbano del norte de la ciudad y curiosidad histórica.',
            'Urban landmark of the north of the city and historical curiosity.',
            'El avión llegó en los años 90 y se convirtió en biblioteca infantil por un tiempo.',
            'The plane arrived in the 90s and became a children''s library for a while.',
            ARRAY['Es un punto de referencia geográfico muy usado: ''Nos vemos en el Parque del Avión''.','El avión perteneció a una aerolínea comercial antes de ser donado.'],
            ARRAY['It is a widely used geographical reference point: ''See you at the Airplane Park''.','The plane belonged to a commercial airline before being donated.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's57',
            'Plazoleta de San Francisco',
            'San Francisco Square',
            'Espacio público',
            'Public Space',
            3.4505,
            -76.5325,
            4.4,
            1000,
            'https://images.unsplash.com/photo-1580974511812-4b71978d2b25?auto=format&fit=crop&w=800',
            'Una amplia explanada de ladrillo rojo dominada por el imponente complejo religioso de San Francisco y la magnífica Torre Mudéjar. Es un espacio de tránsito constante, rodeado de edificios gubernamentales como la Gobernación. Aquí se siente la historia colonial de Cali dialogando con el ajetreo administrativo moderno. Es un punto fotográfico obligatorio por su arquitectura única en Colombia.',
            'A wide red brick esplanade dominated by the imposing religious complex of San Francisco and the magnificent Mudejar Tower. It is a space of constant transit, surrounded by government buildings like the Governor''s Office. Here you feel Cali''s colonial history dialoguing with modern administrative bustle. It is a mandatory photo spot due to its unique architecture in Colombia.',
            'Alberga la Torre Mudéjar, considerada la joya arquitectónica más valiosa y singular de la ciudad.',
            'Houses the Mudejar Tower, considered the city''s most valuable and unique architectural jewel.',
            'La plazoleta ha sido remodelada varias veces, sirviendo históricamente de atrio al templo franciscano.',
            'The square has been remodeled several times, historically serving as an atrium to the Franciscan temple.',
            ARRAY['Las palomas son habitantes permanentes de la plaza y los turistas suelen alimentarlas.','Desde aquí se tiene la mejor vista completa de la Torre Mudéjar y sus ladrillos decorativos.'],
            ARRAY['Pigeons are permanent inhabitants of the square and tourists often feed them.','From here you have the best complete view of the Mudejar Tower and its decorative bricks.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's58',
            'Parque de los Poetas',
            'Poets Park',
            'Espacio público',
            'Public Space',
            3.452,
            -76.5315,
            4.2,
            800,
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800',
            'Un rincón literario en medio del centro, cerca de la iglesia La Ermita. Este parque rinde homenaje a los grandes poetas vallecaucanos (Jorge Isaacs, Ricardo Nieto, Carlos Villafañe) con esculturas de bronce que invitan a sentarse junto a ellos. Es también el lugar de trabajo de los tradicionales ''escribientes'', quienes con sus máquinas de escribir redactan cartas y documentos legales, manteniendo vivo un oficio casi extinto.',
            'A literary corner in the middle of downtown, near La Ermita church. This park pays tribute to the great Valle del Cauca poets (Jorge Isaacs, Ricardo Nieto, Carlos Villafañe) with bronze sculptures that invite you to sit next to them. It is also the workplace of the traditional ''scribes'', who with their typewriters draft letters and legal documents, keeping an almost extinct trade alive.',
            'Preservación de la memoria literaria regional y del oficio tradicional del escribiente.',
            'Preservation of regional literary memory and the traditional scribe''s trade.',
            'Inaugurado en 1995 para revitalizar el espacio urbano del centro.',
            'Inaugurated in 1995 to revitalize the downtown urban space.',
            ARRAY['Puedes ''conversar'' y tomarte fotos sentado con la estatua de Jorge Isaacs.','El sonido de las máquinas de escribir es la banda sonora característica del parque.'],
            ARRAY['You can ''talk'' and take photos sitting with the statue of Jorge Isaacs.','The sound of typewriters is the park''s characteristic soundtrack.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's59',
            'Puente Ortiz',
            'Ortiz Bridge',
            'Monumento',
            'Monument',
            3.453,
            -76.532,
            4.5,
            1500,
            'https://images.unsplash.com/photo-1549643276-8e50b691079d?auto=format&fit=crop&w=800',
            'Más que un cruce sobre el río, el Puente Ortiz es un testigo de la historia de Cali. Construido en ladrillo y cal, fue la primera conexión estable entre el norte y el centro de la ciudad. Hoy, perfectamente integrado al Bulevar del Río, es peatonal y permite apreciar su estructura original restaurada. Es un símbolo de la ingeniería del siglo XIX y un punto de encuentro romántico.',
            'More than a crossing over the river, the Ortiz Bridge is a witness to Cali''s history. Built of brick and lime, it was the first stable connection between the north and the center of the city. Today, perfectly integrated into the River Boulevard, it is pedestrian and allows you to appreciate its restored original structure. It is a symbol of 19th-century engineering and a romantic meeting point.',
            'Bien de Interés Cultural Nacional, vital para el desarrollo urbano de Cali hacia el norte.',
            'National Asset of Cultural Interest, vital for the urban development of Cali towards the north.',
            'Construido entre 1842 y 1845 bajo la dirección de Fray José Joaquín Escobar.',
            'Built between 1842 and 1845 under the direction of Friar José Joaquín Escobar.',
            ARRAY['Se usaron miles de huevos y sangre de toro en la mezcla original para darle fuerza (según la tradición oral).','Fue restaurado en 2011 revelando sus arcos originales que estaban enterrados.'],
            ARRAY['Thousands of eggs and bull''s blood were used in the original mixture to give it strength (according to oral tradition).','It was restored in 2011 revealing its original arches that were buried.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's60',
            'Parque del Peñón',
            'El Peñón Park',
            'Espacio público',
            'Public Space',
            3.449,
            -76.543,
            4.6,
            1100,
            'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800',
            'Un parque elegante, fresco y arborizado en el corazón de uno de los barrios más exclusivos y bohemios de Cali. Rodeado de cafés, galerías de arte y restaurantes de autor, es el lugar perfecto para comenzar una noche de cena o disfrutar de una mañana tranquila. Los domingos se transforma en una vibrante galería al aire libre donde artistas locales exhiben y venden sus pinturas.',
            'An elegant, fresh, and wooded park in the heart of one of Cali''s most exclusive and bohemian neighborhoods. Surrounded by cafes, art galleries, and signature restaurants, it is the perfect place to start a dinner evening or enjoy a quiet morning. On Sundays, it transforms into a vibrant open-air gallery where local artists exhibit and sell their paintings.',
            'Espacio de exhibición artística informal más importante de la ciudad cada domingo.',
            'Most important informal artistic exhibition space in the city every Sunday.',
            'El barrio El Peñón se desarrolló a principios del siglo XX como zona residencial de clase alta.',
            'El Peñón neighborhood developed in the early 20th century as an upper-class residential area.',
            ARRAY['Alberga una estatua de Benito Juárez donada por México.','Es conocido por sus grandes árboles que dan sombra fresca todo el día.'],
            ARRAY['Houses a statue of Benito Juárez donated by Mexico.','It is known for its large trees that provide cool shade all day.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;