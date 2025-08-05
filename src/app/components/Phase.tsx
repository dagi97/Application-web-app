import React from 'react'
import Image from 'next/image'
const Phase = ({ svgLogo, phaseName, phaseDescription }: any) => {
    return (
        <div className='flex gap-5 
        sm:max-w-[250px]
        
        
        items-start

        '>
            <Image
                aria-hidden
                src={svgLogo}
                alt={phaseName}
                width={48}
                height={48}
            />

            <div className=''>
                <h3 className='text-lg font-bold'>{phaseName}</h3>
                <p className='text-base text-[#6B7280]'>{phaseDescription}</p>
            </div>
        </div>
    )
}

export default Phase