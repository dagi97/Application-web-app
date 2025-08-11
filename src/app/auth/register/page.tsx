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
            {/* Full name */}
            <InputField
              isLast={false}
              type="text"
              placeholder="Full Name"
              {...register("name", { required: "Full name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}

            {/* Email */}
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

            {/* Password */}
            <div className="relative">
              <InputField
                isLast={false}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}

            {/* Confirm Password */}
            <div className="relative">
              <InputField
                isLast={true}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                })}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}

          <div className="w-full h-6" />
          <Button
            text={loading ? "Creating account..." : "Create account"}
            disabled={loading}
          />
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
