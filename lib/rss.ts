import { siteConfig } from '@/config/site'
import { getDict, type Locale } from '@/content/dictionary'
import { getPosts, modifiedDate, topicLabel } from './blog'
import { abs, paths } from './i18n'

const escapeXml = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const rfc822 = (iso: string) => new Date(`${iso}T00:00:00Z`).toUTCString()

export function rssFeed(lang: Locale): string {
    const t = getDict(lang).blog
    const posts = getPosts(lang)
    const feedUrl = abs(paths.blogRss(lang))
    const latest = posts.map(modifiedDate).sort().at(-1) ?? siteConfig.contentUpdatedAt

    const items = posts.map((post) => {
        const url = abs(paths.blogPost(lang, post.slug))
        return [
            '    <item>',
            `      <title>${escapeXml(post.title)}</title>`,
            `      <link>${url}</link>`,
            `      <guid isPermaLink="true">${url}</guid>`,
            `      <pubDate>${rfc822(post.date)}</pubDate>`,
            `      <description>${escapeXml(post.description)}</description>`,
            `      <category>${escapeXml(topicLabel(lang, post.topic).title)}</category>`,
            ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
            '    </item>',
        ].join('\n')
    })

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
        '  <channel>',
        `    <title>${escapeXml(`${t.title} | ${siteConfig.author}`)}</title>`,
        `    <link>${abs(paths.blog(lang))}</link>`,
        `    <description>${escapeXml(t.metaDescription)}</description>`,
        `    <language>${lang === 'tr' ? 'tr-TR' : 'en'}</language>`,
        `    <lastBuildDate>${rfc822(latest)}</lastBuildDate>`,
        `    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />`,
        ...items,
        '  </channel>',
        '</rss>',
        '',
    ].join('\n')
}

export function rssResponse(lang: Locale): Response {
    return new Response(rssFeed(lang), {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
        },
    })
}
