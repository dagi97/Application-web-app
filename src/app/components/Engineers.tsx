import React from 'react'
import Image from 'next/image'
const Engineers = () => {
    return (
        <div id="about" className='px-10 sm:px-30    
        py-20      
        bg-[#F3F4F6]        
        flex flex-col 
        md:flex-row
        md:gap-20
        
        justify-center items-center
        lg:justify-center
        
        '>
            <div className=' mt-10'>

                <h3 className='
            text-center
            text-4xl font-bold
            md:text-left
            mb-5
            '>
                    Built by Engineers, for Engineers
                </h3>
                <p className='text-[#4B5563] py-4 mb-16 font-[400]
            text-lg
            text-center
            md:text-left

            '>
                    A2SV is not just a program; it's a community. We're on a mission to
                    identify Africa's most brilliant minds and provide them with the
                    resources, mentorship, and opportunities to solve humanity's
                    greatest challenges.
                </p>
            </div>

            <Image
                aria-hidden
                src="/images/engineers-discussing-tasks.png"
                alt="Engineers discussing tasks"
                width={300}
                height={300}
            />

        </div>
    )
}

export default Engineers
