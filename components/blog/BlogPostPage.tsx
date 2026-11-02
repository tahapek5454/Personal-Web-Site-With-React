import Image from 'next/image'
import Link from 'next/link'
import { getDict, type Locale } from '@/content/dictionary'
import { modifiedDate, renderPost, topicLabel, type Post } from '@/lib/blog'
import { formatDate, formatTemplate } from '@/lib/blogShared'
import { paths } from '@/lib/i18n'
import { blogPostingNode, breadcrumbNode, graph } from '@/lib/schema'
import JsonLd from '../JsonLd'
import { BlogBackLink } from './BlogIndexPage'

export default async function BlogPostPage({ lang, post }: { lang: Locale; post: Post }) {
    const dict = getDict(lang)
    const t = dict.blog
    const { html, toc } = await renderPost(post)
    const topic = topicLabel(lang, post.topic)

    return (
        <main id="main" className="bg-background min-h-screen px-4 pt-28 pb-20">
            <JsonLd
                data={graph(
                    blogPostingNode(lang, post),
                    breadcrumbNode([
                        { name: dict.projectPage.home, path: paths.home(lang) },
                        { name: t.breadcrumb, path: paths.blog(lang) },
                        { name: post.title, path: paths.blogPost(lang, post.slug) },
                    ]),
                )}
            />
            <div className="max-w-3xl mx-auto">
                <nav aria-label="Breadcrumb" className="text-sm text-gray-600 mb-8">
                    <ol className="flex flex-wrap items-center gap-2 list-none">
                        <li><a href={paths.home(lang)} className="hover:text-gray-900 underline">{dict.projectPage.home}</a></li>
                        <li aria-hidden="true">/</li>
                        <li><Link href={paths.blog(lang)} prefetch={false} className="hover:text-gray-900 underline">{t.breadcrumb}</Link></li>
                        <li aria-hidden="true">/</li>
                        <li aria-current="page" className="text-gray-900 break-words">{post.title}</li>
                    </ol>
                </nav>

                <article>
                    <header className="mb-8">
                        <p className="flex flex-wrap items-center gap-x-2 text-sm text-gray-600 mb-3">
                            <Link href={paths.blogTopic(lang, post.topic)} prefetch={false} className="font-semibold uppercase tracking-wide text-gray-800 hover:underline">
                                {topic.title}
                            </Link>
                            <span aria-hidden="true">·</span>
                            <time dateTime={post.date}>{formatDate(lang, post.date)}</time>
                            {post.updated && post.updated !== post.date && (
                                <>
                                    <span aria-hidden="true">·</span>
                                    <span>{t.updatedOn} <time dateTime={modifiedDate(post)}>{formatDate(lang, modifiedDate(post))}</time></span>
                                </>
                            )}
                            <span aria-hidden="true">·</span>
                            <span>{formatTemplate(t.readingTime, post.readingMinutes)}</span>
                        </p>
                        <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4 break-words">{post.title}</h1>
                        <p className="text-lg text-gray-600">{post.description}</p>
                    </header>

                    {post.cover && (
                        <div className="relative aspect-[16/9] mb-8 rounded-2xl overflow-hidden shadow-xl">
                            <Image src={post.cover} alt="" fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
                        </div>
                    )}

                    {toc.length > 1 && (
                        <nav aria-label={t.tocTitle} className="mb-8 rounded-xl border border-gray-200 bg-white p-5">
                            <p className="font-semibold text-gray-900 mb-2">{t.tocTitle}</p>
                            <ol className="list-none space-y-1 text-sm">
                                {toc.map((item) => (
                                    <li key={item.id} className={item.depth === 3 ? 'pl-4' : undefined}>
                                        <a href={`#${item.id}`} className="text-gray-700 hover:text-gray-900 hover:underline">{item.text}</a>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    )}

                    <div className="prose-blog" dangerouslySetInnerHTML={{ __html: html }} />

                    {post.tags.length > 0 && (
                        <ul className="flex flex-wrap gap-2 mt-10 list-none" aria-label={t.tagsLabel}>
                            {post.tags.map((tag) => (
                                <li key={tag} className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border">{tag}</li>
                            ))}
                        </ul>
                    )}
                </article>

                <BlogBackLink lang={lang} />
            </div>
        </main>
    )
}
