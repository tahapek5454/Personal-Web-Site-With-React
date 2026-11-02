import { notFound } from 'next/navigation'
import { getPost, getPostSlugs } from '@/lib/blog'
import { isLocale, locales } from '@/lib/i18n'
import { postOgImage } from '@/lib/postOg'

export const dynamic = 'force-static'
export const dynamicParams = false

type Ctx = { params: Promise<{ lang: string; slug: string }> }

// A route handler (not opengraph-image.tsx) keeps the URL stable so JSON-LD can reference it.
export function generateStaticParams() {
    return locales.flatMap((lang) => getPostSlugs().map((slug) => ({ lang, slug })))
}

export async function GET(_req: Request, { params }: Ctx) {
    const { lang, slug } = await params
    if (!isLocale(lang)) notFound()
    const post = getPost(lang, slug)
    if (!post) notFound()
    return postOgImage(lang, post)
}
