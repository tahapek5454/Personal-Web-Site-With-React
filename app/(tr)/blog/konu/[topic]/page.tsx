import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogTopicPage from '@/components/blog/BlogTopicPage'
import { getTopics } from '@/lib/blog'
import { blogTopicMetadata } from '@/lib/blogSeo'

type Params = { params: Promise<{ topic: string }> }

export const dynamicParams = false

export function generateStaticParams() {
    return getTopics('tr').map((t) => ({ topic: t.key }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    return blogTopicMetadata('tr', (await params).topic)
}

export default async function Page({ params }: Params) {
    const { topic } = await params
    if (!getTopics('tr').some((t) => t.key === topic)) notFound()
    return <BlogTopicPage lang="tr" topic={topic} />
}
