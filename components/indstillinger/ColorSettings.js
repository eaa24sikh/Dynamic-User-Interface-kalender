import Image from "next/image";
import { chooseColorScheme } from "@/app/indstillinger/actions";
import { COLOR_SCHEMES } from "@/lib/settings";
import styles from "./ColorSettings.module.css";

// Two weeks of a small calendar. It uses the same colours as the app,
// so it changes when you pick another colour scheme.
const PREVIEW_WEEKS = [
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
];
const PREVIEW_EVENTS = [4, 13];
const PREVIEW_SELECTED = 9;

function previewClass(day) {
  if (day === PREVIEW_SELECTED) return `${styles.previewDay} ${styles.previewSelected}`;
  if (PREVIEW_EVENTS.includes(day)) return `${styles.previewDay} ${styles.previewEvent}`;
  return styles.previewDay;
}

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
            {week.map((day) => (
              <span key={day} className={previewClass(day)}>
                {day}
              </span>
            ))}
          </div>
        ))}
      </section>

      <h2 className={styles.heading}>Vælg farver til hele appen</h2>

      <div className={styles.options}>
        {COLOR_SCHEMES.map((scheme) => (
          <form key={scheme.id} action={chooseColorScheme} className={styles.option}>
            <input type="hidden" name="farve" value={scheme.id} />
            <button
              type="submit"
              className={scheme.id === activeId ? `${styles.choice} ${styles.active}` : styles.choice}
              aria-pressed={scheme.id === activeId}
            >
              <Image src={scheme.preview} alt="" width={81} height={74} />
              <span className={styles.text}>
                <span className={styles.name}>{scheme.name}</span>
                <span className={styles.description}>{scheme.description}</span>
              </span>
            </button>
          </form>
        ))}
      </div>
    </>
  );
}
