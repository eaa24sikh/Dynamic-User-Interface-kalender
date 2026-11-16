"use client";

import { useState } from "react";
import Image from "next/image";
import { chooseBackground } from "@/app/indstillinger/actions";
import { THEMES } from "@/lib/settings";
import styles from "./ThemeSettings.module.css";

// Pick a holiday to see its backgrounds. Picking a background saves it
// and shows it behind every page. Pick it again to remove it.
export default function ThemeSettings({ activeBackground }) {
  const [themeId, setThemeId] = useState(activeBackground?.theme ?? THEMES[0].id);
  const theme = THEMES.find((item) => item.id === themeId);

  return (
    <>
      <div className={styles.themes} role="radiogroup" aria-label="Højtid">
        {THEMES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={item.id === themeId}
            className={item.id === themeId ? `${styles.theme} ${styles.selected}` : styles.theme}
            onClick={() => setThemeId(item.id)}
          >
            <Image src={item.tile} alt={item.name} width={104} height={58} />
          </button>
        ))}
      </div>

      <div className={styles.backgrounds}>
        {theme.backgrounds.map((background) => {
          const isActive = background.id === activeBackground?.id;
          return (
            <form key={background.id} action={chooseBackground}>
              <input type="hidden" name="baggrund" value={isActive ? "" : background.id} />
              <button
                type="submit"
                className={isActive ? `${styles.background} ${styles.active}` : styles.background}
                aria-pressed={isActive}
                aria-label={background.name}
              >
                <Image src={`/temaer/${background.id}.png`} alt="" width={103} height={224} />
              </button>
            </form>
          );
        })}
      </div>
    </>
  );
}
