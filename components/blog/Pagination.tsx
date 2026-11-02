import Link from 'next/link'
import { getDict, type Locale } from '@/content/dictionary'
import { paths } from '@/lib/i18n'

const base = 'inline-flex min-w-10 justify-center items-center px-3 py-2 rounded-lg border text-sm font-medium transition-colors duration-200'

export default function Pagination({ lang, page, total }: { lang: Locale; page: number; total: number }) {
    if (total <= 1) return null
    const t = getDict(lang).blog
    const pages = Array.from({ length: total }, (_, i) => i + 1)

    return (
        <nav aria-label={t.paginationLabel} className="mt-12">
            <ul className="flex flex-wrap justify-center items-center gap-2 list-none">
                {page > 1 && (
                    <li>
                        <Link href={paths.blogPage(lang, page - 1)} rel="prev" prefetch={false} className={`${base} border-gray-300 bg-white hover:border-gray-700`}>
                            ← {t.prev}
                        </Link>
                    </li>
                )}
                {pages.map((n) => (
                    <li key={n}>
                        <Link
                            href={paths.blogPage(lang, n)}
                            prefetch={false}
                            aria-label={t.pageTitle(n)}
                            aria-current={n === page ? 'page' : undefined}
                            className={`${base} ${n === page ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 bg-white hover:border-gray-700'}`}
                        >
                            {n}
                        </Link>
                    </li>
                ))}
                {page < total && (
                    <li>
                        <Link href={paths.blogPage(lang, page + 1)} rel="next" prefetch={false} className={`${base} border-gray-300 bg-white hover:border-gray-700`}>
                            {t.next} →
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}
