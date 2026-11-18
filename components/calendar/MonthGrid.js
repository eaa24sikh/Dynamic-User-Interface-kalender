import Link from "next/link";
import { WEEKDAY_LABELS, formatLongDate } from "@/lib/calendar";
import styles from "./MonthGrid.module.css";

// Teksten skærmlæseren læser op for en dag, fx
// "tirsdag 17. november, 2 begivenheder: Tandlæge, Fødselsdag"
function dayLabel(date, eventsOnDay) {
  const dateText = formatLongDate(date);

  if (eventsOnDay.length === 0) {
    return dateText;
  }

  const titles = [];
  for (const event of eventsOnDay) {
    titles.push(event.title);
  }

  let countText = "1 begivenhed";
  if (eventsOnDay.length > 1) {
    countText = `${eventsOnDay.length} begivenheder`;
  }

  return `${dateText}, ${countText}: ${titles.join(", ")}`;
}

// Selve kalenderen på månedssiden: ugedagene øverst og en kasse for hver dag.
//
//   weeks       – ugerne fra getMonthGrid() i lib/calendar.js
//   selectedIso – den valgte dag, fx "2026-11-09"
//   events      – begivenhederne fra getEvents() for de dage, der vises
export default function MonthGrid({ weeks, selectedIso, events }) {
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
              const eventsOnDay = events.filter((event) => event.date === day.iso);

              // Grå for dage i måneden før/efter, lyserød ramme for den valgte dag,
              // blå for dage med en begivenhed – ellers hvid
              let dayClass = styles.day;
              if (!day.inMonth) {
                dayClass = `${styles.day} ${styles.outside}`;
              } else if (isSelected) {
                dayClass = `${styles.day} ${styles.selected}`;
              } else if (eventsOnDay.length > 0) {
                dayClass = `${styles.day} ${styles.hasEvent}`;
              }

              return (
                <Link
                  key={day.iso}
                  href={`/dag?dato=${day.iso}`}
                  className={dayClass}
                  aria-label={dayLabel(day.date, eventsOnDay)}
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
