"use client";

import { useForm } from "react-hook-form";
import AuthHeader from "@/app/components/AuthHeader";
import AuthLayout from "@/app/components/AuthLayout";
import Button from "@/app/components/AuthButton";
import InputField from "@/app/components/AuthInputField";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/app/components/Footer";
import HeaderAuth from "@/app/components/HeaderAuth";
import Toaster from "@/app/components/Toaster";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import SuspenseWrapper from "@/app/components/SuspenseWrapper";

const SignInContent = () => {
  type FormData = {
    password: string;
    email: string;
    role: string;
    rememberMe?: boolean;
  };

  const { login, loading, toastMessage, toastType, clearToast } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

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

  const onSubmit = (data: FormData) => {
    login(data);
  };

  return (
    <div className="bg-[#F9FAFB]">
      <HeaderAuth text="Create Account" />
      <AuthLayout>
        <AuthHeader
          title="Sign in to your account"
          subtitle={
            <>
              <a
                href="/"
                className="text-[#4F46E5] hover:underline pr-1 border-r border-black"
              >
                Back to Home
              </a>{" "}
              <a
                href="/auth/register"
                className="text-[#4F46E5] hover:underline"
              >
                Create a new applicant account
              </a>
            </>
          }
        />
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="w-full border-[1.5px] border-[#D1D5DB] rounded-[6px] overflow-hidden">
            <div className="w-full flex flex-col gap-1">
              <InputField
                isLast={false}
                type="email"
                placeholder="user@example.com"
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
              <div className="relative">
                <InputField
                  isLast={true}
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password.message}</p>
              )}
            </div>
          </div>
          <Button
            text={loading ? "Signing in..." : "Sign in"}
            type="submit"
            disabled={loading}
          />
        </form>
        <Toaster
          message={toast.message}
          type={toast.type}
          show={toast.show}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      </AuthLayout>
      <Footer />
    </div>
  );
};

const SignIn = () => {
  return (
    <SuspenseWrapper>
      <SignInContent />
    </SuspenseWrapper>
  );
};

export default SignIn;
