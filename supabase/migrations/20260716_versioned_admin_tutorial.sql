alter table public.profiles
  add column if not exists admin_tutorial_version text,
  add column if not exists admin_tutorial_completed_at timestamptz;

create or replace function public.complete_admin_tutorial(tutorial_version text)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  completed_at timestamptz := now();
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if tutorial_version is null or length(trim(tutorial_version)) < 1 or length(tutorial_version) > 50 then
    raise exception 'Invalid tutorial version';
  end if;

  if not public.is_staff() then
    raise exception 'Staff access required';
  end if;

  update public.profiles
  set admin_tutorial_version = trim(tutorial_version),
      admin_tutorial_completed_at = completed_at
  where id = current_user_id;

  if not found then
    raise exception 'Profile not found';
  end if;

  return completed_at;
end;
$$;

revoke all on function public.complete_admin_tutorial(text) from public;
revoke all on function public.complete_admin_tutorial(text) from anon;
grant execute on function public.complete_admin_tutorial(text) to authenticated;

comment on function public.complete_admin_tutorial(text) is
  'Records the version of the administration tutorial acknowledged by the authenticated staff profile.';
