"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  useUpdateUserByIdMutation,
  useGetUserByIdQuery,
} from "@/lib/redux/api/adminApi";
import { useRouter } from "next/navigation";
import { User } from "@/types/admin/User";
import Toaster from "../Toaster";

interface IFormInput {
  full_name: string;
  email: string;
  password?: string;
  role: "applicant" | "manager" | "reviewer";
  is_active: "true" | "false";
}

interface UpdateUserPayload {
  full_name: string;
  email: string;
  role: "applicant" | "manager" | "reviewer";
  is_active: boolean;
  password?: string;
}

interface ApiError {
  data: { message: string };
}

function isApiError(error: unknown): error is ApiError {
  if (typeof error === "object" && error !== null && "data" in error) {
    const maybeWithData = error as { data?: unknown };
    if (
      typeof maybeWithData.data === "object" &&
      maybeWithData.data !== null &&
      "message" in maybeWithData.data
    ) {
      return true;
    }
  }
  return false;
}

interface EditUserFormProps {
  userId: string;
}

const EditUserForm = ({ userId }: EditUserFormProps) => {
  const router = useRouter();
  const {
    data: user,
    isLoading: isUserLoading,
    isError,
  } = useGetUserByIdQuery(userId);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserByIdMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();

  // Toaster state
  const [toast, setToast] = useState({
    message: "",
    type: "success" as "success" | "error",
    show: false,
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, show: true });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 2500);
  };

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name,
        email: user.email,
        role: user.role as "applicant" | "manager" | "reviewer",
        is_active: String(user.is_active) as "true" | "false",
      });
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const updatedUser: UpdateUserPayload = {
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      is_active: data.is_active === "true",
    };

    if (data.password && data.password.trim() !== "") {
      updatedUser.password = data.password;
    }

    try {
      await updateUser({ user_id: userId, updatedUser }).unwrap();
      showToast("User updated successfully!", "success");
      setTimeout(() => router.push("/admin/users"), 2500);
    } catch (err) {
      console.error("Failed to update user:", err);
      let errorMessage = "An unexpected error occurred.";
      if (isApiError(err)) {
        errorMessage = err.data.message;
      }
      showToast(errorMessage, "error");
    }
  };

  if (isUserLoading)
    return <div className="text-center p-8">Loading user data...</div>;
  if (isError)
    return (
      <div className="text-center p-8 text-red-500">
        Failed to load user data.
      </div>
    );

  return (
    <>
      <Toaster
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />


      <div className="bg-white p-8 rounded-lg shadow-md w-full mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-gray-700"
              >
                Full name
              </label>
              <input
                type="text"
                id="full_name"
                {...register("full_name", {
                  required: "Full name is required.",
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.full_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.full_name.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email format.",
                  },
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Set a new password (optional)"
                {...register("password", {
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters.",
                  },
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role"
                {...register("role")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="applicant">Applicant</option>
                <option value="manager">Manager</option>
                <option value="reviewer">Reviewer</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="is_active"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="is_active"
                {...register("is_active")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="true">Active</option>

                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditUserForm;
