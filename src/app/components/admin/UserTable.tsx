import React from "react";
import UserTableRow from "./UserTableRow";
import { User } from "@/types/admin/User";

interface UserTableProps {
  users: User[];
}

const UserTable = ({ users }: UserTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full w-full table-fixed divide-y divide-gray-200 text-left">
        <thead className="bg-gray-50">
          <tr className="text-[#6B7280] text-xs font-medium uppercase tracking-wider">
            <th className="px-4 py-3 md:px-6 w-2/5">NAME</th>
            <th className="px-4 py-3 md:px-6 w-1/5">ROLE</th>
            <th className="px-4 py-3 md:px-6 w-1/5">STATUS</th>
            <th className="px-4 py-3 md:px-6 w-1/5">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {(users ?? []).map((user: User) => (
            <UserTableRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
