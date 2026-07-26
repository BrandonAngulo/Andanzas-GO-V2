-- Los RPC de notificaciones operan exclusivamente con el usuario autenticado y
-- las políticas RLS existentes; no necesitan privilegios de propietario.

alter function public.get_word_of_the_day() security invoker;
alter function public.create_user_notification(text,text,text,text,text,text,text,text,text,jsonb) security invoker;
alter function public.ensure_daily_notification() security invoker;
alter function public.ensure_app_notifications() security invoker;

revoke all on function public.get_word_of_the_day() from public, anon;
revoke all on function public.create_user_notification(text,text,text,text,text,text,text,text,text,jsonb) from public, anon;
revoke all on function public.ensure_daily_notification() from public, anon;
revoke all on function public.ensure_app_notifications() from public, anon;

grant execute on function public.get_word_of_the_day() to authenticated;
grant execute on function public.create_user_notification(text,text,text,text,text,text,text,text,text,jsonb) to authenticated;
grant execute on function public.ensure_daily_notification() to authenticated;
grant execute on function public.ensure_app_notifications() to authenticated;
