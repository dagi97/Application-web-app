"use client";
import { useForm } from "react-hook-form";
import AuthHeader from "@/app/components/AuthHeader";
import AuthLayout from "@/app/components/AuthLayout";
import Button from "@/app/components/AuthButton";
import InputField from "@/app/components/AuthInputField";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import HeaderForIndex from "@/app/components/HeaderForIndex";
import Footer from "@/app/components/Footer";
import { useState, useEffect } from "react";
import Toaster from "@/app/components/Toaster";
import SuspenseWrapper from "@/app/components/SuspenseWrapper";

type FormData = {
  email: string;
};

function ForgotPasswordContent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { forgotPassword, toastMessage, toastType, clearToast, loading } = useAuth();

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

      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
        clearToast();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toastMessage, toastType, clearToast, toast.show]);

  const onSubmit = async (data: FormData) => {
    await forgotPassword(data.email);
  };

  return (
    <div className="bg-[#F9FAFB]">
      <HeaderForIndex />
      <AuthLayout>
        <AuthHeader
          title="Forgot your password?"
          subtitle="Enter your email and we'll send you a link to get back into your account."
        />
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="border-[1.5px] border-[#D1D5DB] rounded-[6px] overflow-hidden">
            <InputField
              isLast={true}
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
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
          <div className="w-full flex flex-col justify-between">
            <div className="h-[24px]" />
            <Button 
              text={loading ? "sending reset link..." : "Send reset link"}
              disabled={loading} 
              type="submit"
            />
            <div className="h-[24px]" />
          </div>
        </form>
        <Link
          className="block text-sm text-[#4F46E5] font-medium hover:underline"
          href="/auth/signin"
        >
          Back to login
        </Link>
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
}

const ForgotPassword = () => {
  return (
    <SuspenseWrapper>
      <ForgotPasswordContent />
    </SuspenseWrapper>
  );
};

export default ForgotPassword;
