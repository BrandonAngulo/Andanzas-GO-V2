-- Point every official badge definition to its polished raster illustration.
-- The application also keeps this same mapping locally, so badge artwork is
-- consistent while cached data or a deployment is being refreshed.
UPDATE public.badges
SET image_url = '/images/badges-v2/' || id || '.webp'
WHERE id IN (
    'badge-afro',
    'badge-arch',
    'badge-art',
    'badge-calenologo',
    'badge-eco',
    'badge-food',
    'badge-history',
    'badge-lit',
    'badge-salsa',
    'badge-sport',
    'badge-theater',
    'insignia-fav-1',
    'insignia-fav-2',
    'insignia-fav-3',
    'insignia-review-1',
    'insignia-review-2',
    'insignia-review-3',
    'insignia-route-1',
    'insignia-route-2',
    'insignia-route-3',
    'insignia-route-complete',
    'insignia-route-complete-2',
    'insignia-route-complete-3'
);
