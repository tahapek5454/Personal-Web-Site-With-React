import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProjectDetail from '@/components/ProjectDetail'
import { getProject, projects } from '@/content/projects'
import { paths } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

type Params = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
    return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const project = getProject((await params).slug)
    if (!project) return {}
    const text = project.text.en
    return pageMetadata({
        lang: 'en',
        title: text.title,
        description: text.description,
        alternates: { tr: paths.project('tr', project.slug), en: paths.project('en', project.slug) },
        markdown: paths.mdProject('en', project.slug),
    })
}

export default async function Page({ params }: Params) {
    const project = getProject((await params).slug)
    if (!project) notFound()
    return <ProjectDetail lang="en" project={project} />
}
