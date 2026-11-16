import Link from "next/link";
import { formatLongDate, formatShortWeekday, getWeekStrip, toIsoDate } from "@/lib/calendar";
import styles from "./WeekStrip.module.css";

// Ugebåndet øverst på dagssiden: den valgte dag med tre dage på hver side.
//
//   tabQuery – den åbne fane, fx "&fane=noter", så den bliver åben, når man skifter dag
export default function WeekStrip({ date, tabQuery }) {
  const selectedIso = toIsoDate(date);
  const days = getWeekStrip(date);

  return (
    <nav className={styles.strip}>
      {days.map((day) => {
        const isSelected = day.iso === selectedIso;

        let dayClass = styles.day;
        if (isSelected) {
          dayClass = `${styles.day} ${styles.selected}`;
        }

        return (
          <Link
            key={day.iso}
            href={`/dag?dato=${day.iso}${tabQuery}`}
            scroll={false}
            className={dayClass}
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
