import Image from 'next/image'
import Link from 'next/link'
import { getDict, type Locale } from '@/content/dictionary'
import type { Project } from '@/content/projects'
import { paths } from '@/lib/i18n'
import { DownloadIcon, GithubIcon } from '../icons'
import TowerClimbAnimation from './TowerClimbAnimation'

const external = { target: '_blank', rel: 'noopener noreferrer' } as const

const HERO = { src: '/images/projects/tower-climb/hero-point.png', width: 1240, height: 1268 }
const POWER_UPS = [
    { icon: '🚀', className: 'grid -top-6 left-[46%]' },
    { icon: '❤️', className: 'grid top-1/3 -right-4 sm:-right-7' },
    { icon: '⏳', className: 'hidden sm:grid -bottom-5 right-1/4' },
    { icon: '🧲', className: 'hidden sm:grid -bottom-4 -left-5' },
]
const LIGHT_COLORS = ['#7ee8f2', '#f9c6ff', '#fff4c2', '#b7a4f5']
const EMBERS = [
    { left: '58%', delay: '0s', duration: '7s' },
    { left: '64%', delay: '-2.4s', duration: '8.5s' },
    { left: '71%', delay: '-4.1s', duration: '6.5s' },
    { left: '79%', delay: '-1.2s', duration: '9s' },
    { left: '86%', delay: '-5.6s', duration: '7.5s' },
    { left: '93%', delay: '-3.3s', duration: '8s' },
    { left: '22%', delay: '-6.2s', duration: '9.5s' },
    { left: '35%', delay: '-0.8s', duration: '8s' },
]

// Points of a quadratic string-light curve (viewBox 600x100).
const LIGHTS = Array.from({ length: 13 }, (_, i) => {
    const t = (i + 0.5) / 13
    const x = (1 - t) ** 2 * 20 + 2 * (1 - t) * t * 300 + t ** 2 * 580
    const y = (1 - t) ** 2 * 14 + 2 * (1 - t) * t * 92 + t ** 2 * 14
    return { x, y, color: LIGHT_COLORS[i % LIGHT_COLORS.length], delay: `${(i % 5) * -0.6}s` }
})

export default function TowerClimbSection({ lang, project }: { lang: Locale; project: Project }) {
    const dict = getDict(lang)
    const t = dict.towerClimb
    const text = project.text[lang]
    const shot = project.image
    if (!shot) return null

    return (
        <article
            data-tc-root
            aria-labelledby="tower-climb-title"
            className="tc-stage relative isolate -mx-4 mb-24 rounded-4xl text-white shadow-[0_40px_120px_-40px_rgba(45,37,90,0.9)] sm:mx-0"
        >
            <TowerClimbAnimation />

            <div aria-hidden="true" className="tc-bricks absolute inset-0 -z-10 overflow-hidden rounded-4xl">
                {EMBERS.map((ember) => (
                    <span
                        key={ember.left}
                        className="tc-ember hidden md:block"
                        style={{ left: ember.left, animationDelay: ember.delay, animationDuration: ember.duration }}
                    />
                ))}
            </div>

            <svg aria-hidden="true" viewBox="0 0 600 100" className="tc-lights pointer-events-none absolute right-6 top-0 hidden w-[46%] md:block">
                <path d="M20 14 Q300 92 580 14" fill="none" stroke="#a8956b" strokeOpacity="0.55" strokeWidth="1.5" />
                <circle cx="20" cy="14" r="3.5" fill="#2a2440" />
                <circle cx="580" cy="14" r="3.5" fill="#2a2440" />
                {LIGHTS.map((light) => (
                    <circle
                        key={light.x}
                        cx={light.x}
                        cy={light.y + 5}
                        r="4.5"
                        fill={light.color}
                        className="tc-bulb"
                        style={{ animationDelay: light.delay, color: light.color }}
                    />
                ))}
            </svg>

            <div className="relative px-5 py-8 sm:p-10 lg:p-14">
                <header className="mb-6 flex flex-col gap-6 sm:mb-8 lg:mb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p data-tc-reveal className="mb-3 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#b7a4f5]/30 bg-[#b7a4f5]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d9ccff] sm:text-xs">
                            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#7ee8f2] shadow-[0_0_10px_#7ee8f2]" />
                            {t.eyebrow}
                        </p>
                        <div className="flex items-center gap-3">
                            <Image
                                src={HERO.src}
                                alt=""
                                width={96}
                                height={98}
                                sizes="80px"
                                className="h-20 w-auto shrink-0 drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)] lg:hidden"
                            />
                            <h3 data-tc-reveal id="tower-climb-title" className="tc-title text-4xl font-black leading-none tracking-tight sm:text-6xl lg:text-7xl">
                                {text.title}
                            </h3>
                        </div>
                    </div>
                    <dl data-tc-reveal className="hidden grid-cols-3 gap-3 sm:grid lg:min-w-88">
                        {t.stats.map((stat) => (
                            <div key={stat.label} className="flex flex-col-reverse rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-center backdrop-blur-sm">
                                <dt className="text-[11px] font-medium uppercase tracking-wider text-white/60">{stat.label}</dt>
                                <dd className="text-2xl font-black text-[#ffb35c]">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </header>

                <p data-tc-reveal className="mb-8 max-w-2xl text-base leading-relaxed text-[#e4dcff] sm:mb-10 sm:text-xl">
                    {t.tagline}
                </p>

                <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-6">
                    <div className="relative hidden lg:block">
                        <div className="sticky top-24">
                            <div data-tc-tilt className="relative -ml-10 -mt-6 transform-3d">
                                <div data-tc-hero className="relative origin-bottom">
                                    <div data-tc-bob>
                                        <Image
                                            src={HERO.src}
                                            alt={t.heroAlt}
                                            width={HERO.width}
                                            height={HERO.height}
                                            sizes="440px"
                                            className="tc-hero-img relative z-10 h-auto w-full max-w-110 select-none"
                                            draggable="false"
                                        />
                                    </div>
                                </div>
                                <div aria-hidden="true" className="tc-platform relative z-0 mx-auto -mt-8 h-6 w-[78%] max-w-85">
                                    <span data-tc-dust className="tc-dust" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="relative perspective-[1600px]">
                            <div data-tc-shot-tilt className="transform-3d">
                                <figure data-tc-shot className="tc-shot relative rounded-2xl p-1.5">
                                    <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: `${shot.width} / ${shot.height}` }}>
                                        <Image
                                            src={shot.src}
                                            alt={t.shotAlt}
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 620px"
                                            className="object-cover"
                                        />
                                        <span aria-hidden="true" className="tc-gloss" />
                                        <span aria-hidden="true" className="absolute left-3 top-3 rounded-lg bg-black/45 px-2.5 py-1 font-mono text-[11px] font-bold tracking-widest text-[#7ee8f2] backdrop-blur-sm sm:text-xs">
                                            {lang === 'tr' ? 'KAT 128' : 'FLOOR 128'}
                                        </span>
                                        <span aria-hidden="true" className="tc-combo absolute right-3 top-3 rounded-lg bg-[#ff8a1f] px-2.5 py-1 font-mono text-[11px] font-black tracking-widest text-gray-950 sm:text-xs">
                                            COMBO ×4
                                        </span>
                                    </div>
                                </figure>
                            </div>
                            {POWER_UPS.map((p) => (
                                <span
                                    key={p.icon}
                                    aria-hidden="true"
                                    data-tc-float
                                    className={`tc-powerup absolute h-11 w-11 place-items-center rounded-2xl text-xl sm:h-14 sm:w-14 sm:text-2xl ${p.className}`}
                                >
                                    {p.icon}
                                </span>
                            ))}
                        </div>

                        <p className="mt-8 leading-7 text-white/75 sm:hidden">{text.description}</p>

                        {text.features && (
                            <ul aria-label={t.featuresLabel} className="mt-8 grid gap-3 sm:grid-cols-2">
                                {text.features.map((feature, i) => (
                                    <li
                                        key={feature.title}
                                        data-tc-reveal
                                        className={`tc-feature rounded-2xl border border-white/10 bg-white/5 p-4 ${i > 1 ? 'hidden sm:block' : ''}`}
                                    >
                                        <h4 className="mb-1 font-bold text-[#ffcf99]">{feature.title}</h4>
                                        <p className="text-sm leading-relaxed text-white/65">{feature.description}</p>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div data-tc-reveal className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                            <a
                                href={project.downloadUrl}
                                {...external}
                                className="tc-cta inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#ff8a1f] to-[#ffc04d] px-7 py-3.5 font-bold text-gray-950 transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:transform-none"
                            >
                                <DownloadIcon className="h-5 w-5" />
                                {t.download}
                            </a>
                            <a
                                href={project.githubUrl}
                                {...external}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/6 px-7 py-3.5 font-semibold text-white transition-colors duration-300 hover:border-[#7ee8f2]/60 hover:bg-white/10"
                            >
                                <GithubIcon className="h-5 w-5" />
                                {t.source}
                            </a>
                            <Link
                                href={paths.project(lang, project.slug)}
                                prefetch={false}
                                className="inline-flex items-center justify-center gap-1 px-3 py-3 font-semibold text-[#d9ccff] transition-colors duration-200 hover:text-white"
                            >
                                {t.details}
                                <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                        <p className="mt-4 text-center text-xs tracking-[0.2em] text-white/40 sm:text-left">{t.platform}</p>
                    </div>
                </div>
            </div>
        </article>
    )
}
