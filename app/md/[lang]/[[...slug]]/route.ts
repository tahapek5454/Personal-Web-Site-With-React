import { notFound } from 'next/navigation'
import type { Locale } from '@/content/dictionary'
import { projects, getProject } from '@/content/projects'
import { getPost, getPostSlugs } from '@/lib/blog'
import { isLocale, locales } from '@/lib/i18n'
import { blogIndexMarkdown, blogPostMarkdown, homeMarkdown, projectMarkdown } from '@/lib/markdown'

export const dynamic = 'force-static'
export const dynamicParams = false

type Ctx = { params: Promise<{ lang: string; slug?: string[] }> }

// Reached through rewrites: /index.md, /projeler/:slug.md, /blog.md, /blog/:slug.md and their /en equivalents.
export function generateStaticParams() {
    return locales.flatMap((lang) => [
        { lang, slug: [] as string[] },
        ...projects.map((p) => ({ lang, slug: [p.slug] })),
        { lang, slug: ['blog'] },
        ...getPostSlugs().map((slug) => ({ lang, slug: ['blog', slug] })),
    ])
}

function resolve(lang: Locale, slug: string[] = []): string | undefined {
    if (slug.length === 0) return homeMarkdown(lang)
    if (slug[0] === 'blog') {
        if (slug.length === 1) return blogIndexMarkdown(lang)
        const post = slug.length === 2 ? getPost(lang, slug[1]) : undefined
        return post ? blogPostMarkdown(lang, post) : undefined
    }
    const project = slug.length === 1 ? getProject(slug[0]) : undefined
    return project ? projectMarkdown(lang, project) : undefined
}

export async function GET(_req: Request, { params }: Ctx) {
    const { lang, slug } = await params
    if (!isLocale(lang)) notFound()
    const body = resolve(lang, slug)
    if (body === undefined) notFound()

    return new Response(body, {
        headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
            // The HTML page stays the canonical, indexable version.
            'X-Robots-Tag': 'noindex',
        },
    })
}
