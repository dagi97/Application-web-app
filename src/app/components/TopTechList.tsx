import React from 'react'
import Image from 'next/image'

const TopTechList = () => {
    return (
        <div className='
        flex flex-col sm:flex-row justify-center items-center
        gap-10
        min-h-20
        bg-[#F3F4F6]
        py-12
        '>
            <Image
                aria-hidden
                src="/Google.svg"
                alt="google"
                width={100}
                height={100}
            />
            <Image
                aria-hidden
                src="/Amazon.svg"
                alt="amazon"
                width={100}
                height={100}
            />
        </div>
    )
}

export default TopTechList