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
    localStorage.setItem("access_token", token);
  }
  return token;
}

export async function fetchReviewerProfile(token: string): Promise<any> {
  try {
    const response = await fetch("https://a2sv-application-platform-backend-team2.onrender.com/profile/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) return null;
    const profile = await response.json();
    return profile.data || null;
  } catch {
    return null;
  }
}