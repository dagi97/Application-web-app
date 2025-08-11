import { createApi, fetchBaseQuery, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

const BASE_URL = 'https://a2sv-application-platform-backend-team2.onrender.com';

let logoutCallback: (() => void) | null = null;
export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers) => {
    const session = await getSession();
    const accessToken = (session as any)?.access;
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Wrapper to handle refresh token logic
const baseQueryWithReauth: typeof rawBaseQuery = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && (result.error as FetchBaseQueryError).status === 401) {
    console.warn("Access token expired, attempting refresh...");

    const session = await getSession();
    if (!session?.error && session?.user) {
      try {
        // Call refresh endpoint
        const refreshRes = await fetch(`${BASE_URL}/auth/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: (session as any)?.refresh }),
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const newAccessToken = refreshData?.data?.access;

          if (newAccessToken) {
            // Update the session in memory
            (session as any).access = newAccessToken;

            // Retry the original request with new token
            if (typeof args !== 'string') {
              args.headers = {
                ...(args.headers || {}),
                Authorization: `Bearer ${newAccessToken}`,
              };
            }
            result = await rawBaseQuery(args, api, extraOptions);
          }
        } else {
          console.error("Refresh token failed, logging out");
          if (logoutCallback) logoutCallback();
        }
      } catch (err) {
        console.error("Refresh request failed:", err);
        if (logoutCallback) logoutCallback();
      }
    } else {
      console.error("No session available for token refresh");
      if (logoutCallback) logoutCallback();
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation<unknown, { full_name: string; email: string; password: string }>({
      query: (data) => ({
        url: '/auth/register/',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: builder.mutation<{ success: boolean; message: string }, { email: string; callback_url: string }>({
      query: (body) => ({
        url: '/auth/forgot-password/',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<{ success: boolean; message: string }, { token: string; new_password: string }>({
      query: (body) => ({
        url: '/auth/reset-password/',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
