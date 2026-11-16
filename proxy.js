import { NextResponse } from "next/server";
import { LOGIN_COOKIE } from "@/lib/login";

// Next.js kører proxy.js før hver side bliver vist.
// Den sender folk, der ikke er logget ind, til /login.
//
// Man er logget ind, når cookien har samme værdi som LOGIN_SESSION i .env.local
// (den bliver sat af logIn() i app/login/actions.js).
export function proxy(request) {
  const cookie = request.cookies.get(LOGIN_COOKIE);
  const isLoggedIn = Boolean(cookie && process.env.LOGIN_SESSION && cookie.value === process.env.LOGIN_SESSION);
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");

  // Ikke logget ind: send til login-siden
  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allerede logget ind: login-siden er ikke nødvendig
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Alle adresser undtagen Next.js' egne filer og billeder
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
