'use client';

import React from 'react';

interface SearchBarProps {
  searchText: string;
  role: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SearchBar = ({ searchText, role, handleSearchChange, handleRoleChange }: SearchBarProps) => {
  return (
    <div className='bg-white p-4 rounded-md shadow-md mb-4 md:mb-6'>
      <form className='flex flex-col gap-3 md:flex-row md:justify-between md:items-center'>
        <input 
          type="text" 
          placeholder='Search users by name or email...' 
          value={searchText} 
          onChange={handleSearchChange} 
          className='border-[#9CA3AF] border w-full text-gray-700 font-normal p-2 rounded-md md:mr-3'
        />
        <select 
          name="role-filter" 
          id="role-filter" 
          value={role} 
          onChange={handleRoleChange} 
          className='bg-gray-100 border border-gray-300 p-2 rounded-md text-sm md:bg-[#E0E7FF] md:border-none'
        >
          <option value="">All Roles</option>
          <option value="applicant">Applicant</option>
          <option value="manager">Manager</option>
          <option value="reviewer">Reviewer</option>
        </select>
      </form>
    </div>
  );
};

export default SearchBar;