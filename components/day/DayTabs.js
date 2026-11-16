import Link from "next/link";
import styles from "./DayTabs.module.css";

// Fanerne på dagssiden: "Planer 1", "Noter 1", "Minder 1".
//
//   tabs – liste med { id, label, count }, fx { id: "noter", label: "Noter", count: 1 }
export default function DayTabs({ dateIso, tabs, activeTab }) {
  return (
    <nav className={styles.tabs}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        let tabClass = styles.tab;
        if (isActive) {
          tabClass = `${styles.tab} ${styles.active}`;
        }

        return (
          <Link
            key={tab.id}
            href={`/dag?dato=${dateIso}&fane=${tab.id}`}
            scroll={false}
            className={tabClass}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label} {tab.count}
          </Link>
        );
      })}
    </nav>
  );
}
