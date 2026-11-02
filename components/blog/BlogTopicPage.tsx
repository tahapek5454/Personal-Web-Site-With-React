import { getDict, type Locale } from '@/content/dictionary'
import { getPostsByTopic, getTopics, toSummary, topicLabel } from '@/lib/blog'
import { paths } from '@/lib/i18n'
import { breadcrumbNode, graph } from '@/lib/schema'
import JsonLd from '../JsonLd'
import { BlogBackLink } from './BlogIndexPage'
import PostList from './PostList'
import TopicNav from './TopicNav'

export default function BlogTopicPage({ lang, topic }: { lang: Locale; topic: string }) {
    const dict = getDict(lang)
    const t = dict.blog
    const info = topicLabel(lang, topic)
    const posts = getPostsByTopic(lang, topic).map((p) => toSummary(lang, p))

    return (
        <main id="main" className="bg-background min-h-screen px-4 pt-28 pb-20">
            <JsonLd
                data={graph(
                    breadcrumbNode([
                        { name: dict.projectPage.home, path: paths.home(lang) },
                        { name: t.breadcrumb, path: paths.blog(lang) },
                        { name: info.title, path: paths.blogTopic(lang, topic) },
                    ]),
                )}
            />
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl bigLg:text-5xl font-bold text-foreground mb-2">{t.topicTitle(info.title)}</h1>
                    <div className="w-24 h-1 mx-auto bg-gradient-to-r from-gray-700 to-gray-900 rounded-full" />
                    <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">{info.description}</p>
                </header>
                <TopicNav lang={lang} topics={getTopics(lang)} activeTopic={topic} />
                <PostList lang={lang} posts={posts} readingTime={t.readingTime} />
                <BlogBackLink lang={lang} />
            </div>
        </main>
    )
}
