import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { BACKGROUND_COOKIE, COLOR_COOKIE, getBackground, getColorScheme, readCookie } from "@/lib/settings";
import ColorSettings from "@/components/indstillinger/ColorSettings";
import ThemeSettings from "@/components/indstillinger/ThemeSettings";
import GeneralSettings from "@/components/indstillinger/GeneralSettings";
import styles from "./page.module.css";

const TABS = [
  { id: "farver", label: "Farver" },
  { id: "temaer", label: "Temaer" },
  { id: "generelt", label: "Generelt" },
];

// Indstillingssiden. Adressen kan være fx /indstillinger?fane=temaer
// Uden ?fane= åbner den på "Farver".
export default async function SettingsPage({ searchParams }) {
  const params = await searchParams;

  let activeTab = "farver";
  if (params.fane === "temaer" || params.fane === "generelt") {
    activeTab = params.fane;
  }

  // Det brugeren allerede har valgt (gemt i cookies)
  const cookieStore = await cookies();
  const colorScheme = getColorScheme(readCookie(cookieStore, COLOR_COOKIE));
  const background = getBackground(readCookie(cookieStore, BACKGROUND_COOKIE));

  // Indholdet under fanerne
  let content;
  if (activeTab === "farver") {
    content = <ColorSettings activeId={colorScheme.id} />;
  } else if (activeTab === "temaer") {
    content = <ThemeSettings activeBackground={background} />;
  } else {
    content = <GeneralSettings />;
  }

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
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;

          let className = styles.tab;
          if (isActive) {
            className = `${styles.tab} ${styles.activeTab}`;
          }

          return (
            <Link
              key={tab.id}
              href={`/indstillinger?fane=${tab.id}`}
              scroll={false}
              className={className}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {content}
    </main>
  );
}
