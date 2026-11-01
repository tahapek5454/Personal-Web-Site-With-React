import Image from 'next/image'
import { getDict, type Locale } from '@/content/dictionary'
import { Card, CardContent } from '../Card'
import AbilitiesAnimation from './AbilitiesAnimation'

const blur =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknysoS2j3pBSRgOoE5A/qPjmilTNVakMADKFLOST1x9FnTKzGSvRo8V1o7EV1qmFBQFAUA='

function AbilitiesSection({ lang }: { lang: Locale }) {
    const dict = getDict(lang)
    const a = dict.abilities

    return (
        <section
            id={dict.ids.skills}
            data-abilities
            aria-labelledby="abilities-title"
            className="px-4 max-w-7xl mx-auto"
        >
            <AbilitiesAnimation />
            <div className="text-center mb-16">
                <div className="inline-block">
                    <h2 id="abilities-title" className="text-4xl bigLg:text-5xl font-bold text-foreground mb-2">
                        {a.title}
                    </h2>
                    <div className="w-full h-1 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full"></div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-center items-center">
                <div id="abilitiesText" className="relative z-20 w-full lg:max-w-xl xl:max-w-2xl">
                    <Card variant="elevated" padding="lg" rounded="xl" hover3d={false} className="backdrop-blur-sm bg-white/95">
                        <CardContent>
                            <div className="space-y-6">
                                {a.items.map((item) => (
                                    <div key={item.title}>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">{item.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div id="abilitiesImage" className="-mt-12 lg:mt-0 lg:-ml-12 xl:-ml-16 flex-shrink-0">
                    <Image
                        src="/images/image2.jpeg"
                        alt={a.photoAlt}
                        width={550}
                        height={540}
                        sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, (max-width: 1024px) 448px, (max-width: 1280px) 512px, 576px"
                        style={{ objectFit: 'cover' }}
                        className="rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
                        placeholder="blur"
                        blurDataURL={blur}
                    />
                </div>
            </div>
        </section>
    )
}

export default AbilitiesSection
