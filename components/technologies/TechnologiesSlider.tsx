'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

function TechnologiesSlider() {    
    const [mounted, setMounted] = useState(false)
    
    useEffect(() => {
        setMounted(true)
    }, [])
    
    const technologies = [
    { name: "C#", icon: "/icons/csharp.png", color: "from-purple-500 to-blue-600" },
    { name: "Java Script", icon: "/icons/javascript.png", color: "from-purple-500 to-blue-600" },
    { name: "Type Script", icon: "/icons/typescript.png", color: "from-purple-500 to-blue-600" },
    { name: "Nuxt.js", icon: "/icons/nuxtjs.png", color: "from-green-500 to-emerald-600" },
    { name: "Python", icon: "/icons/python.webp", color: "from-yellow-500 to-blue-600" },
    { name: "Next.js", icon: "/icons/nextjs-icon.svg", color: "from-black to-gray-600" },
    { name: "Docker", icon: "/icons/docker.webp", color: "from-blue-400 to-cyan-600" },
    { name: "Java", icon: "/icons/java.png", color: "from-yellow-400 to-orange-500" },
    { name: "React", icon: "/icons/react.png", color: "from-cyan-400 to-blue-500" },
    { name: "Kubernetes", icon: "/icons/kubernetes.png", color: "from-cyan-400 to-blue-500" },
    { name: "Cloud", icon: "/icons/cloud.webp", color: "from-cyan-400 to-blue-500" },
    { name: "Vue", icon: "/icons/vue.png", color: "from-cyan-400 to-blue-500" },
    ];

    if (!mounted) {
        return <div className="relative overflow-x-auto h-32"></div>
    }
    return (
        <div className="relative overflow-x-auto">
            <div
                className="select-none"
            >
                <div className="flex space-x-6 py-4" style={{ width: 'max-content' }}>
                    {technologies.map((tech, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 group pointer-events-none"
                        >                            
                        <div className="w-24 h-24 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:scale-105 border-2 border-gray-100 transform-gpu">
                                <div className="text-center">
                                    <div className="mb-1 flex justify-center">
                                        <Image src={tech.icon} width={40} height={40} alt={tech.name} style={{ objectFit: 'contain' , width: '40px', height: '40px' }} />
                                    </div>
                                    <div className="text-xs font-semibold text-gray-700 leading-tight">{tech.name}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    )
}

export default TechnologiesSlider