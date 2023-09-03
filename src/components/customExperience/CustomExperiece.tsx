import React from 'react'

function CustomExperiece() {
    return (
        <>
            <section className='py-16 md:py-24 px-4 bg-gradient-to-b from-black to-gray-500'>
                <div className="container">

                <h2 className='text-3xl md:text-5xl text-gega-red tracking-wider mb-12'>Tecrübeler</h2>

                    <div className='flex justify-center space-x-8'>

                        <div className='flex flex-col items-center space-y-56'>

                            <div className='border-4 border-solid border-gega-grey rounded-lg shadow-xl shadow-white hover:scale-105 duration-500 text-gega-white min-w-[410px]'>

                                <div className='border-b-2 border-solid border-gega-grey  p-4  flex justify-between items-center'>
                                    <h2 className='font-gemunu text-2xl hover:scale-105 duration-500'>Doğuş Teknoloji</h2>
                                    <i className="fa-solid fa-laptop text-xl"></i>
                                </div>

                                <div className='border-t-2 border-solid border-gega-grey p-4 flex justify-between items-center space-x-8'>
                                    <span>Full-Stack Developer Intern</span>
                                    <span> Temmuz 2023</span>
                                </div>

                            </div>

                            <div className='border-4 border-solid border-gega-grey rounded-lg shadow-xl shadow-white hover:scale-105 duration-500 text-gega-white min-w-[410px]'>

                                <div className='border-b-2 border-solid border-gega-grey  p-4  flex justify-between items-center'>
                                    <h2 className='font-gemunu text-2xl hover:scale-105 duration-500'>ABVAG</h2>
                                    <i className="fa-solid fa-people-group"></i>
                                </div>

                                <div className='border-t-2 border-solid border-gega-grey p-4 flex justify-between items-center space-x-8'>
                                    <span>Akan Büyük Veri Analiz Grubu</span>
                                    <span> Mart - 2021</span>
                                </div>

                            </div>

                            <div className='border-4 border-solid border-gega-grey rounded-lg shadow-xl shadow-white hover:scale-105 duration-500 text-gega-white min-w-[410px]'>

                                <div className='border-b-2 border-solid border-gega-grey  p-4  flex justify-between items-center'>
                                    <h2 className='font-gemunu text-2xl hover:scale-105 duration-500'>Necmettin Erbakan Fen Lisesi</h2>
                                    <i className="fa-solid fa-school"></i>
                                </div>

                                <div className='border-t-2 border-solid border-gega-grey p-4 flex justify-between items-center space-x-8'>
                                    <span>Lise Eğitimi</span>
                                    <span> Eylül - 2016</span>
                                </div>

                            </div>

                        </div>

                        <div className="border-l-4 border-white h-[62rem] mx-auto"> </div>

                        <div className='flex flex-col items-center mt-44 space-y-56'>


                            <div className='border-4 border-solid border-gega-grey rounded-lg shadow-xl shadow-white hover:scale-105 duration-500 text-gega-white min-w-[410px]'>

                                <div className='border-b-2 border-solid border-gega-grey  p-4  flex justify-between items-center'>
                                    <h2 className='font-gemunu text-2xl hover:scale-105 duration-500'>Nacsoft Yazılım</h2>
                                    <i className="fa-solid fa-laptop text-xl"></i>
                                </div>

                                <div className='border-t-2 border-solid border-gega-grey p-4 flex justify-between items-center space-x-8'>
                                    <span>Software Intern</span>
                                    <span> Kasım 2022 - Aralık 2022</span>
                                </div>

                            </div>

                            <div className='border-4 border-solid border-gega-grey rounded-lg shadow-xl shadow-white hover:scale-105 duration-500 text-gega-white min-w-[410px]'>

                                <div className='border-b-2 border-solid border-gega-grey  p-4  flex justify-between items-center'>
                                    <h2 className='font-gemunu text-2xl hover:scale-105 duration-500'>Kocaeli Üniversitesi</h2>
                                    <i className="fa-solid fa-building-columns"></i>
                                </div>

                                <div className='border-t-2 border-solid border-gega-grey p-4 flex justify-between items-center space-x-8'>
                                    <span>Bilgisayar Mühendisliği</span>
                                    <span> Eylül - 2020</span>
                                </div>

                            </div>

                            <button className='mt-3 md:mt-0 text-3xl bg-gega-red px-3 py-1 hover:bg-rose-600 transation duration-500 rounded-xl min-w-[410px] h-24'>
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