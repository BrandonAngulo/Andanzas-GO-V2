-- Reglas de desbloqueo de banners de perfil: ÚNICA FUENTE DE VERDAD en el propio banner.
-- Antes las condiciones estaban hardcodeadas en PerfilPanel (array `rules`), separadas del
-- texto que muestra cada banner → divergían (p.ej. 'Capilla San Antonio' existía sin regla y
-- nunca se desbloqueaba). Ahora cada banner de perfil lleva su `unlock_rule` estructurada y un
-- RPC evalúa esa regla contra las métricas del usuario. Agregar/editar banners ya no toca código.

alter table public.app_banners add column if not exists unlock_rule jsonb;

-- Regla = { "metric": <clave>, "gte": <umbral> }. 'manual' = no se auto-desbloquea (sin métrica).
update public.app_banners set unlock_rule = '{"metric":"reviews","gte":1}'::jsonb          where key='profile_banner_banner_bulevar_rio';
update public.app_banners set unlock_rule = '{"metric":"saved_routes","gte":1}'::jsonb      where key='profile_banner_banner_la_ermita';
update public.app_banners set unlock_rule = '{"metric":"level","gte":3}'::jsonb             where key='profile_banner_banner_tres_cruces';
update public.app_banners set unlock_rule = '{"metric":"routes_completed","gte":1}'::jsonb  where key='profile_banner_banner_torre_cali';
update public.app_banners set unlock_rule = '{"metric":"badges","gte":5}'::jsonb            where key='profile_banner_banner_bulevar_oriente';
update public.app_banners set unlock_rule = '{"metric":"manual"}'::jsonb                    where key='profile_banner_banner_san_antonio';

-- Evalúa las reglas contra las métricas (que el cliente ya calcula) y persiste los desbloqueos.
-- Devuelve la lista completa y los nuevos (para el modal de premio). p_stats:
--   { reviews, saved_routes, level, routes_completed, badges }
create or replace function public.sync_profile_banner_unlocks(p_stats jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_current text[];
  v_new jsonb := '[]'::jsonb;
  r record;
  v_id text; v_metric text; v_gte numeric; v_val numeric;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  select coalesce(unlocked_banners, '{}') into v_current from public.profiles where id = v_uid;

  for r in
    select key, title_es, subtitle_es, unlock_rule
    from public.app_banners
    where scope = 'profile' and is_active and unlock_rule is not null
    order by key
  loop
    v_metric := r.unlock_rule->>'metric';
    if v_metric is null or v_metric in ('manual','none') then continue; end if;
    v_gte := coalesce((r.unlock_rule->>'gte')::numeric, 1);
    v_val := coalesce((p_stats->>v_metric)::numeric, 0);
    v_id := replace(r.key, 'profile_banner_', '');  -- el cliente guarda el id corto
    if v_val >= v_gte and not (v_id = any(v_current)) then
      v_current := array_append(v_current, v_id);
      v_new := v_new || jsonb_build_object('id', v_id, 'name', r.title_es, 'description', coalesce(r.subtitle_es, ''));
    end if;
  end loop;

  if jsonb_array_length(v_new) > 0 then
    update public.profiles set unlocked_banners = v_current where id = v_uid;
  end if;
  return jsonb_build_object('unlocked_banners', to_jsonb(v_current), 'newly_unlocked', v_new);
end $$;

grant execute on function public.sync_profile_banner_unlocks(jsonb) to authenticated;
