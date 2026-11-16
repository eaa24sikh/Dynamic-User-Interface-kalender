import Link from "next/link";
import { formatLongDate, formatShortWeekday, getWeekStrip, toIsoDate } from "@/lib/calendar";
import styles from "./WeekStrip.module.css";

// tabQuery keeps the open tab when you move to another day, e.g. "&fane=noter"
export default function WeekStrip({ date, tabQuery }) {
  const selectedIso = toIsoDate(date);

  return (
    <nav className={styles.strip}>
      {getWeekStrip(date).map((day) => {
        const isSelected = day.iso === selectedIso;
        return (
          <Link
            key={day.iso}
            href={`/dag?dato=${day.iso}${tabQuery}`}
            scroll={false}
            className={isSelected ? `${styles.day} ${styles.selected}` : styles.day}
            aria-label={formatLongDate(day.date)}
            aria-current={isSelected ? "date" : undefined}
          >
            <span>{formatShortWeekday(day.date)}</span>
            <span className={styles.number}>{day.date.getUTCDate()}</span>
          </Link>
        );
      })}
    </nav>
  );
}
