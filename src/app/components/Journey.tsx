import React from 'react'
import Phase from './Phase'

const Journey = () => {
    return (
        <div id="journey" className='p-20
        px-10 sm:px-30
        '>
            <h3 className='text-4xl font-bold text-center'>Your Journey to Silicon Valley</h3>
            <p className='text-[#4B5563] text-center py-4 mb-16 font-[400]
            text-lg
            '>A proven path from learning to leadership.</p>

            <div
                className='
                flex 
                justify-center 
                items-center
                md:items-start
                flex-col 
                md:flex-row 
                gap-8
                '

            >
                <Phase
                    svgLogo="/Phase1.svg"
                    phaseName="Phase 1: Foundations"
                    phaseDescription="Master data structures,
                    algorithms, and problem-solving techniques in an
                    intensive 3-month
                    bootcamp.
                "
                />
                <Phase
                    svgLogo="/Phase2.svg"
                    phaseName="Phase 2: Real-world Projects"
                    phaseDescription="Apply your skills to build
                    complex projects,
                    collaborate in teams, and
                    prepare for technical
                    interviews.
                "
                />
                <Phase
                    svgLogo="/Phase3.svg"
                    phaseName="Phase 3: Internship Placement"
                    phaseDescription="We help you secure
                    internships at top global
                    tech companies to gain
                    invaluable experience.
                "
                />
                <Phase
                    svgLogo="/Phase4.svg"
                    phaseName="Phase 4: Full-Time Conversion"
                    phaseDescription="Excel in your internship and
                    convert it into a full-time
                    offer, launching your global
                    career.
                "
                />
            </div>
            <div className='flex justify-center gap-16'>


            </div>
        </div>
    )
}

export default Journey
