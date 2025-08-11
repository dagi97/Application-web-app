import React from 'react'
import Image from 'next/image'
const TestimonyCard = ({ testimony, name, title, company, image }: any) => {
    return (
        <div className=' 
        bg-white rounded-md
        
        text-[#4B5563]
shadow-[0_2px_30px_rgb(0,0,0,0.12)]        px-10
        py-8 h-[300px] w-[400px] flex-col


        '>
            <p className='mb-5'>{testimony}</p>
            <div className='flex items-center gap-5'>

                <Image
                    aria-hidden
                    src={image}
                    alt={name}
                    width={48}
                    height={48}
                    className='rounded-full 
                    aspect-square object-cover 
                    max-w-full h-auto'
                />
                <div>
                    <h3 className='text-black font-medium'>{name}</h3>
                    <p>{title}, {company}</p>
                </div>
            </div>
        </div>
    )
}

export default TestimonyCard