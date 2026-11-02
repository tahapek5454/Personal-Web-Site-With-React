import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/content/dictionary'
import { formatDate, formatTemplate, type PostSummary } from '@/lib/blogShared'
import { paths } from '@/lib/i18n'
import { Card } from '../Card'

interface Props {
    lang: Locale
    post: PostSummary
    /** Dictionary template containing `{n}`. */
    readingTime: string
    /** Use h3 when the list sits under an h2 section (home page). */
    headingLevel?: 'h2' | 'h3'
}

export default function PostCard({ lang, post, readingTime, headingLevel: Heading = 'h2' }: Props) {
    return (
        <Link href={paths.blogPost(lang, post.slug)} prefetch={false} className="block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900">
            <Card variant="minimal" padding="sm" hover3d={false} className="bg-white h-full">
                <div className="flex gap-4 px-1 py-1">
                    <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500 mb-1">
                            <span className="font-semibold uppercase tracking-wide text-gray-700">{post.topicTitle}</span>
                            <span aria-hidden="true">·</span>
                            <time dateTime={post.date}>{formatDate(lang, post.date)}</time>
                            <span aria-hidden="true">·</span>
                            <span>{formatTemplate(readingTime, post.readingMinutes)}</span>
                        </p>
                        <Heading className="text-base font-bold text-foreground leading-snug mb-1 break-words">{post.title}</Heading>
                        <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
                        {post.tags.length > 0 && (
                            <ul className="mt-2 flex flex-wrap gap-1.5 list-none">
                                {post.tags.slice(0, 3).map((tag) => (
                                    <li key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                        {tag}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {post.cover && (
                        <div className="relative hidden sm:block size-20 shrink-0 rounded-lg overflow-hidden self-start">
                            <Image src={post.cover} alt="" fill sizes="80px" className="object-cover" />
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    )
}
