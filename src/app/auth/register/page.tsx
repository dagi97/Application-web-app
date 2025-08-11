"use client"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import ActionSuccess from "@/app/components/ActionSuccess";  // import your success component
import HeaderForIndex from "@/app/components/HeaderForIndex";
import Footer from "@/app/components/Footer";
import AuthHeader from "@/app/components/AuthHeader";
import AuthLayout from "@/app/components/AuthLayout";
import Button from "@/app/components/AuthButton";
import InputField from "@/app/components/AuthInputField";
import { useSearchParams } from "next/navigation";

type FormData = {
  password: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    const result = await resetPassword(token, data.password);
    if (result.success) {
      setSuccess(true);
    } else {
      alert(result.error);
    }
  };

  if (success) {
    return <ActionSuccess />;
  }

  return (
    <div className="bg-[#F3F4F6]">
      <HeaderForIndex />
      <AuthLayout>
        <AuthHeader
          title="Set a new password"
          subtitle="Please choose a strong, new password for your account."
        />
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
          <div className="border-[1.5px] border-[#D1D5DB] rounded-[6px] overflow-hidden">
            <div className="flex flex-col gap-1">
              <InputField
                isLast={false}
                type="password"
                placeholder="New Password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <InputField
                isLast={true}
                type="password"
                placeholder="Confirm New Password"
                {...register("confirmPassword", { required: "Please confirm password" })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
          <div className="w-full mt-6">
            <Button text="Update Password" />
          </div>
        </form>
      </AuthLayout>
      <Footer />
    </div>
  );
}
