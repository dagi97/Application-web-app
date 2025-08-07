import React from 'react'
import Button from './Button'

const Ready = () => {
    return (
        <div
            className="text-white bg-[#4338CA]
            py-20 flex flex-col gap-5 items-center
            px-10 sm:px-30
            "
        >
            <h3 className='text-center
            text-4xl font-bold
            '>Ready to change your life?</h3>
            <p className='text-center max-w-[560px] text-lg'>The next application cycle is now open. Take the first step towards
                your dream career.</p>
            <button className='bg-white text-[#4338CA] px-4 py-2 rounded-md
            mt-2 font-medium
            '>Apply Now</button>

            {/* <Button size="small" variant='secondary'
                className=' px-4 py-2 rounded-md
            mt-2 font-medium border-2 border-black text-green-500 text-amber-900
            '>Apply Now</Button> */}
        </div>
    )
}

export default Ready