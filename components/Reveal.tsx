'use client'
import React, { useEffect, useRef } from 'react'

// Content is visible in the server HTML; items below the fold are hidden
// only after hydration and revealed on scroll.
export default function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        if (el.getBoundingClientRect().top < window.innerHeight) return

        el.dataset.reveal = 'hidden'
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.dataset.reveal = 'shown'
                    observer.disconnect()
                }
            },
            { threshold: 0.2, rootMargin: '0px 0px -50px 0px' },
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <div ref={ref} className={`reveal ${className}`}>
            {children}
        </div>
    )
}
