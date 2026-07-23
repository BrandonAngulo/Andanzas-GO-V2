-- Keep public reads independent from staff-only helper functions.
-- Staff retain a separate authenticated policy to preview unpublished content.

drop policy if exists "Public Read Published Routes" on public.routes;
create policy "Public Read Published Routes"
  on public.routes for select
  using (status = 'published');

drop policy if exists "Staff Read All Routes" on public.routes;
create policy "Staff Read All Routes"
  on public.routes for select
  to authenticated
  using (public.is_staff());

drop policy if exists "Public Read Published Sites" on public.sites;
create policy "Public Read Published Sites"
  on public.sites for select
  using (status = 'published');

drop policy if exists "Staff Read All Sites" on public.sites;
create policy "Staff Read All Sites"
  on public.sites for select
  to authenticated
  using (public.is_staff());

drop policy if exists "Public Read Published Events" on public.events;
create policy "Public Read Published Events"
  on public.events for select
  using (status = 'published');

drop policy if exists "Staff Read All Events" on public.events;
create policy "Staff Read All Events"
  on public.events for select
  to authenticated
  using (public.is_staff());

drop policy if exists "Public Read Published Feed Items" on public.feed_items;
create policy "Public Read Published Feed Items"
  on public.feed_items for select
  using (status = 'published');

drop policy if exists "Staff Read All Feed Items" on public.feed_items;
create policy "Staff Read All Feed Items"
  on public.feed_items for select
  to authenticated
  using (public.is_staff());

drop policy if exists "Public Read Published Curiosidades" on public.learn_entries;

drop policy if exists "Staff Read All Curiosidades" on public.learn_entries;
create policy "Staff Read All Curiosidades"
  on public.learn_entries for select
  to authenticated
  using (public.is_staff());

drop policy if exists "Public Read Stops of Published Routes" on public.route_stops;
create policy "Public Read Stops of Published Routes"
  on public.route_stops for select
  using (
    exists (
      select 1
      from public.routes r
      where r.id = route_stops.route_id
        and r.status = 'published'
    )
  );

drop policy if exists "Staff Read All Route Stops" on public.route_stops;
create policy "Staff Read All Route Stops"
  on public.route_stops for select
  to authenticated
  using (public.is_staff());
