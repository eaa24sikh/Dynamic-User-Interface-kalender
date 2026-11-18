import { getDayStickers, getEvents, getNotes, getReminders } from "@/lib/supabase/server";
import { formatMonth, getMonthGrid, parseIsoDate, toIsoDate, today } from "@/lib/calendar";
import TopBar from "@/components/calendar/TopBar";
import MonthGrid from "@/components/calendar/MonthGrid";
import DayDetails from "@/components/calendar/DayDetails";
import StickerTray from "@/components/calendar/StickerTray";
import styles from "./page.module.css";

// Månedsoversigten (forsiden). Adressen kan være fx /?dato=2026-11-09
export default async function Home({ searchParams }) {
  const params = await searchParams;

  // Den valgte dag står i adressen. Står der ingen (eller en forkert) dato, bruges i dag.
  let selected = parseIsoDate(params.dato);
  if (!selected) {
    selected = today();
  }
  const selectedIso = toIsoDate(selected);
  const year = selected.getUTCFullYear();

  // Alle dage i kalenderen, også dem fra måneden før og efter
  const grid = getMonthGrid(selected);

  // Hent alt for de dage, der vises i kalenderen
  const events = await getEvents(grid.start, grid.end);
  const notes = await getNotes(grid.start, grid.end);
  const reminders = await getReminders(grid.start, grid.end);
  const stickers = await getDayStickers(grid.start, grid.end);

  // Kortet under kalenderen viser kun det, der sker på den valgte dag
  const eventsOnDay = events.filter((event) => event.date === selectedIso);
  const notesOnDay = notes.filter((note) => note.date === selectedIso);
  const remindersOnDay = reminders.filter((reminder) => reminder.date === selectedIso);

  return (
    <main className={styles.page}>
      <TopBar backHref={`/aar?aar=${year}`} backLabel={year} dateIso={selectedIso} />

      <h1 className={styles.month}>
        <span>{formatMonth(selected)}</span>
      </h1>

      <MonthGrid weeks={grid.weeks} selectedIso={selectedIso} events={events} stickers={stickers} />

      <DayDetails date={selected} events={eventsOnDay} notes={notesOnDay} reminders={remindersOnDay} />

      <StickerTray />
    </main>
  );
}
