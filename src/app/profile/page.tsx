"use client";

import Image from "next/image";
import { refreshSession } from "../lib/refreshSession";
import { useEffect, useState } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../lib/redux/api/ProfileApiSlice";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Label,
} from "../components/Card2";
import Footer from "../components/Footer";
import { Eye, EyeOff } from "lucide-react";
import Toaster from "../components/Toaster";
import Header from "../components/Header";

const Profile = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileUpdateMessage, setProfileUpdateMessage] = useState("");
  const [showProfileToast, setShowProfileToast] = useState(false);
  const { data: session, status } = useSession();

  const {
    data,
    isLoading,
    isError,
    refetch: refetchProfile,
  } = useGetProfileQuery(undefined, {
    skip: status !== "authenticated",
  });

  const profile = data?.data;
  const userName = (session?.user as any)?.name || profile?.full_name || "User";
  const userEmail = session?.user?.email || profile?.email || "";
  const userRole = session?.user?.role || profile?.role || "";
  const passwordRules = {
    required: "New password is required",
    minLength: { value: 8, message: "Password must be at least 8 characters" },
    validate: {
      hasSpecial: (v: string) =>
        /[!@#$%^&*(),.?":{}|<>]/.test(v) ||
        "Password must contain a special character",
      hasUpper: (v: string) =>
        /[A-Z]/.test(v) || "Password must contain an uppercase letter",
      hasLower: (v: string) =>
        /[a-z]/.test(v) || "Password must contain a lowercase letter",
      notSameAsCurrent: (v: string) =>
        v !== watchPassword("currentPassword") ||
        "New password cannot be the same as current password",
    },
  };

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isValid: isProfileValid },
    reset: resetProfileForm,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      role: "",
    },
  });

  useEffect(() => {
    if (profile) {
      resetProfileForm({
        fullName: profile.full_name || "",
        email: profile.email || "",
        role: profile.role || "",
      });
    }
  }, [profile, resetProfileForm]);
  const dashlink = userRole ? `/${userRole}` : "/unauthorized";

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch: watchPassword,
  } = useForm({ mode: "onChange" });

  const [updateProfile, { isLoading: isProfileUpdating }] =
    useUpdateProfileMutation();
  const [profileUpdateStatus, setProfileUpdateStatus] = useState<
    null | "success" | "error" | "loading"
  >(null);

  const handleUpdateProfile = async (formData: any) => {
    if (
      formData.fullName === profile?.full_name &&
      formData.email === profile?.email
    ) {
      setProfileUpdateStatus("error");
      setProfileUpdateMessage(
        "No changes detected. Please modify your name or email before saving."
      );
      setShowProfileToast(true);
      return;
    }
    setProfileUpdateStatus("loading");
    setProfileUpdateMessage("");
    setShowProfileToast(false);

    const fd = new FormData();
    fd.append("full_name", formData.fullName);
    fd.append("email", formData.email);
    try {
      const result = await updateProfile(fd as any).unwrap();
      if (result && (result as any).success) {
        setProfileUpdateStatus("success");
        setProfileUpdateMessage(
          (result as any).message || "Profile updated successfully."
        );
        setShowProfileToast(true);
        const refreshed = await refetchProfile();
        if (
          refreshed.data &&
          refreshed.data.data &&
          (refreshed.data.data.full_name !== profile?.full_name ||
            refreshed.data.data.email !== profile?.email)
        ) {
          resetProfileForm({
            fullName: refreshed.data.data.full_name || "",
            email: refreshed.data.data.email || "",
            role: refreshed.data.data.role || "",
          });
          // Refresh NextAuth session so header and session-based info update
          await refreshSession();
        }
      } else {
        setProfileUpdateStatus("error");
        setProfileUpdateMessage(
          (result as any).message ||
            "Failed to update profile. Please try again."
        );
        setShowProfileToast(true);
      }
    } catch (error: any) {
      setProfileUpdateStatus("error");
      let debugMsg = "Failed to update profile. Please try again.";
      if (error) {
        if (error.data) {
          debugMsg = `API Error: ${JSON.stringify(error.data)}`;
        } else if (error.message) {
          debugMsg = `Error: ${error.message}`;
        } else if (typeof error === "string") {
          debugMsg = error;
        }
        if (error.status) {
          debugMsg += ` (HTTP status: ${error.status})`;
        }
        console.error("Profile update error:", error);
      }
      setProfileUpdateMessage(debugMsg);
      setShowProfileToast(true);
    }
  };

  const [passwordChangeStatus, setPasswordChangeStatus] = useState<
    null | "success" | "error" | "loading"
  >(null);
  const [passwordChangeMessage, setPasswordChangeMessage] =
    useState<string>("");
  const [showPasswordToast, setShowPasswordToast] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    const shouldHidePasswordToast =
      showPasswordToast &&
      (passwordChangeStatus === "success" || passwordChangeStatus === "error");
    const shouldHideProfileToast =
      showProfileToast &&
      (profileUpdateStatus === "success" || profileUpdateStatus === "error");
    if (shouldHidePasswordToast || shouldHideProfileToast) {
      timer = setTimeout(() => {
        if (shouldHidePasswordToast) setShowPasswordToast(false);
        if (shouldHideProfileToast) setShowProfileToast(false);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [
    showPasswordToast,
    passwordChangeStatus,
    showProfileToast,
    profileUpdateStatus,
  ]);

  const handleUpdatePassword = async (formData: any) => {
    setPasswordChangeStatus("loading");
    setPasswordChangeMessage("");
    setShowPasswordToast(false);

    const accessToken = (session as any)?.access;
    if (!accessToken) {
      setPasswordChangeStatus("error");
      setPasswordChangeMessage("No access token found. Please login again.");
      setShowPasswordToast(true);
      return;
    }

    try {
      const response = await fetch(
        "https://a2sv-application-platform-backend-team2.onrender.com/profile/me/change-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            old_password: formData.currentPassword,
            new_password: formData.newPassword,
          }),
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setPasswordChangeStatus("success");
        setPasswordChangeMessage(
          data.message || "Password updated successfully."
        );
        setShowPasswordToast(true);
      } else {
        setPasswordChangeStatus("error");
        setPasswordChangeMessage(
          data.message ||
            data.detail ||
            "Failed to update password. Please try again."
        );
        setShowPasswordToast(true);
      }
    } catch (error: any) {
      setPasswordChangeStatus("error");
      setPasswordChangeMessage(
        error?.message || "Failed to update password. Please try again."
      );
      setShowPasswordToast(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] font-sans">
      <Header
        name={isLoading ? "Loading..." : userName}
        dashboardLink={dashlink}
      ></Header>
      <main className="flex-1 mt-10">
        <div className="max-w-5xl mx-auto px-0 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="h-44 w-full rounded-2xl overflow-hidden bg-gray-200">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 animate-pulse text-gray-500 text-lg">
                  Loading banner...
                </div>
              ) : (
                <Image
                  src={profile?.profile_picture_url || "/images/logo.svg"}
                  alt="Profile Banner"
                  width={1024}
                  height={256}
                  className="w-full h-full object-cover"
                  priority
                />
              )}
            </div>
            <div className="absolute left-0 -bottom-20 flex flex-row items-center w-full pl-8">
              <div className="w-40 h-40 rounded-full border-4 border-white overflow-hidden shadow-lg bg-gray-200">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 animate-pulse text-[#6B7280] text-lg rounded-full">
                    Loading...
                  </div>
                ) : (
                  <Image
                    src={profile?.profile_picture_url || "/images/logo.svg"}
                    alt="Profile Picture"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover rounded-full"
                    priority
                  />
                )}
              </div>
              <div className="ml-6 mb-4 self-end">
                <h1 className="text-2xl font-bold">
                  {isLoading ? (
                    <span className="text-gray-400 animate-pulse">
                      Loading name...
                    </span>
                  ) : isError ? (
                    <span className="text-red-500">
                      Failed to load profile data
                    </span>
                  ) : (
                    userName
                  )}
                </h1>
                <p className="text-base text-[#6B7280]">
                  {isLoading ? (
                    <span className="text-gray-300 animate-pulse">
                      Loading email...
                    </span>
                  ) : isError ? (
                    <span className="text-red-500">
                      Failed to load profile data
                    </span>
                  ) : (
                    userEmail
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 mt-28">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmitProfile(handleUpdateProfile)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullname">Full Name</Label>
                      <Input
                        id="fullname"
                        type="text"
                        {...registerProfile("fullName", {
                          required: "Full Name is required",
                        })}
                      />
                      {profileErrors.fullName && (
                        <span className="text-red-500 text-xs">
                          {profileErrors.fullName.message as string}
                        </span>
                      )}

                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...registerProfile("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address",
                          },
                        })}
                      />
                      {profileErrors.email && (
                        <span className="text-red-500 text-xs">
                          {profileErrors.email.message as string}
                        </span>
                      )}

                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        type="text"
                        readOnly
                        {...registerProfile("role", {
                          required: "Role is required",
                        })}
                      />
                      {profileErrors.role && (
                        <span className="text-red-500 text-xs">
                          {profileErrors.role.message as string}
                        </span>
                      )}
                    </div>
                  </div>
                  <Toaster
                    message={profileUpdateMessage}
                    type={
                      profileUpdateStatus === "success" ? "success" : "error"
                    }
                    onClose={() => setShowProfileToast(false)}
                    show={
                      showProfileToast &&
                      (profileUpdateStatus === "success" ||
                        profileUpdateStatus === "error")
                    }
                  />

                  <div className="flex justify-end py-4 bg-[#F9FAFB] ">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#4F46E5] text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                      disabled={!isProfileValid || isProfileUpdating}
                    >
                      {isProfileUpdating ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            ></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>

                <CardTitle>Change Password</CardTitle>

                <form
                  onSubmit={handleSubmitPassword(handleUpdatePassword)}
                  className="space-y-6 pt-4"
                >
                  <div className="w-1/2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        {...registerPassword("currentPassword", {
                          required: "Current password is required",
                        })}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:shadow-lg hover:bg-gray-100"
                        onClick={() => setShowCurrentPassword((v) => !v)}
                        aria-label={
                          showCurrentPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <span className="text-red-500 text-xs">
                        {passwordErrors.currentPassword.message as string}
                      </span>
                    )}
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        {...registerPassword("newPassword", passwordRules)}
                        className="w-1/2"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:shadow-lg hover:bg-gray-100"
                        onClick={() => setShowNewPassword((v) => !v)}
                        aria-label={
                          showNewPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <span className="text-red-500 text-xs">
                        {passwordErrors.newPassword.message as string}
                      </span>
                    )}
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...registerPassword("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value: string) =>
                          value === watchPassword("newPassword") ||
                          "Passwords do not match",
                      })}
                    />
                    {passwordErrors.confirmPassword && (
                      <span className="text-red-500 text-xs">
                        {passwordErrors.confirmPassword.message as string}
                      </span>
                    )}
                  </div>
                  <Toaster
                    message={passwordChangeMessage}
                    type={
                      passwordChangeStatus === "success" ? "success" : "error"
                    }
                    onClose={() => setShowPasswordToast(false)}
                    show={
                      showPasswordToast &&
                      (passwordChangeStatus === "success" ||
                        passwordChangeStatus === "error")
                    }
                  />
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#4F46E5] text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                      disabled={passwordChangeStatus === "loading"}
                    >
                      {passwordChangeStatus === "loading" ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            ></path>
                          </svg>
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
