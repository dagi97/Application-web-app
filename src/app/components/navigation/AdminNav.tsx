'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


const AdminNav = () => {
    const IsActive = (path:string) => {
        const pathname = usePathname();
        
        return pathname === path;   
    }

    return(
        <nav className='shadow-md bg-white'>
            <div className='flex gap-64 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <img src="/a2sv-logo.svg" alt="A2SV Logo" />
                <ul className='flex gap-10 mt-6 mb-6'>
                    <li><Link href='/admin' className={IsActive('/admin') ? 'border-b-2 border-[#6366F1] text-[#111827]': 'text-[#6B7280]'}>Dashboard</Link></li>
                    <li><Link href='/admin/users' className={IsActive('/admin/users') ? 'border-b-2 border-[#6366F1] text-[#111827]': 'text-[#6B7280]'}>Users</Link></li>
                    <li><Link href='/admin/cycles' className={IsActive('/admin/cycles') ? 'border-b-2 border-[#6366F1] text-[#111827]': 'text-[#6B7280]'}>Cycles</Link></li>
                    <li><Link href='/admin/analytics' className={IsActive('/admin/analytics') ? 'border-b-2 border-[#6366F1] text-[#111827]': 'text-[#6B7280]'}>Analytics</Link></li>
                </ul>
                <ul className='flex gap-4 mt-6 mb-6'>
                    <li><Link href='' className='text-[#4F46E5]'>Your Profile</Link></li> {/*After you figure out the href add classname so that you can underline */}
                    <li>Name</li> {/*Placeholder for user name that need to be changed after you configured the endpoints for the api*/}
                    <li><Link href=''>Logout</Link></li>{/*After you figure out the href add classname so that you can underline */}
                </ul>
            </div>
        </nav>
    )
}

export default AdminNav