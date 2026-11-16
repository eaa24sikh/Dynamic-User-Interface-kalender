import styles from "./Toggle.module.css";

// En tænd/sluk-knap. Det er en almindelig checkbox, der er stylet som en kontakt.
// Læg den inde i et <label> sammen med teksten, eller giv den en label.
export default function Toggle({ name, defaultChecked, label }) {
  return (
    <span className={styles.toggle}>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} aria-label={label} />
      <span className={styles.track} aria-hidden="true" />
    </span>
  );
}
