import styles from "./Toggle.module.css";

// An on/off switch. Put it inside a <label> with the text, or give it a label.
export default function Toggle({ name, defaultChecked = false, label }) {
  return (
    <span className={styles.toggle}>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} aria-label={label} />
      <span className={styles.track} aria-hidden="true" />
    </span>
  );
}
