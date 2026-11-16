"use client";

// "use client" betyder, at komponenten kører i browseren.
// Det skal den, fordi den husker hvilken højtid man har trykket på (useState).

import { useState } from "react";
import Image from "next/image";
import { chooseBackground } from "@/app/indstillinger/actions";
import { THEMES } from "@/lib/settings";
import styles from "./ThemeSettings.module.css";

// Fanen "Temaer" på /indstillinger.
// Tryk på en højtid for at se dens baggrunde. Tryk på en baggrund for at bruge den,
// og tryk på den igen for at fjerne den.
//
//   activeBackground – den baggrund der er valgt nu, eller null
export default function ThemeSettings({ activeBackground }) {
  // Start på den højtid, som den valgte baggrund hører til (ellers Jul)
  let startTheme = THEMES[0].id;
  let activeId = null;
  if (activeBackground) {
    startTheme = activeBackground.theme;
    activeId = activeBackground.id;
  }

  const [themeId, setThemeId] = useState(startTheme);

  // Find højtiden, der er trykket på
  let theme = THEMES[0];
  for (const item of THEMES) {
    if (item.id === themeId) {
      theme = item;
    }
  }

  return (
    <>
      <div className={styles.themes} role="radiogroup" aria-label="Højtid">
        {THEMES.map((item) => {
          const isSelected = item.id === themeId;

          let tileClass = styles.theme;
          if (isSelected) {
            tileClass = `${styles.theme} ${styles.selected}`;
          }

          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={tileClass}
              onClick={() => setThemeId(item.id)}
            >
              <Image src={item.tile} alt={item.name} width={104} height={58} />
            </button>
          );
        })}
      </div>

      {/* Hver baggrund er en lille formular. Et klik sender den til chooseBackground() */}
      <div className={styles.backgrounds}>
        {theme.backgrounds.map((background) => {
          const isActive = background.id === activeId;

          // Er baggrunden allerede valgt, sendes en tom værdi, så den bliver fjernet
          let value = background.id;
          let buttonClass = styles.background;
          if (isActive) {
            value = "";
            buttonClass = `${styles.background} ${styles.active}`;
          }

          return (
            <form key={background.id} action={chooseBackground}>
              <input type="hidden" name="baggrund" value={value} />
              <button type="submit" className={buttonClass} aria-pressed={isActive} aria-label={background.name}>
                <Image src={`/temaer/${background.id}.png`} alt="" width={103} height={224} />
              </button>
            </form>
          );
        })}
      </div>
    </>
  );
}
