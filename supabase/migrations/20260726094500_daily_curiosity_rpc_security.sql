-- Supabase puede conservar grants explícitos definidos por sus privilegios por
-- defecto. La selección del dato es pública; la creación de una notificación
-- personal exige una sesión autenticada.

revoke execute on function public.ensure_daily_curiosity_notification() from anon;
revoke execute on function public.ensure_daily_curiosity_notification() from public;
grant execute on function public.ensure_daily_curiosity_notification() to authenticated;

revoke execute on function public.get_daily_curious_fact() from public;
grant execute on function public.get_daily_curious_fact() to anon, authenticated;
