import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function HeaderSection() {
    return (
        <div className='bg-background'>
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col bigLg:flex-row items-center justify-between gap-12 h-full">
                    <div className="flex-1 max-w-md">
                        <div className="relative">                            
                            <Image
                                src="/images/image1.jpeg"
                                alt="Developer Profile"
                                width="450"
                                height={500}
                                style={{
                                    objectFit: "cover"
                                }}
                                className="rounded-2xl shadow-2xl"
                                priority
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknysoS2j3pBSRgOoE5A/qPjmilTNVakMADKFLOST1x9FnTKzGSvRo8V1o7EV1qmFBQFAUA="
                            />
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full opacity-20"></div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-6 text-center bigLg:text-left">
                        <div className="space-y-4">
                            <h1 className="text-4xl bigLg:text-5xl font-bold text-foreground leading-tight">
                                Merhaba, Ben Taha Pek
                                <span className="block bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                    Full Stack Developer
                                </span>
                            </h1>

                            <p className="text-lg bigLg:text-xl text-gray-600 max-w-2xl leading-relaxed">
                            09.08.2002 Sakarya' da doğdum.
                            <br />
                            Kocaeli Üniversitesi Bilgisayar Mühendisliği mezunuyum.
                            <br />
                            Aktif olarak Doğuş Teknoloji şirketinde Software Developer olarak görev almaktayım.
                            </p>
                        </div>                       
                        <div className="flex flex-col sm:flex-row gap-4 justify-center bigLg:justify-start">
                            <Link href="https://github.com/tahapek5454" target='_blank' className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                                Projelerimi İncele
                            </Link>
                            <Link 
                                href="mailto:tahapek5454@gmail.com?subject=İletişim - Kişisel Web Sitesi&body=Merhaba Taha,"
                                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-gray-700 hover:text-gray-900 transition-all duration-300"
                            >
                                İletişime Geç
                            </Link>
                        </div>                        
                        <div className="flex space-x-6 justify-center bigLg:justify-start">
                            {/* LinkedIn */}
                            <Link 
                                href="https://www.linkedin.com/in/taha-pek-413b1b221/" 
                                target="_blank"
                                className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-all duration-300 group"
                            >
                                <svg className="w-7 h-7 text-gray-600 group-hover:text-blue-700 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </Link>
                              {/* GitHub */}
                            <Link 
                                href="https://github.com/tahapek5454" 
                                target="_blank"
                                className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-800 hover:text-white cursor-pointer transition-all duration-300 group"
                            >
                                <svg className="w-7 h-7 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </Link>
                            <Link 
                                href="https://www.instagram.com/tahapek" 
                                target="_blank"
                                className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white cursor-pointer transition-all duration-300 group"
                            >
                                <svg className="w-7 h-7 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderSection