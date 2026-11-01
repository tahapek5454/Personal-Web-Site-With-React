import Image from 'next/image'
import Link from 'next/link'
import { getDict, type Locale } from '@/content/dictionary'
import { projects, type Project } from '@/content/projects'
import { paths } from '@/lib/i18n'
import { breadcrumbNode, graph, projectNode } from '@/lib/schema'
import { Card, CardContent } from './Card'
import JsonLd from './JsonLd'
import { GithubIcon } from './icons'

export default function ProjectDetail({ lang, project }: { lang: Locale; project: Project }) {
    const dict = getDict(lang)
    const t = dict.projectPage
    const text = project.text[lang]
    const others = projects.filter((p) => p.slug !== project.slug)
    const home = paths.home(lang)

    return (
        <main id="main" className="bg-background min-h-screen px-4 pt-28 pb-20">
            <JsonLd
                data={graph(
                    projectNode(lang, project),
                    breadcrumbNode([
                        { name: t.home, path: home },
                        { name: t.projects, path: `${home === '/' ? '' : home}#${dict.ids.projects}` },
                        { name: text.title, path: paths.project(lang, project.slug) },
                    ]),
                )}
            />
            <div className="max-w-4xl mx-auto">
                <nav aria-label="Breadcrumb" className="text-sm text-gray-600 mb-8">
                    <ol className="flex flex-wrap items-center gap-2 list-none">
                        <li><a href={home} className="hover:text-gray-900 underline">{t.home}</a></li>
                        <li aria-hidden="true">/</li>
                        <li><a href={`${home}#${dict.ids.projects}`} className="hover:text-gray-900 underline">{t.projects}</a></li>
                        <li aria-hidden="true">/</li>
                        <li aria-current="page" className="text-gray-900">{text.title}</li>
                    </ol>
                </nav>

                <article>
                    <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4 break-words">{text.title}</h1>
                    <p className="text-lg text-gray-600 mb-8">{text.description}</p>

                    {project.image && (
                        <div className="relative aspect-[1350/610] mb-8 rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src={project.image.src}
                                alt={text.title}
                                fill
                                priority
                                sizes="(max-width: 896px) 100vw, 896px"
                                className="object-cover"
                            />
                        </div>
                    )}

                    <Card variant="elevated" padding="lg" className="bg-white mb-8">
                        <CardContent>
                            <p className="text-gray-700 text-lg leading-relaxed mb-8">{text.longDescription}</p>

                            <h2 className="text-xl font-bold text-gray-800 mb-3">{t.technologies}</h2>
                            <ul className="flex flex-wrap gap-2 mb-8 list-none">
                                {project.technologies.map((tech) => (
                                    <li key={tech} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border">
                                        {tech}
                                    </li>
                                ))}
                            </ul>

                            <h2 className="text-xl font-bold text-gray-800 mb-3">{t.source}</h2>
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-full font-semibold hover:shadow-lg transition-shadow duration-300"
                            >
                                <GithubIcon className="w-5 h-5 mr-2" />
                                {t.githubCta}
                            </a>
                        </CardContent>
                    </Card>
                </article>

                <section aria-labelledby="other-projects">
                    <h2 id="other-projects" className="text-2xl font-bold text-foreground mb-4">{t.otherProjects}</h2>
                    <ul className="grid sm:grid-cols-2 gap-3 list-none">
                        {others.map((p) => (
                            <li key={p.slug}>
                                <Link
                                    href={paths.project(lang, p.slug)}
                                    prefetch={false}
                                    className="block p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 text-gray-800 font-medium"
                                >
                                    {p.text[lang].title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-8">
                        <a href={`${home}#${dict.ids.projects}`} className="text-gray-700 underline hover:text-gray-900">
                            ← {t.back}
                        </a>
                    </p>
                </section>
            </div>
        </main>
    )
}
