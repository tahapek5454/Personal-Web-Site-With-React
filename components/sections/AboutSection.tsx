import React from 'react'
import { Card, CardContent, CardHeader } from '../Card'
import TechnologiesSlider from '../technologies/TechnologiesSlider';


function AboutSection() {
    const skills = [
        {
            title: "Full Stack Development",
            description: "Backend ve frontend alanlarında kapsamlı deneyim",
            icon: "💻"
        },
        {
            title: "AI & LLM Orchestration",
            description: "LangChain ve LangGraph ile akıllı agent sistemleri ve LLM orkestrasyon mimarileri",
            icon: "🤖"
        },
        {
            title: "Cloud & DevOps",
            description: "Kubernetes, CI/CD ve bulut tabanlı çözümler",
            icon: "☁️"
        },
        {
            title: "Agile & Team Leadership",
            description: "Ekip çalışması ve esnek geliştirme metodolojileri",
            icon: "🚀"
        },
        {
            title: "Problem Solving",
            description: "Karmaşık problemler için yenilikçi çözümler",
            icon: "🎯"
        }
    ];


    return (
        <section id='hakkimda' className="min-h-screen bg-background py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-block">
                        <h2 className="text-4xl bigLg:text-5xl font-bold text-foreground mb-2">
                            Hakkımda
                        </h2>
                        <div className="w-full h-1 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full"></div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                    <div className="space-y-8">
                        <Card variant="elevated" padding="lg" className="bg-white">
                            <CardHeader>
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                    Full Stack Developer
                                </h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                    Dinamik ve sonuç odaklı bir yazılım geliştirici olarak, hem backend hem de frontend alanlarında deneyime sahibim.
                                </p>
                                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                    Projelerimi bulut tabanlı ortamlara başarıyla entegre ederken, Kubernetes gibi containerization teknolojilerini etkin bir şekilde kullanıyorum.
                                </p>
                                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                    Yapay zeka alanında da aktif çalışmalar yürütüyor; LangChain ve LangGraph gibi modern frameworkleri kullanarak karmaşık LLM orkestrasyon mimarileri tasarlıyorum.
                                </p>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    DevOps prensiplerine olan ilgim sayesinde, geliştirme ve operasyon ekipleri arasında köprü kurarak, hızlı ve güvenilir teslimatlar gerçekleştiriyorum.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-6 bg-white rounded-lg shadow-md">
                                <div className="text-3xl font-bold text-gray-700 mb-2">2+</div>
                                <div className="text-sm text-gray-600">Yıl Deneyim</div>
                            </div>
                            <div className="text-center p-6 bg-white rounded-lg shadow-md">
                                <div className="text-3xl font-bold text-gray-800 mb-2">60+</div>
                                <div className="text-sm text-gray-600">Tamamlanan Proje</div>
                            </div>
                            <div className="text-center p-6 bg-white rounded-lg shadow-md">
                                <div className="text-3xl font-bold text-gray-700 mb-2">15+</div>
                                <div className="text-sm text-gray-600">Teknoloji Stack</div>
                            </div>
                            <div className="text-center p-6 bg-white rounded-lg shadow-md">
                                <div className="text-3xl font-bold text-gray-800 mb-2">24/7</div>
                                <div className="text-sm text-gray-600">Öğrenme Tutkusu</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-16">
                    <h3 className="text-3xl bigLg:text-4xl font-bold text-center mb-12 text-foreground">
                        Uzmanlık Alanlarım
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {skills.map((skill, index) => (
                            <Card
                                key={index}
                                variant="elevated"
                                padding="lg"
                                className="text-center hover:scale-105 transition-transform duration-300"
                            >
                                <div className="text-4xl mb-4">{skill.icon}</div>
                                <h3 className="text-xl font-bold mb-3 text-gray-800">
                                    {skill.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {skill.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="mb-16">
                    <TechnologiesSlider />
                </div>

                <div className="text-center">
                    <Card variant="elevated" padding="lg" className="max-w-4xl mx-auto bg-white">
                        <CardContent>
                            <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed italic">
                                "Agile prensiplerini benimseyerek, ekip çalışmasını ve esnekliği ön planda tutuyor,
                                sürekli öğrenmeye ve yenilikçi çözümler geliştirmeye olan tutkumla,
                                karmaşık problemleri çözmek için etkili yaklaşımlar geliştiriyorum."
                            </blockquote>
                            <div className="mt-6 flex justify-center">
                                <div className="w-16 h-1 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full"></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

export default AboutSection