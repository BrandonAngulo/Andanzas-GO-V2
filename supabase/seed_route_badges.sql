-- SQL script to insert the specific route badges into Supabase

INSERT INTO public.badges (
    id, nombre, nombre_en, descripcion, descripcion_en, icono_name
) VALUES 
    ('badge-salsa', 'La Campana de Oro', 'The Golden Bell', 'Has conectado con el origen sonoro del barrio.', 'You have connected with the sound origin of the neighborhood.', 'Bell'),
    ('badge-food', 'El Chontaduro con Miel', 'The Chontaduro with Honey', 'Probaste la herencia ancestral del Pacífico.', 'You tasted the ancestral heritage of the Pacific.', 'Utensils'),
    ('badge-art', 'Aerosol de Cristal', 'Crystal Spray Can', 'Decodificaste los mensajes de los muros de la ciudad.', 'You decoded the messages on the city walls.', 'Palette'),
    ('badge-lit', 'La Máquina de Escribir', 'The Typewriter', 'Caminaste la Cali de papel y cine.', 'You walked the Cali of paper and cinema.', 'Feather'),
    ('badge-afro', 'La Marimba de Chonta', 'The Chonta Marimba', 'Celebraste la raíz africana de la ciudad.', 'You celebrated the African root of the city.', 'Music'),
    ('badge-arch', 'El Vitral Gótico', 'The Gothic Stained Glass', 'Viajaste de la colonia a la modernidad.', 'You traveled from the colony to modernity.', 'Church'),
    ('badge-eco', 'La Huella del Gato', 'The Cat''s Paw', 'Reconectaste con el eje ambiental del río.', 'You reconnected with the river''s environmental axis.', 'Cat'),
    ('badge-theater', 'Zapatos de Charol', 'Patent Leather Shoes', 'Exploraste los escenarios del espectáculo.', 'You explored the stages of the spectacle.', 'Footprints'),
    ('badge-history', 'El Candado Abierto', 'The Open Padlock', 'Descubriste la historia que no está en los libros.', 'You discovered history not found in books.', 'Unlock'),
    ('badge-sport', 'El Balón Ovalado', 'The Oval Ball', 'Entendiste el deporte como tejido de paz.', 'You understood sport as a fabric of peace.', 'Trophy')
ON CONFLICT (id) DO UPDATE SET 
    nombre = EXCLUDED.nombre,
    nombre_en = EXCLUDED.nombre_en,
    descripcion = EXCLUDED.descripcion,
    descripcion_en = EXCLUDED.descripcion_en,
    icono_name = EXCLUDED.icono_name;
