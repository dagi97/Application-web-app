import React from 'react';
import AdminNav from '@/app/components/navigation/AdminNav';
import CreateUserForm from '@/app/components/admin/CreateUserForm';

const Page = () => {
  return (
    <div className="bg-[#F3F4F6] min-h-screen">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-7">
          <h1 className="text-[#111827] text-2xl sm:text-3xl font-bold">
            Create New User
          </h1>
          <p className="text-[#4B5563] font-normal mt-1">
            Use this form to create a new user and assign them a role.
          </p>
        </div>
        <div>
          <CreateUserForm />
        </div>
      </div>
    </div>
  );
};

export default Page;