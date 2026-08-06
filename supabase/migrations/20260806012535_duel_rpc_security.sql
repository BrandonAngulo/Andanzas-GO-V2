-- Duel RPCs require a signed-in player. The functions already validate auth.uid(),
-- but removing anonymous execution also closes the public API surface explicitly.
revoke all on function public.create_duel(uuid, integer) from public, anon;
grant execute on function public.create_duel(uuid, integer) to authenticated;

revoke all on function public.get_duel_play(uuid) from public, anon;
grant execute on function public.get_duel_play(uuid) to authenticated;

revoke all on function public.get_duel_review(uuid) from public, anon;
grant execute on function public.get_duel_review(uuid) to authenticated;

revoke all on function public.cancel_duel(uuid) from public, anon;
grant execute on function public.cancel_duel(uuid) to authenticated;
