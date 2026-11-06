'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const MascotStage = dynamic(() => import('./AIMascotStage'), { ssr: false })

export default function AIMascots() {
    const host = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const element = host.current
        if (!element) return

        const desktop = window.matchMedia('(min-width: 768px)')
        let observer: IntersectionObserver | undefined

        const watchSection = () => {
            observer?.disconnect()
            observer = undefined

            if (!desktop.matches) {
                setVisible(false)
                return
            }

            observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setVisible(true)
                        observer?.disconnect()
                    }
                },
                { rootMargin: '160px' },
            )
            observer.observe(element)
        }

        watchSection()
        desktop.addEventListener('change', watchSection)
        return () => {
            desktop.removeEventListener('change', watchSection)
            observer?.disconnect()
        }
    }, [])

    return (
        <div ref={host} className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
            {visible && <MascotStage />}
        </div>
    )
}
