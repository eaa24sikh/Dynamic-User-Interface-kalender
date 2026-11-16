import Image from "next/image";
import styles from "./StickerTray.module.css";

// Stickerne i bjælken. left og top placerer ikonet i sin kasse, præcis som i Figma.
const STICKERS = [
  { name: "stjerne", width: 31.1111, height: 31.1111, left: 9.78, top: 9.78 },
  { name: "blomst", width: 32.0001, height: 31.9998, left: 12, top: 9.33 },
  { name: "sol", width: 31.1111, height: 31.1111, left: 9.78, top: 9.78 },
  { name: "hjerte", width: 32, height: 32.058, left: 9.33, top: 9.33 },
  { name: "flag", width: 31.1111, height: 31.1111, left: 10.67, top: 9.78 },
  { name: "taco", width: 32, height: 32, left: 9.33, top: 9.33 },
];

// Bjælken nederst på månedssiden med stickers.
// Man kan ikke trække dem ind på en dag endnu – den er kun til at se på.
export default function StickerTray() {
  return (
    <aside className={styles.tray}>
      <div className={styles.handle} aria-hidden="true" />
      <p className={styles.hint}>Træk en sticker ind på dag</p>
      <ul className={styles.stickers}>
        {STICKERS.map((sticker) => (
          <li key={sticker.name} className={styles.tile}>
            <Image
              src={`/icons/sticker-${sticker.name}.svg`}
              alt={sticker.name}
              width={sticker.width}
              height={sticker.height}
              style={{ left: sticker.left, top: sticker.top }}
            />
          </li>
        ))}
      </ul>
    </aside>
  );
}
