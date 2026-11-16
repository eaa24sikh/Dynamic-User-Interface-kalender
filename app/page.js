import { createClient } from "@/lib/supabase/server";
import { formatMonth, getMonthGrid, parseIsoDate, toIsoDate, today } from "@/lib/calendar";
import TopBar from "@/components/calendar/TopBar";
import MonthGrid from "@/components/calendar/MonthGrid";
import DayDetails from "@/components/calendar/DayDetails";
import StickerTray from "@/components/calendar/StickerTray";
import styles from "./page.module.css";

// Fetches events, notes and reminders for every day shown in the grid.
// Row Level Security makes sure each user only gets their own rows.
async function getCalendarData(start, end) {
  const supabase = await createClient();

  const [events, notes, reminders] = await Promise.all([
    supabase
      .from("events")
      .select("id, date, title, start_time")
      .gte("date", start)
      .lte("date", end)
      .order("start_time", { nullsFirst: true }),
    supabase
      .from("notes")
      .select("id, date, content")
      .gte("date", start)
      .lte("date", end)
      .order("created_at"),
    supabase
      .from("reminders")
      .select("id, date, title, time")
      .gte("date", start)
      .lte("date", end)
      .order("time", { nullsFirst: true }),
  ]);

  for (const result of [events, notes, reminders]) {
    if (result.error) console.error(result.error.message);
  }

  return {
    events: events.data ?? [],
    notes: notes.data ?? [],
    reminders: reminders.data ?? [],
  };
}

export default async function Home({ searchParams }) {
  const { dato } = await searchParams;
  const selected = parseIsoDate(dato) ?? today();
  const selectedIso = toIsoDate(selected);

  const { weeks, start, end } = getMonthGrid(selected);
  const { events, notes, reminders } = await getCalendarData(start, end);

  const onSelectedDay = (item) => item.date === selectedIso;

  return (
    <main className={styles.page}>
      <TopBar year={selected.getUTCFullYear()} />

      <h1 className={styles.month}>
        <span>{formatMonth(selected)}</span>
      </h1>

      <MonthGrid
        weeks={weeks}
        selectedIso={selectedIso}
        eventDates={new Set(events.map((event) => event.date))}
      />

      <DayDetails
        date={selected}
        events={events.filter(onSelectedDay)}
        notes={notes.filter(onSelectedDay)}
        reminders={reminders.filter(onSelectedDay)}
      />

      <StickerTray />
    </main>
  );
}
