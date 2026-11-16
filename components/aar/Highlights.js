import Image from "next/image";
import { formatMonthName } from "@/lib/calendar";
import styles from "./Highlights.module.css";

// stickerMonth: { monthIndex, count } or null
// busiestWeek: { week, count } or null
export default function Highlights({ stickerMonth, busiestWeek }) {
  return (
    <section className={styles.card}>
      <h3 className={styles.title}>Årets højdepunkter</h3>

      <p className={styles.row}>
        <span className={styles.label}>
          <Image src="/icons/aar/hjerte.svg" alt="" width={16.4571} height={16.487} />
          {stickerMonth ? `Flest stickers i ${formatMonthName(stickerMonth.monthIndex)}` : "Ingen stickers endnu"}
        </span>
        {stickerMonth && <span className={styles.value}>{stickerMonth.count}</span>}
      </p>

      <p className={styles.row}>
        <span className={styles.label}>
          <Image src="/icons/sticker-day.svg" alt="" width={18} height={17} />
          {busiestWeek ? `Travelste uge: ${busiestWeek.week}` : "Ingen planer endnu"}
        </span>
        {busiestWeek && (
          <span className={styles.value}>
            {busiestWeek.count} {busiestWeek.count === 1 ? "plan" : "planer"}
          </span>
        )}
      </p>
    </section>
  );
}
