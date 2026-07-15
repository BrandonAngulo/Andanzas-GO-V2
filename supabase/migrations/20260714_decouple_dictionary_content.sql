-- Desacopla el CONTENIDO del diccionario del flag de la función (app_features/dictionary_caleno).
-- Objetivo: que las herramientas de la app (auto-enlace en trivia y futuras integraciones)
-- siempre puedan usar el contenido publicado del diccionario, mientras el flag controla solo
-- la VENTANA del Diccionario (panel/menú), gobernada por el frontend (dictionaryVisible).
-- El contenido es cultural y público (las definiciones ya se exponen vía trivia).

-- Entradas: legibles si están publicadas, sin depender del flag.
DROP POLICY IF EXISTS dictionary_entries_anon_read ON public.dictionary_entries;
CREATE POLICY dictionary_entries_anon_read ON public.dictionary_entries
    FOR SELECT TO anon
    USING (status = 'published' AND (publish_at IS NULL OR publish_at <= timezone('utc'::text, now())));

DROP POLICY IF EXISTS dictionary_entries_authenticated_read ON public.dictionary_entries;
CREATE POLICY dictionary_entries_authenticated_read ON public.dictionary_entries
    FOR SELECT TO authenticated
    USING (
        (status = 'published' AND (publish_at IS NULL OR publish_at <= timezone('utc'::text, now())))
        OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()) AND p.role IN ('admin','editor'))
    );

-- Etiquetas de categoría: nombres públicos, sin atar al flag.
DROP POLICY IF EXISTS dictionary_tags_anon_read ON public.dictionary_tags;
CREATE POLICY dictionary_tags_anon_read ON public.dictionary_tags
    FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS dictionary_tags_authenticated_read ON public.dictionary_tags;
CREATE POLICY dictionary_tags_authenticated_read ON public.dictionary_tags
    FOR SELECT TO authenticated USING (true);
