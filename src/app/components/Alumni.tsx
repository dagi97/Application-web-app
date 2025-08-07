import React from 'react'
import TestimonyCard from './TestimonyCard'
const Alumni = () => {
    return (
        <div className='
        bg-[#f7faff]
        py-14
        px-10 sm:px-30
      

        '>
            <h3 className='text-4xl font-bold text-center'>
                Hear from Our Alumni
            </h3>

            <div className='mt-20
                flex flex-col  
                items-center
                justify-center
                lg:flex-row
                gap-5
            '>
                <TestimonyCard
                    testimony={`"${`A2SV completely changed the trajectory of my career. The training is intense, but
                            the community and the opportunities are
                            unparalleled. I'm now at my dream
                            company, and I owe it all to A2SV.`}"`}


                    name="Abel Tadesse"
                    title="Software Engineer"
                    company="Google"
                    image="/images/abel-tadesse.png"

                />
                <TestimonyCard
                    testimony={`"${`A2SV completely changed the trajectory of my career. The training is intense, but
                            the community and the opportunities are
                            unparalleled. I'm now at my dream
                            company, and I owe it all to A2SV.`}"`}


                    name="Abel Tadesse"
                    title="Software Engineer"
                    company="Google"
                    image="/images/abel-tadesse.png"

                />
                <TestimonyCard
                    testimony={`"${`A2SV completely changed the trajectory of my career. The training is intense, but
                            the community and the opportunities are
                            unparalleled. I'm now at my dream
                            company, and I owe it all to A2SV.`}"`}


                    name="Abel Tadesse"
                    title="Software Engineer"
                    company="Google"
                    image="/images/abel-tadesse.png"

                />

            </div>


        </div>
    )
}

export default Alumni