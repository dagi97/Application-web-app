import React from 'react'
import { ActionCardProps } from '@/types/ActionCard'
import Link from 'next/link';
import Image from 'next/image';

const ActionCard = ({title,description,page}: ActionCardProps) => {
  return (
    <div>
        <h3 className='text-[#111827] text-xl font-bold mb-2'>{title}</h3>
        <p className='text-[#4B5563] mb-2'>{description}</p>
        <Link href={
            page === 'Users' ? '/admin/users' :
            page === 'Cycles' ? '/admin/cycle':
            page === 'Analytics' ? '/admin/analytics' : '#'
        }>
            <div className=' text-[#4F46E5] flex gap-1'>
                <p className='font-bold'>Go to {page}</p>
                <Image src='/arrow.svg' alt='Arrow' height={13} width={13} className=' text-[#4F46E5]'/>
            </div>
        </Link>
        
    </div>
  )
}

export default ActionCard