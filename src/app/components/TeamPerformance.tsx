import React from 'react'

const TeamPerformance = ({ teamMembers }: { teamMembers: Array<{ [key: string]: any }> }) => {
    return (
        <div className="max-w-xs w-full bg-white rounded-lg shadow-md p-4 min-w-[350px]">
            <h3 className="font-bold text-[20px] leading-[28px] tracking-[0%] w-full mb-2">
                Team Performance
            </h3>
            <ul>
                {teamMembers.map((teamMember, index) => (
                    <li key={index} className="flex justify-between items-start mb-2">
                        <div>
                            <p className="font-medium">{teamMember.name || 'Jane'}</p>
                            <p className="font-normal text-[14px] leading-[20px] text-[#6B7280]">
                                {`${teamMember.assigned || 2} Assigned / Avg. ${teamMember.average || 12} days`}
                            </p>
                        </div>
                        <p className="font-normal text-[16px] leading-[24px] text-[#4B5563]">
                            {(teamMember.reviews || 5) + " Reviews"}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TeamPerformance