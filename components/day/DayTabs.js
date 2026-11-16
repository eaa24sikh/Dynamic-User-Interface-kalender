import Link from "next/link";
import styles from "./DayTabs.module.css";

// tabs: [{ id, label, count }]
export default function DayTabs({ dateIso, tabs, activeTab }) {
  return (
    <nav className={styles.tabs}>
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={`/dag?dato=${dateIso}&fane=${tab.id}`}
          scroll={false}
          className={tab.id === activeTab ? `${styles.tab} ${styles.active}` : styles.tab}
          aria-current={tab.id === activeTab ? "page" : undefined}
        >
          {tab.label} {tab.count}
        </Link>
      ))}
    </nav>
  );
}
