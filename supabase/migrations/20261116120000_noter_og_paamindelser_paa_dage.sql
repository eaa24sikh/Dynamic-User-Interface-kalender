-- Tilpasser jeres tabeller til appen.
-- Kør hele filen i SQL Editor i Supabase. Den kan køres flere gange uden fejl.


-- 1. PÅMINDELSER OG NOTER PÅ EN DAG
-- I jeres database hører påmindelser og noter altid til en begivenhed (event_id).
-- Appen kan også lave en påmindelse eller note direkte på en dag.
-- Derfor får de en dato og en kalender, og event_id bliver valgfri.

alter table public.reminders
  alter column event_id drop not null,
  alter column remind_at drop not null,
  alter column notification_type drop not null,
  add column if not exists calendar_id uuid references public.calendars on delete cascade,
  add column if not exists date date,
  add column if not exists title text,
  add column if not exists time time,
  add column if not exists alarm boolean not null default false,
  add column if not exists repeat text not null default 'aldrig';

alter table public.event_notes
  alter column event_id drop not null,
  add column if not exists calendar_id uuid references public.calendars on delete cascade,
  add column if not exists date date;


-- 2. ÉN FÆLLES KALENDER UDEN SUPABASE-LOGIN
-- Appen logger ikke ind i Supabase, så kalenderen hører ikke til en bruger.
alter table public.calendars alter column user_id drop not null;


-- 3. SIKKERHEDSREGLER (RLS)
-- Appen må læse og skrive i tabellerne uden at være logget ind i Supabase.
-- Jeres egne regler bliver ikke slettet – disse kommer bare oveni.

-- Regler fra en tidligere version af denne fil
drop policy if exists "Brugere styrer påmindelser i egen kalender" on public.reminders;
drop policy if exists "Brugere styrer noter i egen kalender" on public.event_notes;

drop policy if exists "Appen må bruge calendars" on public.calendars;
create policy "Appen må bruge calendars" on public.calendars
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "Appen må bruge events" on public.events;
create policy "Appen må bruge events" on public.events
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "Appen må bruge reminders" on public.reminders;
create policy "Appen må bruge reminders" on public.reminders
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "Appen må bruge event_notes" on public.event_notes;
create policy "Appen må bruge event_notes" on public.event_notes
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "Appen må bruge day_stickers" on public.day_stickers;
create policy "Appen må bruge day_stickers" on public.day_stickers
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "Appen må bruge event_images" on public.event_images;
create policy "Appen må bruge event_images" on public.event_images
  for all to anon, authenticated using (true) with check (true);

-- Billederne i Storage-mappen "event-images" må vises
drop policy if exists "Appen må se billeder" on storage.objects;
create policy "Appen må se billeder" on storage.objects
  for select to anon, authenticated using (bucket_id = 'event-images');
