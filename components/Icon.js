import styles from "./Icon.module.css";

// A one-colour SVG drawn in a CSS colour, so it follows the chosen colour scheme.
// The SVG is used as a mask, which means its own colour doesn't matter.
export default function Icon({ src, width, height, color = "var(--reminder-tekst)", className }) {
  return (
    <span
      aria-hidden="true"
      className={className ? `${styles.icon} ${className}` : styles.icon}
      style={{
        width,
        height,
        backgroundColor: color,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
      }}
    />
  );
}
