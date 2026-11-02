import { notFound } from 'next/navigation'
import { isLocale, locales } from '@/lib/i18n'
import { getPosts, toSummary } from '@/lib/blog'

export const dynamic = 'force-static'
export const dynamicParams = false

type Ctx = { params: Promise<{ lang: string }> }

export function generateStaticParams() {
    return locales.map((lang) => ({ lang }))
}

// Loaded lazily by the blog search box; not an indexable page.
export async function GET(_req: Request, { params }: Ctx) {
    const { lang } = await params
    if (!isLocale(lang)) notFound()
    return Response.json(getPosts(lang).map((p) => toSummary(lang, p)), {
        headers: {
            'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
            'X-Robots-Tag': 'noindex',
        },
    })
}
