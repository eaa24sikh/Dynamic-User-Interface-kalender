import Link from "next/link";
import { formatMonth, formatShortMonth, getMonthGrid, toIsoDate } from "@/lib/calendar";
import styles from "./MonthCard.module.css";

// En lille måned i årsoversigten med én prik for hver dag.
// Prikken er farvet, hvis dagen har en begivenhed, påmindelse eller note.
//
//   busyDates – liste med de datoer, der har noget, fx ["2026-11-09", …]
//   todayIso  – dagens dato, så den nuværende måned kan fremhæves
export default function MonthCard({ year, monthIndex, busyDates, todayIso }) {
  const firstDay = new Date(Date.UTC(year, monthIndex, 1));
  const firstDayIso = toIsoDate(firstDay);
  const grid = getMonthGrid(firstDay);

  // Er det den måned, vi er i nu? (sammenlign "2026-11" med "2026-11")
  const isCurrent = todayIso.slice(0, 7) === firstDayIso.slice(0, 7);

  // Den nuværende måned åbner på i dag, de andre på den 1.
  let cardClass = styles.card;
  let href = `/?dato=${firstDayIso}`;
  if (isCurrent) {
    cardClass = `${styles.card} ${styles.current}`;
    href = `/?dato=${todayIso}`;
  }

  // Alle dagene i én lang liste (ugerne efter hinanden)
  const days = [];
  for (const week of grid.weeks) {
    for (const day of week) {
      days.push(day);
    }
  }

  return (
    <Link
      href={href}
      className={cardClass}
      aria-label={`${formatMonth(firstDay)} ${year}`}
      aria-current={isCurrent ? "date" : undefined}
    >
      <span className={styles.name}>{formatShortMonth(monthIndex)}</span>
      <span className={styles.dots} aria-hidden="true">
        {days.map((day) => {
          // Dage fra måneden før og efter bliver et tomt felt
          if (!day.inMonth) {
            return <span key={day.iso} />;
          }

          let dotClass = styles.dot;
          if (busyDates.includes(day.iso)) {
            dotClass = `${styles.dot} ${styles.busy}`;
          }
          return <span key={day.iso} className={dotClass} />;
        })}
      </span>
    </Link>
  );
}
