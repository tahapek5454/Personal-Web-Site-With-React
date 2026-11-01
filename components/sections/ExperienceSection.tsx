import Image from 'next/image'
import { getDict, type Locale } from '@/content/dictionary'
import { Card, CardContent, CardHeader } from '../Card'
import Reveal from '../Reveal'

const logoClass: Record<string, string> = {
    '/logos/dt-logo.svg': 'lg:-top-16 lg:-right-4',
    '/logos/nacsoft.png': 'lg:-top-12 lg:-right-4',
    '/logos/kou.svg': 'lg:-top-16 lg:-right-4',
}

function ExperienceSection({ lang }: { lang: Locale }) {
    const dict = getDict(lang)
    const e = dict.experience

    return (
        <section id={dict.ids.experience} aria-labelledby="experience-title" className="py-20">
            <div className="container mx-auto ">
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-block">
                        <h2 id="experience-title" className="text-4xl bigLg:text-5xl font-bold text-foreground mb-2">
                            {e.title}
                        </h2>
                        <div className="w-full h-1 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full"></div>
                    </div>
                    <p className="text-base mt-2 md:text-lg text-gray-600 max-w-2xl mx-auto px-4">{e.subtitle}</p>
                </div>

                <div className="relative max-w-6xl mx-auto">
                <div aria-hidden="true" className="hidden lg:block absolute left-1/2 -translate-x-0.5 w-1 h-full bg-gradient-to-b from-black to-gray-600 rounded-full opacity-20"></div>
                <ol className="space-y-6 lg:space-y-0 list-none">
                    {e.items.map((exp, index) => (
                        <li
                            key={exp.id}
                            className={`relative lg:flex lg:items-center lg:mb-16 ${index % 2 === 0 ? 'lg:justify-start' : 'lg:justify-end'}`}
                        >
                            <div aria-hidden="true" className="hidden lg:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-black z-10 shadow-lg">
                                <div className="absolute inset-0.5 rounded-full bg-black"></div>
                            </div>
                            <Reveal className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                                <Card
                                    variant="elevated"
                                    padding="md"
                                    rounded="xl"
                                    className="group bg-white border border-gray-100 relative overflow-visible lg:p-8"
                                >
                                    <Image
                                        src={exp.logo}
                                        alt=""
                                        width={80}
                                        height={80}
                                        sizes="80px"
                                        className={`absolute -top-3 -right-3 z-10 object-contain w-[70px] h-[70px] lg:w-20 lg:h-20 ${logoClass[exp.logo] ?? ''}`}
                                    />
                                    <CardHeader className="mb-3">
                                        <div className="text-xs md:text-sm text-gray-500 font-medium mb-3 lg:mb-2">
                                            {exp.period}
                                        </div>
                                        <h3 className="text-lg md:text-xl lg:text-lg font-bold text-gray-800 mb-1">
                                            {exp.title}
                                        </h3>
                                        <p className="text-base md:text-lg text-blue-600 font-semibold">
                                            {exp.company}
                                        </p>
                                    </CardHeader>

                                    <CardContent>
                                        <p className="text-gray-600 mb-4 leading-relaxed text-sm md:text-base lg:text-sm">
                                            {exp.description}
                                        </p>
                                        <ul className="flex flex-wrap gap-2 list-none">
                                            {exp.skills.map((skill) => (
                                                <li
                                                    key={skill}
                                                    className="px-2 md:px-3 lg:px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs md:text-sm lg:text-xs font-medium"
                                                >
                                                    {skill}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </Reveal>
                        </li>
                    ))}
                </ol>
                </div>
            </div>
        </section>
    )
}

export default ExperienceSection
