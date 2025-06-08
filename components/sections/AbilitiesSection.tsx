import React from 'react'
import Image from 'next/image'
import { Card, CardContent } from '../Card'

function AbilitiesSection() {
    return (
        <section id='kabiliyetler' className="px-4 max-w-7xl mx-auto">

            <div className="text-center mb-16">
                <div className="inline-block">
                    <h2 className="text-4xl bigLg:text-5xl font-bold text-foreground mb-2">
                        Kabiliyetlerim
                    </h2>
                    <div className="w-full h-1 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full"></div>
                </div>
            </div>

            <div className='flex flex-col lg:flex-row justify-center items-center'>
                <div className="relative z-20 w-full lg:max-w-xl xl:max-w-2xl">
                    <Card variant="elevated" padding="lg" rounded="xl" hover3d={false} className="backdrop-blur-sm bg-white/95">                        
                    <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                        Yazılım Geliştirme
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Modern web teknolojileri ile performanslı uygulamalar geliştiriyorum. 
                                        Next.js, Nuxt.js, .NET Core ve WebAPI uzmanım.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                        Yazılım Mimarisi
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        SOLID, Clean Code, Clean Architecture ve Microservice 
                                        yaklaşımları ile tasarım patterns uygularım.
                                    </p>                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                        Problem Çözme
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Karmaşık problemleri analiz ederek etkili çözümler üretiyorum.
                                        Algoritma tasarımı ve optimizasyon konularında deneyimliyim.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                        Takım Çalışması
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Güçlü iletişim becerileri ile ekip halinde projeler yürütüyorum. 
                                        Agile (Scrum) metodolojileri ve OOP ile etkili çalışırım.
                                    </p>                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                        Sürekli Öğrenme
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Teknolojideki gelişmeleri takip ediyor, kendimi sürekli 
                                        geliştiriyorum. Yeni teknolojiler öğrenme konusunda hevesliyim.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="-mt-12 lg:mt-0 lg:-ml-12 xl:-ml-16 flex-shrink-0">
                    <Image
                        src="/images/image2.jpeg"
                        alt="Developer Profile"
                        width={550}
                        height={540}
                        style={{
                            objectFit: "cover"
                        }}
                        className="rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
                        priority
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknysoS2j3pBSRgOoE5A/qPjmilTNVakMADKFLOST1x9FnTKzGSvRo8V1o7EV1qmFBQFAUA="
                    />
                </div>
            </div>


        </section>
    )
}

export default AbilitiesSection