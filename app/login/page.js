import Image from "next/image";
import { logIn, signUp } from "./actions";
import styles from "./page.module.css";

// Stickerne rundt om kortet, præcis placeret som i Figma.
// De første fire ligger bag kortet, resten ligger ovenpå.
const STICKERS_BEHIND = [
  { name: "sol", left: 14, top: 116 },
  { name: "stjerne", left: 333, top: 275 },
  { name: "hjerte", left: 13.5, top: 558.5 },
  { name: "blomst", left: 336.5, top: 108.5 },
];
const STICKERS_IN_FRONT = [
  { name: "stjerne", left: 17, top: 24 },
  { name: "blomst", left: 279.5, top: 685.5 },
  { name: "sol", left: 280, top: 11 },
  { name: "hjerte", left: 178.5, top: 44.5 },
  { name: "blomst", left: 30.5, top: 732.5 },
  { name: "sol", left: 129, top: 603 },
  { name: "stjerne", left: 313, top: 575 },
  { name: "hjerte", left: 332.5, top: 744.5 },
];

// Størrelsen på hver sticker
const SIZES = {
  sol: { width: 49.2468, height: 48 },
  stjerne: { width: 35, height: 35 },
  hjerte: { width: 35.6253, height: 30.9325 },
  blomst: { width: 36.0001, height: 35.9998 },
};

function Sticker({ sticker }) {
  const size = SIZES[sticker.name];
  return (
    <Image
      src={`/icons/login/${sticker.name}.svg`}
      alt=""
      width={size.width}
      height={size.height}
      className={styles.sticker}
      style={{ left: sticker.left, top: sticker.top }}
    />
  );
}

// Login-siden. Beskeder (fx "Forkert kodeord") kommer med i adressen: /login?besked=…
export default async function LoginPage({ searchParams }) {
  const params = await searchParams;

  return (
    <main className={styles.page}>
      {STICKERS_BEHIND.map((sticker) => (
        <Sticker key={`${sticker.name}-${sticker.left}`} sticker={sticker} />
      ))}

      <form className={styles.card}>
        <h1 className={styles.title}>
          <span>Login</span>
        </h1>

        <label className={styles.field}>
          <span className={styles.label}>Email adresse</span>
          <input
            type="email"
            name="email"
            className={styles.input}
            placeholder="Skriv din mailadresse"
            autoComplete="email"
            required
          />
        </label>

        <label className={`${styles.field} ${styles.passwordField}`}>
          <span className={styles.label}>Kodeord</span>
          <input
            type="password"
            name="password"
            className={styles.input}
            placeholder="Skriv dit kodeord"
            autoComplete="current-password"
            required
          />
        </label>

        <p className={styles.forgot}>Glemt kodeord?</p>

        {params.besked && (
          <p className={styles.message} role="alert">
            {params.besked}
          </p>
        )}

        {/* Begge knapper sender formularen, men til hver sin funktion i actions.js */}
        <div className={styles.buttons}>
          <button formAction={signUp} className={styles.button}>
            Opret bruger
          </button>
          <button formAction={logIn} className={styles.button}>
            Login
          </button>
        </div>
      </form>

      {STICKERS_IN_FRONT.map((sticker) => (
        <Sticker key={`${sticker.name}-${sticker.left}`} sticker={sticker} />
      ))}
    </main>
  );
}
