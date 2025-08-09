"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { signIn, useSession, signOut } from "next-auth/react";
import { useRegisterMutation, useForgotPasswordMutation, useResetPasswordMutation, setLogoutCallback } from "@/lib/redux/api/authApi";

// Define types for login and registration data
interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
}

export const useAuth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/"; // redirect after login
  const { data: session, status } = useSession(); // get session and loading status

  // RTK Query mutations for auth-related API calls
  const [registerMutation] = useRegisterMutation();
  const [forgotPasswordMutation] = useForgotPasswordMutation();
  const [resetPasswordMutation] = useResetPasswordMutation();

  // Login function using next-auth's signIn with credentials provider
  const login = async (data: { email: string; password: string; rememberMe?: boolean }) => {
    const res = await signIn("credentials", {
      redirect: false, // handle redirect manually
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe ? "true" : "false", // pass rememberMe flag as string
    });

    if (res?.error) {
      alert(res.error); // show error if login failed
      return;
    }

    // Save rememberMe preference in localStorage (persistent) or remove it
    if (data.rememberMe) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }

    // Redirect user to role-based dashboard or default redirect URL
    if (session?.user?.role) {
      const role = session.user.role;
      if (role === "applicant") router.replace("/applicant");
      else if (role === "manager") router.replace("/manager");
      else if (role === "reviewer") router.replace("/reviewer");
      else if (role === "admin") router.replace("/admin");
      else router.replace(redirect);
    } else {
      router.replace(redirect);
    }
  };

  // Register new user
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

  // Logout function using next-auth's signOut
  const logout = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  // Send forgot password email with callback URL for reset
  const forgotPassword = async (email: string) => {
    try {
      const callbackUrl = `${window.location.origin}/auth/reset-password`;
      await forgotPasswordMutation({ email, callback_url: callbackUrl }).unwrap();
      alert("If the email exists, a password reset link has been sent.");
    } catch (err: any) {
      alert(err?.data?.message || "Failed to send reset link");
    }
  };

  // Reset password using token and new password
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await resetPasswordMutation({ token, new_password: newPassword }).unwrap();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.data?.message || "Failed to reset password" };
    }
  };

  // Register logout callback to handle forced logout on token expiry
  useEffect(() => {
    setLogoutCallback(logout);
  }, []);

  // Watch for session errors related to token refresh failure, then logout
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      alert("Your session expired. Please log in again.");
      logout();
    }
  }, [session]);

  return {
    login,
    register,
    logout,
    loading: status === "loading", // loading state during session fetch
    forgotPassword,
    resetPassword,
    session,
  };
};
