import React from 'react'
import backgroundImage from '../../images/background.jpg'
import personIcon from '../../images/tahaYarımIcon.png'

function CustomHeader() {
    return (
        <>
            <section className='h-[28rem] md:h-128 group relative bg-black'>

                <img src={backgroundImage} alt="" className='h-full w-full object-cover' />

                <div className='absolute bottom-0 w-full bg-gradient-to-b from-transparent to-black'>

                    <div className='container'>
                        <h2 className='md:text-2xl text-gega-melon tracking-wider group-hover:mb-3 duration-500'> KİŞİSEL WEB SİTEME HOŞGELDİNİZ</h2>
                        <h1 className='text-2xl md:text-6xl text-gega-grey tracking-wider group-hover:mb-3 duration-500'> FULL-STACK DEVEOPER</h1>
                        <p className='text-sm md:text-lg text-gega-grey font-open group-hover:mb-3 duration-500 w-2/3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa qui officiis voluptatem ipsam saepe, praesentium, temporibus eum dignissimos necessitatibus, nobis quae maxime officia! Harum tempora perferendis corrupti? Distinctio, non rerum.</p>
                        <div className='flex space-x-8 opacity-0 group-hover:opacity-100 group-hover:mb-20 duration-500'>
                            <a href="/"> <i className="fa-brands fa-github text-gega-grey text-6xl hover:shadow-2xl hover:shadow-gray-500/50 "></i></a>
                            <a href='/'> <i className="fa-brands fa-instagram  text-gega-grey text-6xl hover:shadow-2xl hover:shadow-orange-500/50"></i></a>
                            <a href='/'> <i className="fa-brands fa-linkedin  text-gega-grey text-6xl hover:shadow-2xl hover:shadow-cyan-500/50"></i></a>
                        </div>
                    </div>

                </div>

                <div className='absolute bottom-5 right-0 ml-auto'>
                    <img src={personIcon} alt="" className='w-[6rem] md:w-[8rem]' />
                </div>

            </section>
        </>
    )
}

export default CustomHeader