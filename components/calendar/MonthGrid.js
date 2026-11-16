import Link from "next/link";
import { WEEKDAY_LABELS, formatLongDate } from "@/lib/calendar";
import styles from "./MonthGrid.module.css";

// Selve kalenderen på månedssiden: ugedagene øverst og en kasse for hver dag.
//
//   weeks       – ugerne fra getMonthGrid() i lib/calendar.js
//   selectedIso – den valgte dag, fx "2026-11-09"
//   eventDates  – liste med de datoer, der har mindst én begivenhed
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
              const isSelected = day.iso === selectedIso;

              // Grå for dage i måneden før/efter, lyserød ramme for den valgte dag,
              // blå for dage med en begivenhed – ellers hvid
              let dayClass = styles.day;
              if (!day.inMonth) {
                dayClass = `${styles.day} ${styles.outside}`;
              } else if (isSelected) {
                dayClass = `${styles.day} ${styles.selected}`;
              } else if (eventDates.includes(day.iso)) {
                dayClass = `${styles.day} ${styles.hasEvent}`;
              }

              return (
                <Link
                  key={day.iso}
                  href={`/dag?dato=${day.iso}`}
                  className={dayClass}
                  aria-label={formatLongDate(day.date)}
                  aria-current={isSelected ? "date" : undefined}
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
