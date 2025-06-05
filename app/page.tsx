import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/Card';
import AboutSection from '@/components/sections/AboutSection';
import HeaderSection from '@/components/sections/HeaderSection';

export default function Home() {
  return (
    <div className="bg-background p-8">
      <HeaderSection />

      <AboutSection />

      {/* <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle>Temel Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Bu temel bir card örneğidir. İçeriğini tamamen özelleştirebilirsiniz.</p>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
