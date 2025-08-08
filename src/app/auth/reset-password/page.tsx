"use client";

import React from "react";
import { useForm } from "react-hook-form";
import AuthHeader from "@/app/components/AuthHeader";
import AuthLayout from "@/app/components/AuthLayout";
import Button from "@/app/components/AuthButton";
import InputField from "@/app/components/AuthInputField";

type FormData = {
  password: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    //  API Call
  };
  const hasError = errors.password || errors.confirmPassword;
  return (
    <div className="bg-[#F3F4F6]">
      <AuthLayout>
        <AuthHeader
          title="Set a new password"
          subtitle="Please choose a strong, new password for your account."
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full"
        >
          <div className="border-[1.5px]  border-[#D1D5DB] rounded-[6px] overflow-hidden">
            <div className="flex flex-col gap-1">
              <InputField
                isLast={false}
                type="password"
                placeholder="New Password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <InputField
                isLast={true}
                type="password"
                placeholder="Confirm New Password"
                {...register("confirmPassword", {
                  required: "Please confirm password",
                })}
              />
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs ">
              {errors.confirmPassword.message}
            </p>
          )}
          <div className="w-full mt-6"></div>
          <Button text="Update Password" />
        </form>
      </AuthLayout>
    </div>
  );
}
