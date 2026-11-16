import { Fraunces, Inter, Nunito } from "next/font/google";
import { cookies } from "next/headers";
import Header from "@/components/Header";
import { BACKGROUND_COOKIE, COLOR_COOKIE, getBackground, getColorScheme, readCookie } from "@/lib/settings";
import "./globals.css";

// Skrifttyperne fra Figma. De kan bruges i CSS som fx var(--font-fraunces)
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: "italic",
  axes: ["SOFT", "WONK"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kalender",
  description: "Overblik over måneden med begivenheder, noter og påmindelser",
};

// Layoutet ligger rundt om alle sider i appen.
export default async function RootLayout({ children }) {
  // Læs hvad brugeren har valgt under /indstillinger (gemt i cookies)
  const cookieStore = await cookies();
  const colorScheme = getColorScheme(readCookie(cookieStore, COLOR_COOKIE));
  const background = getBackground(readCookie(cookieStore, BACKGROUND_COOKIE));

  // Baggrundsbilledet gives videre som CSS-variablen --tema-billede.
  // Måneds-, dags- og indstillingssiden viser det.
  let style = {};
  if (background) {
    style = { "--tema-billede": `url(${background.image})` };
  }

  // data-farve styrer farverne. Se app/globals.css
  return (
    <html
      lang="da"
      className={`${fraunces.variable} ${nunito.variable} ${inter.variable}`}
      data-farve={colorScheme.id}
      style={style}
    >
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
