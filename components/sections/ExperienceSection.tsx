'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader } from '../Card'
import Image from 'next/image'

interface ExperienceItem {
    id: number
    title: string
    company: string
    period: string
    src: string
    css: string
    type: 'education' | 'internship' | 'work'
    description: string
    skills?: string[]
}

function ExperienceSection() {
    const [visibleItems, setVisibleItems] = useState<number[]>([])
    const [mounted, setMounted] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

    const experiences: ExperienceItem[] = [
        {
            id: 4,
            title: "Software Developer",
            company: "Doğuş Teknoloji",
            src: "/logos/dt-logo.svg",
            period: "Şub 2024 - Devam Ediyor",
            type: "work",
            description: "Profesyonel yazılım geliştirme projelerinde aktif rol alıyorum.",
            skills: [".NET", "Nuxt.js", "Next.js", "AI Entegration", "Vue","MSSQL", "PostgreSQL", "Kubernetes", "Docker"],
            css: "absolute -top-16 -right-4 w-[190] h-[70]"
        },
        {
            id: 3,
            title: "Software Developer Intern",
            company: "Doğuş Teknoloji",
            period: "Tem 2023 - Şub 2024",
            type: "internship",
            src: "/logos/dt-logo.svg",
            description: "Backend ve frontend geliştirme süreçlerinde kapsamlı deneyim edindim.",
            skills: [".NET", "Nuxt.js", "Next.js", "AI Entegration", "Vue","MSSQL", "PostgreSQL", "Kubernetes", "Docker"],
            css: "absolute -top-16 -right-4 w-[190] h-[70]"
        },
        {
            id: 2,
            title: "Software Developer Intern",
            company: "Nacsoft",
            period: "Kas 2022 - Ara 2022",
            type: "internship",
            src: "/logos/nacsoft.png",
            description: "Backend ve frontend geliştirme süreçlerinde kapsamlı deneyim edindim.",
            skills: [".Net", "ASP.NET Core", "C#", "SQL Server", "Entity Framework", "HTML", "CSS", "JavaScript"],
            css: "absolute -top-12 -right-4 w-[150] h-[40]"
        },
        {
            id: 1,
            title: "Bilgisayar Mühendisliği",
            company: "Kocaeli Üniversitesi",
            period: "Eyl 2020 - Haz 2024",
            type: "education",
            src: "/logos/kou.svg",
            description: "Yazılım geliştirme, algoritma ve veri yapıları konularında derinlemesine eğitim aldım.",
            skills: ["Algoritma", "Veri Yapıları", "Yazılım Mühendisliği", "Yapay zeka", "Makine Öğrenimi"],            css: "absolute -top-16 -right-4 w-[80] h-[80]"
        },
    ]

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute('data-index') || '0')
                        setVisibleItems(prev => [...new Set([...prev, index])])
                    }
                })
            },
            { threshold: 0.3, rootMargin: '0px 0px -50px 0px' }
        )

        const items = sectionRef.current?.querySelectorAll('[data-index]')
        items?.forEach(item => observer.observe(item))

        return () => observer.disconnect()
    }, [mounted])
    const getItemClassName = (index: number) => {
        if (!mounted) {
            return 'opacity-0 translate-y-8'  // Server ve client aynı başlangıç durumu
        }
        return visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }

    return (
        <section id='tecrubeler' ref={sectionRef} className="py-20">
            <div className="container mx-auto ">
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-block">
                        <h2 className="text-4xl bigLg:text-5xl font-bold text-foreground mb-2">
                            Tecrübelerim
                        </h2>
                        <div className="w-full h-1 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full"></div>
                    </div>
                    <p className="text-base mt-2 md:text-lg text-gray-600  max-w-2xl mx-auto px-4">
                        Eğitimden profesyonel kariyere uzanan yolculuğumda edindiğim deneyimler
                    </p>
                </div>

                {/* Desktop Timeline */}
                <div className="hidden lg:block relative max-w-6xl mx-auto">
                    <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-gradient-to-b from-black 
                    to-gray-600 rounded-full opacity-20"></div>

                    {experiences.map((exp, index) => (
                        <div
                            key={exp.id}
                            data-index={index}
                            className={`relative flex items-center mb-16 transition-all duration-700 transform ${index % 2 === 0 ? 'justify-start' : 'justify-end'
                                } ${getItemClassName(index)}`}
                        >
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-white  border-4 border-black z-10 shadow-lg">
                                <div className="absolute inset-0.5 rounded-full bg-black"></div>
                            </div>
                            <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>                                <Card
                                variant="elevated"
                                padding="lg"
                                rounded="xl"
                                className="group bg-white  border border-gray-100 relative overflow-visible"
                            >
                                <Image
                                    src={exp.src}
                                    alt={exp.title}
                                    width={80}
                                    height={80}
                                    className={exp.css}
                                />

                                <CardHeader className="mb-3">


                                    <div className="text-sm text-gray-500  mb-2 font-medium">
                                        {exp.period}
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-800  mb-1">
                                        {exp.title}
                                    </h3>
                                    <h3 className="text-lg text-blue-600  font-semibold">
                                        {exp.company}
                                    </h3>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-gray-600  mb-4 leading-relaxed text-sm">
                                        {exp.description}
                                    </p>

                                    {exp.skills && (
                                        <div className="flex flex-wrap gap-2">
                                            {exp.skills.map((skill, skillIndex) => (
                                                <span
                                                    key={skillIndex}
                                                    className="px-2 py-1 bg-gray-100  text-gray-700  rounded-full text-xs font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Mobile/Tablet Layout */}
                <div className="lg:hidden space-y-6">
                    {experiences.map((exp, index) => (
                        <div
                            key={exp.id}
                            data-index={index}
                            className={`transition-all duration-700 transform ${getItemClassName(index)}`}
                        >                            
                        <Card
                            variant="elevated"
                            padding="md"
                            rounded="xl"
                            className="bg-white  border border-gray-100 relative overflow-visible"
                        >
                                <Image
                                    src={exp.src}
                                    alt={exp.title}
                                    width={70}
                                    height={70}
                                    className='absolute  -top-3 -right-3  object-contain z-10'
                                />
                                <CardHeader className="mb-3">
                                    <div className="flex items-start justify-between mb-3">

                                        <div className="text-xs md:text-sm text-gray-500  font-medium">
                                            {exp.period}
                                        </div>
                                    </div>

                                    <h3 className="text-lg md:text-xl font-bold text-gray-800  mb-1">
                                        {exp.title}
                                    </h3>
                                    <h3 className="text-base md:text-lg text-blue-600  font-semibold">
                                        {exp.company}
                                    </h3>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-gray-600 mb-4 leading-relaxed text-sm md:text-base">
                                        {exp.description}
                                    </p>

                                    {exp.skills && (
                                        <div className="flex flex-wrap gap-2">
                                            {exp.skills.map((skill, skillIndex) => (
                                                <span
                                                    key={skillIndex}
                                                    className="px-2 md:px-3 py-1 bg-gray-100  text-gray-700  rounded-full text-xs md:text-sm font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ExperienceSection
