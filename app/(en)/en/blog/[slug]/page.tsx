import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogPostPage from '@/components/blog/BlogPostPage'
import { getPost, getPostSlugs } from '@/lib/blog'
import { blogPostMetadata } from '@/lib/blogSeo'

type Params = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
    return getPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const post = getPost('en', (await params).slug)
    return post ? blogPostMetadata('en', post) : {}
}

export default async function Page({ params }: Params) {
    const post = getPost('en', (await params).slug)
    if (!post) notFound()
    return <BlogPostPage lang="en" post={post} />
}
