import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, isLocale, localeCookie, negotiateLocale, paths } from '@/lib/i18n'

// Only the unprefixed root negotiates; locale-prefixed URLs are explicit and never redirected.
export function proxy(request: NextRequest) {
    const cookie = request.cookies.get(localeCookie)?.value
    const locale = isLocale(cookie) ? cookie : negotiateLocale(request.headers.get('accept-language'))

    if (locale === defaultLocale) return NextResponse.next()

    const url = request.nextUrl.clone()
    url.pathname = paths.home(locale)
    const response = NextResponse.redirect(url, 307)
    response.headers.set('Vary', 'Accept-Language, Cookie')
    return response
}

export const config = { matcher: '/' }
