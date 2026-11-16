import { Fraunces, Inter, Nunito } from "next/font/google";
import { cookies } from "next/headers";
import Header from "@/components/Header";
import { BACKGROUND_COOKIE, COLOR_COOKIE, getBackground, getColorScheme } from "@/lib/settings";
import "./globals.css";

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

// The colour scheme chosen under /indstillinger is used on every page.
// The background is set as --tema-billede, which the month, day and settings pages show.
export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const colorScheme = getColorScheme(cookieStore.get(COLOR_COOKIE)?.value);
  const background = getBackground(cookieStore.get(BACKGROUND_COOKIE)?.value);

  return (
    <html
      lang="da"
      className={`${fraunces.variable} ${nunito.variable} ${inter.variable}`}
      data-farve={colorScheme.id}
      style={background ? { "--tema-billede": `url(${background.image})` } : undefined}
    >
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
