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
    blog: (lang: Locale) => (lang === 'tr' ? '/blog' : '/en/blog'),
    blogPage: (lang: Locale, page: number): string =>
        page <= 1 ? paths.blog(lang) : `${paths.blog(lang)}/${lang === 'tr' ? 'sayfa' : 'page'}/${page}`,
    blogPost: (lang: Locale, slug: string): string => `${paths.blog(lang)}/${slug}`,
    blogTopic: (lang: Locale, topic: string): string =>
        `${paths.blog(lang)}/${lang === 'tr' ? 'konu' : 'topic'}/${topic}`,
    blogRss: (lang: Locale): string => `${paths.blog(lang)}/rss.xml`,
    blogSearch: (lang: Locale) => `/blog-search/${lang}`,
    blogOg: (lang: Locale, slug: string) => `/blog-og/${lang}/${slug}`,
    mdBlog: (lang: Locale) => (lang === 'tr' ? '/blog.md' : '/en/blog.md'),
    mdBlogPost: (lang: Locale, slug: string): string => `${paths.blogPost(lang, slug)}.md`,
}

/** Post slugs share the URL namespace with these segments. */
export const reservedBlogSlugs = ['konu', 'topic', 'sayfa', 'page', 'rss.xml']

/** Equivalent page of the current pathname in another locale. */
export function localizedPath(pathname: string, target: Locale): string {
    const slug =
        pathname.match(/^\/projeler\/([^/]+)\/?$/)?.[1] ??
        pathname.match(/^\/en\/projects\/([^/]+)\/?$/)?.[1]
    if (slug) return paths.project(target, slug)

    const blog = pathname.match(/^(?:\/en)?\/blog(?:\/(.*?))?\/?$/)
    if (!blog) return paths.home(target)
    const rest = blog[1]
    if (!rest) return paths.blog(target)

    const page = rest.match(/^(?:sayfa|page)\/(\d+)$/)?.[1]
    if (page) return paths.blogPage(target, Number(page))
    const topic = rest.match(/^(?:konu|topic)\/([^/]+)$/)?.[1]
    if (topic) return paths.blogTopic(target, topic)
    if (/^[^/]+$/.test(rest)) return paths.blogPost(target, rest)
    return paths.blog(target)
}

export const abs = (path: string) => `${siteConfig.url}${path === '/' ? '' : path}`

export const absHome = (lang: Locale) => `${siteConfig.url}${paths.home(lang)}`

export const mailto = (subject: string, body: string) =>
    `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

export const personId = `${siteConfig.url}/#person`
export const websiteId = `${siteConfig.url}/#website`
