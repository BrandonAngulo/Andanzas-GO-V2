INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's1',
            'Museo La Tertulia',
            'La Tertulia Museum',
            'Museo',
            'Museum',
            3.4495,
            -76.546,
            4.7,
            1240,
            'https://images.unsplash.com/photo-1569388330292-7a6a8411a233?auto=format&fit=crop&w=800',
            'Ubicado estratégicamente a orillas del río Cali, en el emblemático oeste de la ciudad, el Museo La Tertulia es un hito arquitectónico y cultural. Diseñado por los arquitectos Lago y Sáenz, su estructura modernista se integra orgánicamente con la naturaleza circundante, creando un oasis de paz bajo enormes árboles centenarios. Es la institución museal más importante del suroccidente colombiano, reconocida por poseer una de las colecciones de arte en papel y gráfica más completas de Iberoamérica. El complejo cuenta con varias salas de exhibición, una cinemateca que proyecta lo mejor del cine independiente mundial, un teatro al aire libre y jardines escultóricos donde el arte dialoga con el paisaje.',
            'Strategically located on the banks of the Cali River, in the iconic west of the city, La Tertulia Museum is an architectural and cultural landmark. Designed by architects Lago and Sáenz, its modernist structure integrates organically with the surrounding nature, creating an oasis of peace under huge centennial trees. It is the most important museum institution in southwestern Colombia, recognized for possessing one of the most complete collections of paper and graphic art in Ibero-America. The complex features several exhibition halls, a cinematheque screening the best of world independent cinema, an open-air theater, and sculptural gardens where art dialogues with the landscape.',
            'Fue el primer museo de arte moderno fundado en Colombia y es vital para la preservación de obras en papel y arte gráfico.',
            'It was the first modern art museum founded in Colombia and is vital for the preservation of works on paper and graphic art.',
            'Fundado en 1956 por Maritza Uribe de Urdinola durante la dictadura de Rojas Pinilla como un espacio de libertad de expresión. Su edificio actual se inauguró en 1968.',
            'Founded in 1956 by Maritza Uribe de Urdinola during the dictatorship of Rojas Pinilla as a space for freedom of expression. Its current building was inaugurated in 1968.',
            ARRAY['Su colección de obras en papel es una de las más importantes de América Latina.','La Cinemateca es la única sala de la ciudad dedicada exclusivamente al cine arte.'],
            ARRAY['Its collection of works on paper is one of the most important in Latin America.','The Cinematheque is the only theater in the city dedicated exclusively to art cinema.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's4',
            'Lugar a Dudas',
            'A Place for Doubts',
            'Espacio de Arte',
            'Art Space',
            3.456,
            -76.536,
            4.9,
            750,
            'https://images.unsplash.com/photo-1518998053901-5348d3969105?auto=format&fit=crop&w=800',
            'En el vibrante barrio Granada, una casa tradicional caleña esconde un laboratorio de pensamiento artístico sin igual. Lugar a Dudas no es un museo estático, sino un espacio dinámico dedicado a la investigación, la producción y la difusión de las prácticas artísticas contemporáneas. Fundado por el renombrado artista Oscar Muñoz, este centro cuenta con un programa de residencias internacionales, salas de exhibición experimental y un centro de documentación especializado. Aquí el arte se cuestiona, se debate y se produce, convirtiéndose en una parada obligatoria para curadores, artistas y pensadores globales.',
            'In the vibrant Granada neighborhood, a traditional Cali house hides an unparalleled laboratory of artistic thought. Lugar a Dudas is not a static museum, but a dynamic space dedicated to research, production, and dissemination of contemporary artistic practices. Founded by renowned artist Oscar Muñoz, this center features an international residency program, experimental exhibition rooms, and a specialized documentation center. Here art is questioned, debated, and produced, making it a mandatory stop for global curators, artists, and thinkers.',
            'Fundado por el maestro Oscar Muñoz, es un referente internacional para el arte contemporáneo y conceptual.',
            'Founded by master Oscar Muñoz, it is an international benchmark for contemporary and conceptual art.',
            'Abrió sus puertas en 2005 para llenar el vacío de espacios independientes en la ciudad.',
            'It opened its doors in 2005 to fill the void of independent spaces in the city.',
            ARRAY['Su nombre invita a ''dudar'' como método de conocimiento.','Ofrece ''Cine Sin Autor'', proyecciones gratuitas y debates en la calle.'],
            ARRAY['Its name invites you to ''doubt'' as a method of knowledge.','Offers ''Cinema Without Author'', free screenings and street debates.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's10',
            'Museo del Oro Calima',
            'Calima Gold Museum',
            'Museo',
            'Museum',
            3.4515,
            -76.532,
            4.8,
            1100,
            'https://images.unsplash.com/photo-1605218427306-633ba84c1f6d?auto=format&fit=crop&w=800',
            'Una bóveda de tesoros ancestrales gestionada por el Banco de la República. Este museo narra con maestría la historia de los orfebres de la región Calima (culturas Ilama, Yotoco y Sonso) a través del brillo del oro y la perfección de la cerámica. La museografía es impecable y didáctica, permitiendo apreciar el detalle microscópico de narigueras, pectorales, diademas y poporos que reflejan la cosmovisión indígena, sus jerarquías sociales y su profunda conexión con la naturaleza y el mundo espiritual.',
            'A vault of ancestral treasures managed by the Bank of the Republic. This museum masterfully tells the story of the goldsmiths of the Calima region (Ilama, Yotoco, and Sonso cultures) through the shine of gold and the perfection of ceramics. The museography is impeccable and didactic, allowing you to appreciate the microscopic detail of nose rings, pectorals, diadems, and poporos that reflect the indigenous worldview, their social hierarchies, and their deep connection with nature and the spiritual world.',
            'Fundamental para entender la sofisticación tecnológica y artística de las culturas prehispánicas del Valle.',
            'Fundamental for understanding the technological and artistic sophistication of the pre-Hispanic cultures of the Valley.',
            'Inaugurado en 1991 como parte de la red de museos del oro del país.',
            'Inaugurated in 1991 as part of the country''s gold museum network.',
            ARRAY['La entrada es siempre gratuita.','Explica cómo el oro no tenía valor comercial, sino espiritual y de rango.'],
            ARRAY['Admission is always free.','Explains how gold had no commercial value, but spiritual and rank value.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's12',
            'Museo Arqueológico La Merced',
            'La Merced Archaeological Museum',
            'Museo',
            'Museum',
            3.4508,
            -76.5338,
            4.6,
            600,
            'https://images.unsplash.com/photo-1599582200638-344445353549?auto=format&fit=crop&w=800',
            'Ubicado en el edificio colonial más antiguo de Santiago de Cali, este museo ofrece un viaje profundo a las raíces prehispánicas de la región. Sus gruesos muros de adobe y tejas de barro resguardan una impresionante colección de cerámica, orfebrería y arte lítico de las culturas que habitaron el suroccidente colombiano, como Calima, Quimbaya, Tumaco y San Agustín. El patio central, adornado con una fuente y jardines exuberantes, ofrece un silencio casi místico en medio del ajetreo del centro, transportando al visitante a la época de la fundación de la ciudad.',
            'Located in the oldest colonial building in Santiago de Cali, this museum offers a deep journey into the region''s pre-Hispanic roots. Its thick adobe walls and clay tiles guard an impressive collection of ceramics, goldsmithing, and lithic art from the cultures that inhabited southwestern Colombia, such as Calima, Quimbaya, Tumaco, and San Agustín. The central courtyard, adorned with a fountain and lush gardens, offers an almost mystical silence amidst the downtown bustle, transporting the visitor to the city''s founding era.',
            'Preserva el patrimonio arqueológico y arquitectónico más antiguo de la ciudad.',
            'Preserves the city''s oldest archaeological and architectural heritage.',
            'El complejo religioso data de la fundación de la ciudad en el siglo XVI. El museo se estableció en 1979.',
            'The religious complex dates back to the city''s founding in the 16th century. The museum was established in 1979.',
            ARRAY['En este lugar se ofició la primera misa de fundación de Cali.','Posee urnas funerarias y rodillos de imprenta precolombinos.'],
            ARRAY['The first founding mass of Cali was officiated here.','It possesses funerary urns and pre-Columbian printing rollers.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's13',
            'Zoológico de Cali',
            'Cali Zoo',
            'Parque Temático',
            'Theme Park',
            3.4475,
            -76.558,
            4.9,
            5000,
            'https://images.unsplash.com/photo-1577979749830-f1d742b96791?auto=format&fit=crop&w=800',
            'Considerado uno de los mejores zoológicos de América Latina, este santuario de vida silvestre está inmerso en un bosque tropical seco a orillas del río Cali. No es solo un lugar de exhibición, sino un centro líder en investigación y conservación. Sus hábitats están diseñados para sumergir al visitante en la naturaleza, con recorridos que van desde los Andes hasta la Amazonía. Es famoso por su mariposario y por el cuidado excepcional de sus animales.',
            'Considered one of the best zoos in Latin America, this wildlife sanctuary is immersed in a tropical dry forest on the banks of the Cali River. It is not just an exhibition place, but a leading center for research and conservation. Its habitats are designed to immerse the visitor in nature, with tours ranging from the Andes to the Amazon. It is famous for its butterfly house and the exceptional care of its animals.',
            'Líder continental en la cría y preservación de especies amenazadas.',
            'Continental leader in the breeding and preservation of threatened species.',
            'Fundado en 1969. Ha transformado el concepto de zoológico clásico hacia uno de inmersión y respeto.',
            'Founded in 1969. It has transformed the classic zoo concept towards one of immersion and respect.',
            ARRAY['El río Cali atraviesa el zoológico, creando un microclima fresco.','Tienen un programa exitoso de reproducción de nutrias gigantes.'],
            ARRAY['The Cali River runs through the zoo, creating a cool microclimate.','They have a successful breeding program for giant otters.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's23',
            'Casa Obeso Mejía',
            'Obeso Mejía House',
            'Museo',
            'Museum',
            3.4485,
            -76.5435,
            4.7,
            400,
            'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800',
            'Una casona de estilo colonial californiano que parece detenida en el tiempo, ubicada estratégicamente frente al río Cali y el famoso Gato de Tejada. Originalmente una residencia familiar de la élite caleña, hoy es un espacio cultural íntimo que acoge exposiciones temporales, talleres y eventos privados. Sus jardines traseros, amplios y perfectamente cuidados, son un secreto a voces para disfrutar de la brisa de la tarde y ofrecen una vista privilegiada del río.',
            'A Californian colonial-style mansion that seems frozen in time, strategically located facing the Cali River and the famous Tejada''s Cat. Originally a family residence of the Cali elite, today it is an intimate cultural space hosting temporary exhibitions, workshops, and private events. Its expansive and perfectly manicured back gardens are an open secret for enjoying the afternoon breeze and offer a privileged view of the river.',
            'Ejemplo de la arquitectura doméstica de principios del siglo XX, hoy democratizada para el arte.',
            'Example of early 20th-century domestic architecture, now democratized for art.',
            'Construida por la familia Obeso Mejía, fue adquirida y restaurada por el Museo La Tertulia.',
            'Built by the Obeso Mejía family, it was acquired and restored by La Tertulia Museum.',
            ARRAY['Conserva los pisos, baños y cocina originales de la época.','Su arquitectura dialoga con el Hotel Obelisco cruzando el río.'],
            ARRAY['Preserves the original floors, bathrooms, and kitchen of the era.','Its architecture dialogues with the Hotel Obelisco across the river.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's25',
            'Museo de la Salsa',
            'Salsa Museum',
            'Museo',
            'Museum',
            3.435,
            -76.53,
            4.9,
            2000,
            'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=800',
            'Ubicado en el corazón del histórico Barrio Obrero, este lugar es considerado el ''Vaticano'' de la salsa caleña. Más que un museo convencional, es la casa de Carlos Molina, quien ha dedicado su vida a recopilar la historia fotográfica y musical de la salsa en la ciudad. Sus paredes están cubiertas de piso a techo con fotos originales, instrumentos firmados y recuerdos de leyendas como Celia Cruz, Héctor Lavoe y el Grupo Niche. Es un viaje nostálgico y vibrante donde cada objeto tiene una anécdota contada con pasión.',
            'Located in the heart of the historic Barrio Obrero, this place is considered the ''Vatican'' of Cali salsa. More than a conventional museum, it is the home of Carlos Molina, who has dedicated his life to collecting the photographic and musical history of salsa in the city. Its walls are covered from floor to ceiling with original photos, signed instruments, and memorabilia from legends like Celia Cruz, Héctor Lavoe, and Grupo Niche. It is a nostalgic and vibrant journey where every object has an anecdote told with passion.',
            'Es el repositorio de memoria visual más importante de la cultura salsera popular.',
            'It is the most important repository of visual memory of popular salsa culture.',
            'Fundado hace más de 50 años como un archivo personal que se abrió al mundo.',
            'Founded over 50 years ago as a personal archive that opened to the world.',
            ARRAY['Es el museo de salsa más antiguo del mundo.','Carlos Molina, su director, suele guiar personalmente las visitas.'],
            ARRAY['It is the oldest salsa museum in the world.','Carlos Molina, its director, usually guides the tours personally.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's30',
            'Museo de Ciencias Naturales',
            'Natural Science Museum',
            'Museo',
            'Museum',
            3.435,
            -76.54,
            4.5,
            850,
            'https://images.unsplash.com/photo-1563804807963-7186a51cc247?auto=format&fit=crop&w=800',
            'Un espacio fascinante para entender la inmensa biodiversidad de una de las regiones más ricas del planeta. Ubicado en la Manzana del Saber, este museo exhibe completas colecciones zoológicas, geológicas y arqueológicas del Valle del Cauca. Desde imponentes esqueletos de megafauna prehistórica hasta dioramas detallados de los ecosistemas locales (páramo, selva, mar), es un lugar educativo imperdible para familias y amantes de la naturaleza.',
            'A fascinating space to understand the immense biodiversity of one of the richest regions on the planet. Located in the Manzana del Saber, this museum exhibits complete zoological, geological, and archaeological collections from Valle del Cauca. From imposing skeletons of prehistoric megafauna to detailed dioramas of local ecosystems (paramo, rainforest, sea), it is an unmissable educational place for families and nature lovers.',
            'Principal centro de divulgación científica del INCIVA.',
            'Main scientific dissemination center of INCIVA.',
            'Fundado en 1963 por el biólogo Federico Carlos Lehmann.',
            'Founded in 1963 by biologist Federico Carlos Lehmann.',
            ARRAY['Posee un esqueleto completo de un Mastodonte hallado en el Valle.','Tiene una gran colección de aves taxidermizadas.'],
            ARRAY['It has a complete skeleton of a Mastodon found in the Valley.','It has a large collection of taxidermied birds.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's34',
            'Museo Caliwood',
            'Caliwood Museum',
            'Museo',
            'Museum',
            3.4485,
            -76.5585,
            4.8,
            500,
            'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800',
            'Un homenaje monumental a la obsesión de Cali por el cine y la imagen. Este museo alberga la colección privada de proyectores, cámaras filmadoras y afiches de cine más grande del país. Al recorrer sus pasillos, se viaja por la historia tecnológica del séptimo arte, desde los hermanos Lumière hasta la época dorada del cine mexicano y hollywoodense que tanto influyó en la cultura caleña. Además, ofrece una vista espectacular del oeste de Cali desde su terraza.',
            'A monumental tribute to Cali''s obsession with cinema and image. This museum houses the country''s largest private collection of projectors, movie cameras, and film posters. Walking through its corridors is a journey through the technological history of the seventh art, from the Lumière brothers to the golden age of Mexican and Hollywood cinema that so influenced Cali culture. Furthermore, it offers a spectacular view of western Cali from its terrace.',
            'Primer museo de la cinematografía en Colombia, guardián de la cultura cinéfila caleña.',
            'First cinematography museum in Colombia, guardian of Cali''s cinephile culture.',
            'Fundado en 2008 por Hugo Suárez, un apasionado coleccionista.',
            'Founded in 2008 by Hugo Suárez, a passionate collector.',
            ARRAY['Tiene proyectores que funcionaron en los antiguos teatros de barrio de Cali.','El nombre alude al fenómeno cultural de ''Caliwood'' de los años 70.'],
            ARRAY['It has projectors that worked in the old neighborhood theaters of Cali.','The name alludes to the ''Caliwood'' cultural phenomenon of the 70s.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
            id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
            logo_url, descripcion, descripcion_en, importancia, importancia_en, 
            datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
        ) VALUES (
            's35',
            'Hacienda Cañasgordas',
            'Cañasgordas Hacienda',
            'Hacienda Histórica',
            'Historic Estate',
            3.366,
            -76.528,
            4.7,
            600,
            'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800',
            'Un viaje directo al pasado colonial del Valle del Cauca. Esta magnífica hacienda del siglo XVIII es el escenario real donde se desarrolla la novela ''El Alférez Real'' de Eustaquio Palacios. Su arquitectura conserva los corredores amplios, la capilla privada y los sistemas de acequias de la época. Es un testimonio vivo de la vida aristocrática colonial y de la historia de la independencia en la región.',
            'A direct trip to the colonial past of Valle del Cauca. This magnificent 18th-century hacienda is the real setting where the novel ''El Alférez Real'' by Eustaquio Palacios takes place. Its architecture preserves the wide corridors, the private chapel, and the irrigation systems of the time. It is a living testimony of colonial aristocratic life and the history of independence in the region.',
            'Monumento Nacional y escenario literario clave de la región.',
            'National Monument and key literary setting of the region.',
            'Fue cuartel general de los ejércitos patriotas durante la campaña de independencia.',
            'It was the headquarters of the patriot armies during the independence campaign.',
            ARRAY['Se dice que aún conserva muebles originales de la época colonial.','Sus terrenos originales abarcaban gran parte del sur de la actual Cali.'],
            ARRAY['It is said to still preserve original furniture from the colonial era.','Its original grounds covered much of what is now southern Cali.']
        ) ON CONFLICT (id) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            visitas = EXCLUDED.visitas;