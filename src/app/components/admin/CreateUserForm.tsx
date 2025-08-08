'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form'; // Import the library's hooks
import { useCreateUserMutation } from '@/lib/redux/api/adminApi';
import { useRouter } from 'next/navigation';
import Button from '../Button';

interface IFormInput {
full_name: string;
email: string;
password: string;
role: 'applicant' | 'manager' | 'reviewer';
}

const CreateUserForm = () => {
const router = useRouter();
const [createUser, { isLoading }] = useCreateUserMutation();


const {
    register,         
    handleSubmit,     
    formState: { errors } 
} = useForm<IFormInput>({
    
    defaultValues: {
        role: 'applicant'
    }
});


const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
        await createUser(data).unwrap();

        alert('User created successfully!');
        router.push('/admin/users');
    } catch (err: unknown) {
            console.error('Failed to create user:', err);

let apiErrorMessage = 'An unexpected error occurred.';
if (typeof err === 'object' && err !== null && 'data' in err) {
    const maybeError = err as { data?: { message?: string } };
    apiErrorMessage = maybeError.data?.message || apiErrorMessage;
}

alert(`Error: ${apiErrorMessage}`);
    }
};

return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full  mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full name</label>
                    <input
                        type="text"
                        id="full_name"
                        {...register("full_name", { required: "Full name is required." })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                    <input
                        type="email"
                        id="email"
                        {...register("email", {
                            required: "Email address is required.",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Entered value does not match email format."
                            }
                        })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Set an initial password"
                        {...register("password", {
                            required: "Password is required.",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters long."
                            }
                        })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                        id="role"
                        {...register("role")}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="applicant">Applicant</option>
                        <option value="manager">Manager</option>
                        <option value="reviewer">Reviewer</option>
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
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Saving...' : 'Save User'}
                </button>
            </div>
        </form>
    </div>
);
};

export default CreateUserForm;