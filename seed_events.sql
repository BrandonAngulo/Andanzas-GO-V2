INSERT INTO public.events (
        id, titulo, titulo_en, fecha, lugar, lugar_en, 
        resumen, resumen_en, img, descripcion, descripcion_en, is_published
    ) VALUES (
        'e1',
        'Festival de Música del Pacífico Petronio Álvarez',
        'Petronio Álvarez Pacific Music Festival',
        '2024-08-14',
        'Unidad Deportiva Alberto Galindo',
        'Alberto Galindo Sports Unit',
        'El festival de cultura afro más importante de Latinoamérica.',
        'The most important Afro culture festival in Latin America.',
        'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&w=800',
        'Una celebración vibrante de la herencia africana en Colombia. Durante cinco días, Cali se convierte en la capital del Pacífico. Disfruta de la música de marimba, los cantos tradicionales, la comida típica (viche, arrechón, mariscos) y la moda afro. Es una experiencia cultural inmersiva llena de alegría y sabor.',
        'A vibrant celebration of African heritage in Colombia. For five days, Cali becomes the capital of the Pacific. Enjoy marimba music, traditional songs, typical food (viche, arrechón, seafood), and Afro fashion. It is an immersive cultural experience full of joy and flavor.',
        TRUE
    ) ON CONFLICT (id) DO UPDATE SET 
        titulo = EXCLUDED.titulo,
        titulo_en = EXCLUDED.titulo_en,
        fecha = EXCLUDED.fecha,
        img = EXCLUDED.img,
        descripcion = EXCLUDED.descripcion,
        descripcion_en = EXCLUDED.descripcion_en;

INSERT INTO public.events (
        id, titulo, titulo_en, fecha, lugar, lugar_en, 
        resumen, resumen_en, img, descripcion, descripcion_en, is_published
    ) VALUES (
        'e2',
        'Feria de Cali',
        'Cali Fair',
        '2024-12-25',
        'Autopista Suroriental y varios puntos',
        'Southeastern Highway and various locations',
        'La fiesta más grande de la ciudad: salsa, desfiles y alegría.',
        'The city''s biggest party: salsa, parades, and joy.',
        'https://images.unsplash.com/photo-1545959720-333d6b38c227?auto=format&fit=crop&w=800',
        'El evento cumbre del año. Comienza con el Salsódromo (un desfile de bailarines de salsa de talla mundial) y continúa con el Desfile de Autos Clásicos, el Carnaval de Cali Viejo y el Encuentro de Melómanos. Es una semana donde la ciudad no duerme y la salsa se respira en cada esquina.',
        'The pinnacle event of the year. It starts with the Salsódromo (a parade of world-class salsa dancers) and continues with the Classic Car Parade, the Old Cali Carnival, and the Music Lovers Meeting. It''s a week where the city doesn''t sleep and salsa is breathed in every corner.',
        TRUE
    ) ON CONFLICT (id) DO UPDATE SET 
        titulo = EXCLUDED.titulo,
        titulo_en = EXCLUDED.titulo_en,
        fecha = EXCLUDED.fecha,
        img = EXCLUDED.img,
        descripcion = EXCLUDED.descripcion,
        descripcion_en = EXCLUDED.descripcion_en;

INSERT INTO public.events (
        id, titulo, titulo_en, fecha, lugar, lugar_en, 
        resumen, resumen_en, img, descripcion, descripcion_en, is_published
    ) VALUES (
        'e3',
        'Festival Internacional de Ballet',
        'International Ballet Festival',
        '2024-10-20',
        'Teatro Municipal y Plazoleta Jairo Varela',
        'Municipal Theater and Jairo Varela Square',
        'Lo mejor de la danza clásica y contemporánea mundial.',
        'The best of world classical and contemporary dance.',
        'https://images.unsplash.com/photo-1514306191717-452ec28c7f91?auto=format&fit=crop&w=800',
        'Cali abre sus telones para recibir a compañías de ballet de Europa, América y Asia. Además de las galas en teatros, el festival se caracteriza por sus presentaciones gratuitas al aire libre, acercando el arte de la danza a todo el público. Una muestra de elegancia y técnica.',
        'Cali opens its curtains to welcome ballet companies from Europe, America, and Asia. In addition to theater galas, the festival is characterized by its free outdoor performances, bringing the art of dance to the general public. A display of elegance and technique.',
        TRUE
    ) ON CONFLICT (id) DO UPDATE SET 
        titulo = EXCLUDED.titulo,
        titulo_en = EXCLUDED.titulo_en,
        fecha = EXCLUDED.fecha,
        img = EXCLUDED.img,
        descripcion = EXCLUDED.descripcion,
        descripcion_en = EXCLUDED.descripcion_en;

INSERT INTO public.events (
        id, titulo, titulo_en, fecha, lugar, lugar_en, 
        resumen, resumen_en, img, descripcion, descripcion_en, is_published
    ) VALUES (
        'e4',
        'Festival Internacional de Cine de Cali',
        'Cali International Film Festival',
        '2024-11-05',
        'Museo La Tertulia y cines locales',
        'La Tertulia Museum and local cinemas',
        'Cine independiente, vanguardista y documental.',
        'Independent, avant-garde, and documentary cinema.',
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800',
        'Un espacio para el cine que arriesga. El FICCALI proyecta películas que difícilmente llegan a las salas comerciales, con un fuerte enfoque en el cine colombiano y latinoamericano. Incluye talleres, conversatorios con directores y proyecciones al aire libre junto al río.',
        'A space for cinema that takes risks. FICCALI screens films that rarely reach commercial theaters, with a strong focus on Colombian and Latin American cinema. It includes workshops, talks with directors, and outdoor screenings by the river.',
        TRUE
    ) ON CONFLICT (id) DO UPDATE SET 
        titulo = EXCLUDED.titulo,
        titulo_en = EXCLUDED.titulo_en,
        fecha = EXCLUDED.fecha,
        img = EXCLUDED.img,
        descripcion = EXCLUDED.descripcion,
        descripcion_en = EXCLUDED.descripcion_en;

INSERT INTO public.events (
        id, titulo, titulo_en, fecha, lugar, lugar_en, 
        resumen, resumen_en, img, descripcion, descripcion_en, is_published
    ) VALUES (
        'e5',
        'Mundial de Salsa',
        'World Salsa Festival',
        '2024-09-20',
        'Coliseo El Pueblo',
        'El Pueblo Coliseum',
        'Competencia de los mejores bailarines de salsa del planeta.',
        'Competition of the best salsa dancers on the planet.',
        'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800',
        'Siente la adrenalina de la competencia. Bailarines de todo el mundo vienen a Cali a desafiar a los locales en estilo caleño, en línea y cabaret. Es un espectáculo de acrobacias, velocidad y precisión que te dejará sin aliento.',
        'Feel the adrenaline of the competition. Dancers from all over the world come to Cali to challenge the locals in Cali style, On1/On2, and cabaret. It is a spectacle of acrobatics, speed, and precision that will leave you breathless.',
        TRUE
    ) ON CONFLICT (id) DO UPDATE SET 
        titulo = EXCLUDED.titulo,
        titulo_en = EXCLUDED.titulo_en,
        fecha = EXCLUDED.fecha,
        img = EXCLUDED.img,
        descripcion = EXCLUDED.descripcion,
        descripcion_en = EXCLUDED.descripcion_en;

