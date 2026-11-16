-- For the create page (/opret).
-- Run this after 20261116100000_dag_side.sql.

-- Reminders: alarm on/off and how often it repeats
alter table public.reminders
  add column alarm boolean not null default false,
  add column repeat text not null default 'aldrig'
    check (repeat in ('aldrig', 'dagligt', 'ugentligt', 'maanedligt', 'aarligt'));

-- Notes get a title
alter table public.notes add column title text;

-- Events: reminder before the event (in minutes), invited friends and a sticker
alter table public.events
  add column reminder_minutes integer check (reminder_minutes >= 0),
  add column invitees text,
  add column sticker text
    check (sticker in ('stjerne', 'blomst', 'sol', 'hjerte', 'flag', 'taco'));
