// src/lib/redux/api/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryApi, FetchArgs, FetchBaseQueryMeta, BaseQueryFn } from '@reduxjs/toolkit/query';

// Base URL of your backend
const BASE_URL = 'https://a2sv-application-platform-backend-team2.onrender.com';

// Helper to get tokens from storage
const getStoredToken = () => {
  const access = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  const refresh = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
  return { access, refresh };
};

// Helper to store tokens to correct storage
const storeTokens = (access: string, refresh: string) => {
  if (localStorage.getItem('refresh_token')) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  } else {
    sessionStorage.setItem('access_token', access);
    sessionStorage.setItem('refresh_token', refresh);
  }
};

// To handle logout callback (passed from your hook)
let logoutCallback: (() => void) | null = null;
export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

// Basic fetchBaseQuery with auth header prep
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

// Extended baseQuery with token refresh logic
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown,
  {},
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const { refresh } = getStoredToken();

    if (refresh) {
      // Prevent retry loop
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

            // Retry original query with new token
            result = await baseQuery(args, api, extraOptions);
          } else {
            throw new Error('No refresh token data');
          }
        } catch {
          if (logoutCallback) logoutCallback();
          else window.location.href = '/auth/signin';
        }
      }
    } else {
      if (logoutCallback) logoutCallback();
      else window.location.href = '/auth/signin';
    }
  }
  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<{ access: string; refresh: string }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/token/',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<unknown, { full_name: string; email: string; password: string }>({
      query: (data) => ({
        url: '/auth/register/',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
