'use client';

import React, { useState } from 'react';
import { User } from '@/types/admin/User';
import Link from 'next/link';
import { useDeleteUserByIdMutation } from '@/lib/redux/api/adminApi';
import Image from 'next/image';



const UserTableRow = ( {user} :{user: User}) => {
  const is_active = user.is_active

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserByIdMutation();

  let property: string;
  let text: string;


  if (is_active){
    text = 'Active'
    property = 'bg-[#DBEAFE] rounded-2xl text-[#166534] font-bold text-sm ml-5 p-1 px-2'
  } else {
    text = 'Inactive'
    property = 'bg-[#FEF9C3] rounded-2xl text-[#854D0E] font-bold text-sm ml-5 p-1 px-2'
  };


  const handleDeleteClick = async () => {
    if (window.confirm(`Are you sure you want to delete the user "${user.full_name}"?`)) {
      try {
        await deleteUser(user.id).unwrap();
        alert('User deleted successfully!');
      } catch (err) {
        console.error('Failed to delete user:', err);
        alert('Failed to delete the user. Please try again.');
      }
    }
  };

  

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className='md: flex items-center gap-3'>
          <Image src={user.profile_picture}  alt="User Profile" width={35} height={35} />
          <div>
            <p className='font-bold'>{user.full_name}</p>
            <p className='text-[#6B7280]'>{user.email}</p>
          </div>
        </div>
      </td>
      <td>
        <p className='text-[#6B7280] text-sm text-left ml-5'>{user.role.toUpperCase()}</p>
      </td>
      <td><button className={property}><p>{text}</p></button></td>
      <td>
        <Link href={`/admin/users/edit_user/${user.id}`}><button className='text-[#4F46E5] mr-3 text-sm'>Edit</button></Link>
        <button className='text-[#DC2626] text-sm' onClick={handleDeleteClick}>Delete</button>
      </td>
    </tr>
  )
}

export default UserTableRow