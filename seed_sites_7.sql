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