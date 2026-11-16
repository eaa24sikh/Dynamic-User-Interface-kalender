import Link from "next/link";
import styles from "./CardStack.module.css";

// Kortet på dagssiden med et skævt kort bag ved.
//
//   children – det der står på kortet
//   more     – { href, label } til knappen under kortet, eller null for ingen knap
//   centered – true hvis indholdet skal stå i midten af kortet
export default function CardStack({ children, more, centered }) {
  let cardClass = styles.card;
  if (centered) {
    cardClass = `${styles.card} ${styles.centered}`;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.stack}>
        <div className={styles.behind} aria-hidden="true" />
        <div className={cardClass}>{children}</div>
      </div>

      {more && (
        <div className={styles.moreRow}>
          <Link href={more.href} scroll={false} className={styles.more}>
            {more.label}
          </Link>
        </div>
      )}
    </div>
  );
}
