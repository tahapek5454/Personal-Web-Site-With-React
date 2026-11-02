import type { Metadata } from 'next'
import { getDict, type Locale } from '@/content/dictionary'
import { modifiedDate, topicLabel, type Post } from './blog'
import { paths } from './i18n'
import { pageMetadata } from './seo'

export function blogIndexMetadata(lang: Locale, page: number): Metadata {
    const t = getDict(lang).blog
    return pageMetadata({
        lang,
        title: page > 1 ? `${t.metaTitle} - ${t.pageTitle(page)}` : t.metaTitle,
        description: t.metaDescription,
        alternates: { tr: paths.blogPage('tr', page), en: paths.blogPage('en', page) },
        markdown: page > 1 ? undefined : paths.mdBlog(lang),
        rss: paths.blogRss(lang),
    })
}

export function blogTopicMetadata(lang: Locale, topic: string): Metadata {
    const t = getDict(lang).blog
    const info = topicLabel(lang, topic)
    return pageMetadata({
        lang,
        title: t.topicTitle(info.title),
        description: info.description,
        alternates: { tr: paths.blogTopic('tr', topic), en: paths.blogTopic('en', topic) },
        rss: paths.blogRss(lang),
    })
}

export function blogPostMetadata(lang: Locale, post: Post): Metadata {
    return pageMetadata({
        lang,
        title: post.title,
        description: post.description,
        alternates: { tr: paths.blogPost('tr', post.slug), en: paths.blogPost('en', post.slug) },
        markdown: paths.mdBlogPost(lang, post.slug),
        rss: paths.blogRss(lang),
        image: post.cover ?? paths.blogOg(lang, post.slug),
        article: {
            publishedTime: post.date,
            modifiedTime: modifiedDate(post),
            tags: post.tags,
            section: topicLabel(lang, post.topic).title,
        },
    })
}
