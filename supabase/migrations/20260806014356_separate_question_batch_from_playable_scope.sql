-- `campaign` participates in gameplay filtering and therefore represents a playable
-- collection/scope. Editorial import provenance belongs in a separate field.
alter table public.game_questions
  add column if not exists content_batch text;

comment on column public.game_questions.campaign is
  'Playable collection or geographic scope (for example city_cali or world_general). Never use for an editorial import batch.';

comment on column public.game_questions.content_batch is
  'Optional editorial/import batch identifier. It does not create a player-facing theme or filter.';

create index if not exists idx_game_questions_game_content_batch
  on public.game_questions (game_id, content_batch)
  where content_batch is not null;

-- The Expansion 300 pack is a Cali-focused editorial expansion. Preserve its
-- provenance while making every question feed the Cali territory and the unfiltered
-- general bank instead of appearing as a fifth geographic scale.
update public.game_questions
set content_batch = coalesce(content_batch, 'expansion_300_2026'),
    campaign = 'city_cali',
    updated_at = now()
where campaign = 'expansion_300_2026';
