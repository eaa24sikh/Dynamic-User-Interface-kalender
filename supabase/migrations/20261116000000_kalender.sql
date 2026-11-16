-- All tables for the calendar. Run this once in the SQL Editor in Supabase.
-- There is no login: everyone using the app shares the same data.

create table public.events (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text not null,
  start_time time,
  end_time time,
  location text,
  description text,
  reminder_minutes integer check (reminder_minutes >= 0),
  invitees text,
  sticker text check (sticker in ('stjerne', 'blomst', 'sol', 'hjerte', 'flag', 'taco')),
  created_at timestamptz not null default now()
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text,
  content text not null,
  created_at timestamptz not null default now()
);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text not null,
  time time,
  alarm boolean not null default false,
  repeat text not null default 'aldrig'
    check (repeat in ('aldrig', 'dagligt', 'ugentligt', 'maanedligt', 'aarligt')),
  created_at timestamptz not null default now()
);

-- A photo from the day. event_id links it to the event it was taken at.
-- The file itself is in the Storage bucket "minder".
create table public.memories (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  event_id uuid references public.events on delete set null,
  image_path text not null,
  taken_at timestamptz,
  created_at timestamptz not null default now()
);

create index events_date_idx on public.events (date);
create index notes_date_idx on public.notes (date);
create index reminders_date_idx on public.reminders (date);
create index memories_date_idx on public.memories (date);

-- Supabase blocks tables without Row Level Security from the API,
-- so it is turned on with policies that let anyone read and write.
alter table public.events enable row level security;
alter table public.notes enable row level security;
alter table public.reminders enable row level security;
alter table public.memories enable row level security;

create policy "Everyone can use events" on public.events
  for all to anon, authenticated using (true) with check (true);

create policy "Everyone can use notes" on public.notes
  for all to anon, authenticated using (true) with check (true);

create policy "Everyone can use reminders" on public.reminders
  for all to anon, authenticated using (true) with check (true);

create policy "Everyone can use memories" on public.memories
  for all to anon, authenticated using (true) with check (true);

-- Storage for the photos
insert into storage.buckets (id, name, public)
values ('minder', 'minder', false);

create policy "Everyone can use photos" on storage.objects
  for all to anon, authenticated
  using (bucket_id = 'minder')
  with check (bucket_id = 'minder');
