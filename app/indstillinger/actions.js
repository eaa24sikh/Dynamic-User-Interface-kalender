"use server";

// Denne fil kører på serveren. Funktionerne bliver kaldt fra
// knapperne på /indstillinger og gemmer valget i en cookie.

import { cookies } from "next/headers";
import { BACKGROUND_COOKIE, COLOR_COOKIE, getBackground, getColorScheme } from "@/lib/settings";

// Cookien huskes i et år (tallet er i sekunder)
const ONE_YEAR = 60 * 60 * 24 * 365;

// Gemmer det valgte farvetema
export async function chooseColorScheme(formData) {
  const id = formData.get("farve");

  // Gem kun, hvis farvetemaet findes
  if (getColorScheme(id).id !== id) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(COLOR_COOKIE, id, { maxAge: ONE_YEAR, path: "/" });
}

// Gemmer den valgte baggrund. En tom værdi fjerner baggrunden igen.
export async function chooseBackground(formData) {
  const background = getBackground(formData.get("baggrund"));
  const cookieStore = await cookies();

  if (background) {
    cookieStore.set(BACKGROUND_COOKIE, background.id, { maxAge: ONE_YEAR, path: "/" });
  } else {
    cookieStore.delete(BACKGROUND_COOKIE);
  }
}
