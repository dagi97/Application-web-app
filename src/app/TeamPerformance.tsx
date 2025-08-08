import React from 'react'

const TeamPerformance = ({ teamMembers }: { teamMembers: Array<{ [key: string]: any }> }) => {
    return (
        <div>
            <h3 className="font-bold text-[20px] leading-[28px] align-middle tracking-[0%]">
                Team Performance
            </h3>
            <ul>
                {
                    teamMembers.map((teamMember) =>
                        <li>
                            <div>
                                <p className='font-medium'>{teamMember.name || 'Jane'}</p>
                                <p className="font-normal not-italic text-[14px] leading-[20px] align-middle tracking-[0%] text-[#6B7280]">
                                    {`${teamMember.assigned || 2} Assigned / Avg. ${teamMember.average || 12} days`}
                                </p>
                            </div>
                            <p className="font-normal not-italic text-[16px] leading-[24px] align-middle tracking-[0%]">
                                {teamMember.reviews || 5 + " Reviews"}
                            </p>
                        </li>
                    )
                }
            </ul>
        </div>
    )
}

export default TeamPerformance