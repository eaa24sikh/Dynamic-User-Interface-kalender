import Image from "next/image";
import Link from "next/link";
import { formatLongDate, formatTime, toIsoDate } from "@/lib/calendar";
import styles from "./DayDetails.module.css";

export default function DayDetails({ date, events, notes, reminders }) {
  const isEmpty = events.length === 0 && notes.length === 0 && reminders.length === 0;

  return (
    <Link href={`/dag/${toIsoDate(date)}`} className={styles.card}>
      <div className={styles.tape} aria-hidden="true" />

      <h2 className={styles.date}>{formatLongDate(date)}</h2>

      {reminders.map((reminder) => (
        <p key={reminder.id} className={styles.reminder}>
          Husk: {reminder.title}
          {reminder.time && ` kl ${formatTime(reminder.time)}`}
        </p>
      ))}

      {events.length > 0 && (
        <ul className={styles.events}>
          {events.map((event) => (
            <li key={event.id} className={styles.event}>
              <Image src="/icons/reminder-dot.svg" alt="" width={9.215} height={8.485} />
              <span>
                {event.start_time && `${formatTime(event.start_time)} - `}
                {event.title}
              </span>
            </li>
          ))}
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
