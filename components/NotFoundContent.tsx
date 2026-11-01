import { getDict, type Locale } from '@/content/dictionary'
import { paths } from '@/lib/i18n'

export default function NotFoundContent({ lang }: { lang: Locale }) {
    const t = getDict(lang).notFound

    return (
        <main id="main" className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                <p aria-hidden="true" className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 bg-clip-text text-transparent">
                    404
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{t.title}</h1>
                <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed mb-8">{t.text}</p>
                <a
                    href={paths.home(lang)}
                    className="inline-block px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                    {t.home}
                </a>
            </div>
        </main>
    )
}
