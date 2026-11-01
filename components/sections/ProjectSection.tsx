import Link from 'next/link'
import Image from 'next/image'
import { getDict, type Locale } from '@/content/dictionary'
import { projects } from '@/content/projects'
import { paths } from '@/lib/i18n'
import { siteConfig } from '@/config/site'
import { Card, CardContent, CardHeader } from '../Card'
import { GithubIcon } from '../icons'
import ProjectSectionAnimation from './ProjectSectionAnimation'

const external = { target: '_blank', rel: 'noopener noreferrer' } as const

function ProjectSection({ lang }: { lang: Locale }) {
    const dict = getDict(lang)
    const p = dict.projects
    const featuredProject = projects.find((project) => project.featured)
    const regularProjects = projects.filter((project) => !project.featured)

    return (
        <section id={dict.ids.projects} aria-labelledby="projects-title" className="min-h-screen bg-background py-20 px-4">
            <ProjectSectionAnimation />
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-block">
                        <h2 id="projects-title" className="text-4xl bigLg:text-5xl font-bold text-foreground mb-2">
                            {p.title}
                        </h2>
                        <div className="w-full h-1 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full"></div>
                    </div>
                    <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">{p.subtitle}</p>
                </div>

                {featuredProject && (
                    <div className="mb-16">
                        <h3 className="text-2xl font-bold text-foreground mb-8 text-center">{p.featured}</h3>
                        <Card variant="elevated" padding="sm" className="bg-white overflow-hidden">
                            <div className="grid lg:grid-cols-2 h-full">
                                {featuredProject.image && (
                                    <div className="relative min-h-[300px] rounded-2xl overflow-hidden">
                                        <Image
                                            src={featuredProject.image.src}
                                            alt={featuredProject.text[lang].title}
                                            className="object-cover rounded-2xl"
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            draggable="false"
                                        />
                                    </div>
                                )}
                                <div className="p-8 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-2xl font-bold text-foreground mb-4">
                                            {featuredProject.text[lang].title}
                                        </h4>
                                        <p className="text-gray-600 mb-4">{featuredProject.text[lang].longDescription}</p>
                                        <ul className="flex flex-wrap gap-2 mb-6 list-none">
                                            {featuredProject.technologies.map((tech) => (
                                                <li key={tech} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border">
                                                    {tech}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <a
                                            href={featuredProject.githubUrl}
                                            {...external}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 motion-reduce:transform-none text-center"
                                        >
                                            {p.viewOnGithub}
                                        </a>
                                        <Link
                                            href={paths.project(lang, featuredProject.slug)}
                                            prefetch={false}
                                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-gray-700 hover:text-gray-900 transition-all duration-300 text-center"
                                        >
                                            {p.viewDetails}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 list-none">
                    {regularProjects.map((project) => {
                        const text = project.text[lang]
                        return (
                            <li key={project.slug}>
                                <Card variant="elevated" padding="lg" className="bg-white group hover:shadow-xl transition-all duration-300 h-full">
                                    <CardHeader>
                                        <div className="flex items-center justify-between mb-4">
                                            <div aria-hidden="true" className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                                                <span className="text-white text-xl">📁</span>
                                            </div>
                                            <a
                                                href={project.githubUrl}
                                                {...external}
                                                aria-label={p.githubLabel(text.title)}
                                                className="p-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                <GithubIcon className="w-5 h-5 text-gray-600" />
                                            </a>
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-gray-700 transition-colors duration-200">
                                            {text.title}
                                        </h3>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 mb-4">{text.description}</p>
                                        <ul className="flex flex-wrap gap-2 mb-6 list-none">
                                            {project.technologies.map((tech) => (
                                                <li key={tech} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                    {tech}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href={paths.project(lang, project.slug)}
                                            prefetch={false}
                                            aria-label={`${p.viewDetails}: ${text.title}`}
                                            className="inline-flex items-center py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-200"
                                        >
                                            {p.viewDetails}
                                            <svg aria-hidden="true" className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </li>
                        )
                    })}
                </ul>

                <div className="text-center mt-16">
                    <Card variant="elevated" padding="lg" className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200">
                        <CardContent>
                            <h3 className="text-2xl font-bold text-foreground mb-4">{p.moreTitle}</h3>
                            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{p.moreText}</p>
                            <a
                                href={siteConfig.social.github}
                                {...external}
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 motion-reduce:transform-none"
                            >
                                <GithubIcon className="w-5 h-5 mr-2" />
                                {p.visitGithub}
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

export default ProjectSection
