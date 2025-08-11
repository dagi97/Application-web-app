"use client";

import { useForm } from "react-hook-form";
import AuthHeader from "@/app/components/AuthHeader";
import AuthLayout from "@/app/components/AuthLayout";
import Button from "@/app/components/AuthButton";
import InputField from "@/app/components/AuthInputField";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/app/components/Footer";
import HeaderAuth from "@/app/components/HeaderAuth";
import Toaster from "@/app/components/Toaster";
import { useState, useEffect } from "react";

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
    formState: { errors },
  } = useForm<FormData>();

  const {
    register: registerUser,
    loading,
    toastMessage,
    toastType,
    clearToast,
  } = useAuth();

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  useEffect(() => {
    if (toastMessage && !toast.show) {
      setToast({
        show: true,
        message: toastMessage,
        type: toastType || "success",
      });
    }
  }, [toastMessage, toastType, toast.show]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
        clearToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show, clearToast]);

  const showLocalToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
  };

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      showLocalToast("Passwords don't match", "error");
      return;
    }

    registerUser({
      full_name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="bg-[#F9FAFB] relative">
      <HeaderAuth text="Sign in" />
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
      <Footer />

      <Toaster
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default Register;
