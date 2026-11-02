import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeShiki from '@shikijs/rehype'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import type { Element, Nodes, Root } from 'hast'
import { siteConfig } from '@/config/site'
import { topicInfo } from '@/content/blog/topics'
import { getDict, type Locale } from '@/content/dictionary'
import { abs, locales, reservedBlogSlugs } from './i18n'
import type { PostSummary } from './blogShared'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')
const PUBLIC_DIR = path.join(process.cwd(), 'public')
const COVER_PREFIX = '/images/blog/'
const KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const WORDS_PER_MINUTE = 200

export const POSTS_PER_PAGE = 9

const isProduction = process.env.NODE_ENV === 'production'
// Set BLOG_INCLUDE_DRAFTS=1 to preview drafts in a production build.
const includeDrafts = !isProduction || process.env.BLOG_INCLUDE_DRAFTS === '1'

export interface PostMeta {
    slug: string
    lang: Locale
    title: string
    description: string
    /** ISO date (YYYY-MM-DD). */
    date: string
    updated?: string
    topic: string
    tags: string[]
    /** Public path under /images/blog/. */
    cover?: string
    readingMinutes: number
    wordCount: number
}

export interface Post extends PostMeta {
    /** Raw markdown without frontmatter. */
    body: string
}

export interface TocItem {
    id: string
    text: string
    depth: 2 | 3
}

export interface Topic {
    key: string
    title: string
    description: string
    count: number
    /** Newest post date in the topic. */
    latest: string
}

function fail(file: string, message: string): never {
    throw new Error(`[blog] ${file}: ${message}`)
}

function requiredString(data: Record<string, unknown>, key: string, file: string): string {
    const value = data[key]
    if (typeof value !== 'string' || !value.trim()) fail(file, `frontmatter "${key}" is required`)
    return value.trim()
}

// YAML parses bare dates into Date objects.
function isoDate(value: unknown, key: string, file: string): string {
    const iso = value instanceof Date ? value.toISOString().slice(0, 10) : value
    if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso) || Number.isNaN(Date.parse(iso))) {
        fail(file, `frontmatter "${key}" must be a valid YYYY-MM-DD date`)
    }
    return iso
}

function parsePost(slug: string, lang: Locale, file: string): { post: Post; draft: boolean } {
    const label = `content/blog/${slug}/${lang}.md`
    const { data, content } = matter(fs.readFileSync(file, 'utf8'))

    const topic = requiredString(data, 'topic', label)
    if (!KEY_PATTERN.test(topic)) fail(label, `topic "${topic}" must be lowercase letters, digits and hyphens`)

    const rawTags = data.tags ?? []
    if (!Array.isArray(rawTags) || rawTags.some((t) => typeof t !== 'string' || !t.trim())) {
        fail(label, 'frontmatter "tags" must be a list of strings')
    }

    const cover = data.cover === undefined ? undefined : requiredString(data, 'cover', label)
    if (cover && (!cover.startsWith(COVER_PREFIX) || cover.includes('..') || !fs.existsSync(path.join(PUBLIC_DIR, cover)))) {
        fail(label, `cover must be an existing file under public${COVER_PREFIX}`)
    }

    const date = isoDate(data.date, 'date', label)
    const updated = data.updated === undefined ? undefined : isoDate(data.updated, 'updated', label)
    if (updated && updated < date) fail(label, '"updated" cannot be earlier than "date"')

    const body = content.trim()
    if (!body) fail(label, 'content is empty')
    const wordCount = body.split(/\s+/).length

    return {
        draft: data.draft === true,
        post: {
            slug,
            lang,
            title: requiredString(data, 'title', label),
            description: requiredString(data, 'description', label),
            date,
            updated,
            topic,
            tags: (rawTags as string[]).map((t) => t.trim()),
            cover,
            readingMinutes: Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE)),
            wordCount,
            body,
        },
    }
}

let cache: Record<Locale, Post[]> | undefined

function load(): Record<Locale, Post[]> {
    if (cache && isProduction) return cache
    const result: Record<Locale, Post[]> = { tr: [], en: [] }

    if (fs.existsSync(BLOG_DIR)) {
        for (const entry of fs.readdirSync(BLOG_DIR, { withFileTypes: true })) {
            if (!entry.isDirectory()) continue
            const slug = entry.name
            if (!KEY_PATTERN.test(slug)) fail(`content/blog/${slug}`, 'folder name must be a lowercase slug')
            if (reservedBlogSlugs.includes(slug)) fail(`content/blog/${slug}`, 'folder name is a reserved URL segment')

            const parsed = locales.map((lang) => {
                const file = path.join(BLOG_DIR, slug, `${lang}.md`)
                if (!fs.existsSync(file)) fail(`content/blog/${slug}`, `missing translation ${lang}.md`)
                return parsePost(slug, lang, file)
            })
            if (parsed[0].post.topic !== parsed[1].post.topic) {
                fail(`content/blog/${slug}`, 'topic must be identical in all languages')
            }
            if (!includeDrafts && parsed.some((p) => p.draft)) continue
            for (const { post } of parsed) result[post.lang].push(post)
        }
    }

    for (const lang of locales) {
        result[lang].sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
    }
    cache = result
    return result
}

export const getPosts = (lang: Locale): Post[] => load()[lang]

export const getPost = (lang: Locale, slug: string): Post | undefined =>
    getPosts(lang).find((p) => p.slug === slug)

export const getPostSlugs = (): string[] => getPosts('tr').map((p) => p.slug)

export const modifiedDate = (post: PostMeta) => post.updated ?? post.date

/** Most recent publish/update date across all posts, if any. */
export function latestPostDate(): string | undefined {
    return getPosts('tr')
        .concat(getPosts('en'))
        .map(modifiedDate)
        .sort()
        .at(-1)
}

const humanize = (key: string) =>
    key
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')

export function topicLabel(lang: Locale, key: string): { title: string; description: string } {
    const info = topicInfo[key]?.[lang]
    if (info) return info
    const title = humanize(key)
    return { title, description: getDict(lang).blog.topicDescription(title) }
}

export function getTopics(lang: Locale): Topic[] {
    const byKey = new Map<string, Topic>()
    for (const post of getPosts(lang)) {
        const existing = byKey.get(post.topic)
        if (existing) {
            existing.count += 1
            if (post.date > existing.latest) existing.latest = post.date
        } else {
            byKey.set(post.topic, { key: post.topic, ...topicLabel(lang, post.topic), count: 1, latest: post.date })
        }
    }
    return [...byKey.values()].sort((a, b) => b.count - a.count || a.title.localeCompare(b.title, lang))
}

export const getPostsByTopic = (lang: Locale, topic: string) => getPosts(lang).filter((p) => p.topic === topic)

export function getTags(lang: Locale): { tag: string; count: number }[] {
    const counts = new Map<string, number>()
    for (const post of getPosts(lang)) for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
    return [...counts].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, lang))
}

export const pageCount = (total: number) => Math.max(1, Math.ceil(total / POSTS_PER_PAGE))

export const paginate = <T>(items: T[], page: number): T[] =>
    items.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)

export function toSummary(lang: Locale, post: PostMeta): PostSummary {
    return {
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: post.date,
        topic: post.topic,
        topicTitle: topicLabel(lang, post.topic).title,
        tags: post.tags,
        cover: post.cover,
        readingMinutes: post.readingMinutes,
    }
}

/** Relative image paths in a post resolve to /images/blog/<slug>/. */
export function resolveImage(slug: string, src: string): string {
    if (/^(https?:)?\/\//.test(src)) {
        throw new Error(`[blog] ${slug}: external image "${src}" is blocked by the site CSP; add it under public/images/blog/${slug}/`)
    }
    if (src.includes('..') || src.includes(':')) throw new Error(`[blog] ${slug}: invalid image path "${src}"`)
    return src.startsWith('/') ? src : `${COVER_PREFIX}${slug}/${src.replace(/^\.\//, '')}`
}

/** Markdown body with image URLs made absolute, for the markdown twins and llms files. */
export function absoluteBody(post: Post): string {
    return post.body.replace(/(!\[[^\]]*\]\()([^)\s]+)/g, (_m, open: string, src: string) => `${open}${abs(resolveImage(post.slug, src))}`)
}

const textOf = (node: Nodes): string =>
    node.type === 'text' ? node.value : 'children' in node ? node.children.map(textOf).join('') : ''

function walk(node: Nodes, visit: (el: Element) => void) {
    if (node.type === 'element') visit(node)
    if ('children' in node) for (const child of node.children) walk(child, visit)
}

// http(s), mailto, anchors, or scheme-less relative URLs; blocks javascript:, data:, vbscript: etc.
const SAFE_HREF = /^(?:https?:|mailto:|[#/?]|[^:]*$)/i

function rehypeBlog({ slug, toc }: { slug: string; toc: TocItem[] }) {
    return (tree: Root) => {
        walk(tree, (el) => {
            if ((el.tagName === 'h2' || el.tagName === 'h3') && typeof el.properties.id === 'string') {
                toc.push({ id: el.properties.id, text: textOf(el), depth: el.tagName === 'h2' ? 2 : 3 })
            } else if (el.tagName === 'img' && typeof el.properties.src === 'string') {
                el.properties.src = resolveImage(slug, el.properties.src)
                el.properties.loading = 'lazy'
                el.properties.decoding = 'async'
            } else if (el.tagName === 'a' && typeof el.properties.href === 'string') {
                const href = el.properties.href
                if (!SAFE_HREF.test(href)) throw new Error(`[blog] ${slug}: unsafe link "${href}"`)
                if (/^https?:\/\//.test(href) && !href.startsWith(siteConfig.url)) {
                    el.properties.target = '_blank'
                    el.properties.rel = ['noopener', 'noreferrer']
                }
            }
        })
    }
}

const processor = (slug: string, toc: TocItem[]) =>
    unified()
        .use(remarkParse)
        .use(remarkGfm)
        // Raw HTML in markdown is dropped; posts are plain markdown only.
        .use(remarkRehype)
        .use(rehypeSlug)
        .use(rehypeBlog, { slug, toc })
        .use(rehypeAutolinkHeadings, {
            behavior: 'append',
            properties: { className: ['anchor'], ariaHidden: 'true', tabIndex: -1 },
            content: { type: 'text', value: '#' },
        })
        .use(rehypeShiki, {
            theme: 'github-dark',
            fallbackLanguage: 'text',
            langs: ['typescript', 'tsx', 'javascript', 'json', 'bash', 'csharp', 'python', 'yaml', 'sql', 'html', 'css', 'markdown'],
        })
        .use(rehypeStringify)

export async function renderPost(post: Post): Promise<{ html: string; toc: TocItem[] }> {
    const toc: TocItem[] = []
    const file = await processor(post.slug, toc).process(post.body)
    return { html: String(file), toc }
}
