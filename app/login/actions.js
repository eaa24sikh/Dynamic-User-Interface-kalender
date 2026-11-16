"use server";

// Denne fil kører på serveren. Funktionerne bliver kaldt fra knapperne på /login
// og fra "Log ud" under indstillinger.
//
// Login bruger ikke Supabase. Der er én profil, og dens email og kodeord står
// i .env.local (LOGIN_EMAIL og LOGIN_PASSWORD). Når man logger ind, gemmes
// LOGIN_SESSION i en cookie, og proxy.js tjekker den cookie på alle sider.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LOGIN_COOKIE } from "@/lib/login";

// Login'et huskes i 30 dage (tallet er i sekunder)
const THIRTY_DAYS = 60 * 60 * 24 * 30;

// Sender tilbage til login-siden med en besked, fx /login?besked=Forkert+kodeord
function backToLogin(message) {
  redirect(`/login?besked=${encodeURIComponent(message)}`);
}

// "Login"-knappen
export async function logIn(formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const correctEmail = String(process.env.LOGIN_EMAIL || "").toLowerCase();
  const correctPassword = process.env.LOGIN_PASSWORD;

  if (email !== correctEmail || password !== correctPassword) {
    backToLogin("Forkert email eller kodeord");
  }

  const cookieStore = await cookies();
  cookieStore.set(LOGIN_COOKIE, process.env.LOGIN_SESSION, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });

  redirect("/");
}

// "Opret bruger"-knappen. Der er kun én profil, så man kan ikke oprette nye.
export async function signUp() {
  backToLogin("Der kan ikke oprettes nye brugere. Log ind med din profil.");
}

// "Log ud" under indstillinger
export async function logOut() {
  const cookieStore = await cookies();
  cookieStore.delete(LOGIN_COOKIE);
  redirect("/login");
}
