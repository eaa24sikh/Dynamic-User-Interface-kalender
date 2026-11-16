import Image from "next/image";
import Link from "next/link";
import styles from "./TopBar.module.css";

// Knapperne øverst på siden: tilbage-pil, indstillinger og plus.
//
//   backHref  – hvor tilbage-pilen går hen
//   backLabel – tekst ved pilen, fx "2026". Uden tekst bliver knappen en lille firkant.
//   dateIso   – den dag, plus-knappen opretter noget på
export default function TopBar({ backHref, backLabel, dateIso }) {
  // Uden tekst får knappen et navn til skærmlæsere, fordi man kun ser pilen
  let barClass = styles.topBar;
  let backName = undefined;
  if (!backLabel) {
    barClass = `${styles.topBar} ${styles.compact}`;
    backName = "Tilbage";
  }

  return (
    <nav className={barClass}>
      <Link href={backHref} className={styles.back} aria-label={backName}>
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
