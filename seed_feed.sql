INSERT INTO public.feed_items (
        type, titulo, titulo_en, contenido, contenido_en, site_id, icono_name, fecha
    ) VALUES (
        'anuncio',
        '¡Nueva funcionalidad!',
        'New Feature!',
        'Ahora puedes ver la programación de los teatros directamente en el mapa.',
        'Now you can see theater schedules directly on the map.',
        NULL,
        'Megaphone',
        NOW() - INTERVAL '30 minutes'
    );

INSERT INTO public.feed_items (
        type, titulo, titulo_en, contenido, contenido_en, site_id, icono_name, fecha
    ) VALUES (
        'publicacion_sitio',
        NULL,
        NULL,
        'Inauguramos nuestra nueva exposición "Voces del Río". ¡Entrada libre este fin de semana!',
        'We are inaugurating our new exhibition "Voices of the River". Free entry this weekend!',
        's1',
        NULL,
        NOW() - INTERVAL '2 hours'
    );

INSERT INTO public.feed_items (
        type, titulo, titulo_en, contenido, contenido_en, site_id, icono_name, fecha
    ) VALUES (
        'publicacion_sitio',
        NULL,
        NULL,
        'Hoy jueves de salsa en vivo con la orquesta local. ¡No te lo pierdas!',
        'Today Thursday live salsa with the local orchestra. Don''t miss it!',
        's7',
        NULL,
        NOW() - INTERVAL '5 hours'
    );

