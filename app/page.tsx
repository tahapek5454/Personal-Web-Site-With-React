import AbilitiesSection from '@/components/sections/AbilitiesSection';
import AboutSection from '@/components/sections/AboutSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import HeaderSection from '@/components/sections/HeaderSection';
import ProjectSection from '@/components/sections/ProjectSection';

export default function Home() {
  return (
    <main className="bg-background p-8">
      <HeaderSection />
      <AboutSection />
      <ExperienceSection />
      <AbilitiesSection />
      <ProjectSection />
    </main>
  );
}
