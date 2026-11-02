import Link from 'next/link'
import { getDict, type Locale } from '@/content/dictionary'
import { paths } from '@/lib/i18n'

const chip = 'inline-flex items-center gap-1 px-4 py-1.5 rounded-full border text-sm font-medium transition-colors duration-200'
const idle = 'border-gray-300 text-gray-700 bg-white hover:border-gray-700'
const active = 'border-gray-900 bg-gray-900 text-white'

interface Props {
    lang: Locale
    topics: { key: string; title: string; count: number }[]
    activeTopic?: string
}

export default function TopicNav({ lang, topics, activeTopic }: Props) {
    const t = getDict(lang).blog
    if (topics.length === 0) return null
    return (
        <nav aria-label={t.topicsLabel} className="mb-8">
            <ul className="flex flex-wrap gap-2 list-none">
                <li>
                    <Link href={paths.blog(lang)} prefetch={false} aria-current={activeTopic ? undefined : 'page'} className={`${chip} ${activeTopic ? idle : active}`}>
                        {t.allTopics}
                    </Link>
                </li>
                {topics.map((topic) => (
                    <li key={topic.key}>
                        <Link
                            href={paths.blogTopic(lang, topic.key)}
                            prefetch={false}
                            aria-current={activeTopic === topic.key ? 'page' : undefined}
                            className={`${chip} ${activeTopic === topic.key ? active : idle}`}
                        >
                            {topic.title}
                            <span className="text-xs opacity-70">{topic.count}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
