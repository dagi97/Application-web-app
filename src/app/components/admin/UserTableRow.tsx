// UserTableRow.tsx
'use client';

import React from 'react';
import { User } from '@/types/admin/User';
import Link from 'next/link';
import { useDeleteUserByIdMutation } from '@/lib/redux/api/adminApi';
import Image from 'next/image';

const UserTableRow = ({ user, onToast }: { user: User, onToast: (message: string, type: "success" | "error") => void }) => {
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserByIdMutation();

  const status = user.is_active 
    ? { text: 'Active', className: 'bg-[#DBEAFE] text-[#166534]' }
    : { text: 'Inactive', className: 'bg-[#FEF9C3] text-[#854D0E]' };

  const handleDeleteClick = async () => {
    if (window.confirm(`Are you sure you want to delete the user "${user.full_name}"?`)) {
      try {
        await deleteUser(user.id).unwrap();
        onToast('User deleted successfully!', 'success');
      } catch (err) {
        console.error('Failed to delete user:', err);
        onToast('Failed to delete the user. Please try again.', 'error');
      }
    }
  };

  const imgUrl: string = user?.profile_picture || '/profile.png';

  return (
    <tr className="block md:table-row border-b border-gray-200 md:border-none mb-4 md:mb-0">
      <td className="px-6 py-4 whitespace-nowrap block md:table-cell" data-label="User">
        <div className="flex items-center gap-3">
          <Image src={imgUrl} alt="User Profile" width={40} height={40} className="rounded-full" />
          <div>
            <p className="font-bold text-gray-900">{user.full_name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-2 md:py-4 whitespace-nowrap block md:table-cell text-right md:text-left" data-label="Role">
        <span className="md:hidden font-bold float-left">Role</span>
        <span className="text-sm text-gray-700">{user.role.toUpperCase()}</span>
      </td>
      <td className="px-6 py-2 md:py-4 whitespace-nowrap block md:table-cell text-right md:text-left" data-label="Status">
        <span className="md:hidden font-bold float-left">Status</span>
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}>
          {status.text}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right block md:table-cell">
        <Link href={`/admin/users/edit_user/${user.id}`}>
          <span className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</span>
        </Link>
        <button
          className="text-red-600 hover:text-red-900"
          onClick={handleDeleteClick}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </td>
    </tr>
  );
};

export default UserTableRow;