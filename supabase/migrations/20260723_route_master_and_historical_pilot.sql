-- Master structure for scalable, measurable cultural routes.
-- The existing routes.gamificacion JSON remains available during the transition.

alter table public.routes
  add column if not exists narrative_question_en text,
  add column if not exists intro_text_en text,
  add column if not exists closing_text_en text;

alter table public.route_stops
  add column if not exists site_id text references public.sites(id) on delete restrict,
  add column if not exists chapter_index integer not null default 1,
  add column if not exists narrative_beat text,
  add column if not exists accessibility jsonb not null default '{}'::jsonb,
  add column if not exists safety_info jsonb not null default '{}'::jsonb,
  add column if not exists media jsonb not null default '{}'::jsonb,
  add column if not exists content_status text not null default 'draft';

alter table public.route_stops
  drop constraint if exists route_stops_chapter_index_check,
  add constraint route_stops_chapter_index_check check (chapter_index > 0),
  drop constraint if exists route_stops_content_status_check,
  add constraint route_stops_content_status_check
    check (content_status in ('draft', 'review', 'published', 'archived'));

create unique index if not exists route_stops_route_site_unique
  on public.route_stops(route_id, site_id)
  where site_id is not null;

create index if not exists route_stops_route_order_idx
  on public.route_stops(route_id, order_index);

alter table public.route_challenges
  add column if not exists route_stop_id uuid references public.route_stops(id) on delete cascade,
  add column if not exists challenge_key text,
  add column if not exists order_index integer not null default 0,
  add column if not exists instruction text,
  add column if not exists completed_message text,
  add column if not exists connection_story text,
  add column if not exists interaction_data jsonb not null default '{}'::jsonb,
  add column if not exists alternatives jsonb not null default '{}'::jsonb,
  add column if not exists learning_goal text,
  add column if not exists content_source text;

create unique index if not exists route_challenges_route_key_unique
  on public.route_challenges(route_id, challenge_key)
  where challenge_key is not null;

create index if not exists route_challenges_route_stop_idx
  on public.route_challenges(route_stop_id, order_index);

update public.routes
set
  gamification_level = 'full',
  completion_status = 'fully_playable',
  narrative_question = '¿Qué huellas de la ciudad colonial siguen vivas en la Cali que recorremos hoy?',
  narrative_question_en = 'Which traces of the colonial city remain alive in the Cali we walk through today?',
  intro_text = 'Eres cronista de una ciudad construida por capas. En cada parada reunirás una huella para reconstruir su memoria.',
  intro_text_en = 'You are the chronicler of a city built in layers. At every stop you will collect a clue to reconstruct its memory.',
  closing_text = 'La respuesta no estaba en un solo edificio: vive en las plazas, los oficios, los caminos y las personas que siguen dándole significado al centro de Cali. Has reconstruido el primer capítulo de tu Archivo de Andanzas.',
  closing_text_en = 'The answer was not contained in a single building: it lives in the squares, trades, paths and people who still give meaning to downtown Cali. You have reconstructed the first chapter of your Andanzas Archive.',
  points_reward = greatest(coalesce(points_reward, 0), 200)
where id = 'ruta2';

insert into public.route_stops (
  route_id,
  site_id,
  title,
  description,
  order_index,
  latitude,
  longitude,
  instruction_text,
  story_text,
  required_for_completion,
  estimated_minutes,
  chapter_index,
  narrative_beat,
  content_status
)
select
  r.id,
  point.site_id,
  s.nombre,
  s.descripcion,
  point.ordinality::integer - 1,
  s.lat,
  s.lng,
  coalesce(challenge.item->>'instruction', 'Observa el lugar y completa la misión de esta parada.'),
  challenge.item->>'connection_story',
  true,
  greatest(15, round(r.duracion_min::numeric / greatest(cardinality(r.puntos), 1))::integer),
  case when point.ordinality <= 2 then 1 when point.ordinality <= 4 then 2 else 3 end,
  case
    when point.ordinality <= 2 then 'Reconocer el origen'
    when point.ordinality <= 4 then 'Leer las transformaciones'
    else 'Conectar pasado y presente'
  end,
  'published'
from public.routes r
cross join lateral unnest(r.puntos) with ordinality as point(site_id, ordinality)
join public.sites s on s.id = point.site_id
cross join lateral jsonb_array_elements(r.gamificacion) with ordinality as challenge(item, ordinality)
where r.id = 'ruta2'
  and challenge.ordinality = point.ordinality
on conflict (route_id, site_id) where site_id is not null
do update set
  title = excluded.title,
  description = excluded.description,
  order_index = excluded.order_index,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  instruction_text = excluded.instruction_text,
  story_text = excluded.story_text,
  estimated_minutes = excluded.estimated_minutes,
  chapter_index = excluded.chapter_index,
  narrative_beat = excluded.narrative_beat,
  content_status = excluded.content_status,
  updated_at = timezone('utc', now());

insert into public.route_challenges (
  route_id,
  stop_id,
  route_stop_id,
  challenge_key,
  order_index,
  challenge_type,
  prompt,
  instruction,
  options,
  correct_answer,
  explanation,
  completed_message,
  connection_story,
  interaction_data,
  alternatives,
  points_reward,
  required,
  status
)
select
  r.id,
  stop.site_id,
  stop.id,
  challenge.item->>'id',
  challenge.ordinality::integer - 1,
  challenge.item->>'type',
  coalesce(
    challenge.item#>>'{quiz_data,question}',
    challenge.item#>>'{manual_trivia_data,question}',
    challenge.item->>'instruction'
  ),
  challenge.item->>'instruction',
  coalesce(
    challenge.item#>'{quiz_data,options}',
    challenge.item#>'{manual_trivia_data,options}'
  ),
  coalesce(
    challenge.item#>>'{quiz_data,correct_answer}',
    challenge.item#>>'{manual_trivia_data,correct_answer}'
  ),
  challenge.item#>>'{quiz_data,fun_fact}',
  challenge.item->>'completed_message',
  challenge.item->>'connection_story',
  challenge.item,
  case
    when coalesce((challenge.item->>'allow_manual_trivia')::boolean, false)
      then jsonb_build_object('manual_trivia', challenge.item->'manual_trivia_data')
    else '{}'::jsonb
  end,
  coalesce((challenge.item->>'points_reward')::integer, 10),
  true,
  'published'
from public.routes r
cross join lateral jsonb_array_elements(r.gamificacion) with ordinality as challenge(item, ordinality)
join public.route_stops stop
  on stop.route_id = r.id
 and stop.order_index = challenge.ordinality::integer - 1
where r.id = 'ruta2'
on conflict (route_id, challenge_key) where challenge_key is not null
do update set
  stop_id = excluded.stop_id,
  route_stop_id = excluded.route_stop_id,
  order_index = excluded.order_index,
  challenge_type = excluded.challenge_type,
  prompt = excluded.prompt,
  instruction = excluded.instruction,
  options = excluded.options,
  correct_answer = excluded.correct_answer,
  explanation = excluded.explanation,
  completed_message = excluded.completed_message,
  connection_story = excluded.connection_story,
  interaction_data = excluded.interaction_data,
  alternatives = excluded.alternatives,
  points_reward = excluded.points_reward,
  required = excluded.required,
  status = excluded.status,
  updated_at = timezone('utc', now());
