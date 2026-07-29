-- AVENTURA: RPC de servidor (mapa, jugar nivel, enviar + desbloqueo).
-- Aplicado en Supabase V3 vía apply_migration: aventura_rpcs + aventura_fix_chapter_map.
-- Todos SECURITY DEFINER; el jugador nunca escribe las tablas directamente.

-- Mapa del capítulo con el estado del usuario (bloqueado/disponible/completado, secuencial).
create or replace function public.get_chapter_map(p_chapter_id uuid)
returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare
  v_uid uuid := auth.uid();
  v_c public.game_chapters%rowtype;
  v_prog public.user_chapter_progress%rowtype;
  v_levels jsonb;
  v_char jsonb;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_c from public.game_chapters where id = p_chapter_id;
  if not found then raise exception 'CHAPTER_NOT_FOUND'; end if;
  if v_c.status <> 'published' and not public.is_staff() then raise exception 'CHAPTER_NOT_PUBLISHED'; end if;

  select * into v_prog from public.user_chapter_progress where user_id = v_uid and chapter_id = p_chapter_id;

  if v_c.reward_character_id is not null then
    select jsonb_build_object('id', ch.id, 'slug', ch.slug, 'name', ch.name,
             'description', ch.description, 'image_url', ch.image_url, 'kind', ch.kind,
             'owned', exists(select 1 from public.user_characters uc where uc.user_id = v_uid and uc.character_id = ch.id))
      into v_char from public.characters ch where ch.id = v_c.reward_character_id;
  end if;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'id', cl.id, 'level_number', cl.level_number, 'title', cl.title,
      'purpose', cl.purpose, 'narrative', cl.narrative,
      'assigned_count', (select count(*) from public.game_chapter_level_questions q where q.chapter_level_id = cl.id),
      'completed', coalesce(lp.completed, false),
      'best_score', coalesce(lp.best_score, 0),
      'available', (cl.level_number = 1 or exists (
          select 1 from public.game_chapter_levels pcl
          join public.user_chapter_level_progress plp on plp.chapter_level_id = pcl.id and plp.user_id = v_uid
          where pcl.chapter_id = cl.chapter_id and pcl.level_number = cl.level_number - 1 and plp.completed))
    ) order by cl.level_number
  ), '[]'::jsonb) into v_levels
  from public.game_chapter_levels cl
  left join public.user_chapter_level_progress lp on lp.chapter_level_id = cl.id and lp.user_id = v_uid
  where cl.chapter_id = p_chapter_id;

  return jsonb_build_object(
    'chapter', jsonb_build_object('id', v_c.id, 'slug', v_c.slug, 'title', v_c.title,
      'subtitle', v_c.subtitle, 'description', v_c.description, 'cover_image_url', v_c.cover_image_url,
      'levels_count', v_c.levels_count, 'questions_per_level', v_c.questions_per_level,
      'unlock_min_levels', v_c.unlock_min_levels, 'unlock_min_correct', v_c.unlock_min_correct,
      'version', v_c.version, 'character', v_char),
    'progress', jsonb_build_object(
      'levels_completed', coalesce(v_prog.levels_completed, 0),
      'unique_correct', coalesce(v_prog.unique_correct, 0),
      'unlocked', coalesce(v_prog.unlocked, false),
      'unlocked_at', v_prog.unlocked_at),
    'levels', v_levels
  );
end $function$;

-- Inicia un nivel: N preguntas del pool asignado (no vistas primero + azar). Acceso secuencial.
create or replace function public.start_chapter_level(p_chapter_level_id uuid)
returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare
  v_uid uuid := auth.uid();
  v_cl public.game_chapter_levels%rowtype;
  v_c public.game_chapters%rowtype;
  v_n int; v_available boolean; v_questions jsonb;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_cl from public.game_chapter_levels where id = p_chapter_level_id;
  if not found then raise exception 'LEVEL_NOT_FOUND'; end if;
  select * into v_c from public.game_chapters where id = v_cl.chapter_id;
  if v_c.status <> 'published' and not public.is_staff() then raise exception 'CHAPTER_NOT_PUBLISHED'; end if;

  v_available := v_cl.level_number = 1 or exists (
    select 1 from public.game_chapter_levels pcl
    join public.user_chapter_level_progress plp on plp.chapter_level_id = pcl.id and plp.user_id = v_uid
    where pcl.chapter_id = v_cl.chapter_id and pcl.level_number = v_cl.level_number - 1 and plp.completed
  );
  if not v_available and not public.is_staff() then raise exception 'LEVEL_LOCKED'; end if;

  v_n := coalesce(v_cl.questions_per_run, v_c.questions_per_level, 5);

  select jsonb_agg(jsonb_build_object(
      'id', q.id, 'question_text', q.question_text, 'question_type', q.question_type,
      'options', q.options, 'category', q.category, 'level', q.level,
      'prompt_image_url', q.prompt_image_url
    ) order by q.rn) into v_questions
  from (
    select gq.*, row_number() over (
      order by (case when exists (
        select 1 from public.user_chapter_correct ucc
        where ucc.user_id = v_uid and ucc.chapter_id = v_c.id and ucc.question_id = gq.id
      ) then 1 else 0 end), random()
    ) rn
    from public.game_chapter_level_questions clq
    join public.game_questions gq on gq.id = clq.question_id
    where clq.chapter_level_id = p_chapter_level_id and gq.status = 'published'
    limit v_n
  ) q;

  if v_questions is null then raise exception 'NO_QUESTIONS'; end if;
  return jsonb_build_object('chapter_level_id', p_chapter_level_id, 'questions_per_run', v_n, 'questions', v_questions);
end $function$;

-- Envía respuestas: califica en servidor, marca progreso, cuenta correctas únicas y
-- evalúa el desbloqueo del personaje una sola vez.
create or replace function public.submit_chapter_level(p_chapter_level_id uuid, p_answers jsonb)
returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare
  v_uid uuid := auth.uid();
  v_cl public.game_chapter_levels%rowtype;
  v_c public.game_chapters%rowtype;
  v_item jsonb; v_qid uuid; v_sel jsonb; v_ca jsonb; v_ok boolean;
  v_correct int := 0; v_total int := 0;
  v_levels_completed int; v_unique_correct int;
  v_was_unlocked boolean; v_unlocked_now boolean := false; v_char jsonb;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_cl from public.game_chapter_levels where id = p_chapter_level_id;
  if not found then raise exception 'LEVEL_NOT_FOUND'; end if;
  select * into v_c from public.game_chapters where id = v_cl.chapter_id;

  for v_item in select * from jsonb_array_elements(coalesce(p_answers, '[]'::jsonb)) loop
    v_qid := (v_item->>'question_id')::uuid;
    if not exists (select 1 from public.game_chapter_level_questions clq
                   where clq.chapter_level_id = p_chapter_level_id and clq.question_id = v_qid) then
      continue;
    end if;
    v_sel := v_item->'selected';
    select correct_answer into v_ca from public.game_questions where id = v_qid;
    v_total := v_total + 1;
    v_ok := case
      when jsonb_typeof(v_ca) = 'string' and v_sel is not null and jsonb_typeof(v_sel) = 'string'
        then lower(btrim(v_ca #>> '{}')) = lower(btrim(v_sel #>> '{}'))
      else v_ca = v_sel
    end;
    if v_ok then
      v_correct := v_correct + 1;
      insert into public.user_chapter_correct (user_id, chapter_id, question_id)
      values (v_uid, v_c.id, v_qid) on conflict do nothing;
    end if;
  end loop;

  insert into public.user_chapter_level_progress (user_id, chapter_level_id, completed, best_score, runs, completed_at, updated_at)
  values (v_uid, p_chapter_level_id, true, v_correct, 1, now(), now())
  on conflict (user_id, chapter_level_id) do update
    set completed = true, best_score = greatest(public.user_chapter_level_progress.best_score, excluded.best_score),
        runs = public.user_chapter_level_progress.runs + 1, completed_at = coalesce(public.user_chapter_level_progress.completed_at, now()),
        updated_at = now();

  select count(*) into v_levels_completed
  from public.user_chapter_level_progress lp
  join public.game_chapter_levels cl on cl.id = lp.chapter_level_id
  where lp.user_id = v_uid and cl.chapter_id = v_c.id and lp.completed;

  select count(*) into v_unique_correct
  from public.user_chapter_correct where user_id = v_uid and chapter_id = v_c.id;

  select coalesce(unlocked, false) into v_was_unlocked
  from public.user_chapter_progress where user_id = v_uid and chapter_id = v_c.id;
  v_was_unlocked := coalesce(v_was_unlocked, false);

  v_unlocked_now := (not v_was_unlocked)
    and v_levels_completed >= v_c.unlock_min_levels
    and v_unique_correct >= v_c.unlock_min_correct;

  insert into public.user_chapter_progress (user_id, chapter_id, levels_completed, unique_correct, unlocked, unlocked_at, version, updated_at)
  values (v_uid, v_c.id, v_levels_completed, v_unique_correct, v_was_unlocked or v_unlocked_now,
          case when v_unlocked_now then now() else null end, v_c.version, now())
  on conflict (user_id, chapter_id) do update
    set levels_completed = excluded.levels_completed,
        unique_correct = excluded.unique_correct,
        unlocked = public.user_chapter_progress.unlocked or v_unlocked_now,
        unlocked_at = coalesce(public.user_chapter_progress.unlocked_at, case when v_unlocked_now then now() else null end),
        version = v_c.version, updated_at = now();

  if v_unlocked_now and v_c.reward_character_id is not null then
    insert into public.user_characters (user_id, character_id, source)
    values (v_uid, v_c.reward_character_id, 'chapter:' || v_c.id) on conflict do nothing;
    select jsonb_build_object('id', ch.id, 'slug', ch.slug, 'name', ch.name, 'image_url', ch.image_url)
      into v_char from public.characters ch where ch.id = v_c.reward_character_id;
  end if;

  return jsonb_build_object(
    'correct', v_correct, 'total', v_total,
    'levels_completed', v_levels_completed, 'unique_correct', v_unique_correct,
    'unlock_min_levels', v_c.unlock_min_levels, 'unlock_min_correct', v_c.unlock_min_correct,
    'unlocked_now', v_unlocked_now, 'character', v_char
  );
end $function$;
