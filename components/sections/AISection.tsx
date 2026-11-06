import Image from 'next/image'
import { getDict, type Locale } from '@/content/dictionary'

export default function AISection({ lang }: { lang: Locale }) {
    const ai = getDict(lang).ai

    return (
        <section
            id={lang === 'tr' ? 'yapay-zeka' : 'ai'}
            aria-labelledby="ai-section-title"
            className="-mx-8 w-[calc(100%+4rem)] bg-[#080808] px-6 py-20 text-white sm:px-8"
        >
            <div className="mx-auto max-w-6xl">
                <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                    <div>
                        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">AI</p>
                        <h2 id="ai-section-title" className="mb-6 text-4xl font-bold leading-tight sm:text-5xl">
                            {ai.title}
                        </h2>
                        <p className="max-w-3xl text-base leading-8 text-white/80 sm:text-lg">
                            {ai.intro}
                        </p>
                        <ul className="mt-10 grid gap-6 sm:grid-cols-2" aria-label={ai.title}>
                            {ai.topics.map((topic) => (
                                <li key={topic.title} className="border-l border-white/30 pl-4">
                                    <h3 className="mb-2 text-lg font-semibold text-white">{topic.title}</h3>
                                    <p className="leading-relaxed text-white/70">{topic.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-white/5 aspect-[4/5]">
                        <Image
                            src="/images/image3.jpeg"
                            alt={ai.portraitAlt}
                            fill
                            sizes="(max-width: 1024px) 100vw, 38vw"
                            className="object-cover"
                        />
                    </div>
                </div>

                <div className="mt-14 flex items-center gap-8 border-t border-white/15 pt-8" role="group" aria-label={ai.logosLabel}>
                    <Image src="/logos/gpt.webp" alt={ai.gptAlt} width={112} height={48} sizes="112px" className="h-10 w-auto object-contain brightness-0 invert" />
                    <Image src="/logos/claude.webp" alt={ai.claudeAlt} width={112} height={48} sizes="112px" className="h-10 w-auto object-contain" />
                </div>
            </div>
        </section>
    )
}
