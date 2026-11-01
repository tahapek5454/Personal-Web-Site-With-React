import React from 'react'
import { getDict, type Locale } from '@/content/dictionary'
import { Card, CardContent, CardHeader } from '../Card'
import TechnologiesSlider from '../technologies/TechnologiesSlider'

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

                <div className="mb-16">
                    <h3 className="text-3xl bigLg:text-4xl font-bold text-center mb-12 text-foreground">
                        {a.expertiseTitle}
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {a.expertise.map((skill) => (
                            <Card
                                key={skill.title}
                                variant="elevated"
                                padding="lg"
                                className="text-center hover:scale-105 transition-transform duration-300 motion-reduce:transform-none"
                            >
                                <div aria-hidden="true" className="text-4xl mb-4">{skill.icon}</div>
                                <h4 className="text-xl font-bold mb-3 text-gray-800">{skill.title}</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">{skill.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="mb-16">
                    <TechnologiesSlider />
                </div>

                <div className="text-center">
                    <Card variant="elevated" padding="lg" className="max-w-4xl mx-auto bg-white">
                        <CardContent>
                            <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed italic">
                                “{a.quote}”
                            </blockquote>
                            <div className="mt-6 flex justify-center">
                                <div className="w-16 h-1 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full"></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

export default AboutSection
