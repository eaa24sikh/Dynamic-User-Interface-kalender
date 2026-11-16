import Link from "next/link";
import Icon from "@/components/Icon";
import { formatLongDate, formatTime, toIsoDate } from "@/lib/calendar";
import styles from "./DayDetails.module.css";

// Kortet under kalenderen på månedssiden. Det viser den valgte dags
// påmindelser, begivenheder og noter, og et klik åbner dagssiden.
export default function DayDetails({ date, events, notes, reminders }) {
  const isEmpty = events.length === 0 && notes.length === 0 && reminders.length === 0;

  return (
    <Link href={`/dag?dato=${toIsoDate(date)}`} className={styles.card}>
      <div className={styles.tape} aria-hidden="true" />

      <h2 className={styles.date}>{formatLongDate(date)}</h2>

      {/* Påmindelser, fx "Husk: aflever rapport kl 12:00" */}
      {reminders.map((reminder) => {
        let text = `Husk: ${reminder.title}`;
        if (reminder.time) {
          text = `${text} kl ${formatTime(reminder.time)}`;
        }
        return (
          <p key={reminder.id} className={styles.reminder}>
            {text}
          </p>
        );
      })}

      {/* Begivenheder, fx "14:00 - Café med Lærke og Ditte" */}
      {events.length > 0 && (
        <ul className={styles.events}>
          {events.map((event) => {
            let text = event.title;
            if (event.start_time) {
              text = `${formatTime(event.start_time)} - ${event.title}`;
            }
            return (
              <li key={event.id} className={styles.event}>
                <Icon src="/icons/reminder-dot.svg" width={9.215} height={8.485} color="var(--prik-ud-fra-reminder)" />
                <span>{text}</span>
              </li>
            );
          })}
        </ul>
      )}

      {notes.map((note) => (
        <p key={note.id} className={styles.note}>
          {note.content}
        </p>
      ))}

      {isEmpty && <p className={styles.note}>Ingen begivenheder, noter eller påmindelser</p>}
    </Link>
  );
}
