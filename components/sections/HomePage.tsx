import type { Locale } from '@/content/dictionary'
import { graph, profilePageNode } from '@/lib/schema'
import JsonLd from '../JsonLd'
import AbilitiesSection from './AbilitiesSection'
import AboutSection from './AboutSection'
import ExperienceSection from './ExperienceSection'
import HeaderSection from './HeaderSection'
import HeroReveal from './HeroReveal'
import ProjectSection from './ProjectSection'

export default function HomePage({ lang }: { lang: Locale }) {
    return (
        <main id="main" className="bg-background">
            <JsonLd data={graph(profilePageNode(lang))} />
            <HeroReveal />
            <div className="p-8">
                <HeaderSection lang={lang} />
                <AboutSection lang={lang} />
                <ExperienceSection lang={lang} />
                <AbilitiesSection lang={lang} />
                <ProjectSection lang={lang} />
            </div>
        </main>
    )
}
