import Image from "next/image";
import Link from "next/link";
import styles from "./TopBar.module.css";

// Without backLabel the back button is a small square with only the arrow
export default function TopBar({ backHref, backLabel }) {
  return (
    <nav className={backLabel ? styles.topBar : `${styles.topBar} ${styles.compact}`}>
      <Link href={backHref} className={styles.back} aria-label={backLabel ? undefined : "Tilbage"}>
        <Image src="/icons/chevron-back.svg" alt="" width={27} height={27} />
        {backLabel && <span>{backLabel}</span>}
      </Link>

      <div className={styles.actions}>
        <Link href="/indstillinger" className={styles.iconButton} aria-label="Indstillinger">
          <Image src="/icons/settings.svg" alt="" width={28} height={28} />
        </Link>
        <Link href={`/opret?dato=${dateIso}`} className={styles.iconButton} aria-label="Opret ny">
          <Image src="/icons/plus.svg" alt="" width={24} height={24} />
        </Link>
      </div>
    </nav>
  );
}
