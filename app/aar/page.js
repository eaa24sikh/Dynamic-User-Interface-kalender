import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isoWeek, parseIsoDate, toIsoDate, today } from "@/lib/calendar";
import TopBar from "@/components/calendar/TopBar";
import MonthCard from "@/components/aar/MonthCard";
import Highlights from "@/components/aar/Highlights";
import styles from "./page.module.css";

// How many years are shown below each other
const YEAR_COUNT = 3;

async function getYearData(firstYear, lastYear) {
  const supabase = await createClient();
  const range = (query) => query.gte("date", `${firstYear}-01-01`).lte("date", `${lastYear}-12-31`);

  const [events, reminders, notes] = await Promise.all([
    range(supabase.from("events").select("date, sticker")),
    range(supabase.from("reminders").select("date")),
    range(supabase.from("notes").select("date")),
  ]);

  for (const result of [events, reminders, notes]) {
    if (result.error) console.error(result.error.message);
  }

  return {
    events: events.data ?? [],
    reminders: reminders.data ?? [],
    notes: notes.data ?? [],
  };
}

// The value that appears most often, as { key, count }, or null for an empty list
function mostCommon(keys) {
  const counts = new Map();
  for (const key of keys) counts.set(key, (counts.get(key) ?? 0) + 1);

  let best = null;
  for (const [key, count] of counts) {
    if (!best || count > best.count) best = { key, count };
  }
  return best;
}

function getHighlights(year, events, reminders) {
  const inYear = (item) => item.date.startsWith(`${year}-`);

  // Each event can have one sticker
  const stickerMonths = events
    .filter((event) => inYear(event) && event.sticker)
    .map((event) => Number(event.date.slice(5, 7)) - 1);

  // "Planer" are events and reminders, like on the day page
  const planWeeks = [...events, ...reminders].filter(inYear).map((plan) => isoWeek(parseIsoDate(plan.date)));

  const stickerMonth = mostCommon(stickerMonths);
  const busiestWeek = mostCommon(planWeeks);

  return {
    stickerMonth: stickerMonth && { monthIndex: stickerMonth.key, count: stickerMonth.count },
    busiestWeek: busiestWeek && { week: busiestWeek.key, count: busiestWeek.count },
  };
}

// /aar?aar=2026 – starts with this year without ?aar=
export default async function YearPage({ searchParams }) {
  const { aar } = await searchParams;
  const todayIso = toIsoDate(today());
  const firstYear = /^\d{4}$/.test(aar ?? "") ? Number(aar) : Number(todayIso.slice(0, 4));
  const years = Array.from({ length: YEAR_COUNT }, (_, index) => firstYear + index);

  const { events, reminders, notes } = await getYearData(firstYear, years.at(-1));
  const busyDates = new Set([...events, ...reminders, ...notes].map((item) => item.date));

  return (
    <main className={styles.page}>
      <TopBar backHref="/" dateIso={todayIso} />

      {years.map((year) => (
        <section key={year} className={styles.year} aria-label={String(year)}>
          <h2 className={styles.title}>
            <span>{year}</span>
          </h2>

          <div className={styles.months}>
            {Array.from({ length: 12 }, (_, monthIndex) => (
              <MonthCard
                key={monthIndex}
                year={year}
                monthIndex={monthIndex}
                busyDates={busyDates}
                todayIso={todayIso}
              />
            ))}
          </div>

          <Highlights {...getHighlights(year, events, reminders)} />
        </section>
      ))}

      <Link href="/" className={styles.today}>
        I dag
      </Link>
    </main>
  );
}
