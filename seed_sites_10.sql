INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's89',
            'Biblioteca Pública Isaías Duarte Cancino',
            'Isaías Duarte Cancino Public Library',
            'Biblioteca',
            'Library',
            3.415,
            -76.475,
            4.6,
            550,
            'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800',
            'Ubicada estratégicamente junto al hospital del mismo nombre, esta biblioteca entiende la cultura como una forma de sanación y bienestar. Tiene un enfoque único en salud, ofreciendo lectura y acompañamiento para pacientes y familias, así como talleres sobre vida saludable. Es un refugio de calma, esperanza y distracción constructiva en medio de la actividad hospitalaria.',
            'Strategically located next to the hospital of the same name, this library understands culture as a form of healing and well-being. It has a unique focus on health, offering reading and accompaniment for patients and families, as well as workshops on healthy living. It is a refuge of calm, hope, and constructive distraction amidst hospital activity.',
            'Pionera en vincular la lectura y la cultura con la salud pública.',
            'Pioneer in linking reading and culture with public health.',
            'Nombrada en memoria del Monseñor Isaías Duarte Cancino, Arzobispo de Cali y defensor de los derechos humanos.',
            'Named in memory of Monsignor Isaías Duarte Cancino, Archbishop of Cali and defender of human rights.',
            ARRAY['Llevan carritos con libros (''Bibliocarritos'') a las salas de espera del hospital.','Organizan jornadas de lectura en voz alta muy emotivas.'],
            ARRAY['They take carts with books (''Bibliocarts'') to the hospital waiting rooms.','They organize very emotional reading aloud sessions.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's90',
            'Biblioteca Pública Rigoberta Menchú',
            'Rigoberta Menchú Public Library',
            'Biblioteca',
            'Library',
            3.402,
            -76.488,
            4.7,
            600,
            'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800',
            'En el barrio El Retiro, esta biblioteca lleva con orgullo el nombre de la líder indígena y Premio Nobel de Paz. Es un centro activo de memoria, diversidad y derechos humanos, con un enfoque especial en la cultura afrocolombiana e indígena. Aquí se celebran las raíces, se debate sobre identidad y se construyen puentes de paz a través de la palabra y el diálogo.',
            'In the El Retiro neighborhood, this library proudly bears the name of the indigenous leader and Nobel Peace Prize winner. It is an active center for memory, diversity, and human rights, with a special focus on Afro-Colombian and indigenous culture. Here roots are celebrated, identity is debated, and bridges of peace are built through words and dialogue.',
            'Defensora de la diversidad étnica y la paz en la Comuna 15.',
            'Defender of ethnic diversity and peace in Commune 15.',
            'Inaugurada con un fuerte mensaje de inclusión social y respeto a la diferencia.',
            'Inaugurated with a strong message of social inclusion and respect for difference.',
            ARRAY['Tienen una excelente colección especializada de autores afrocolombianos.','Celebran el mes de la herencia africana con grandes eventos culturales.'],
            ARRAY['They have an excellent specialized collection of Afro-Colombian authors.','They celebrate African Heritage Month with major cultural events.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's91',
            'Biblioteca Pública Municipal Desepaz',
            'Desepaz Municipal Public Library',
            'Biblioteca',
            'Library',
            3.435,
            -76.465,
            4.5,
            700,
            'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800',
            'Un faro cultural en el extremo oriente de Cali. La biblioteca Desepaz es una infraestructura fundamental para los niños y jóvenes de la Comuna 21. Ofrece amplios espacios iluminados para el estudio, salas de sistemas conectadas y un auditorio para eventos. Es conocida por sus programas de refuerzo escolar y por ser un lugar cívico donde la comunidad se organiza y participa activamente.',
            'A cultural beacon in the far east of Cali. The Desepaz library is a fundamental infrastructure for the children and youth of Commune 21. It offers ample illuminated spaces for study, connected computer rooms, and an auditorium for events. It is known for its school reinforcement programs and for being a civic place where the community organizes and actively participates.',
            'Punto vital de acceso a la información y tecnología en una zona de expansión urbana.',
            'Vital access point to information and technology in an urban expansion zone.',
            'Nació junto con el desarrollo urbanístico del proyecto Desepaz (Desarrollo, Seguridad y Paz).',
            'Born along with the urban development of the Desepaz (Development, Security, and Peace) project.',
            ARRAY['Es una de las bibliotecas más visitadas por estudiantes de secundaria para hacer tareas.','Tienen grupos de danza y teatro juvenil muy talentosos.'],
            ARRAY['It is one of the libraries most visited by high school students to do homework.','They have very talented youth dance and theater groups.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's92',
            'Biblioestación Andrés Sanín',
            'Andrés Sanín Library Station',
            'Biblioteca',
            'Library',
            3.445,
            -76.482,
            4.4,
            1200,
            'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800',
            'Cultura en movimiento. Ubicada estratégicamente dentro de una de las terminales de transporte masivo (MIO) más concurridas, esta biblioteca lleva los libros directamente al paso de la gente. Es un pequeño oasis cultural en medio del ajetreo diario, donde los viajeros pueden leer mientras esperan, llevarse libros en préstamo para el camino o participar en lecturas rápidas. Demuestra que la cultura puede estar en cualquier lugar.',
            'Culture in motion. Strategically located inside one of the busiest mass transit terminals (MIO), this library brings books directly to people''s paths. It is a small cultural oasis amidst the daily hustle, where travelers can read while they wait, borrow books for the road, or participate in quick readings. It demonstrates that culture can be anywhere.',
            'Democratización del acceso al libro en espacios no convencionales y de alto tráfico.',
            'Democratization of access to books in unconventional and high-traffic spaces.',
            'Parte de una estrategia innovadora de ''Biblioestaciones'' integradas al sistema de transporte masivo.',
            'Part of an innovative strategy of ''Library Stations'' integrated into the mass transit system.',
            ARRAY['Funciona con un exitoso sistema de ''confianza'' para el préstamo de libros.','Es pequeña en espacio pero tiene una rotación de títulos increíblemente alta.'],
            ARRAY['It works with a successful ''trust'' system for book lending.','It is small in space but has an incredibly high turnover of titles.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's95',
            'Centro Cultural U.R El Vallado',
            'El Vallado Cultural Center',
            'Centro Cultural',
            'Cultural Center',
            3.412,
            -76.488,
            4.6,
            400,
            'https://images.unsplash.com/photo-1514533248912-c96053fa4819?auto=format&fit=crop&w=800',
            'Un espacio de encuentro y creación en la Unidad Recreativa El Vallado. Este centro cultural aprovecha la infraestructura deportiva y recreativa para ofrecer una programación artística variada. Es un lugar híbrido donde el deporte y la cultura se dan la mano: puedes ver un ensayo de danza folclórica junto a las canchas de fútbol. Fomenta el uso saludable del tiempo libre y la integración comunitaria.',
            'A meeting and creation space in the El Vallado Recreational Unit. This cultural center takes advantage of sports and recreational infrastructure to offer varied artistic programming. It is a hybrid place where sports and culture go hand in hand: you can watch a folk dance rehearsal next to the soccer fields. It promotes the healthy use of free time and community integration.',
            'Integración exitosa de deporte, recreación y cultura en un solo espacio comunitario.',
            'Successful integration of sports, recreation, and culture in a single community space.',
            'Surgió para optimizar los espacios públicos de la unidad recreativa.',
            'Emerged to optimize the public spaces of the recreational unit.',
            ARRAY['Los fines de semana es el centro de la vida social del barrio.','Alberga torneos deportivos que incluyen componentes culturales.'],
            ARRAY['On weekends it is the center of the neighborhood''s social life.','It hosts sports tournaments that include cultural components.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;