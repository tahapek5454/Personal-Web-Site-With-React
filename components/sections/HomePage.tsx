import type { Locale } from '@/content/dictionary'
import { graph, profilePageNode } from '@/lib/schema'
import JsonLd from '../JsonLd'
import AbilitiesSection from './AbilitiesSection'
import AboutSection from './AboutSection'
import ExperienceSection from './ExperienceSection'
import HeaderSection from './HeaderSection'
import LatestPosts from './LatestPosts'
import ProjectSection from './ProjectSection'

export default function HomePage({ lang }: { lang: Locale }) {
    return (
        <main id="main" className="bg-background">
            <JsonLd data={graph(profilePageNode(lang))} />
            <HeaderSection lang={lang} />
            <div className="p-8">
                <AboutSection lang={lang} />
                <ExperienceSection lang={lang} />
                <AbilitiesSection lang={lang} />
                <ProjectSection lang={lang} />
                <LatestPosts lang={lang} />
            </div>
        </main>
    )
}
