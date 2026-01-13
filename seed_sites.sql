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
INSERT INTO public.sites (
        id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
        logo_url, descripcion, descripcion_en, importancia, importancia_en, 
        datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
    ) VALUES (
        's29',
        'Tin Tin Deo',
        'Tin Tin Deo',
        'Música en Vivo',
        'Live Music',
        3.428,
        -76.541,
        4.6,
        850,
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800',
        'Un clásico de la noche caleña ubicado cerca a la Calle 5ta. Tin Tin Deo es un lugar con alma y sabor, donde convergen el son cubano, la salsa clásica y el jazz latino. Su ambiente es bohemio, relajado y respetuoso, ideal para quienes buscan buena música, conversación y baile sin pretensiones. Es un punto de encuentro tradicional para universitarios, intelectuales y extranjeros que buscan la esencia musical de la ciudad.',
        'A classic of Cali nightlife located near 5th Street. Tin Tin Deo is a place with soul and flavor, where Cuban son, classic salsa, and Latin jazz converge. Its atmosphere is bohemian, relaxed, and respectful, ideal for those looking for good music, conversation, and unpretentious dancing. It is a traditional meeting point for university students, intellectuals, and foreigners seeking the city''s musical essence.',
        'Promotor de la cultura del ''Melómano'' y la música antillana y jazzística.',
        'Promoter of the ''Music Lover'' culture and Antillean and jazz music.',
        'Su nombre viene del famoso tema de Chano Pozo y Dizzy Gillespie, marcando su influencia de Latin Jazz.',
        'Its name comes from the famous song by Chano Pozo and Dizzy Gillespie, marking its Latin Jazz influence.',
        ARRAY['Decorado con obras de arte y fotografía local que cambia periódicamente.','Los jueves suelen tener audiciones temáticas especiales.'],
        ARRAY['Decorated with local art and photography that changes periodically.','Thursdays usually have special themed auditions.']
    ) ON CONFLICT (id) DO UPDATE SET 
        nombre = EXCLUDED.nombre,
        visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
        id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
        logo_url, descripcion, descripcion_en, importancia, importancia_en, 
        datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
    ) VALUES (
        's46',
        'Mulato Cabaret',
        'Mulato Cabaret',
        'Espectáculo de Salsa',
        'Salsa Show',
        3.433,
        -76.534,
        4.8,
        1000,
        'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800',
        'El primer cabaret latino de Colombia y una experiencia imperdible. Creado por ''El Mulato'', este lugar ofrece un espectáculo de salsa al estilo Broadway pero con el sabor y la técnica caleña. Es una experiencia inmersiva: el escenario está en todas partes y los bailarines interactúan con el público. La velocidad de los pies, las acrobacias aéreas y el vestuario deslumbrante hacen de este show algo único en el mundo, mostrando la evolución de la salsa.',
        'Colombia''s first Latin cabaret and an unmissable experience. Created by ''El Mulato'', this place offers a Broadway-style salsa show but with Cali flavor and technique. It is an immersive experience: the stage is everywhere and the dancers interact with the audience. The speed of the feet, aerial acrobatics, and dazzling costumes make this show unique in the world, showcasing the evolution of salsa.',
        'Elevó la salsa caleña a la categoría de espectáculo de entretenimiento de clase mundial.',
        'Elevated Cali salsa to the category of world-class entertainment spectacle.',
        'Inaugurado tras el éxito global de Swing Latino para tener una sede propia de presentaciones permanentes.',
        'Inaugurated after the global success of Swing Latino to have its own permanent presentation venue.',
        ARRAY['Después del show, el lugar se convierte en una discoteca para que el público baile.','Jennifer Lopez ha visitado y elogiado este lugar y a sus bailarines.'],
        ARRAY['After the show, the place becomes a nightclub for the audience to dance.','Jennifer Lopez has visited and praised this place and its dancers.']
    ) ON CONFLICT (id) DO UPDATE SET 
        nombre = EXCLUDED.nombre,
        visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
        id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
        logo_url, descripcion, descripcion_en, importancia, importancia_en, 
        datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
    ) VALUES (
        's71',
        'MalaMaña Salsa Bar',
        'MalaMaña Salsa Bar',
        'Música en Vivo',
        'Live Music',
        3.447,
        -76.5385,
        4.7,
        600,
        'https://images.unsplash.com/photo-1574349132578-1a5c40467776?auto=format&fit=crop&w=800',
        'Ubicado en un sótano discreto del barrio San Antonio, MalaMaña es el refugio del ''underground'' salsero. Es oscuro, rojo, intenso y auténtico. Aquí solo suena salsa brava, guaguancó y boogaloo, estrictamente en formato vinilo. Es el lugar favorito de los bailadores exigentes que buscan espacio en la pista y buena música sin interrupciones comerciales ni reguetón. Una joya escondida para los puristas.',
        'Located in a discreet basement in the San Antonio neighborhood, MalaMaña is the refuge of the salsa ''underground''. It is dark, red, intense, and authentic. Only salsa brava, guaguancó, and boogaloo play here, strictly in vinyl format. It is the favorite place for demanding dancers looking for floor space and good music without commercial interruptions or reggaeton. A hidden gem for purists.',
        'Preserva la cultura del vinilo y el baile de estilo libre en un ambiente contracultural.',
        'Preserves vinyl culture and freestyle dancing in a countercultural environment.',
        'Nació como una alternativa a las discotecas crossover, buscando recuperar la esencia del barrio.',
        'Born as an alternative to crossover nightclubs, seeking to recover the essence of the neighborhood.',
        ARRAY['No se piden canciones, se confía ciegamente en la selección del DJ.','Su entrada discreta hace que solo lleguen los verdaderos conocedores.'],
        ARRAY['Songs are not requested, the DJ''s selection is blindly trusted.','Its discreet entrance means only true connoisseurs arrive.']
    ) ON CONFLICT (id) DO UPDATE SET 
        nombre = EXCLUDED.nombre,
        visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
        id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
        logo_url, descripcion, descripcion_en, importancia, importancia_en, 
        datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
    ) VALUES (
        's72',
        'Punto Baré',
        'Punto Baré',
        'Música en Vivo',
        'Live Music',
        3.4465,
        -76.539,
        4.6,
        500,
        'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800',
        'Un club con aire sofisticado donde el jazz latino y la salsa de calidad se encuentran. Punto Baré es famoso por su excelente programación de música en vivo, ofreciendo escenario a las mejores orquestas locales y grupos de jazz. El ambiente es adulto, cómodo y apreciativo, con una excelente carta de cócteles y vinos. Es el sitio para escuchar, sentir y bailar con elegancia, lejos del bullicio masivo.',
        'A club with a sophisticated air where Latin jazz and quality salsa meet. Punto Baré is famous for its excellent live music programming, offering a stage to the best local orchestras and jazz groups. The atmosphere is adult, comfortable, and appreciative, with an excellent cocktail and wine list. It is the place to listen, feel, and dance with elegance, far from the massive bustle.',
        'Vital para la escena de música en vivo de calidad y el jazz en Cali.',
        'Vital for the quality live music scene and jazz in Cali.',
        'Fundado por amantes de la música que querían un espacio con acústica impecable para escuchar en vivo.',
        'Founded by music lovers who wanted a space with impeccable acoustics for live listening.',
        ARRAY['Es habitual ver ''jam sessions'' improvisadas con músicos visitantes.','Su nombre evoca el punto de encuentro y la ''barra'' (baré).'],
        ARRAY['It is common to see improvised ''jam sessions'' with visiting musicians.','Its name evokes the meeting point and the ''bar'' (baré).']
    ) ON CONFLICT (id) DO UPDATE SET 
        nombre = EXCLUDED.nombre,
        visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
        id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
        logo_url, descripcion, descripcion_en, importancia, importancia_en, 
        datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
    ) VALUES (
        's73',
        'La Caldera del Diablo',
        'Devil''s Cauldron',
        'Música en Vivo',
        'Live Music',
        3.448,
        -76.5375,
        4.5,
        400,
        'https://images.unsplash.com/photo-1571204680875-e8d4aa97edf9?auto=format&fit=crop&w=800',
        'Un rincón con mística y sabor en la emblemática Calle 5ta. La Caldera del Diablo hace honor a su nombre: el ambiente se calienta con la mejor salsa ''golpeada'' y ritmos antillanos. Su decoración con máscaras, iconografía popular y luces rojas crea una atmósfera única, casi de ritual. Es un lugar sin pretensiones donde lo único que importa es disfrutar la música y azotar baldosa hasta el amanecer.',
        'A corner with mystique and flavor on the emblematic 5th Street. Devil''s Cauldron lives up to its name: the atmosphere heats up with the best ''hard'' salsa and Antillean rhythms. Its decoration with masks, popular iconography, and red lights creates a unique, almost ritualistic atmosphere. It is an unpretentious place where the only thing that matters is enjoying the music and hitting the dance floor until dawn.',
        'Mantiene viva la esencia de la rumba caleña de barrio en una zona turística.',
        'Keeps the essence of the Cali neighborhood party alive in a tourist area.',
        'Inspirado en la mitología popular caleña sobre el diablo y la fiesta eterna.',
        'Inspired by popular Cali mythology about the devil and the eternal party.',
        ARRAY['Tienen cócteles con nombres ''diabólicos'' y picantes.','La música es curada para verdaderos salseros, evitando los éxitos comerciales.'],
        ARRAY['They have cocktails with ''diabolical'' and spicy names.','The music is curated for true salseros, avoiding commercial hits.']
    ) ON CONFLICT (id) DO UPDATE SET 
        nombre = EXCLUDED.nombre,
        visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
        id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
        logo_url, descripcion, descripcion_en, importancia, importancia_en, 
        datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
    ) VALUES (
        's84',
        'Academia de Baile Star Latin',
        'Star Latin Dance Academy',
        'Escuela de Salsa',
        'Salsa School',
        3.425,
        -76.49,
        4.8,
        350,
        'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=800',
        'En el corazón del Distrito de Aguablanca, Star Latin es mucho más que una academia de baile; es un proyecto de vida para cientos de jóvenes. Aquí se forja el estilo caleño puro en su máxima expresión: velocidad vertiginosa en los pies y acrobacias aéreas desafiantes. Visitarla es ver el talento en bruto, la pasión desbordante y la disciplina férrea de quienes sueñan con ser campeones mundiales.',
        'In the heart of the Aguablanca District, Star Latin is much more than a dance academy; it is a life project for hundreds of young people. Here the pure Cali style is forged at its finest: dizzying foot speed and challenging aerial acrobatics. Visiting it is seeing raw talent, overflowing passion, and the iron discipline of those who dream of being world champions.',
        'Transformación social y prevención de violencia a través del arte y el deporte.',
        'Social transformation and violence prevention through art and sports.',
        'Fundada con el objetivo de dar alternativas de vida a los jóvenes del sector.',
        'Founded with the aim of providing life alternatives to young people in the sector.',
        ARRAY['Sus ensayos son abiertos y la energía que se siente es contagiosa.','Han representado a Colombia en competencias internacionales con gran éxito.'],
        ARRAY['Their rehearsals are open and the energy felt is contagious.','They have represented Colombia in international competitions with great success.']
    ) ON CONFLICT (id) DO UPDATE SET 
        nombre = EXCLUDED.nombre,
        visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
        id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
        logo_url, descripcion, descripcion_en, importancia, importancia_en, 
        datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
    ) VALUES (
        's85',
        'Fundación Sabor y Swing',
        'Sabor y Swing Foundation',
        'Escuela de Salsa',
        'Salsa School',
        3.428,
        -76.488,
        4.7,
        300,
        'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=800',
        'Una escuela comunitaria en el barrio Comuneros II que respira pasión y tradición. Sabor y Swing se enfoca en preservar la herencia del baile caleño mientras innova en coreografías grupales de alto impacto. Es un espacio humilde en infraestructura pero lleno de grandeza humana, donde niños desde los 5 años aprenden que la salsa es disciplina, trabajo en equipo y alegría.',
        'A community school in the Comuneros II neighborhood that breathes passion and tradition. Sabor y Swing focuses on preserving the heritage of Cali dance while innovating in high-impact group choreographies. It is a humble space in infrastructure but full of human greatness, where children as young as 5 learn that salsa is discipline, teamwork, and joy.',
        'Tejido social vital en una de las zonas más vulnerables de la ciudad.',
        'Vital social fabric in one of the most vulnerable areas of the city.',
        'Nació de la necesidad de ocupar el tiempo libre de los niños del barrio para alejarlos de la calle.',
        'Born from the need to occupy the free time of neighborhood children to keep them off the streets.',
        ARRAY['Sus trajes de competencia son a menudo confeccionados por las madres de los bailarines.','Son protagonistas frecuentes y premiados del Salsódromo.'],
        ARRAY['Their competition costumes are often made by the dancers'' mothers.','They are frequent and awarded protagonists of the Salsódromo.']
    ) ON CONFLICT (id) DO UPDATE SET 
        nombre = EXCLUDED.nombre,
        visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
        id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
        logo_url, descripcion, descripcion_en, importancia, importancia_en, 
        datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
    ) VALUES (
        's93',
        'Escuela de Baile King of the Swing',
        'King of the Swing Dance School',
        'Escuela de Salsa',
        'Salsa School',
        3.418,
        -76.485,
        4.8,
        400,
        'https://images.unsplash.com/photo-1545959720-333d6b38c227?auto=format&fit=crop&w=800',
        'Referente indiscutible del estilo ''caleño acrobático''. King of the Swing es famosa mundialmente por la potencia, riesgo y altura de sus alzadas y figuras. Ubicada en el oriente de la ciudad, es una fábrica de verdaderos atletas del baile. Sus coreografías son explosivas y rápidas, reflejando la energía inagotable de su gente. Un lugar para admirar la capacidad física humana al ritmo de la clave.',
        'Undisputable benchmark of the ''acrobatic Cali'' style. King of the Swing is world-famous for the power, risk, and height of its lifts and figures. Located in the east of the city, it is a factory of true dance athletes. Their choreographies are explosive and fast, reflecting the inexhaustible energy of their people. A place to admire human physical capacity to the rhythm of the clave.',
        'Innovación constante en el componente acrobático y deportivo de la salsa caleña.',
        'Constant innovation in the acrobatic and sporting component of Cali salsa.',
        'Han formado a bailarines que hoy trabajan en los circos y espectáculos más famosos del mundo.',
        'They have trained dancers who now work in the most famous circuses and shows in the world.',
        ARRAY['Entrenan con técnicas deportivas de alto rendimiento.','El nivel de exigencia física es comparable al de la gimnasia olímpica.'],
        ARRAY['They train with high-performance sports techniques.','The level of physical demand is comparable to Olympic gymnastics.']
    ) ON CONFLICT (id) DO UPDATE SET 
        nombre = EXCLUDED.nombre,
        visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
        id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
        logo_url, descripcion, descripcion_en, importancia, importancia_en, 
        datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
    ) VALUES (
        's94',
        'Academia de Baile Imperio Juvenil',
        'Imperio Juvenil Dance Academy',
        'Escuela de Salsa',
        'Salsa School',
        3.425,
        -76.495,
        4.9,
        600,
        'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&w=800',
        'Una de las escuelas más laureadas y respetadas de Cali. Imperio Juvenil combina la elegancia y el estilo clásico con la velocidad moderna. Su sede es un hervidero de actividad constante donde se preparan los campeones del Festival Mundial de Salsa. Su estilo es pulido, preciso y espectacular. Visitar sus ensayos es entender por qué Cali ostenta el título de capital mundial de la salsa.',
        'One of the most laureate and respected schools in Cali. Imperio Juvenil combines elegance and classic style with modern speed. Its headquarters is a hive of constant activity where champions of the World Salsa Festival are prepared. Their style is polished, precise, and spectacular. Visiting their rehearsals is understanding why Cali holds the title of world salsa capital.',
        'Múltiples campeones mundiales y referentes de calidad técnica y artística.',
        'Multiple world champions and benchmarks of technical and artistic quality.',
        'Fundada por Jefferson Benjumea y Adriana Ávila, una pareja de baile legendaria a nivel mundial.',
        'Founded by Jefferson Benjumea and Adriana Ávila, a legendary dance couple globally.',
        ARRAY['Han participado en reality shows internacionales como ''Q''Viva! The Chosen''.','Tienen grupos de todas las edades, desde ''semilleros'' infantiles hasta elenco profesional.'],
        ARRAY['They have participated in international reality shows like ''Q''Viva! The Chosen''.','They have groups of all ages, from children''s ''seedbeds'' to professional cast.']
    ) ON CONFLICT (id) DO UPDATE SET 
        nombre = EXCLUDED.nombre,
        visitas = EXCLUDED.visitas;
INSERT INTO public.sites (
        id, nombre, nombre_en, tipo, tipo_en, lat, lng, rating, visitas, 
        logo_url, descripcion, descripcion_en, importancia, importancia_en, 
        datos_historicos, datos_historicos_en, datos_curiosos, datos_curiosos_en
    ) VALUES (
        's9',
        'Plaza de Mercado Alameda',
        'Alameda Market Square',
        'Gastronomía',
        'Gastronomy',
        3.4345,
        -76.5375,
        4.7,
        1400,
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800',
        'Más que un mercado, la Galería Alameda es un santuario de sabores y saberes. Aquí el Pacífico se encuentra con el Valle. Es el lugar donde los chefs más famosos de la ciudad vienen a comprar sus insumos frescos. Pasear por sus pasillos es un festín sensorial: el olor a albahaca y cimarrón, los colores vibrantes de frutas exóticas como el lulo, el chontaduro y el borojó, y el sonido de las cocineras tradicionales ofreciendo sancocho de pescado, ceviches, encocados y arroz atollado.',
        'More than a market, the Alameda Gallery is a sanctuary of flavors and knowledge. Here the Pacific meets the Valley. It is the place where the city''s most famous chefs come to buy their fresh supplies. Walking through its corridors is a sensory feast: the smell of basil and cimarrón, the vibrant colors of exotic fruits like lulo, chontaduro, and borojó, and the sound of traditional cooks offering fish sancocho, ceviches, encocados, and arroz atollado.',
        'Principal punto de difusión de la cocina y cultura del Pacífico colombiano en Cali.',
        'Main point of dissemination of Colombian Pacific cuisine and culture in Cali.',
        'Fundada en 1950, ha mantenido su arquitectura abierta y ventilada original, típica de los mercados tropicales.',
        'Founded in 1950, it has maintained its original open and ventilated architecture, typical of tropical markets.',
        ARRAY['Aquí encuentras las mejores ''bebidas espirituosas'' del Pacífico (Viche, Arrechón, Tumbacatre).','Es considerado el mejor lugar para probar la auténtica ''rellena'' y la chuleta valluna.'],
        ARRAY['Here you find the best ''spirit drinks'' of the Pacific (Viche, Arrechón, Tumbacatre).','It is considered the best place to try authentic ''rellena'' and chuleta valluna.']
    ) ON CONFLICT (id) DO UPDATE SET 
        nombre = EXCLUDED.nombre,
        visitas = EXCLUDED.visitas;
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