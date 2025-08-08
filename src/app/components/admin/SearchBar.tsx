'use client';

import React from 'react'
import { RootState } from '@/lib/redux/store';

interface SearchBarProps {
  searchText: string;
  role: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SearchBar = ({searchText,role,handleSearchChange, handleRoleChange}: SearchBarProps) => {

  return (
    <div className='md:bg-white p-4 rounded-md shadow-md mb-6'>
        <form action="" className='md: flex justify-between items-center'>
          <input type="text" placeholder='Search users by name or email...' value={searchText} onChange={handleSearchChange} className='border-[#9CA3AF] border w-full text-[#9CA3AF]  font-[400] mr-3 p-2'/>
          <select name="role-filter" id="role-filter" value={role} onChange={handleRoleChange} className='md: bg-[#E0E7FF] p-2 rounded-md text-sm'>
              <option value="">All Roles</option>
              <option value="applicant">Applicant</option>
              <option value="manager">Manager</option>
              <option value="reviewer">Reviewer</option>
          </select>
        </form>
    </div>
  )
}

export default SearchBar