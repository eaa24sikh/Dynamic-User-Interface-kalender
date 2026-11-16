import Icon from "@/components/Icon";
import Toggle from "@/components/Toggle";
import styles from "./GeneralSettings.module.css";

// Shows what could be on this page. Nothing here is saved or changes the app.
function Chevron() {
  return (
    <Icon
      src="/icons/indstillinger/chevron.svg"
      width={18}
      height={18}
      color="var(--reminder-dato)"
      className={styles.chevron}
    />
  );
}

export default function GeneralSettings() {
  return (
    <div className={styles.general}>
      <h2 className={styles.sectionTitle}>Kalender</h2>
      <div className={styles.list}>
        <div className={styles.row}>
          <span className={styles.label}>
            <Icon src="/icons/indstillinger/calendar.svg" width={21} height={21} />
            Ugen starter
          </span>
          <span className={styles.value}>
            Vælg dag
            <Chevron />
          </span>
        </div>
        <div className={styles.row}>
          <span className={`${styles.label} ${styles.wideGap}`}>
            <span className={styles.gridIcon} aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            Startvisning
          </span>
          <span className={styles.value}>
            Måned
            <Chevron />
          </span>
        </div>
        <div className={styles.row}>
          <span className={`${styles.label} ${styles.wideGap}`}>
            <Icon src="/icons/opret/bell.svg" width={18} height={18} />
            Standardpåmindelse
          </span>
          <span className={styles.value}>
            1 time før
            <Chevron />
          </span>
        </div>
      </div>

      <h2 className={`${styles.sectionTitle} ${styles.small}`}>Notifikationer</h2>
      <div className={styles.list}>
        <label className={styles.row}>
          <span className={`${styles.label} ${styles.wideGap}`}>
            <Icon src="/icons/indstillinger/notif.svg" width={18} height={18} />
            Notifikationer
          </span>
          <Toggle defaultChecked />
        </label>
      </div>

      <h2 className={`${styles.sectionTitle} ${styles.small} ${styles.account}`}>Konto</h2>
      <div className={styles.list}>
        <label className={styles.row}>
          <span className={styles.label}>
            <span className={styles.cloud}>
              <Icon src="/icons/indstillinger/cloud.svg" width={21.988} height={16.015} />
            </span>
            Synkronisér med iCloud
          </span>
          <Toggle defaultChecked />
        </label>
        <div className={styles.row}>
          <span className={styles.label}>
            <Icon src="/icons/indstillinger/info.svg" width={20} height={20} />
            Om appen
          </span>
          <Chevron />
        </div>
      </div>
    </div>
  );
}
