-- Tables for the calendar: events, notes and reminders.
-- Run this in the SQL Editor in Supabase (or with `supabase db push`).
-- Every row belongs to a user, and Row Level Security only lets
-- users see and change their own rows.

create table public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  date date not null,
  title text not null,
  start_time time,
  end_time time,
  description text,
  created_at timestamptz not null default now()
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  date date not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  date date not null,
  title text not null,
  time time,
  created_at timestamptz not null default now()
);

create index events_user_date_idx on public.events (user_id, date);
create index notes_user_date_idx on public.notes (user_id, date);
create index reminders_user_date_idx on public.reminders (user_id, date);

alter table public.events enable row level security;
alter table public.notes enable row level security;
alter table public.reminders enable row level security;

create policy "Users manage their own events" on public.events
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users manage their own notes" on public.notes
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users manage their own reminders" on public.reminders
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
