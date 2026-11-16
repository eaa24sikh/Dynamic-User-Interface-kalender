import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { BACKGROUND_COOKIE, COLOR_COOKIE, getBackground, getColorScheme } from "@/lib/settings";
import ColorSettings from "@/components/indstillinger/ColorSettings";
import ThemeSettings from "@/components/indstillinger/ThemeSettings";
import GeneralSettings from "@/components/indstillinger/GeneralSettings";
import styles from "./page.module.css";

const TABS = [
  { id: "farver", label: "Farver" },
  { id: "temaer", label: "Temaer" },
  { id: "generelt", label: "Generelt" },
];

// /indstillinger?fane=temaer – opens on "Farver" without ?fane=
export default async function SettingsPage({ searchParams }) {
  const { fane } = await searchParams;
  const activeTab = TABS.some((tab) => tab.id === fane) ? fane : "farver";

  const cookieStore = await cookies();
  const colorScheme = getColorScheme(cookieStore.get(COLOR_COOKIE)?.value);
  const background = getBackground(cookieStore.get(BACKGROUND_COOKIE)?.value);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back} aria-label="Tilbage til kalenderen">
          <Image src="/icons/chevron-back.svg" alt="" width={27} height={27} />
        </Link>
        <h1 className={styles.title}>
          <span>Indstillinger</span>
        </h1>
      </header>

      <nav className={styles.tabs}>
        {TABS.map((tab) => (
          <Link
            key={tab.id}
            href={`/indstillinger?fane=${tab.id}`}
            scroll={false}
            className={tab.id === activeTab ? `${styles.tab} ${styles.activeTab}` : styles.tab}
            aria-current={tab.id === activeTab ? "page" : undefined}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {activeTab === "farver" && <ColorSettings activeId={colorScheme.id} />}
      {activeTab === "temaer" && <ThemeSettings activeBackground={background} />}
      {activeTab === "generelt" && <GeneralSettings />}
    </main>
  );
}
