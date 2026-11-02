import type { Locale } from '@/content/dictionary'
import type { PostSummary } from '@/lib/blogShared'
import PostCard from './PostCard'

export default function PostList({
    lang,
    posts,
    readingTime,
    headingLevel,
}: {
    lang: Locale
    posts: PostSummary[]
    readingTime: string
    headingLevel?: 'h2' | 'h3'
}) {
    return (
        <ul className="grid md:grid-cols-2 gap-4 list-none">
            {posts.map((post) => (
                <li key={post.slug}>
                    <PostCard lang={lang} post={post} readingTime={readingTime} headingLevel={headingLevel} />
                </li>
            ))}
        </ul>
    )
}
