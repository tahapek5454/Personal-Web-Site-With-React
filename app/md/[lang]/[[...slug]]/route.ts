import { notFound } from 'next/navigation'
import type { Locale } from '@/content/dictionary'
import { projects, getProject } from '@/content/projects'
import { homeMarkdown, projectMarkdown } from '@/lib/markdown'

export const dynamic = 'force-static'
export const dynamicParams = false

type Ctx = { params: Promise<{ lang: string; slug?: string[] }> }

// Reached through rewrites: /index.md, /projeler/:slug.md, /en/index.md, /en/projects/:slug.md
export function generateStaticParams() {
    return (['tr', 'en'] as const).flatMap((lang) => [
        { lang, slug: [] as string[] },
        ...projects.map((p) => ({ lang, slug: [p.slug] })),
    ])
}

export async function GET(_req: Request, { params }: Ctx) {
    const { lang, slug } = await params
    if (lang !== 'tr' && lang !== 'en') notFound()

    let body: string
    if (!slug || slug.length === 0) {
        body = homeMarkdown(lang as Locale)
    } else {
        const project = getProject(slug[0])
        if (!project) notFound()
        body = projectMarkdown(lang as Locale, project)
    }

    return new Response(body, {
        headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
            // The HTML page stays the canonical, indexable version.
            'X-Robots-Tag': 'noindex',
        },
    })
}
