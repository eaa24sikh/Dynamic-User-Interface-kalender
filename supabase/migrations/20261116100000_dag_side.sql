-- For the day page: where an event is, and photos ("minder").
-- Run this after 20261116000000_kalender.sql.

alter table public.events add column location text;

-- A photo from the day. event_id links it to the event it was taken at.
-- The file itself is in the private Storage bucket "minder",
-- in a folder named after the user: <user_id>/<file name>
create table public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  date date not null,
  event_id uuid references public.events on delete set null,
  image_path text not null,
  taken_at timestamptz,
  created_at timestamptz not null default now()
);

create index memories_user_date_idx on public.memories (user_id, date);

alter table public.memories enable row level security;

create policy "Users manage their own memories" on public.memories
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Storage: a private bucket where each user only has access to their own folder
insert into storage.buckets (id, name, public)
values ('minder', 'minder', false);

create policy "Users manage their own photos" on storage.objects
  for all to authenticated
  using (bucket_id = 'minder' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'minder' and (storage.foldername(name))[1] = (select auth.uid())::text);
