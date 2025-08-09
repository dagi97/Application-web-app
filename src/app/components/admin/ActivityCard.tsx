import React from 'react'

const ActivityCard = () => {
  return (
    <div>
        <h3 className='text-[#111827] text-xl font-bold mb-2'>Recent Admin Activity</h3>

        <div className='flex gap-2'>
            <img src="/user.svg" alt="User Icon" />
            <div>
                <p className='text-[#374151] text-md font-[400] whitespace-nowrap'>New User {"Jane R."} created.</p>
                <p className='text-[#6B7280] font-[400] test-sm mb-2'>2 hours ago</p>
            </div>
        </div>

        <div className='flex gap-2'>
            <img src="/calendar.svg" alt="Calendar Icon" />
            <div>
                <p className='text-[#374151] text-sm font-[400]whitespace-nowrap'>Cycle {"G7 November"} set to active.</p>
                <p className='text-[#6B7280] font-[400] test-xs'>1 day ago</p>
            </div>
        </div>
    </div>
  )
}

export default ActivityCard