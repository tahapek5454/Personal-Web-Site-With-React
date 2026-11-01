"use client"

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Slide-in animation for the abilities card and photo; markup stays server-rendered.
export default function AbilitiesAnimation() {
    useGSAP(() => {
        const sectionEl = document.querySelector('[data-abilities]')
        const textEl = document.getElementById('abilitiesText')
        const imageEl = document.getElementById('abilitiesImage')
        if (!sectionEl || !textEl || !imageEl) return

        const media = gsap.matchMedia()
        media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
            const scrollTrigger = {
                trigger: sectionEl,
                start: 'top 80%',
                end: 'top 15%',
                scrub: 1,
            }
            gsap.fromTo(textEl, { x: -320, opacity: 0 }, { x: 0, opacity: 1, duration: 2, ease: 'power3.out', immediateRender: false, scrollTrigger })
            gsap.fromTo(imageEl, { x: 320, opacity: 0 }, { x: 0, opacity: 1, duration: 2, ease: 'power3.out', immediateRender: false, scrollTrigger })
        })
        return () => media.revert()
    })

    return null
}
