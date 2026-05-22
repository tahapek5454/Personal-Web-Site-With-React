'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

const technologies = [
    { name: "C#",         icon: "/icons/csharp.png",       color: "from-purple-500 to-blue-600"    },
    { name: "JavaScript", icon: "/icons/javascript.png",    color: "from-yellow-400 to-amber-500"   },
    { name: "TypeScript", icon: "/icons/typescript.png",    color: "from-blue-500 to-indigo-600"    },
    { name: "Nuxt.js",    icon: "/icons/nuxtjs.png",        color: "from-green-500 to-emerald-600"  },
    { name: "Python",     icon: "/icons/python.webp",       color: "from-yellow-500 to-blue-600"    },
    { name: "Next.js",    icon: "/icons/nextjs-icon.svg",   color: "from-gray-700 to-gray-900"      },
    { name: "Docker",     icon: "/icons/docker.webp",       color: "from-blue-400 to-cyan-600"      },
    { name: "Java",       icon: "/icons/java.png",          color: "from-orange-400 to-red-500"     },
    { name: "React",      icon: "/icons/react.png",         color: "from-cyan-400 to-blue-500"      },
    { name: "Kubernetes", icon: "/icons/kubernetes.png",    color: "from-blue-500 to-violet-600"    },
    { name: "Cloud",      icon: "/icons/cloud.webp",        color: "from-sky-400 to-cyan-500"       },
    { name: "Vue",        icon: "/icons/vue.png",           color: "from-green-400 to-teal-500"     },
]

// Items çift yapılıyor — seamless sonsuz döngü için
const doubled = [...technologies, ...technologies]

function TechnologiesSlider() {
    const trackRef = useRef<HTMLDivElement>(null)
    const tweenRef = useRef<gsap.core.Tween | null>(null)

    useGSAP(() => {
        const track = trackRef.current
        if (!track) return

        tweenRef.current = gsap.to(track, {
            xPercent: -50,
            duration: 28,
            ease: 'none',
            repeat: -1,
        })
    }, { scope: trackRef })

    const handleMouseEnter = () => tweenRef.current?.pause()
    const handleMouseLeave = () => tweenRef.current?.resume()

    return (
        <div
            className="relative overflow-hidden py-4 select-none"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Kenar soluklaştırma maskeleri */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />

            <div ref={trackRef} className="flex gap-6" style={{ width: 'max-content' }}>
                {doubled.map((tech, index) => (
                    <div key={index} className="flex-shrink-0 group">
                        {/* Gradient border: padding wrapper tekniği */}
                        <div className={`p-[2px] rounded-full bg-gradient-to-br ${tech.color} shadow-md group-hover:shadow-lg group-hover:scale-105 transition-transform duration-200`}>
                            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                                <div className="text-center">
                                    <div className="mb-1 flex justify-center">
                                        <Image
                                            src={tech.icon}
                                            width={40}
                                            height={40}
                                            alt={tech.name}
                                            style={{ objectFit: 'contain', width: '40px', height: '40px' }}
                                        />
                                    </div>
                                    <div className="text-xs font-semibold text-gray-700 leading-tight">
                                        {tech.name}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TechnologiesSlider