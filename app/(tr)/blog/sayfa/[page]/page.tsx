import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogIndexPage from '@/components/blog/BlogIndexPage'
import { getPosts, pageCount } from '@/lib/blog'
import { blogIndexMetadata } from '@/lib/blogSeo'

type Params = { params: Promise<{ page: string }> }

export const dynamicParams = false

// Page 1 lives at /blog; only pages 2..N exist here.
export function generateStaticParams() {
    const total = pageCount(getPosts('tr').length)
    return Array.from({ length: total - 1 }, (_, i) => ({ page: String(i + 2) }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    return blogIndexMetadata('tr', Number((await params).page))
}

export default async function Page({ params }: Params) {
    const page = Number((await params).page)
    if (!Number.isInteger(page) || page < 2) notFound()
    return <BlogIndexPage lang="tr" page={page} />
}
