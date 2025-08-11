// UserTable.tsx
import { useState } from "react";
import Toaster from "../Toaster";
import UserTableRow from "./UserTableRow";
import { User } from "@/types/admin/User";

type ToastState = {
  message: string;
  type: "success" | "error" | "";
  show: boolean;
};

export default function UserTable({ users }: { users: User[] }) {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "",
    show: false,
  });

  const handleToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, show: true });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 2500);
  };

  return (
    // Use a React Fragment to contain the Toaster and the table.
    <>
      {/* The Toaster is rendered here, outside the table, which is valid. */}
      {toast.show && toast.type && (
        <Toaster
          message={toast.message}
          type={toast.type}
          show={toast.show}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => (
            <UserTableRow key={user.id} user={user} onToast={handleToast} />
          ))}
        </tbody>
      </table>
    </>
  );
}