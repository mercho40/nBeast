import { NextResponse, NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { auth } from "./lib/auth";
import { headers } from "next/headers";
import { locales } from "./actions/dictionaries"; // unifica con dictionaries
import type { Lang } from "./actions/dictionaries";

const DEFAULT_LOCALE: Lang = "en";

function negotiateLocale(request: NextRequest): Lang {
  const accept = request.headers.get("accept-language") || "";
  const languages = new Negotiator({ headers: { "accept-language": accept } }).languages();
  const matched = match(languages, locales as string[], DEFAULT_LOCALE);
  return (matched.startsWith("es") ? "es" : "en") as Lang;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extrae primer segmento para ver si es un locale soportado
  const segments = pathname.split("/").filter(Boolean);
  const candidate = segments[0] as Lang | undefined;
  const hasSupportedLocale = !!candidate && (locales as readonly string[]).includes(candidate);

  if (hasSupportedLocale) {
    // Lógica especial para signin con locale ya presente
    if (
      pathname === `/${candidate}/auth/signin` ||
      pathname.startsWith(`/${candidate}/auth/signin?`)
    ) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (session) {
        const url = request.nextUrl.clone();
        url.pathname = `/${candidate}/auth/callback`;
        url.searchParams.set("source", "signin");
        url.searchParams.set("redirect", "/");
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
  }

  // No tiene locale válido → negociar y redirigir
  const locale = negotiateLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`.replace(/\/+$/, "") || `/${locale}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next|api).*)",
  ],
};

