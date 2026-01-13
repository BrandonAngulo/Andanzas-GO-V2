INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's53',
            'Biblioteca Centenario',
            'Centenario Library',
            'Biblioteca',
            'Library',
            3.446,
            -76.541,
            4.6,
            400,
            'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800',
            'La ''abuela'' elegante de las bibliotecas públicas de Cali. Ubicada cerca al CAM y a Bellas Artes, ocupa una bella casa republicana restaurada que invita a la lectura. Es un espacio tranquilo y lleno de encanto, especializado en literatura y cine. Su sala de proyecciones ''La Pila'', sus estanterías de madera y su patio interior con fuente son perfectos para escapar del ruido del centro y sumergirse en un buen libro.',
            'The elegant ''grandmother'' of Cali''s public libraries. Located near the CAM and Fine Arts, it occupies a beautiful restored Republican house that invites reading. It is a quiet space full of charm, specialized in literature and cinema. Its ''La Pila'' screening room, its wooden shelves, and its interior courtyard with a fountain are perfect for escaping the downtown noise and diving into a good book.',
            'Primera biblioteca pública municipal de Cali y patrimonio arquitectónico.',
            'Cali''s first municipal public library and architectural heritage.',
            'Fundada el 20 de julio de 1910 para conmemorar el centenario de la independencia de Colombia.',
            'Founded on July 20, 1910, to commemorate the centennial of Colombia''s independence.',
            ARRAY['Tiene una colección especial (Sala Ferrocarril) de autores vallecaucanos.','Sus talleres de escritura creativa ''La Pluma'' son muy populares.'],
            ARRAY['It has a special collection (Railroad Room) of Valle del Cauca authors.','Its ''The Pen'' creative writing workshops are very popular.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's54',
            'Centro Cultural Colombo Americano',
            'Colombo Americano Cultural Center',
            'Centro Cultural',
            'Cultural Center',
            3.456,
            -76.533,
            4.7,
            800,
            'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800',
            'Un puente cultural vibrante entre dos naciones. El Colombo Americano no es solo una academia de inglés; es un hervidero de actividad cultural de alta calidad. Su galería de arte ''Humberto Hernández'' siempre tiene exposiciones vanguardistas, y su auditorio es sede frecuente de conciertos de jazz, blues, rock y música de cámara. Cuenta además con una biblioteca bilingüe muy completa y moderna abierta al público.',
            'A vibrant cultural bridge between two nations. The Colombo Americano is not just an English academy; it is a hive of high-quality cultural activity. Its ''Humberto Hernández'' art gallery always has avant-garde exhibitions, and its auditorium is a frequent venue for jazz, blues, rock, and chamber music concerts. It also features a very complete and modern bilingual library open to the public.',
            'Pionero en la enseñanza de idiomas y la promoción del jazz y las artes visuales en la ciudad.',
            'Pioneer in language teaching and the promotion of jazz and visual arts in the city.',
            'Fundado en 1954 por un grupo de ciudadanos colombianos y estadounidenses.',
            'Founded in 1954 by a group of Colombian and American citizens.',
            ARRAY['Organiza el famoso y longevo ''Festival de Blues y Jazz'' de Cali.','Ofrece asesoría gratuita (EducationUSA) para estudiar en EE. UU.'],
            ARRAY['Organizes Cali''s famous and long-running ''Blues and Jazz Festival''.','Offers free counseling (EducationUSA) for studying in the USA.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's55',
            'Alianza Francesa',
            'Alliance Française',
            'Centro Cultural',
            'Cultural Center',
            3.4545,
            -76.5345,
            4.6,
            700,
            'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&w=800',
            'Un pedacito de Francia en el corazón de Cali. Ubicada en una casona renovada del barrio Granada, la Alianza es un centro dinámico de difusión cultural europea. Además de la enseñanza del francés, es famosa por su mediateca, sus ciclos de cine francés, debates filosóficos y exposiciones de fotografía. Su patio interior es escenario de la ''Fiesta de la Música'' cada junio, uno de los eventos gratuitos más alegres y multitudinarios de la ciudad.',
            'A little piece of France in the heart of Cali. Located in a renovated mansion in the Granada neighborhood, the Alliance is a dynamic center for European cultural dissemination. Besides teaching French, it is famous for its media library, its French film cycles, philosophical debates, and photography exhibitions. Its interior courtyard is the stage for the ''Fête de la Musique'' every June, one of the city''s most joyful and massive free events.',
            'Principal promotor de la cultura francófona y europea en la región.',
            'Main promoter of Francophone and European culture in the region.',
            'Tiene presencia activa en Cali desde hace más de 50 años.',
            'It has had an active presence in Cali for over 50 years.',
            ARRAY['Su restaurante ''Crêpe France'' en el interior es delicioso y auténtico.','Traen artistas franceses exclusivos para sus eventos culturales.'],
            ARRAY['Its ''Crêpe France'' restaurant inside is delicious and authentic.','They bring exclusive French artists for their cultural events.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's77',
            'Biblioteca Pública Centro Cultural Nuevo Latir',
            'Nuevo Latir Cultural Center Public Library',
            'Centro Cultural',
            'Cultural Center',
            3.4235,
            -76.496,
            4.7,
            600,
            'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800',
            'Una joya arquitectónica monumental en el corazón del Distrito de Aguablanca. Nuevo Latir es un símbolo de dignidad, inclusión y acceso a la cultura. Su imponente edificio de ladrillo y concreto, premiado internacionalmente, alberga una biblioteca moderna, auditorios, salas de ensayo y espacios de encuentro. Es un punto vital para la comunidad del oriente, donde se respira esperanza y transformación social a través del conocimiento.',
            'A monumental architectural jewel in the heart of the Aguablanca District. Nuevo Latir is a symbol of dignity, inclusion, and access to culture. Its imposing brick and concrete building, internationally awarded, houses a modern library, auditoriums, rehearsal rooms, and meeting spaces. It is a vital point for the eastern community, where hope and social transformation through knowledge are breathed.',
            'La infraestructura cultural más grande e importante del oriente de Cali.',
            'The largest and most important cultural infrastructure in eastern Cali.',
            'Inaugurada en 2011 como una de las ''Megaobras'' de la ciudad para cerrar brechas sociales.',
            'Inaugurated in 2011 as one of the city''s ''Megaworks'' to close social gaps.',
            ARRAY['Su diseño bioclimático permite que sea fresco sin aire acondicionado.','Acoge grandes conciertos de la Orquesta Filarmónica de Cali.'],
            ARRAY['Its bioclimatic design allows it to be cool without air conditioning.','It hosts major concerts by the Cali Philharmonic Orchestra.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's78',
            'Centro de Emprendimiento Cultural Comuna 13',
            'Comuna 13 Cultural Entrepreneurship Center',
            'Centro Cultural',
            'Cultural Center',
            3.431,
            -76.498,
            4.6,
            450,
            'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800',
            'Un espacio innovador y colorido en el barrio El Pondaje, diseñado específicamente para potenciar el talento local y la economía naranja. Aquí la cultura se ve como motor de desarrollo económico. Cuenta con estudios de grabación, salas de danza y talleres para emprendedores creativos. Es la casa de muchos grupos de hip hop, salsa choke y folclor urbano que están redefiniendo el sonido de Cali.',
            'An innovative and colorful space in the El Pondaje neighborhood, specifically designed to boost local talent and the orange economy. Here culture is seen as a driver of economic development. It features recording studios, dance halls, and workshops for creative entrepreneurs. It is the home of many hip hop, salsa choke, and urban folklore groups that are redefining the sound of Cali.',
            'Incubadora de proyectos de economía creativa y cultura urbana.',
            'Incubator for creative economy and urban culture projects.',
            'Construido para descentralizar la oferta cultural y apoyar la profesionalización de artistas emergentes.',
            'Built to decentralize the cultural offer and support the professionalization of emerging artists.',
            ARRAY['Su arquitectura geométrica y colorida destaca notablemente en el entorno.','Ofrece formación en marketing y gestión para artistas.'],
            ARRAY['Its geometric and colorful architecture stands out notably in the surroundings.','Offers training in marketing and management for artists.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's79',
            'Central Didáctica La Casona',
            'La Casona Didactic Center',
            'Centro Cultural',
            'Cultural Center',
            3.415,
            -76.492,
            4.8,
            550,
            'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800',
            'Un verdadero oasis educativo y social en el barrio Marroquín II. La Casona, operada por la Fundación Carvajal, es un referente histórico de intervención social exitosa. Más que una biblioteca, es un centro de vida comunitaria donde niños, jóvenes y adultos acceden a libros, cursos de sistemas, arte, recreación y formación laboral. Su ambiente es seguro, verde y acogedor, contrastando con el entorno urbano denso.',
            'A true educational and social oasis in the Marroquín II neighborhood. La Casona, operated by the Carvajal Foundation, is a historical benchmark for successful social intervention. More than a library, it is a center of community life where children, youth, and adults access books, computer courses, art, recreation, and job training. Its environment is safe, green, and welcoming, contrasting with the dense urban surroundings.',
            'Pionero en el trabajo social y educativo en el Distrito de Aguablanca.',
            'Pioneer in social and educational work in the Aguablanca District.',
            'Fue una de las primeras infraestructuras sociales de calidad en llegar a la zona durante su expansión.',
            'It was one of the first quality social infrastructures to arrive in the area during its expansion.',
            ARRAY['Tiene una ludoteca fantástica y muy concurrida por los niños.','Es el corazón de muchas iniciativas de paz y convivencia barrial.'],
            ARRAY['It has a fantastic playroom very frequented by children.','It is the heart of many neighborhood peace and coexistence initiatives.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's80',
            'Centro Cultural Abriendo Puertas',
            'Abriendo Puertas Cultural Center',
            'Centro Cultural',
            'Cultural Center',
            3.41,
            -76.485,
            4.5,
            300,
            'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?auto=format&fit=crop&w=800',
            'Una iniciativa inspiradora nacida de la propia comunidad en el barrio El Vallado. ''Abriendo Puertas'' es la prueba viviente de que el arte salva vidas. Es sede de grupos de teatro comunitario, danza y música que trabajan temas de memoria histórica, prevención de violencia y convivencia. Un espacio humilde en recursos pero lleno de fuerza transformadora y talento local.',
            'An inspiring initiative born from the community itself in the El Vallado neighborhood. ''Abriendo Puertas'' (Opening Doors) is living proof that art saves lives. It is home to community theater, dance, and music groups working on themes of historical memory, violence prevention, and coexistence. A space humble in resources but full of transformative power and local talent.',
            'Ejemplo brillante de autogestión cultural comunitaria y resistencia.',
            'Brilliant example of community cultural self-management and resistance.',
            'Fundado por líderes comunitarios para alejar a los jóvenes de las fronteras invisibles.',
            'Founded by community leaders to keep young people away from invisible borders.',
            ARRAY['Utilizan el ''Teatro del Oprimido'' como metodología de trabajo.','Sus obras se presentan en las calles del barrio, integrando al público.'],
            ARRAY['They use the ''Theater of the Oppressed'' as a working methodology.','Their plays are performed in the neighborhood streets, integrating the audience.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's81',
            'Biblioteca Pública San Marino',
            'San Marino Public Library',
            'Biblioteca',
            'Library',
            3.465,
            -76.485,
            4.6,
            400,
            'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800',
            'Ubicada en el corazón del barrio San Marino, esta biblioteca es el refugio seguro de los niños y abuelos del sector. Es un espacio colorido, dinámico y activo donde la lectura se mezcla con talleres de manualidades, cine foros, alfabetización digital y horas del cuento. Su labor en la promoción de la lectura en la primera infancia es destacable y reconocida.',
            'Located in the heart of the San Marino neighborhood, this library is the safe haven for the sector''s children and grandparents. It is a colorful, dynamic, and active space where reading mixes with craft workshops, film forums, digital literacy, and story hours. Its work in promoting early childhood reading is remarkable and recognized.',
            'Foco de cultura, educación y encuentro intergeneracional en la Comuna 7.',
            'Focus of culture, education, and intergenerational meeting in Commune 7.',
            'Parte integral de la Red de Bibliotecas Públicas de Cali.',
            'Integral part of the Cali Public Library Network.',
            ARRAY['Sus ''Abuelos Cuentacuentos'' son famosos y queridos en la zona.','Tienen una colección de libros álbum ilustrados muy bonita.'],
            ARRAY['Its ''Storytelling Grandparents'' are famous and beloved in the area.','They have a very beautiful illustrated picture book collection.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's82',
            'Biblioteca Pública Daniel Guillard',
            'Daniel Guillard Public Library',
            'Biblioteca',
            'Library',
            3.405,
            -76.5,
            4.5,
            450,
            'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800',
            'Nombrada en honor a un sacerdote belga que dedicó su vida a servir a la comunidad del oriente, esta biblioteca en el barrio Lagos es un centro de paz y aprendizaje. Ofrece un ambiente tranquilo y climatizado para estudiar, acceso gratuito a internet y una programación cultural constante. Es un lugar clave y recurso indispensable para los estudiantes de los colegios cercanos.',
            'Named after a Belgian priest who dedicated his life to serving the eastern community, this library in the Lagos neighborhood is a center of peace and learning. It offers a quiet and air-conditioned environment to study, free internet access, and constant cultural programming. It is a key place and indispensable resource for students from nearby schools.',
            'Honra la memoria social y el servicio comunitario a través de la educación.',
            'Honors social memory and community service through education.',
            'El Padre Daniel Guillard fue un líder social muy querido en el Distrito de Aguablanca.',
            'Father Daniel Guillard was a beloved social leader in the Aguablanca District.',
            ARRAY['Tienen un programa exitoso de alfabetización digital para adultos mayores.','Es un punto de encuentro seguro y neutral para los jóvenes.'],
            ARRAY['They have a successful digital literacy program for seniors.','It is a safe and neutral meeting point for young people.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's83',
            'Biblioteca Pública Los Naranjos',
            'Los Naranjos Public Library',
            'Biblioteca',
            'Library',
            3.418,
            -76.475,
            4.7,
            500,
            'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800',
            'En el corazón de la Comuna 21, la biblioteca Los Naranjos es un motor de creatividad y expresión. Destaca por su fuerte vínculo con las artes plásticas y visuales. Aquí los libros conviven armónicamente con exposiciones de pintura, muralismo y talleres de dibujo. Es un espacio luminoso, ventilado y abierto que invita a imaginar otros mundos posibles a través del arte.',
            'In the heart of Commune 21, Los Naranjos library is an engine of creativity and expression. It stands out for its strong link with plastic and visual arts. Here books coexist harmoniously with painting exhibitions, muralism, and drawing workshops. It is a bright, ventilated, and open space that invites you to imagine other possible worlds through art.',
            'Promotora activa de las artes visuales y la lectura en el oriente de la ciudad.',
            'Active promoter of visual arts and reading in the east of the city.',
            'Se ha consolidado como el centro cultural de facto de su barrio.',
            'It has consolidated itself as the de facto cultural center of its neighborhood.',
            ARRAY['Realizan murales comunitarios coloridos en sus paredes exteriores.','Tienen un club de lectura de cómics y novelas gráficas muy activo.'],
            ARRAY['They create colorful community murals on their exterior walls.','They have a very active comic and graphic novel reading club.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;