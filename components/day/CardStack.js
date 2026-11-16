import Link from "next/link";
import styles from "./CardStack.module.css";

// A card with a second, tilted card behind it.
// more: { href, label } for the button under the card, or null
export default function CardStack({ children, more, centered = false }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.stack}>
        <div className={styles.behind} aria-hidden="true" />
        <div className={centered ? `${styles.card} ${styles.centered}` : styles.card}>{children}</div>
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
