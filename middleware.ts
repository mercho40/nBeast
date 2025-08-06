import { NextResponse, NextRequest } from "next/server";
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

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

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en/products
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

