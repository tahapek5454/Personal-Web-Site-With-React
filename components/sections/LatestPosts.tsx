import Link from 'next/link'
import { getDict, type Locale } from '@/content/dictionary'
import { getPosts, toSummary } from '@/lib/blog'
import { paths } from '@/lib/i18n'
import PostList from '../blog/PostList'

const LATEST_COUNT = 3

export default function LatestPosts({ lang }: { lang: Locale }) {
    const t = getDict(lang).blog
    const posts = getPosts(lang).slice(0, LATEST_COUNT)
    if (posts.length === 0) return null

    return (
        <section aria-labelledby="latest-posts-title" className="bg-background py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-block">
                        <h2 id="latest-posts-title" className="text-4xl bigLg:text-5xl font-bold text-foreground mb-2">
                            {t.latestTitle}
                        </h2>
                        <div className="w-full h-1 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full"></div>
                    </div>
                    <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">{t.latestSubtitle}</p>
                </div>
                <PostList lang={lang} posts={posts.map((p) => toSummary(lang, p))} readingTime={t.readingTime} headingLevel="h3" />
                <div className="text-center mt-12">
                    <Link
                        href={paths.blog(lang)}
                        prefetch={false}
                        className="inline-block px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-gray-700 hover:text-gray-900 transition-all duration-300"
                    >
                        {t.viewAll}
                    </Link>
                </div>
            </div>
        </section>
    )
}
