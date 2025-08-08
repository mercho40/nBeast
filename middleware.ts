import { NextResponse, NextRequest } from "next/server";
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { auth } from "./lib/auth";
import { headers } from "next/headers";

const locales = ['en', 'es']
// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
  const headers = { 'accept-language': request.headers.get('accept-language') || '' }
  const languages = new Negotiator({ headers }).languages()
  const defaultLocale = 'en'
  // Match and normalize to 'en' or 'es'
  const matched = match(languages, locales, defaultLocale)
  return matched.startsWith('es') ? 'es' : 'en'
}

export async function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  if (pathnameHasLocale) return
  // Redirect if there is no locale
  const locale = getLocale(request)

  if (pathname.startsWith(`/${locale}/auth/signin`) || pathname === `/${locale}/auth/signin`) {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session) {
      return NextResponse.redirect(`/${locale}/auth/callback?source=signin&redirect=/`)
    }
  }

  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
}

