import Image from "next/image";
import Link from "next/link";
import styles from "./TopBar.module.css";

export default function TopBar({ year }) {
  return (
    <nav className={styles.topBar}>
      <Link href="/aar" className={styles.back}>
        <Image src="/icons/chevron-back.svg" alt="" width={27} height={27} />
        <span>{year}</span>
      </Link>

      <div className={styles.actions}>
        <Link href="/indstillinger" className={styles.iconButton} aria-label="Indstillinger">
          <Image src="/icons/settings.svg" alt="" width={28} height={28} />
        </Link>
        <Link href="/opret" className={styles.iconButton} aria-label="Opret ny">
          <Image src="/icons/plus.svg" alt="" width={24} height={24} />
        </Link>
      </div>
    </nav>
  );
}
