import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { getDict, type Locale } from '@/content/dictionary'
import { abs, absHome, paths } from './i18n'

export function baseMetadata(lang: Locale): Metadata {
    const dict = getDict(lang)
    return {
        metadataBase: new URL(siteConfig.url),
        title: { default: dict.meta.title, template: `%s | ${siteConfig.author}` },
        description: dict.meta.description,
        applicationName: siteConfig.name,
        authors: [{ name: siteConfig.author, url: absHome('tr') }],
        creator: siteConfig.author,
        publisher: siteConfig.author,
        keywords: dict.meta.keywords,
        category: 'Technology',
        formatDetection: { email: false, address: false, telephone: false },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        verification: { google: siteConfig.googleSiteVerification },
    }
}

interface PageMeta {
    lang: Locale
    /** Absolute title (skips the title template) or a template-wrapped one. */
    title: string
    absoluteTitle?: boolean
    description: string
    /** Pathname of this page per locale; omit a locale if no translation exists. */
    alternates: Partial<Record<Locale, string>>
    /** Markdown twin of this page. */
    markdown?: string
    /** RSS feed advertised to feed readers. */
    rss?: string
    article?: { publishedTime: string; modifiedTime: string; tags: string[]; section: string }
    /** Overrides the file-based Open Graph image. */
    image?: string
}

export function pageMetadata({ lang, title, absoluteTitle, description, alternates, markdown, rss, article, image }: PageMeta): Metadata {
    const dict = getDict(lang)
    const self = alternates[lang] ?? paths.home(lang)
    const languages: Record<string, string> = {}
    if (alternates.tr) languages['tr-TR'] = abs(alternates.tr)
    if (alternates.en) languages.en = abs(alternates.en)
    if (alternates.tr) languages['x-default'] = abs(alternates.tr)

    const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.author}`
    const types: Record<string, string> = {}
    if (markdown) types['text/markdown'] = markdown
    if (rss) types['application/rss+xml'] = rss

    return {
        title: absoluteTitle ? { absolute: title } : title,
        description,
        alternates: {
            canonical: abs(self),
            languages,
            types,
        },
        openGraph: {
            ...(article
                ? {
                      type: 'article' as const,
                      publishedTime: article.publishedTime,
                      modifiedTime: article.modifiedTime,
                      authors: [siteConfig.author],
                      section: article.section,
                      tags: article.tags,
                  }
                : { type: 'website' as const }),
            locale: dict.ogLocale,
            alternateLocale: alternates.tr && alternates.en ? (lang === 'tr' ? ['en_US'] : ['tr_TR']) : undefined,
            url: abs(self),
            siteName: siteConfig.name,
            title: fullTitle,
            description,
            ...(image ? { images: [{ url: abs(image), width: 1200, height: 630 }] } : {}),
        },
        twitter: { card: 'summary_large_image', title: fullTitle, description, ...(image ? { images: [abs(image)] } : {}) },
    }
}
