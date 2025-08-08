// src/hooks/useAuth.ts
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useLoginMutation,
  useRegisterMutation,
  setLogoutCallback,
} from "@/lib/redux/api/authApi";

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
  const redirect = searchParams.get("redirect") || "/";

  const [loginMutation, { isLoading: loading }] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

  const login = async (data: LoginData) => {
    try {
      const res = await loginMutation({
        email: data.email,
        password: data.password,
      }).unwrap();
      const { access, refresh } = res;

      if (data.rememberMe) {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
      } else {
        sessionStorage.setItem("access_token", access);
        sessionStorage.setItem("refresh_token", refresh);
      }
      router.replace(redirect);
    } catch (err: any) {
      const msg = err?.data?.message || "Login failed";
      alert(msg);
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
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    router.push("/auth/signin");
  };

  useEffect(() => {
    setLogoutCallback(logout);
  }, []);

  const resetPassword = async (email: string) => {
    // TODO
  };

  const updatePassword = async (password: string) => {
    // TODO
  };

  return {
    login,
    register,
    logout,
    loading,
    resetPassword,
    updatePassword,
  };
};
