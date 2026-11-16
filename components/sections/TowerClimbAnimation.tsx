'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function TowerClimbAnimation() {
    useGSAP(() => {
        const root = document.querySelector<HTMLElement>('[data-tc-root]')
        if (!root) return

        const q = gsap.utils.selector(root)
        const media = gsap.matchMedia()

        media.add('(prefers-reduced-motion: no-preference)', () => {
            const intro = gsap.timeline({
                scrollTrigger: { trigger: root, start: 'top 78%', once: true },
                defaults: { ease: 'power3.out' },
            })

            intro
                .from(q('[data-tc-reveal]'), { y: 36, autoAlpha: 0, duration: 0.8, stagger: 0.07 })
                .from(q('[data-tc-shot]'), { rotateY: -32, rotateX: 14, y: 70, autoAlpha: 0, duration: 1.2, ease: 'expo.out' }, 0.15)
                .from(q('[data-tc-float]'), { scale: 0, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(2.6)' }, 0.6)

            q('[data-tc-float]').forEach((el, i) => {
                gsap.to(el, {
                    y: i % 2 ? -12 : -18,
                    rotate: i % 2 ? 8 : -8,
                    duration: 2.2 + i * 0.35,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                    delay: 1 + i * 0.2,
                })
            })
        })

        media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
            const hero = q('[data-tc-hero]')
            const dust = q('[data-tc-dust]')

            // Jump in from below, then squash & stretch on landing like the in-game character.
            gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 70%', once: true } })
                .from(hero, { y: 320, scaleX: 0.78, scaleY: 1.28, autoAlpha: 0, duration: 0.6, ease: 'power2.out' })
                .to(hero, { scaleX: 1.16, scaleY: 0.82, duration: 0.12, ease: 'power1.in' })
                .fromTo(dust, { scale: 0.3, autoAlpha: 0.9 }, { scale: 1.8, autoAlpha: 0, duration: 0.7, ease: 'power2.out' }, '<')
                .to(hero, { scaleX: 1, scaleY: 1, duration: 0.8, ease: 'elastic.out(1, 0.35)' }, '<0.05')

            gsap.to(q('[data-tc-bob]'), { y: -14, duration: 1.9, ease: 'sine.inOut', yoyo: true, repeat: -1 })

            // Climb a little while the section scrolls by.
            gsap.fromTo(q('[data-tc-tilt]'), { yPercent: 6 }, {
                yPercent: -6,
                ease: 'none',
                scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
            })

            const heroTilt = q('[data-tc-tilt]')[0]
            const shotTilt = q('[data-tc-shot-tilt]')[0]
            const heroX = gsap.quickTo(heroTilt, 'rotationY', { duration: 0.6, ease: 'power3' })
            const heroY = gsap.quickTo(heroTilt, 'rotationX', { duration: 0.6, ease: 'power3' })
            const shotX = gsap.quickTo(shotTilt, 'rotationY', { duration: 0.8, ease: 'power3' })
            const shotY = gsap.quickTo(shotTilt, 'rotationX', { duration: 0.8, ease: 'power3' })
            gsap.set([heroTilt, shotTilt], { transformPerspective: 1200 })

            const onMove = (event: PointerEvent) => {
                const rect = root.getBoundingClientRect()
                const x = (event.clientX - rect.left) / rect.width - 0.5
                const y = (event.clientY - rect.top) / rect.height - 0.5
                heroX(x * 18)
                heroY(-y * 10)
                shotX(x * 10 - 4)
                shotY(-y * 8)
            }
            const onLeave = () => {
                heroX(0)
                heroY(0)
                shotX(-4)
                shotY(0)
            }

            gsap.set(shotTilt, { rotationY: -4 })
            root.addEventListener('pointermove', onMove)
            root.addEventListener('pointerleave', onLeave)
            return () => {
                root.removeEventListener('pointermove', onMove)
                root.removeEventListener('pointerleave', onLeave)
            }
        })
    })

    return null
}

export default TowerClimbAnimation
