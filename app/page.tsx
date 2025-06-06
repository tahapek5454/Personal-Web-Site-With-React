import AboutSection from '@/components/sections/AboutSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import HeaderSection from '@/components/sections/HeaderSection';

export default function Home() {
  return (
    <div className="bg-background p-8">
      <HeaderSection />

      <AboutSection />

      <ExperienceSection />
    </div>
  );
}
