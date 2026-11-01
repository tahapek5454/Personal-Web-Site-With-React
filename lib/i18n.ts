import { siteConfig } from '@/config/site'
import type { Locale } from '@/content/dictionary'

export const locales: Locale[] = ['tr', 'en']
export const defaultLocale: Locale = 'tr'
export const localeCookie = 'NEXT_LOCALE'
export const localeCookieMaxAge = 60 * 60 * 24 * 365

export const isLocale = (value: string | undefined): value is Locale =>
    locales.includes(value as Locale)

/** Picks the best supported locale from an Accept-Language header (RFC 9110 q-values). */
export function negotiateLocale(header: string | null): Locale {
    const ranked = (header ?? '')
        .split(',')
        .map((part) => {
            const [tag, ...params] = part.trim().split(';')
            const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='))
            return { lang: tag.trim().toLowerCase().split('-')[0], q: q ? Number(q.slice(2)) : 1 }
        })
        .filter((e) => e.q > 0)
        .sort((a, b) => b.q - a.q)
    const match = ranked.find((e) => isLocale(e.lang))
    return match ? (match.lang as Locale) : defaultLocale
}

export const paths = {
    home: (lang: Locale) => (lang === 'tr' ? '/' : '/en'),
    project: (lang: Locale, slug: string) =>
        lang === 'tr' ? `/projeler/${slug}` : `/en/projects/${slug}`,
    mdHome: (lang: Locale) => (lang === 'tr' ? '/index.md' : '/en/index.md'),
    mdProject: (lang: Locale, slug: string) =>
        lang === 'tr' ? `/projeler/${slug}.md` : `/en/projects/${slug}.md`,
}

/** Equivalent page of the current pathname in another locale. */
export function localizedPath(pathname: string, target: Locale): string {
    const slug =
        pathname.match(/^\/projeler\/([^/]+)\/?$/)?.[1] ??
        pathname.match(/^\/en\/projects\/([^/]+)\/?$/)?.[1]
    return slug ? paths.project(target, slug) : paths.home(target)
}

export const abs = (path: string) => `${siteConfig.url}${path === '/' ? '' : path}`

export const absHome = (lang: Locale) => `${siteConfig.url}${paths.home(lang)}`

export const mailto = (subject: string, body: string) =>
    `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

export const personId = `${siteConfig.url}/#person`
export const websiteId = `${siteConfig.url}/#website`
