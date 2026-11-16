import Image from "next/image";
import { formatMonthName } from "@/lib/calendar";
import styles from "./Highlights.module.css";

// Boksen "Årets højdepunkter" i årsoversigten.
//
//   highlights.stickerMonth – { monthIndex, count } eller null
//   highlights.busiestWeek  – { week, count } eller null
//   (de regnes ud i getHighlights() i app/aar/page.js)
export default function Highlights({ highlights }) {
  const stickerMonth = highlights.stickerMonth;
  const busiestWeek = highlights.busiestWeek;

  let stickerText = "Ingen stickers endnu";
  let stickerValue = "";
  if (stickerMonth) {
    stickerText = `Flest stickers i ${formatMonthName(stickerMonth.monthIndex)}`;
    stickerValue = stickerMonth.count;
  }

  let weekText = "Ingen planer endnu";
  let weekValue = "";
  if (busiestWeek) {
    weekText = `Travelste uge: ${busiestWeek.week}`;
    if (busiestWeek.count === 1) {
      weekValue = "1 plan";
    } else {
      weekValue = `${busiestWeek.count} planer`;
    }
  }

  return (
    <section className={styles.card}>
      <h3 className={styles.title}>Årets højdepunkter</h3>

      <p className={styles.row}>
        <span className={styles.label}>
          <Image src="/icons/aar/hjerte.svg" alt="" width={16.4571} height={16.487} />
          {stickerText}
        </span>
        <span className={styles.value}>{stickerValue}</span>
      </p>

      <p className={styles.row}>
        <span className={styles.label}>
          <Image src="/icons/sticker-day.svg" alt="" width={18} height={17} />
          {weekText}
        </span>
        <span className={styles.value}>{weekValue}</span>
      </p>
    </section>
  );
}
