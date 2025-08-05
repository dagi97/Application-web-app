'use client';
import { useForm } from 'react-hook-form';
import AuthHeader from '@/components/AuthHeader';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/AuthButton';
import InputField from '@/components/AuthInputField';
import Link from 'next/link';
type FormData = {
  email: string;
};
const ForgotPassword = () => {
  const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<FormData>();
  const hasError = errors.email;
  const onSubmit = (data: any) => {
    // TODO: Send reset link
  };

  return (
    <div className='bg-[#F9FAFB]'>
      <AuthLayout>
      <AuthHeader
        title="Forgot your password?"
        subtitle="Enter your email and we'll send you a link to get back into your account."
      />
      <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
        <div className='border-[1.5px] border-[#D1D5DB] rounded-[6px] overflow-hidden'>
          <InputField
          isLast={true} type="email"
          placeholder="Email address"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })} />
          
        </div>{errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
        <div className='w-full flex flex-col justify-between'>
          <div className='h-[24px]'/>
          <Button text="Send reset link"/>
          <div className='h-[24px]'/>
        </div>
        
        
      </form>
      <Link className="block text-sm text-[#4F46E5] font-medium hover:underline" href="/auth/signin " >
        Back to login
      </Link>
    </AuthLayout>
    </div>
    
  );
};

export default ForgotPassword;
