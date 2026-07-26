-- Sustituye cuatro referencias de imagen rotas por recursos versionados con la app.
-- Así las paradas mantienen imagen tanto fuera como dentro del recorrido.
UPDATE public.sites
SET logo_url = CASE id
  WHEN 's20' THEN '/routes/ruta_naturaleza.jpg'
  WHEN 's30' THEN '/routes/ruta_naturaleza.jpg'
  WHEN 's65' THEN '/images/banners/banner_tres_cruces.png'
  WHEN 's5' THEN '/images/imperdibles/banner_ruta_colonial.png'
  ELSE logo_url
END
WHERE id IN ('s20', 's30', 's65', 's5');
