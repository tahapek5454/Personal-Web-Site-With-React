import Link from 'next/link'
import { getDict, type Locale } from '@/content/dictionary'
import { getPosts, getTags, getTopics, pageCount, paginate, toSummary } from '@/lib/blog'
import { paths } from '@/lib/i18n'
import { blogNode, breadcrumbNode, graph } from '@/lib/schema'
import JsonLd from '../JsonLd'
import BlogSearch from './BlogSearch'
import Pagination from './Pagination'
import PostList from './PostList'
import TopicNav from './TopicNav'

const MAX_TAG_FILTERS = 16

export default function BlogIndexPage({ lang, page }: { lang: Locale; page: number }) {
    const dict = getDict(lang)
    const t = dict.blog
    const all = getPosts(lang)
    const visible = paginate(all, page)
    const summaries = visible.map((p) => toSummary(lang, p))

    return (
        <main id="main" className="bg-background min-h-screen px-4 pt-28 pb-20">
            <JsonLd
                data={graph(
                    blogNode(lang, visible),
                    breadcrumbNode([
                        { name: dict.projectPage.home, path: paths.home(lang) },
                        { name: t.breadcrumb, path: paths.blogPage(lang, page) },
                    ]),
                )}
            />
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl bigLg:text-5xl font-bold text-foreground mb-2">
                        {t.title}
                        {page > 1 && <span className="sr-only"> — {t.pageTitle(page)}</span>}
                    </h1>
                    <div className="w-24 h-1 mx-auto bg-gradient-to-r from-gray-700 to-gray-900 rounded-full" />
                    <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">{t.subtitle}</p>
                    <p className="mt-4 text-sm">
                        <a href={paths.blogRss(lang)} className="underline text-gray-600 hover:text-gray-900">
                            {t.rss}
                        </a>
                    </p>
                </header>

                {all.length === 0 ? (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold text-foreground mb-2">{t.emptyTitle}</h2>
                        <p className="text-gray-600">{t.emptyText}</p>
                    </div>
                ) : (
                    <>
                        <TopicNav lang={lang} topics={getTopics(lang)} />
                        <BlogSearch
                            lang={lang}
                            searchUrl={paths.blogSearch(lang)}
                            tags={getTags(lang).slice(0, MAX_TAG_FILTERS)}
                            labels={{
                                searchLabel: t.searchLabel,
                                searchPlaceholder: t.searchPlaceholder,
                                searchLoading: t.searchLoading,
                                noResults: t.noResults,
                                resultsCount: t.resultsCount,
                                clearFilters: t.clearFilters,
                                tagsLabel: t.tagsLabel,
                                readingTime: t.readingTime,
                            }}
                        >
                            <PostList lang={lang} posts={summaries} readingTime={t.readingTime} />
                            <Pagination lang={lang} page={page} total={pageCount(all.length)} />
                        </BlogSearch>
                    </>
                )}
            </div>
        </main>
    )
}

export function BlogBackLink({ lang }: { lang: Locale }) {
    const t = getDict(lang).blog
    return (
        <p className="mt-10">
            <Link href={paths.blog(lang)} prefetch={false} className="text-gray-700 underline hover:text-gray-900">
                ← {t.backToBlog}
            </Link>
        </p>
    )
}
