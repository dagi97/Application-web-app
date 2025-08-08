// src/hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiPost, setLogoutCallback } from "@/app/lib/redux/api/clientApi";

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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const login = async (data: LoginData) => {
    setLoading(true);
    try {
      const res = await apiPost("/auth/token/", data);
      const { access, refresh } = res.data;

      if (data.rememberMe) {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
      } else {
        sessionStorage.setItem("access_token", access);
        sessionStorage.setItem("refresh_token", refresh);
      }

      router.replace(redirect);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Something went wrong";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      await apiPost("/auth/register/", data);
      alert("Account created! You can now sign in.");
      router.push("/auth/signin");
    } catch (err: any) {
      alert("Registration failed");
      console.error(err?.response?.data || err.message);
    } finally {
      setLoading(false);
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
  const resetPassword = async (email: string) => {};

  const updatePassword = async (password: string) => {};

  return {
    login,
    register,
    logout,
    loading,
    resetPassword,
    updatePassword,
  };
};
