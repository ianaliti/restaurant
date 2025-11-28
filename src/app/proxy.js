import { NextResponse } from "next/server";

let locales = ['en', 'fr']
let defaultLocale = 'fr'

function getLocale(request) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return pathname.split('/')[1]
  }

  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage.split(',')[0].split('-')[0]
    if (locales.includes(preferredLocale)) {
      return preferredLocale
    }
  }

  return defaultLocale
}

export function proxy(request) {
  const { pathname } = request.nextUrl

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const locale = getLocale(request)
  const newPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
  request.nextUrl.pathname = newPath
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|.*\\..*).*)',
  ],
}
