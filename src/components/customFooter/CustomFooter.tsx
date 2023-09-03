import React from 'react'

function CustomFooter() {
    return (
        <>
            <footer className='bg-black text-gega-grey'>

                <div className='container flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 p-4'>

                    <a href='/' className='text-xl lg:text-2xl font-bold text-transparent bg-gradient-to-r bg-clip-text from-gega-red to-gega-grey whitespace-nowrap'>TAHA PEK</a>

                    <div className='grid grid-cols-3 gap-6'>
                        <a href="/" className='col-span-1'> <i className="fa-brands fa-github text-gega-grey text-3xl"></i></a>
                        <a href='/' className='col-span-1'> <i className="fa-brands fa-instagram  text-gega-grey text-3xl"></i></a>
                        <a href='/' className='col-span-1'> <i className="fa-brands fa-linkedin  text-gega-grey text-3xl"></i></a>
                    </div>

                    <div>
                        <h2 className='text-gega-red'> İLETİŞİM</h2>
                        <span className='text-xl'>tahapek5454@gmail.com</span>
                    </div>



                </div>

            </footer>
        </>
    )
}

export default CustomFooter