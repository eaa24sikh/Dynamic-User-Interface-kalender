import styles from "./Icon.module.css";

// Et ikon i én farve, der følger det valgte farvetema.
// SVG-filen bruges som en "maske" (en stencil), og farven males igennem den.
// Derfor er det ligegyldigt, hvilken farve SVG-filen selv har.
//
//   src    – stien til SVG-filen, fx "/icons/opret/bell.svg"
//   color  – farven (lilla, hvis den ikke er sat)
export default function Icon({ src, width, height, color, className }) {
  let iconColor = "var(--reminder-tekst)";
  if (color) {
    iconColor = color;
  }

  let iconClass = styles.icon;
  if (className) {
    iconClass = `${styles.icon} ${className}`;
  }

  return (
    <span
      aria-hidden="true"
      className={iconClass}
      style={{
        width: width,
        height: height,
        backgroundColor: iconColor,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
      }}
    />
  );
}
