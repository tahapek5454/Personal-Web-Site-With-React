import React from 'react'

function CustomExperiece() {
    return (
        <>
            <section className='py-16 md:py-24 px-4 bg-gradient-to-b from-black via-gray-900 to-gray-800'>
                <div className="container">

                    <h2 className='text-3xl md:text-5xl text-gega-red tracking-wider mb-12'>Tecrübeler</h2>

                    <div className='flex justify-center space-x-0 md:space-x-8'>

                        <div className='flex flex-col items-end pr-2 md:pr-0 md:items-center space-y-36 md:space-y-56'>

                            <div className='border md:border-4 border-solid border-gega-grey rounded-lg shadow-lg shadow-white hover:scale-105 duration-500 text-gega-white md:min-w-[410px]'>

                                <div className='border-b md:border-b-2 border-solid border-gega-grey p-1 md:p-4  flex justify-center space-x-2 md:space-x-0 md:justify-between items-center'>
                                    <h2 className='font-gemunu text-sm md:text-2xl hover:scale-105 duration-500'>Doğuş Teknoloji</h2>
                                    <i className="fa-solid fa-laptop md:text-xl"></i>
                                </div>

                                <div className='border-t md:border-t-2 border-solid border-gega-grey p-1 md:p-4 flex flex-col md:flex-row justify-between items-center md:space-x-8'>
                                    <span className='text-xs md:text-base'>Full-Stack Developer Intern</span>
                                    <span className='text-xs md:text-base'> Temmuz 2023</span>
                                </div>

                            </div>

                            <div className='border md:border-4 border-solid border-gega-grey rounded-lg shadow-lg shadow-white hover:scale-105 duration-500 text-gega-white md:min-w-[410px]'>

                                <div className='border-b md:border-b-2 border-solid border-gega-grey p-1 md:p-4  flex justify-center space-x-2 md:space-x-0 md:justify-between items-center'>
                                    <h2 className='font-gemunu text-sm md:text-2xl hover:scale-105 duration-500'>ABVAG</h2>
                                    <i className="fa-solid fa-people-group md:text-xl"></i>
                                </div>

                                <div className='border-t md:border-t-2 border-solid border-gega-grey p-1 md:p-4 flex flex-col md:flex-row justify-between items-center md:space-x-8'>
                                    <span className='text-xs md:text-base'>Akan Büyük Veri Analiz Grubu</span>
                                    <span className='text-xs md:text-base'> Mart 2021</span>
                                </div>

                            </div>

                            <div className='border md:border-4 border-solid border-gega-grey rounded-lg shadow-lg shadow-white hover:scale-105 duration-500 text-gega-white md:min-w-[410px]'>

                                <div className='border-b md:border-b-2 border-solid border-gega-grey p-1 md:p-4  flex justify-center space-x-2 md:space-x-0 md:justify-between items-center'>
                                    <h2 className='font-gemunu text-sm md:text-2xl hover:scale-105 duration-500'>Necmettin Erbakan Fen Lisesi</h2>
                                    <i className="fa-solid fa-school md:text-xl"></i>
                                </div>

                                <div className='border-t md:border-t-2 border-solid border-gega-grey p-1 md:p-4 flex flex-col md:flex-row justify-between items-center md:space-x-8'>
                                    <span className='text-xs md:text-base'>Lise Eğitimi</span>
                                    <span className='text-xs md:text-base'> Eylül 2016 - Haziran 2020</span>
                                </div>

                            </div>

                        </div>

                        <div className="border-l md:border-l-4 border-white h-[37rem] md:h-[62rem] mx-auto"> </div>

                        <div className='flex flex-col items-start pl-2 md:pl-0 md:items-center mt-28 md:mt-44 space-y-36 md:space-y-56'>


                            <div className='border md:border-4 border-solid border-gega-grey rounded-lg shadow-lg shadow-white hover:scale-105 duration-500 text-gega-white md:min-w-[410px]'>

                                <div className='border-b md:border-b-2 border-solid border-gega-grey p-1 md:p-4  flex justify-center space-x-2 md:space-x-0 md:justify-between items-center'>
                                    <h2 className='font-gemunu text-sm md:text-2xl hover:scale-105 duration-500'>Nacsoft Yazılım</h2>
                                    <i className="fa-solid fa-laptop md:text-xl"></i>
                                </div>

                                <div className='border-t md:border-t-2 border-solid border-gega-grey p-1 md:p-4 flex flex-col md:flex-row justify-between items-center md:space-x-8'>
                                    <span className='text-xs md:text-base'>Software Intern</span>
                                    <span className='text-xs md:text-base'> Kasım 2022 - Aralık 2022</span>
                                </div>

                            </div>

                            <div className='border md:border-4 border-solid border-gega-grey rounded-lg shadow-lg shadow-white hover:scale-105 duration-500 text-gega-white md:min-w-[410px]'>

                                <div className='border-b md:border-b-2 border-solid border-gega-grey p-1 md:p-4  flex justify-center space-x-2 md:space-x-0 md:justify-between items-center'>
                                    <h2 className='font-gemunu text-sm md:text-2xl hover:scale-105 duration-500'>Kocaeli Üniversitesi</h2>
                                    <i className="fa-solid fa-building-columns md:text-xl"></i>
                                </div>

                                <div className='border-t md:border-t-2 border-solid border-gega-grey p-1 md:p-4 flex flex-col md:flex-row justify-between items-center md:space-x-8'>
                                    <span className='text-xs md:text-base'>Bilgisayar Mühendisliği</span>
                                    <span className='text-xs md:text-base'> Eylül 2020</span>
                                </div>

                            </div>

                            <button className='mt-3 md:mt-0 text-xl md:text-3xl bg-gega-red px-3 py-1 hover:bg-rose-600 transation duration-500 rounded-xl md:min-w-[410px] md:h-24'>
                                <span className="font-gemunu text-gega-grey">CV</span> <i className="fa-solid fa-download text-gega-grey"></i>
                            </button>

                        </div>

                    </div>

                </div>
            </section>
        </>
    )
}

export default CustomExperiece