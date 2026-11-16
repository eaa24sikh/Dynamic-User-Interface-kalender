"use server";

import { cookies } from "next/headers";
import { BACKGROUND_COOKIE, COLOR_COOKIE, COLOR_SCHEMES, getBackground } from "@/lib/settings";

const ONE_YEAR = 60 * 60 * 24 * 365;

export async function chooseColorScheme(formData) {
  const id = formData.get("farve");
  if (!COLOR_SCHEMES.some((scheme) => scheme.id === id)) return;

  const cookieStore = await cookies();
  cookieStore.set(COLOR_COOKIE, id, { maxAge: ONE_YEAR, path: "/" });
}

// An empty or unknown value removes the background again
export async function chooseBackground(formData) {
  const background = getBackground(formData.get("baggrund"));
  const cookieStore = await cookies();

  if (background) {
    cookieStore.set(BACKGROUND_COOKIE, background.id, { maxAge: ONE_YEAR, path: "/" });
  } else {
    cookieStore.delete(BACKGROUND_COOKIE);
  }
}
