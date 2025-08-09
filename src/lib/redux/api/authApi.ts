import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';

// Base URL for backend API
const BASE_URL = 'https://a2sv-application-platform-backend-team2.onrender.com';

// Helpers to get and store tokens either in localStorage (persistent) or sessionStorage (temporary)
const getStoredToken = () => {
  const access = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  const refresh = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
  return { access, refresh };
};

const storeTokens = (access: string, refresh: string) => {
  // If refresh token exists in localStorage, store both tokens there (rememberMe)
  if (localStorage.getItem('refresh_token')) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  } else {
    // Otherwise store in sessionStorage (session only)
    sessionStorage.setItem('access_token', access);
    sessionStorage.setItem('refresh_token', refresh);
  }
};

// To store a logout callback from your React hook for forced logout on token failure
let logoutCallback: (() => void) | null = null;
export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

// Basic baseQuery adds Authorization header with access token
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const { access } = getStoredToken();
    if (access) {
      headers.set('Authorization', `Bearer ${access}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Extended baseQuery to handle 401 errors by trying to refresh tokens
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, unknown, {}, FetchBaseQueryMeta> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const { refresh } = getStoredToken();

    if (refresh) {
      // Prevent infinite retry loops
      if (!(api.getState() as any).auth?._retry) {
        try {
          const refreshResult = await baseQuery(
            {
              url: '/auth/token/refresh/',
              method: 'POST',
              body: { refresh },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const { access } = refreshResult.data as { access: string };
            storeTokens(access, refresh);

            // Retry original query with new access token
            result = await baseQuery(args, api, extraOptions);
          } else {
            throw new Error('No refresh token data');
          }
        } catch {
          // If refresh fails, call logout callback or redirect to login page
          if (logoutCallback) logoutCallback();
          else window.location.href = '/auth/signin';
        }
      }
    } else {
      // No refresh token — logout immediately
      if (logoutCallback) logoutCallback();
      else window.location.href = '/auth/signin';
    }
  }

  return result;
};

// Define API endpoints for auth related operations
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

// Export hooks for components to use
export const {
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;