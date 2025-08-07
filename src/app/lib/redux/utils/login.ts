export async function updatePassword({
  accessToken,
  currentPassword,
  newPassword,
}: {
  accessToken: string;
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: boolean; message: string; details?: string }> {
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
          old_password: currentPassword,
          new_password: newPassword,
        }),
      }
    );
    const result = await response.json();
    return {
      success: response.ok && result.success,
      message: result.message || (response.ok ? "Password updated successfully." : "Failed to update password."),
      details: result.details || result.error || undefined,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "An error occurred.",
    };
  }
}
export async function loginAndStoreToken(email: string, password: string) {
  const res = await fetch("https://a2sv-application-platform-backend-team2.onrender.com/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error("Login failed");
  }
  const data = await res.json();
  const token = data.data?.access;
  if (token) {
    localStorage.setItem("accessToken", token);
  }
  return token;
}