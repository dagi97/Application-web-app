export async function submitReview(reviewId: string, payload: any): Promise<{ success: boolean; error?: string }> {
  if (typeof window === "undefined") return { success: false, error: "No window object" };
  let token = localStorage.getItem("reviewer_token") || localStorage.getItem("access_token");
  if (!token) {
    return { success: false, error: "No auth token" };
  }
  try {
    const response = await fetch(
      `https://a2sv-application-platform-backend-team2.onrender.com/reviews/${reviewId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      const err = await response.text();
      return { success: false, error: err };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Unknown error" };
  }
}
export async function loginAndFetchAssignedReview() {
  if (typeof window === "undefined") return { token: null, assignedReviewData: null, applicationId: null, reviewerName: null };
  let token = localStorage.getItem("reviewer_token");
  if (!token) {
    token = await reviewerLogin("abcd@gmail.com", "bezzthegoat!AA");
  }
  let reviewerName = null;
  if (token) {
    try {
      const profileRes = await fetch(
        "https://a2sv-application-platform-backend-team2.onrender.com/profile/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const profileData = await profileRes.json();
      reviewerName = profileData?.data?.full_name || profileData?.data?.name || null;
    } catch (e) {
      reviewerName = null;
    }
    try {
      const res = await fetch(
        "https://a2sv-application-platform-backend-team2.onrender.com/reviews/assigned?page=1&limit=10",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      let assigned = null;
      if (Array.isArray(data?.data)) {
        assigned = data?.data[0]?.application_id || data?.data[0]?.id;
      } else if (data?.data) {
        assigned = data?.data?.id || data?.data?.application_id;
      }
      return { token, assignedReviewData: data, applicationId: assigned, reviewerName };
    } catch (e) {
      return { token, assignedReviewData: null, applicationId: null, reviewerName };
    }
  }
  return { token: null, assignedReviewData: null, applicationId: null, reviewerName: null };
}

export async function reviewerLogin(email: string, password: string): Promise<string | null> {
  try {
    const response = await fetch('https://a2sv-application-platform-backend-team2.onrender.com/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }
    const data = await response.json();
    const token = data.access;
    if (token) {
      localStorage.setItem('reviewer_token', token);
      return token;
    }
    return null;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}
