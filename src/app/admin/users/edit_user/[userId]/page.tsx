import React from 'react';
import AdminNav from '@/app/components/navigation/AdminNav';
import EditUserForm from '@/app/components/admin/EditUserForm';

const EditUserPage = ({ params }: { params: { userId: string } }) => {
  const { userId } = params;

  return (
    <div>
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <div className='mb-7'>
          <h1 className="text-[#111827] text-3xl font-bold">Edit User</h1>
          <p className="text-[#4B5563] font-normal">
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