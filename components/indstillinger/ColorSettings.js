import Image from "next/image";
import { chooseColorScheme } from "@/app/indstillinger/actions";
import { COLOR_SCHEMES } from "@/lib/settings";
import styles from "./ColorSettings.module.css";

// En lille kalender med to uger, som viser hvordan appen ser ud.
// Den bruger de samme farver som resten af appen, så den skifter med det samme.
const PREVIEW_WEEKS = [
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
];
const PREVIEW_EVENTS = [4, 13];
const PREVIEW_SELECTED = 9;

// Fanen "Farver" på /indstillinger.
//
//   activeId – det farvetema der er valgt nu, fx "natur"
export default function ColorSettings({ activeId }) {
  return (
    <>
      <section className={styles.preview} aria-label="Forhåndsvisning">
        <div className={styles.previewHeader}>
          <p className={styles.previewMonth}>November</p>
          <p className={styles.previewHint}>Sådan ser appen ud</p>
        </div>
        {PREVIEW_WEEKS.map((week) => (
          <div key={week[0]} className={styles.previewWeek}>
            {week.map((day) => {
              // Den valgte dag er lyserød, dage med begivenheder er blå
              let dayClass = styles.previewDay;
              if (day === PREVIEW_SELECTED) {
                dayClass = `${styles.previewDay} ${styles.previewSelected}`;
              } else if (PREVIEW_EVENTS.includes(day)) {
                dayClass = `${styles.previewDay} ${styles.previewEvent}`;
              }

              return (
                <span key={day} className={dayClass}>
                  {day}
                </span>
              );
            })}
          </div>
        ))}
      </section>

      <h2 className={styles.heading}>Vælg farver til hele appen</h2>

      {/* Hvert farvetema er en lille formular. Et klik sender det til chooseColorScheme() */}
      <div className={styles.options}>
        {COLOR_SCHEMES.map((scheme) => {
          const isActive = scheme.id === activeId;

          let buttonClass = styles.choice;
          if (isActive) {
            buttonClass = `${styles.choice} ${styles.active}`;
          }

          return (
            <form key={scheme.id} action={chooseColorScheme} className={styles.option}>
              <input type="hidden" name="farve" value={scheme.id} />
              <button type="submit" className={buttonClass} aria-pressed={isActive}>
                <Image src={scheme.preview} alt="" width={81} height={74} />
                <span className={styles.text}>
                  <span className={styles.name}>{scheme.name}</span>
                  <span className={styles.description}>{scheme.description}</span>
                </span>
              </button>
            </form>
          );
        })}
      </div>
    </>
  );
}
