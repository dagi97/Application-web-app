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
import { Eye, EyeOff } from "lucide-react";
import SuspenseWrapper from "@/app/components/SuspenseWrapper";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function RegisterContent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            <div className="w-full flex flex-col gap-1">
              <InputField
                isLast={false}
                type="text"
                placeholder="Full Name"
                {...register("name", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
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
                  isLast={false}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password.message}</p>
              )}
              <div className="relative">
                <InputField
                  isLast={true}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          <Button
            text={loading ? "Creating account..." : "Create account"}
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
}

const Register = () => {
  return (
    <SuspenseWrapper>
      <RegisterContent />
    </SuspenseWrapper>
  );
};

export default Register;
