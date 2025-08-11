'use client';

import React from 'react';
import { use } from 'react';
import AdminNav from '@/app/components/navigation/AdminNav';
import EditUserForm from '@/app/components/admin/EditUserForm';
import { useGetUserByIdQuery } from '@/lib/redux/api/adminApi';
import LoadingSpinner from '@/app/components/LoadingSpinner';

const EditUserPage = ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = use(params);
  const { data: user, isLoading } = useGetUserByIdQuery(userId);

  const name = user?.full_name || 'User';

  return (
    <div className="bg-[#F3F4F6] min-h-screen">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-7">
          <h1 className="text-[#111827] text-2xl sm:text-3xl font-bold">
            {isLoading ? 'Loading User...' : `Edit User: ${name}`}
          </h1>
          <p className="text-[#4B5563] font-normal mt-1">
            Update the user`s details, role, and status below.
          </p>
        </div>
        <div>
          <EditUserForm userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default EditUserPage;