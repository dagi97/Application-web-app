"use client";
import { useForm } from "react-hook-form";
import AuthHeader from "@/app/components/AuthHeader";
import AuthLayout from "@/app/components/AuthLayout";
import Button from "@/app/components/AuthButton";
import InputField from "@/app/components/AuthInputField";
import Link from "next/link";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: any) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // TODO: Handle register logic
  };

  return (
    <div className="bg-[#F9FAFB]">
      <AuthLayout>
        <AuthHeader
          title="Create a new applicant account"
          subtitle={
            <>
              Or{" "}
              <Link
                href="/auth/signin"
                className="text-[#4F46E5] hover:underline"
              >
                sign in to your existing account
              </Link>
            </>
          }
        />
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="w-full border-[1.5px] border-[#D1D5DB] rounded-[6px] overflow-hidden">
            <InputField
              isLast={false}
              type="text"
              placeholder="Full Name"
              {...register("name", { required: "Full name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
            <InputField
              isLast={false}
              type="email"
              placeholder="Email address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
            <InputField
              isLast={false}
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
            <InputField
              isLast={true}
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
              })}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
          <div className="w-full h-6" />
          <Button text="Create account" />
        </form>
      </AuthLayout>
    </div>
  );
};

export default Register;
