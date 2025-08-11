"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession, signOut, getSession } from "next-auth/react";
import {
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  setLogoutCallback,
} from "@/lib/redux/api/authApi";

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
}

export const useAuth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { data: session, status } = useSession();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registerMutation] = useRegisterMutation();
  const [forgotPasswordMutation] = useForgotPasswordMutation();
  const [resetPasswordMutation] = useResetPasswordMutation();

  const login = async (data: { email: string; password: string }) => {
    setLoading(true);
    setLoginError(null); // clear previous errors
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    setLoading(false);

    if (res?.error) {
      setLoginError("Invalid email or password");
      return;
    }

    const newSession = await getSession();
    const accessToken = (newSession as any)?.access;

    if (accessToken) {
      sessionStorage.setItem("access_token", accessToken);
    }

    if (newSession?.user?.role) {
      const role = newSession.user.role;
      if (role === "applicant") router.replace("/applicant");
      else if (role === "manager") router.replace("/manager");
      else if (role === "reviewer") router.replace("/reviewer");
      else if (role === "admin") router.replace("/admin");
      else router.replace(redirect);
    } else {
      router.replace(redirect);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await registerMutation(data).unwrap();
      alert("Account created! You can now sign in.");
      router.push("/auth/signin");
    } catch (err: any) {
      alert("Registration failed");
      console.error(err);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("access_token"); // clear token on logout
    signOut({ callbackUrl: "/auth/signin" });
  };

  const forgotPassword = async (email: string) => {
    try {
      const callbackUrl = `${window.location.origin}/auth/reset-password`;
      await forgotPasswordMutation({ email, callback_url: callbackUrl }).unwrap();
      alert("If the email exists, a password reset link has been sent.");
    } catch (err: any) {
      alert(err?.data?.message || "Failed to send reset link");
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await resetPasswordMutation({ token, new_password: newPassword }).unwrap();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.data?.message || "Failed to reset password" };
    }
  };

  useEffect(() => {
    setLogoutCallback(logout);
  }, []);

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      alert("Your session expired. Please log in again.");
      sessionStorage.removeItem("access_token"); // clear token on error
      logout();
    }
  }, [session]);

  return {
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    loading,
    loginError,
    session,
  };
};
