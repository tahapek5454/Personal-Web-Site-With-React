import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '../Card'
import Image from 'next/image'

interface Project {
    id: number;
    title: string;
    description: string;
    longDescription: string;
    technologies: string[];
    githubUrl: string;
    liveUrl?: string;
    image?: string;
    featured?: boolean;
}

function ProjectSection() {
    const projects: Project[] = [
        {
            id: 1,
            title: "Sinema Mikroservis (D-TIX)",
            description: "Sinema uygulaması için geliştirdiğim mikroservis mimarisi projesi",
            longDescription: "Modern bir sinema yönetim sistemi. .NET Core, Docker ve Kubernetes kullanılarak geliştirilmiştir. Mikroservis mimarisine sahip ve bulut tabanlı bir yaklaşımla tasarlanmıştır.",
            technologies: [".NET", "Vue", "Kubernetes", "PostgreSQL", "Redis"],
            githubUrl: "https://github.com/tahapek5454/Cinema-MicroServices",
            image: "/images/d-tix.webp",
            featured: true
        },
        {
            id: 2,
            title: "AI-ChatAgent-With-MCP",
            description: "OpenAI modelleriyle entegre, MCP destekli .NET tabanlı sohbet ajanı.",
            longDescription: "OpenAI modellerini Model Context Protocol (MCP) ile entegre eden, genişletilebilir araç desteği ve özel yapay zeka yetenekleri sunan .NET tabanlı bir sohbet ajanı.",
            technologies: [".NET Core", "Semantic Kernel", "OpenAI", "MCP", "C#"],
            githubUrl: "https://github.com/tahapek5454/AI-ChatAgent-With-MCP",
            featured: false
        },
        {
            id: 3,
            title: "DODKA (TÜBİTAK)",
            description: "Görme engelli bireyler için sesli-interaktif doküman arama sistemi.",
            longDescription: "Bu çalışmada, görme engelli bireylerin dijital olmayan dokümanlar üzerinde sesli ve interaktif olarak arama yapmalarına imkan sağlayan mobil destekli bir sistem geliştirilmiştir.",
            technologies: ["Python", "React Native", "YOLO", "Google Vision API"],
            githubUrl: "https://github.com/orgs/Abvag-Bitirme-OCR/repositories"
        },
        {
            id: 4,
            title: "Self Waiter",
            description: "Kafe ve restoranlarda sipariş verme ve takip etme sistemi.",
            longDescription: "Bu projenin amacı, kafe ve restoranlarda herhangi bir zaman kaybı yaşamadan kare kod ile menü görüntülemenin (çoklu dil destekli) yanı sıra sipariş verme ve siparişi takip etme sistemi kurmaktır.",
            technologies: ["Vue.js", ".Net", "Redis", "WebSocket", "PostgreSQL"],
            githubUrl: "https://github.com/tahapek5454/Self-Waiter"
        },
        {
            id: 5,
            title: "Yapay Sinir Ağı ile Diyabet Tahmini",
            description: "Diyabet hastalığı tahmini için yapay sinir ağı ile sınıflandırma modeli.",
            longDescription: "Bu çalışmada amaç, diyabet hasta tespitini kendi oluşturduğum nöron ağı mimarisiyle tespit etmeye yarayan bir sınıflandırma ağı inşa etmektir. Mimariye uygun feed-forward ve back-propagation algoritmaları yazılmıştır.",
            technologies: ["Python", "YSA"],
            githubUrl: "https://github.com/tahapek5454/Diabetes-Prediction-with-ANN"
        },
        {
            id: 6,
            title: "Saga-Pattern-Orchestration-Eventual-Consistency",
            description: "Distributed sistemlerde veri tutarlılığını sağlamak için kullanılan yöntemlerden biridir.",
            longDescription: "Bu çalışmada amaç, distributed sistemlerde veri tutarlılığını sağlanması için kullanılan yöntemlerden olan Eventual Consistency yöntemini Saga Orchestration yaklaşımıyla birlikte ele almaktır.",
            technologies: [".Net", "C#", "Saga Pattern", "Orchestration", "Eventual Consistency"],
            githubUrl: "https://github.com/tahapek5454/Saga-Pattern-Orchestration-Eventual-Consistency"
        },
        {
            id: 7,
            title: "RabbitMQ With NETCore",
            description: "RabbitMQ ile .NETCore mimarisinde microservisler arası haberleşme.",
            longDescription: "Bu çalışmanın amacı microservisler arası haberleşmenin nasıl yapıldığını ve bir message-broker olan Rabbit-MQ teknolojisinin .NETCore mimarisinde nasıl kullanıldığını öğrenmektir.",
            technologies: [".Net", "C#", "RabbitMQ"],
            githubUrl: "https://github.com/tahapek5454/RabbitMQ-With-NETCore"
        }
    ];

    const featuredProject = projects.find(p => p.featured);
    const regularProjects = projects.filter(p => !p.featured);

    return (
        <section id='projeler' className="min-h-screen bg-background py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-block">
                        <h2 className="text-4xl bigLg:text-5xl font-bold text-foreground mb-2">
                            Kişisel Projelerim
                        </h2>
                        <div className="w-full h-1 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full"></div>
                    </div>
                    <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
                        Geliştirdiğim projeleri keşfedin. Her biri farklı teknolojiler ve yaklaşımlar kullanılarak oluşturulmuştur.
                    </p>
                </div>

                {featuredProject && (
                    <div className="mb-16">
                        <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Öne Çıkan Proje</h3>
                        <Card variant="elevated" padding="sm" className="bg-white overflow-hidden">                            
                            <div className="grid lg:grid-cols-2 h-full">
                                <div className="relative min-h-[300px] rounded-2xl overflow-hidden">
                                    <Image
                                        src={featuredProject.image as string}
                                        alt={featuredProject.title}
                                        className="object-cover rounded-2xl"
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        draggable="false"
                                    />
                                </div>
                                <div className="p-8 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-2xl font-bold text-foreground mb-4">{featuredProject.title}</h4>
                                        <p className="text-gray-600 mb-4">{featuredProject.longDescription}</p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {featuredProject.technologies.map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Link
                                            href={featuredProject.githubUrl}
                                            target="_blank"
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-center"
                                        >
                                            GitHub'da Görüntüle
                                        </Link>
                                        {featuredProject.liveUrl && (
                                            <Link
                                                href={featuredProject.liveUrl}
                                                target="_blank"
                                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-gray-700 hover:text-gray-900 transition-all duration-300 text-center"
                                            >
                                                Canlı Demo
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularProjects.map((project) => (
                        <Card key={project.id} variant="elevated" padding="lg" className="bg-white group hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-xl">📁</span>
                                    </div>
                                    <Link
                                        href={project.githubUrl}
                                        target="_blank"
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                        </svg>
                                    </Link>
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-gray-700 transition-colors duration-200">
                                    {project.title}
                                </h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.technologies.slice(0, 3).map((tech, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                            +{project.technologies.length - 3}
                                        </span>
                                    )}
                                </div>
                                <Link
                                    href={project.githubUrl}
                                    target="_blank"
                                    className="inline-flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-200"
                                >
                                    Projeyi İncele
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <Card variant="elevated" padding="lg" className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200">
                        <CardContent>
                            <h3 className="text-2xl font-bold text-foreground mb-4">Daha Fazla Proje</h3>
                            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                GitHub profilimde daha fazla proje ve açık kaynak katkılarımı keşfedebilirsiniz.
                            </p>
                            <Link
                                href="https://github.com/tahapek5454"
                                target="_blank"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                GitHub Profilimi Ziyaret Et
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

export default ProjectSection