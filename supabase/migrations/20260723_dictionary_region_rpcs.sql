-- Diccionario de jergas y culturas — Paso 2: RPC con filtro por capítulo/región.
--
-- Extiende search_dictionary_cards y get_dictionary_facets para navegar la jerarquía
-- geográfica creada en 20260723_dictionary_geographic_hierarchy.sql.
--
-- El filtro por región es RECURSIVO sobre parent_id: filtrar por 'colombia' (capítulo)
-- devuelve todo lo de Valle del Cauca y Cali; filtrar por 'cali' devuelve solo Cali.
--
-- Nota: ambas funciones se DROPean antes de recrearse. Añadir un parámetro o cambiar el
-- RETURNS TABLE no es un reemplazo in-place: crearía una sobrecarga y las llamadas
-- existentes quedarían ambiguas.

drop function if exists public.search_dictionary_cards(text, text, text, text, integer, integer);
drop function if exists public.get_dictionary_facets();

-- 1) Búsqueda de tarjetas, ahora con p_region_slug y la lista de regiones de cada entrada.
create function public.search_dictionary_cards(
    p_query           text    default null,
    p_letter          text    default null,
    p_tag             text    default null,
    p_temporal_status text    default null,
    p_limit           integer default 48,
    p_offset          integer default 0,
    p_region_slug     text    default null
)
returns table(
    id uuid, term text, slug text, variants text[], word_class text,
    short_definition text, full_definition text, usage_example text, usage_context text,
    geographic_scope text[], social_register text[], temporal_status text,
    etymology text, notes text, image_url text, audio_url text, is_featured boolean,
    first_letter text, tags jsonb, regions jsonb, total_count bigint
)
language sql
stable
set search_path to 'public'
as $function$
  with recursive region_scope as (
    -- Raíz: la región pedida. Si no se pide ninguna, no devuelve filas (el filtro se omite).
    select r.id
    from public.dictionary_regions r
    where p_region_slug is not null and btrim(p_region_slug) <> '' and r.slug = btrim(p_region_slug)
    union all
    -- Descendientes: departamentos y ciudades que cuelgan del capítulo.
    select child.id
    from public.dictionary_regions child
    join region_scope s on child.parent_id = s.id
  ),
  filtered as (
    select
      e.*,
      public.dictionary_initial(e.term) as first_letter,
      coalesce(
        jsonb_agg(
          distinct jsonb_build_object('key', t.key, 'label', t.label)
        ) filter (where t.id is not null),
        '[]'::jsonb
      ) as tags
    from public.dictionary_entries e
    left join public.dictionary_entry_tags et on et.entry_id = e.id
    left join public.dictionary_tags t on t.id = et.tag_id
    where
      (
        p_query is null or btrim(p_query) = '' or
        lower(e.term) like '%' || lower(btrim(p_query)) || '%' or
        lower(e.slug) like '%' || lower(btrim(p_query)) || '%' or
        exists (
          select 1 from unnest(e.variants) variant
          where lower(variant) like '%' || lower(btrim(p_query)) || '%'
        ) or
        lower(coalesce(e.short_definition,'')) like '%' || lower(btrim(p_query)) || '%' or
        lower(coalesce(e.full_definition,'')) like '%' || lower(btrim(p_query)) || '%'
      )
      and (
        p_letter is null or btrim(p_letter) = '' or
        public.dictionary_initial(e.term) = public.dictionary_initial(btrim(p_letter))
      )
      and (p_temporal_status is null or btrim(p_temporal_status) = '' or e.temporal_status = btrim(p_temporal_status))
      and (
        p_tag is null or btrim(p_tag) = '' or
        exists (
          select 1
          from public.dictionary_entry_tags et2
          join public.dictionary_tags t2 on t2.id = et2.tag_id
          where et2.entry_id = e.id and t2.key = btrim(p_tag)
        )
      )
      and (
        p_region_slug is null or btrim(p_region_slug) = '' or
        exists (
          select 1
          from public.dictionary_entry_regions der
          where der.entry_id = e.id and der.region_id in (select region_scope.id from region_scope)
        )
      )
    group by e.id
  ),
  counted as (
    select filtered.*, count(*) over() as total_count
    from filtered
  )
  select
    c.id, c.term, c.slug, c.variants, c.word_class,
    c.short_definition, c.full_definition, c.usage_example, c.usage_context,
    c.geographic_scope, c.social_register, c.temporal_status,
    c.etymology, c.notes, c.image_url, c.audio_url, c.is_featured,
    c.first_letter, c.tags,
    coalesce((
      select jsonb_agg(
               jsonb_build_object(
                 'slug', r.slug, 'name', r.name, 'level', r.level,
                 'is_primary', der.is_primary, 'scope_note', der.scope_note
               )
               order by der.is_primary desc, r.level
             )
      from public.dictionary_entry_regions der
      join public.dictionary_regions r on r.id = der.region_id
      where der.entry_id = c.id
    ), '[]'::jsonb) as regions,
    c.total_count
  from counted c
  order by c.is_featured desc, lower(c.term), c.term
  limit greatest(1, least(coalesce(p_limit,48),100))
  offset greatest(coalesce(p_offset,0),0);
$function$;

-- 2) Facetas. Las de letra/categoría/vigencia se recalculan DENTRO del capítulo activo;
--    'regions' devuelve el árbol completo (plano, con parent_slug) para pintar el selector.
create function public.get_dictionary_facets(p_region_slug text default null)
returns jsonb
language sql
stable
set search_path to 'public'
as $function$
  with recursive region_scope as (
    select r.id
    from public.dictionary_regions r
    where p_region_slug is not null and btrim(p_region_slug) <> '' and r.slug = btrim(p_region_slug)
    union all
    select child.id
    from public.dictionary_regions child
    join region_scope s on child.parent_id = s.id
  ),
  -- Cada región mapeada a sí misma y a todos sus ancestros, para contar subárboles.
  region_paths as (
    select r.id as region_id, r.id as ancestor_id
    from public.dictionary_regions r
    union all
    select rp.region_id, parent.id
    from region_paths rp
    join public.dictionary_regions child  on child.id = rp.ancestor_id
    join public.dictionary_regions parent on parent.id = child.parent_id
  ),
  region_counts as (
    select rp.ancestor_id as region_id, count(distinct der.entry_id)::int as entry_count
    from region_paths rp
    join public.dictionary_entry_regions der on der.region_id = rp.region_id
    group by rp.ancestor_id
  ),
  scoped as (
    select e.*
    from public.dictionary_entries e
    where
      p_region_slug is null or btrim(p_region_slug) = '' or
      exists (
        select 1 from public.dictionary_entry_regions der
        where der.entry_id = e.id and der.region_id in (select region_scope.id from region_scope)
      )
  )
  select jsonb_build_object(
    'letters',
      coalesce((
        select jsonb_agg(x.letter order by x.sort_order, x.letter)
        from (
          select distinct
            public.dictionary_initial(term) as letter,
            case public.dictionary_initial(term)
              when 'Ñ' then 'NZ'
              else public.dictionary_initial(term)
            end as sort_order
          from scoped
        ) x
      ), '[]'::jsonb),
    'tags',
      coalesce((
        select jsonb_agg(
          jsonb_build_object('key', t.key, 'label', t.label, 'count', counts.entry_count)
          order by lower(t.label)
        )
        from public.dictionary_tags t
        join (
          select et.tag_id, count(*)::int as entry_count
          from public.dictionary_entry_tags et
          join scoped e on e.id = et.entry_id
          group by et.tag_id
        ) counts on counts.tag_id = t.id
      ), '[]'::jsonb),
    'temporal_statuses',
      coalesce((
        select jsonb_agg(
          jsonb_build_object('key', temporal_status, 'count', entry_count)
          order by temporal_status
        )
        from (
          select temporal_status, count(*)::int as entry_count
          from scoped
          group by temporal_status
        ) s
      ), '[]'::jsonb),
    'regions',
      coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'slug', r.slug,
            'name', r.name,
            'level', r.level,
            'parent_slug', parent.slug,
            'emoji_flag', r.emoji_flag,
            'cover_url', r.cover_url,
            'count', coalesce(rc.entry_count, 0)
          )
          order by r.sort_order, r.name
        )
        from public.dictionary_regions r
        left join public.dictionary_regions parent on parent.id = r.parent_id
        left join region_counts rc on rc.region_id = r.id
      ), '[]'::jsonb),
    'featured_count', (select count(*)::int from scoped where is_featured),
    'total_entries',  (select count(*)::int from scoped)
  );
$function$;
