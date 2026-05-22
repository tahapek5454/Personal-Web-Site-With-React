'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const COLORS = [
    '#f59e0b', '#ef4444', '#3b82f6', '#10b981',
    '#8b5cf6', '#f97316', '#ec4899', '#06b6d4',
    '#84cc16', '#f43f5e',
]
const PARTICLE_COUNT = 30 // her yönden 30, toplamda 60

function spawnParticle(side: 'left' | 'right'): HTMLDivElement {
    const el = document.createElement('div')
    const size = Math.random() * 10 + 6
    const isCircle = Math.random() > 0.4

    el.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
        border-radius: ${isCircle ? '50%' : '2px'};
        pointer-events: none;
        z-index: 9999;
        top: ${Math.random() * 60 + 20}vh;
        ${side}: 0px;
        opacity: 1;
    `
    return el
}

function ProjectSectionAnimation() {
    useGSAP(() => {
        const sectionEl = document.getElementById('projeler')
        if (!sectionEl) return

        const media = gsap.matchMedia()

        media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
            ScrollTrigger.create({
                trigger: sectionEl,
                start: 'top 20%',
                onEnter: () => {

                    const burst = (side: 'left' | 'right') => {
                        for (let i = 0; i < PARTICLE_COUNT; i++) {
                            const el = spawnParticle(side)
                            document.body.appendChild(el)

                            const dirX = side === 'left'
                                ? Math.random() * 380 + 80
                                : -(Math.random() * 380 + 80)

                            gsap.fromTo(
                                el,
                                { x: 0, y: 0, opacity: 1, rotation: 0, scale: 1 },
                                {
                                    x: dirX,
                                    y: (Math.random() - 0.45) * 500,
                                    opacity: 0,
                                    rotation: Math.random() * 720 - 360,
                                    scale: Math.random() * 0.5 + 0.3,
                                    duration: Math.random() * 1.2 + 1,
                                    ease: 'power3.out',
                                    delay: Math.random() * 0.35,
                                    onComplete: () => el.remove(),
                                }
                            )
                        }
                    }

                    burst('left')
                    burst('right')
                },
            })
        })
    })

    return null
}

export default ProjectSectionAnimation
