import { getDict, type Locale } from '@/content/dictionary'
import { Card, CardContent } from '../Card'
import TechnologiesSlider from '../technologies/TechnologiesSlider'

export default function ExpertiseSection({ lang }: { lang: Locale }) {
    const a = getDict(lang).about

    return (
        <section aria-labelledby="expertise-title" className="bg-background px-4 py-20">
            <div className="mx-auto max-w-6xl">
                <div className="mb-16">
                    <h2 id="expertise-title" className="mb-12 text-center text-3xl font-bold text-foreground bigLg:text-4xl">
                        {a.expertiseTitle}
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {a.expertise.map((skill) => (
                            <Card
                                key={skill.title}
                                variant="elevated"
                                padding="lg"
                                className="text-center transition-transform duration-300 hover:scale-105 motion-reduce:transform-none"
                            >
                                <div aria-hidden="true" className="mb-4 text-4xl">{skill.icon}</div>
                                <h3 className="mb-3 text-xl font-bold text-gray-800">{skill.title}</h3>
                                <p className="text-sm leading-relaxed text-gray-600">{skill.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="mb-16">
                    <TechnologiesSlider />
                </div>

                <div className="text-center">
                    <Card variant="elevated" padding="lg" className="mx-auto max-w-4xl bg-white">
                        <CardContent>
                            <blockquote className="text-xl italic leading-relaxed text-gray-700 md:text-2xl">
                                “{a.quote}”
                            </blockquote>
                            <div className="mt-6 flex justify-center">
                                <div className="h-1 w-16 rounded-full bg-gradient-to-r from-gray-700 to-gray-900" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
