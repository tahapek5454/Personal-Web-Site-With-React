import React, { useState } from 'react'

import './CustomNavbar.css'

function CustomNavbar() {

    const [isExpand, setExpand] = useState<boolean>(false);

    return (
        <>
            <header className='bg-black py-4 text-gega-grey font-gemunu'>
                <div className='container md:flex md:items-center justify-between space-x-8 lg:space-x-16'>

                    <a href='/' className='pl-7 md:pl-0 text-3xl lg:text-5xl font-bold text-transparent bg-gradient-to-r bg-clip-text from-gega-red to-gega-grey whitespace-nowrap'>TAHA PEK</a>

                    <div className='flex absolute right-1 items-center top-6 pr-7 md:hidden' onClick={()=>setExpand(!isExpand)}>
                        <div className='space-y-1 cursor-pointer'>
                            <div className='bg-gega-grey w-8 h-1 rounded-full'></div>
                            <div className='bg-gega-grey w-8 h-1 rounded-full'></div>
                            <div className='bg-gega-grey w-8 h-1 rounded-full'></div>
                        </div>
                    </div>


                    

                    <nav className={`${isExpand ?  '' : 'hidden'} md:flex md:justify-between flex-1`}>
                        <div></div>

      
                        <div className={`${isExpand ?  'bg-gega-grey w-11/12 h-1 rounded-full mt-3 mb-3' : 'hidden'} md:hidden`}></div>
                      
                        <ul className='space-y-6 md:space-y-0 md:flex items-center md:space-x-6  lg:space-x-8 lg:text-lg '>                                           
                            <li> <a href='/' className='hover:text-gega-melon transition duration-500 active'>HAKKIMDA</a></li>
                            <li> <a href='/' className='hover:text-gega-melon transition duration-500'>TECRÜBELERİM</a></li>
                            <li> <a href='/' className='hover:text-gega-melon transition duration-500'>İLETİŞİM</a></li>
                        </ul>

                        <button className='mt-3 md:mt-0 bg-gega-red px-3 py-1 hover:bg-rose-600 transation duration-500 rounded-full '>
                            CV <i className="fa-solid fa-download text-gega-grey"></i>
                        </button>
                    </nav>

                </div>
            </header>
        </>
    )
}

export default CustomNavbar