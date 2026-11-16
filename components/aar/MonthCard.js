import Link from "next/link";
import { formatMonth, formatShortMonth, getMonthGrid, toIsoDate } from "@/lib/calendar";
import styles from "./MonthCard.module.css";

// A small month: one dot per day, coloured when the day has an event, reminder or note.
// busyDates: a Set of "YYYY-MM-DD"
export default function MonthCard({ year, monthIndex, busyDates, todayIso }) {
  const firstDay = new Date(Date.UTC(year, monthIndex, 1));
  const { weeks } = getMonthGrid(firstDay);
  const isCurrent = todayIso.startsWith(toIsoDate(firstDay).slice(0, 7));

  return (
    <Link
      href={`/?dato=${isCurrent ? todayIso : toIsoDate(firstDay)}`}
      className={isCurrent ? `${styles.card} ${styles.current}` : styles.card}
      aria-label={`${formatMonth(firstDay)} ${year}`}
      aria-current={isCurrent ? "date" : undefined}
    >
      <span className={styles.name}>{formatShortMonth(monthIndex)}</span>
      <span className={styles.dots} aria-hidden="true">
        {weeks.flat().map((day) => {
          if (!day.inMonth) return <span key={day.iso} />;
          const isBusy = busyDates.has(day.iso);
          return <span key={day.iso} className={isBusy ? `${styles.dot} ${styles.busy}` : styles.dot} />;
        })}
      </span>
    </Link>
  );
}
