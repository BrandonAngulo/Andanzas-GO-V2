-- Keep route rewards obtainable and align their editorial data with the current
-- Andanzas GO achievement system.
UPDATE public.routes
SET reward_badge_id = CASE id
    WHEN 'ruta2' THEN 'badge-arch'
    WHEN 'ruta4' THEN 'badge-eco'
    ELSE reward_badge_id
END
WHERE id IN ('ruta2', 'ruta4');

UPDATE public.badges
SET
    nombre = CASE id
        WHEN 'badge-arch' THEN 'El Vitral Gótico'
        WHEN 'badge-eco' THEN 'Huella Verde'
        WHEN 'badge-lit' THEN 'La Máquina de Escribir'
        WHEN 'badge-sport' THEN 'El Balón Ovalado'
        ELSE nombre
    END,
    descripcion = CASE id
        WHEN 'badge-afro' THEN 'Celebraste la raíz africana de la ciudad.'
        WHEN 'badge-eco' THEN 'Reconectaste con la biodiversidad y los corredores verdes de la ciudad.'
        WHEN 'badge-food' THEN 'Probaste la herencia ancestral del Pacífico.'
        WHEN 'badge-history' THEN 'Descubriste la historia que no está en los libros.'
        WHEN 'badge-theater' THEN 'Exploraste los escenarios del espectáculo.'
        ELSE descripcion
    END,
    icono_name = CASE WHEN id = 'badge-eco' THEN 'Leaf' ELSE icono_name END
WHERE id IN (
    'badge-afro',
    'badge-arch',
    'badge-eco',
    'badge-food',
    'badge-history',
    'badge-lit',
    'badge-sport',
    'badge-theater'
);
