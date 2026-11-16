import Link from "next/link";
import { WEEKDAY_LABELS, formatLongDate } from "@/lib/calendar";
import styles from "./MonthGrid.module.css";

// eventDates: a Set of "YYYY-MM-DD" with at least one event
export default function MonthGrid({ weeks, selectedIso, eventDates }) {
  return (
    <div>
      <div className={styles.weekdays}>
        {WEEKDAY_LABELS.map((label) => (
          <p key={label}>{label}</p>
        ))}
      </div>

      <div className={styles.grid}>
        {weeks.map((week) => (
          <div key={week[0].iso} className={styles.week}>
            {week.map((day) => {
              const classNames = [styles.day];
              if (!day.inMonth) classNames.push(styles.outside);
              else if (day.iso === selectedIso) classNames.push(styles.selected);
              else if (eventDates.has(day.iso)) classNames.push(styles.hasEvent);

              return (
                <Link
                  key={day.iso}
                  href={`/?dato=${day.iso}`}
                  scroll={false}
                  className={classNames.join(" ")}
                  aria-label={formatLongDate(day.date)}
                  aria-current={day.iso === selectedIso ? "date" : undefined}
                >
                  {day.date.getUTCDate()}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
