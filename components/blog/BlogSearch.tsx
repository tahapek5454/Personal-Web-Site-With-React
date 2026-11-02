'use client'

import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Locale } from '@/content/dictionary'
import { formatTemplate, normalizeSearch, type PostSummary } from '@/lib/blogShared'
import PostList from './PostList'

interface Props {
    lang: Locale
    searchUrl: string
    tags: { tag: string; count: number }[]
    labels: {
        searchLabel: string
        searchPlaceholder: string
        searchLoading: string
        noResults: string
        resultsCount: string
        clearFilters: string
        tagsLabel: string
        readingTime: string
    }
    /** Server-rendered, crawlable list shown while no filter is active. */
    children: ReactNode
}

export default function BlogSearch({ lang, searchUrl, tags, labels, children }: Props) {
    const [query, setQuery] = useState('')
    const [activeTag, setActiveTag] = useState<string | null>(null)
    const [index, setIndex] = useState<PostSummary[] | null>(null)
    const requested = useRef(false)

    const loadIndex = useCallback(() => {
        if (requested.current) return
        requested.current = true
        fetch(searchUrl)
            .then((res) => res.json() as Promise<PostSummary[]>)
            .then(setIndex)
            .catch(() => {
                requested.current = false
            })
    }, [searchUrl])

    const isActive = query.trim() !== '' || activeTag !== null

    const results = useMemo(() => {
        if (!index) return []
        const terms = normalizeSearch(lang, query).split(/\s+/).filter(Boolean)
        return index.filter((post) => {
            if (activeTag && !post.tags.includes(activeTag)) return false
            const haystack = normalizeSearch(lang, [post.title, post.description, post.topicTitle, ...post.tags].join(' '))
            return terms.every((term) => haystack.includes(term))
        })
    }, [index, query, activeTag, lang])

    const clear = () => {
        setQuery('')
        setActiveTag(null)
    }

    return (
        <div>
            <div className="mb-6">
                <label htmlFor="blog-search" className="sr-only">
                    {labels.searchLabel}
                </label>
                <input
                    id="blog-search"
                    type="search"
                    value={query}
                    onFocus={loadIndex}
                    onChange={(e) => {
                        loadIndex()
                        setQuery(e.target.value)
                    }}
                    placeholder={labels.searchPlaceholder}
                    autoComplete="off"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                />
            </div>

            {tags.length > 0 && (
                <div className="mb-8">
                    <p className="text-sm font-semibold text-gray-700 mb-2">{labels.tagsLabel}</p>
                    <ul className="flex flex-wrap gap-2 list-none">
                        {tags.map(({ tag, count }) => (
                            <li key={tag}>
                                <button
                                    type="button"
                                    aria-pressed={activeTag === tag}
                                    onClick={() => {
                                        loadIndex()
                                        setActiveTag((current) => (current === tag ? null : tag))
                                    }}
                                    className={`px-3 py-1 rounded-full border text-sm transition-colors duration-200 cursor-pointer ${
                                        activeTag === tag
                                            ? 'border-gray-900 bg-gray-900 text-white'
                                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-700'
                                    }`}
                                >
                                    {tag} <span className="text-xs opacity-70">{count}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {isActive ? (
                <section aria-live="polite">
                    {!index ? (
                        <p className="text-gray-600">{labels.searchLoading}</p>
                    ) : (
                        <>
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                                <p role="status" className="text-gray-600">
                                    {results.length === 0 ? labels.noResults : formatTemplate(labels.resultsCount, results.length)}
                                </p>
                                <button type="button" onClick={clear} className="text-sm underline text-gray-700 hover:text-gray-900 cursor-pointer">
                                    {labels.clearFilters}
                                </button>
                            </div>
                            <PostList lang={lang} posts={results} readingTime={labels.readingTime} />
                        </>
                    )}
                </section>
            ) : (
                children
            )}
        </div>
    )
}
