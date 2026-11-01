import React from 'react'
import Image from 'next/image'
import { siteConfig } from '@/config/site'
import { getDict, type Locale } from '@/content/dictionary'
import { mailto, paths } from '@/lib/i18n'
import { GithubIcon, InstagramIcon, LinkedinIcon } from '../icons'

const external = { target: '_blank', rel: 'noopener noreferrer' } as const
const primaryBtn =
    'px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 motion-reduce:transform-none'
const socialBtn =
    'w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 group'

const blur =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknysoS2j3pBSRgOoE5A/qPjmilTNVakMADKFLOST1x9FnTKzGSvRo8V1o7EV1qmFBQFAUA='

function HeaderSection({ lang }: { lang: Locale }) {
    const dict = getDict(lang)
    const h = dict.header

    return (
        <div className='bg-background'>
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col bigLg:flex-row items-center justify-between gap-12 h-full">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Image
                                src="/images/image1.jpeg"
                                alt={h.photoAlt}
                                width={450}
                                height={500}
                                sizes="(max-width: 1090px) 90vw, 450px"
                                style={{ objectFit: 'cover' }}
                                className="rounded-2xl shadow-2xl"
                                placeholder="blur"
                                blurDataURL={blur}
                            />
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full opacity-20"></div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-6 text-center bigLg:text-left">
                        <div className="space-y-4">
                            <h2 className="text-4xl bigLg:text-5xl font-bold text-foreground leading-tight">
                                {h.greeting}
                            </h2>
                            <p className="block font-bold text-3xl bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                {h.role}
                            </p>
                            <p className="text-lg bigLg:text-xl text-gray-600 max-w-2xl leading-relaxed">
                                {h.bio.map((line, i) => (
                                    <React.Fragment key={i}>
                                        {i > 0 && <br />}
                                        {line}
                                    </React.Fragment>
                                ))}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center bigLg:justify-start">
                            <a href={`${paths.home(lang)}#${dict.ids.projects}`} className={primaryBtn}>
                                {h.viewProjects}
                            </a>
                            <a
                                href={mailto(dict.mail.subject, dict.mail.body)}
                                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-gray-700 hover:text-gray-900 transition-all duration-300"
                            >
                                {h.getInTouch}
                            </a>
                            <a href={siteConfig.cvUrl} {...external} className={primaryBtn}>
                                {h.cv}
                            </a>
                        </div>
                        <div className="flex space-x-6 justify-center bigLg:justify-start">
                            <a href={siteConfig.social.linkedin} {...external} aria-label={h.linkedinLabel} className={`${socialBtn} hover:bg-blue-100 hover:text-blue-700`}>
                                <LinkedinIcon className="w-7 h-7 text-gray-600 group-hover:text-blue-700 transition-colors" />
                            </a>
                            <a href={siteConfig.social.github} {...external} aria-label={h.githubLabel} className={`${socialBtn} hover:bg-gray-800 hover:text-white`}>
                                <GithubIcon className="w-7 h-7 text-gray-600 group-hover:text-white transition-colors" />
                            </a>
                            <a href={siteConfig.social.instagram} {...external} aria-label={h.instagramLabel} className={`${socialBtn} hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white`}>
                                <InstagramIcon className="w-7 h-7 text-gray-600 group-hover:text-white transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderSection
