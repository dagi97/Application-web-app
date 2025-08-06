'use client';
import { useForm } from 'react-hook-form';
import AuthHeader from '@/components/AuthHeader';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/AuthButton';
import InputField from '@/components/AuthInputField';

const SignIn = () => {
  type FormData = {
    password: string;
    email: string;
  };
  const onSubmit = (data: any) => {};
  const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<FormData>();
  const hasError = errors.password || errors.email;

  return (
    <div className='bg-[#F9FAFB]'>
      <AuthLayout>
      <AuthHeader
        title="Sign in to your account"
        subtitle={
    <>
      <a href="/" className="text-[#4F46E5] hover:underline pr-1 border-r-1 border-black">Back to Home</a>  <a href="/auth/register" className="text-[#4F46E5] hover:underline">Create a new applicant account</a>
    </>
  }
      />
      <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
        <div className='w-full border-[1.5px] border-[#D1D5DB] rounded-[6px] overflow-hidden'>
          <div className="w-full flex flex-col gap-1">
            <InputField
          isLast={false} type="email"
          placeholder="user@example.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}/>
          {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>
        <div className="flex flex-col gap-1">
          <InputField
          isLast={true} type="password"
          placeholder="password123"
          {...register('password', { required: 'Password is required' })}          
        />
        </div>
        
        </div>{errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
        
        <div className="w-full mb-[25px] flex justify-between items-center text-sm mt-[25px]">
          <label>
            <input type="checkbox" className="mr-1 text-[#111827]" />
            Remember me
          </label>
          <a href="/auth/forgot-password" className="text-[#4F46E5] hover:underline font-[500] ">Forgot your password?</a>
        </div>
        
        <Button
          text="Sign In"/>
      </form>
    </AuthLayout>
    </div>
    
  );
};

export default SignIn;
