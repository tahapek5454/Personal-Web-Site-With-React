import { getDict, type Locale } from '@/content/dictionary'
import { Card, CardContent, CardHeader } from '../Card'

function AboutSection({ lang }: { lang: Locale }) {
    const dict = getDict(lang)
    const a = dict.about

    return (
        <section id={dict.ids.about} aria-labelledby="about-title" className="min-h-screen bg-background py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-block">
                        <h2 id="about-title" className="text-4xl bigLg:text-5xl font-bold text-foreground mb-2">
                            {a.title}
                        </h2>
                        <div className="w-full h-1 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full"></div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                    <div className="space-y-8">
                        <Card variant="elevated" padding="lg" className="bg-white">
                            <CardHeader>
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                    {a.cardTitle}
                                </h3>
                            </CardHeader>
                            <CardContent>
                                {a.paragraphs.map((text, i) => (
                                    <p
                                        key={i}
                                        className={`text-gray-600 text-lg leading-relaxed ${i < a.paragraphs.length - 1 ? 'mb-6' : ''}`}
                                    >
                                        {text}
                                    </p>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <dl className="grid grid-cols-2 gap-4">
                            {a.stats.map((stat, i) => (
                                <div key={stat.label} className="flex flex-col-reverse text-center p-6 bg-white rounded-lg shadow-md">
                                    <dt className="text-sm text-gray-600">{stat.label}</dt>
                                    <dd className={`text-3xl font-bold mb-2 ${i % 2 === 0 ? 'text-gray-700' : 'text-gray-800'}`}>
                                        {stat.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutSection
