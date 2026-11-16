import Link from "next/link";
import { getEvents, getNotes, getReminders, getStickers } from "@/lib/supabase/server";
import { isoWeek, parseIsoDate, toIsoDate, today } from "@/lib/calendar";
import TopBar from "@/components/calendar/TopBar";
import MonthCard from "@/components/aar/MonthCard";
import Highlights from "@/components/aar/Highlights";
import styles from "./page.module.css";

// Hvor mange år der vises under hinanden
const YEAR_COUNT = 3;

// Månederne 0 (januar) til 11 (december)
const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

// Finder den værdi, der står flest gange i listen.
// Giver { value, count } – eller null, hvis listen er tom.
function mostCommon(values) {
  // Tæl hvor mange gange hver værdi står i listen
  const counts = {};
  for (const value of values) {
    if (counts[value]) {
      counts[value] = counts[value] + 1;
    } else {
      counts[value] = 1;
    }
  }

  // Find den værdi, der blev talt flest gange
  let best = null;
  for (const value of values) {
    if (best === null || counts[value] > best.count) {
      best = { value: value, count: counts[value] };
    }
  }
  return best;
}

// Regner "Årets højdepunkter" ud for ét år
function getHighlights(year, events, reminders, stickers) {
  const yearStart = `${year}-`;

  // Måneden for hver sticker (0 = januar)
  const stickerMonths = [];
  for (const sticker of stickers) {
    if (sticker.date.startsWith(yearStart)) {
      stickerMonths.push(Number(sticker.date.slice(5, 7)) - 1);
    }
  }

  // Ugenummeret for hver plan. Planer er begivenheder og påmindelser, ligesom på dagssiden.
  const planWeeks = [];
  for (const plan of events.concat(reminders)) {
    if (plan.date.startsWith(yearStart)) {
      planWeeks.push(isoWeek(parseIsoDate(plan.date)));
    }
  }

  let stickerMonth = null;
  const mostStickers = mostCommon(stickerMonths);
  if (mostStickers) {
    stickerMonth = { monthIndex: mostStickers.value, count: mostStickers.count };
  }

  let busiestWeek = null;
  const mostPlans = mostCommon(planWeeks);
  if (mostPlans) {
    busiestWeek = { week: mostPlans.value, count: mostPlans.count };
  }

  return { stickerMonth: stickerMonth, busiestWeek: busiestWeek };
}

// Årsoversigten. Adressen kan være fx /aar?aar=2026 (i år, hvis den mangler)
export default async function YearPage({ searchParams }) {
  const params = await searchParams;
  const todayIso = toIsoDate(today());

  // Det første år der vises
  let firstYear = Number(todayIso.slice(0, 4));
  const chosenYear = Number(params.aar);
  if (Number.isInteger(chosenYear) && chosenYear >= 1000 && chosenYear <= 9999) {
    firstYear = chosenYear;
  }

  const years = [];
  for (let i = 0; i < YEAR_COUNT; i++) {
    years.push(firstYear + i);
  }
  const lastYear = years[years.length - 1];

  // Hent alt fra 1. januar i det første år til 31. december i det sidste
  const fromDate = `${firstYear}-01-01`;
  const toDate = `${lastYear}-12-31`;
  const events = await getEvents(fromDate, toDate);
  const reminders = await getReminders(fromDate, toDate);
  const notes = await getNotes(fromDate, toDate);
  const stickers = await getStickers(fromDate, toDate);

  // Alle dage der har en begivenhed, påmindelse eller note – de får en farvet prik
  const busyDates = [];
  for (const item of events.concat(reminders, notes)) {
    busyDates.push(item.date);
  }

  return (
    <main className={styles.page}>
      <TopBar backHref="/" dateIso={todayIso} />

      {years.map((year) => (
        <section key={year} className={styles.year} aria-label={String(year)}>
          <h2 className={styles.title}>
            <span>{year}</span>
          </h2>

          <div className={styles.months}>
            {MONTHS.map((monthIndex) => (
              <MonthCard
                key={monthIndex}
                year={year}
                monthIndex={monthIndex}
                busyDates={busyDates}
                todayIso={todayIso}
              />
            ))}
          </div>

          <Highlights highlights={getHighlights(year, events, reminders, stickers)} />
        </section>
      ))}

      <Link href="/" className={styles.today}>
        I dag
      </Link>
    </main>
  );
}
