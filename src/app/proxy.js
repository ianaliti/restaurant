// import { match } from '@formatjs/intl-localematcher'
// import Negotiator from 'negotiator'
// import { NextResponse } from "next/server";
 
// let headers = { 'accept-language': 'en-US,en;q=0.5' }
// let languages = new Negotiator({ headers }).languages()
// let locales = ['en-US', 'fr-FR', 'fr']
// let defaultLocale = 'en-US'
 
// match(languages, locales, defaultLocale) 

 
// // Get the preferred locale, similar to the above or using a library
// function getLocale(request) {
//   let negotiator = new Negotiator({
//     headers: {
//       'accept-language': request.headers.get('accept-language'),
//     },
//   })
 
//   let languages = negotiator.languages()
//   let locale = match(languages, locales, defaultLocale)
 
//   return locale
// }
 
// export function proxy(request) {
//   // Check if there is any supported locale in the pathname
//   const { pathname } = request.nextUrl
//   const pathnameHasLocale = locales.some(
//     (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
//   )
 
//   if (pathnameHasLocale) return
 
//   // Redirect if there is no locale
//   const locale = getLocale(request)
//   request.nextUrl.pathname = `/${locale}${pathname}`
//   // e.g. incoming request is /products
//   // The new URL is now /en-US/products
//   return NextResponse.redirect(request.nextUrl)
// }
 
// export const config = {
//   matcher: [
//     // Skip all internal paths (_next)
//     '/((?!_next).*)',
//     // Optional: only run on root (/) URL
//     // '/'
//   ],
// }