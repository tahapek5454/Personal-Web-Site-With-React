import React from 'react'
import { siteConfig } from '@/config/site'
import { getDict, type Locale } from '@/content/dictionary'
import { mailto, paths } from '@/lib/i18n'
import { FileIcon, GithubIcon, InstagramIcon, LinkedinIcon, MailIcon } from './icons'

const quickLink = 'inline-block py-1 text-gray-300 hover:text-white transition-colors duration-200 text-sm'
const iconLink = 'flex items-center space-x-2 py-1 text-gray-300 hover:text-white transition-colors duration-200 text-sm'
const external = { target: '_blank', rel: 'noopener noreferrer' } as const

function Footer({ lang }: { lang: Locale }) {
    const dict = getDict(lang)
    const home = paths.home(lang)
    const mail = mailto(dict.mail.subject, dict.mail.body)

    return (
        <footer className='bg-black text-white'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
                    <div className='md:col-span-2'>
                        <div className='flex items-center mb-4'>
                            <span className='text-3xl font-bold text-white'>TAHA</span>
                            <span className='text-3xl ml-1 font-[200] text-white'>PEK</span>
                        </div>
                        <p className='text-gray-300 text-sm leading-relaxed max-w-md'>{dict.footer.role}</p>
                        <div className='mt-6'>
                            <p className='text-gray-400 text-xs'>
                                © {new Date().getFullYear()} Taha Pek. {dict.footer.rights}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h2 className='text-lg font-semibold mb-4 text-white'>{dict.footer.quickLinks}</h2>
                        <div className='flex flex-col'>
                            <a href={`${home}#${dict.ids.about}`} className={quickLink}>{capitalize(dict.nav.about, lang)}</a>
                            <a href={`${home}#${dict.ids.experience}`} className={quickLink}>{capitalize(dict.nav.experience, lang)}</a>
                            <a href={`${home}#${dict.ids.skills}`} className={quickLink}>{capitalize(dict.nav.skills, lang)}</a>
                            <a href={`${home}#${dict.ids.projects}`} className={quickLink}>{capitalize(dict.nav.projects, lang)}</a>
                            <a href={paths.blog(lang)} className={quickLink}>{capitalize(dict.nav.blog, lang)}</a>
                            <a href={mail} className={quickLink}>{dict.footer.contact}</a>
                        </div>
                    </div>

                    <div>
                        <h2 className='text-lg font-semibold mb-4 text-white'>{dict.footer.links}</h2>
                        <div className='flex flex-col'>
                            <a href={siteConfig.social.github} {...external} className={iconLink}>
                                <GithubIcon className='w-5 h-5' />
                                <span>GitHub</span>
                            </a>
                            <a href={siteConfig.social.linkedin} {...external} className={iconLink}>
                                <LinkedinIcon className='w-5 h-5' />
                                <span>LinkedIn</span>
                            </a>
                            <a href={siteConfig.social.instagram} {...external} className={iconLink}>
                                <InstagramIcon className='w-5 h-5' />
                                <span>Instagram</span>
                            </a>
                            <a href={mail} className={iconLink}>
                                <MailIcon className='w-5 h-5' />
                                <span>{siteConfig.email}</span>
                            </a>
                            <a href={siteConfig.cvUrl} {...external} className={iconLink}>
                                <FileIcon className='w-5 h-5' />
                                <span>{dict.footer.cv}</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className='border-t border-gray-800 mt-8 pt-6'>
                    <div className='flex flex-col md:flex-row justify-between items-center'>
                        <div className='text-gray-400 text-xs mb-4 md:mb-0'>
                            <span>{dict.footer.role}</span>
                            <span className='mx-2'>•</span>
                            <span>{dict.footer.location}</span>
                        </div>
                        <div className='text-gray-400 text-xs'>
                            <span>Next.js</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

// Nav labels are upper-case; footer shows them in sentence case.
function capitalize(label: string, lang: Locale) {
    const locale = lang === 'tr' ? 'tr-TR' : 'en-US'
    return label.charAt(0).toLocaleUpperCase(locale) + label.slice(1).toLocaleLowerCase(locale)
}

export default Footer
