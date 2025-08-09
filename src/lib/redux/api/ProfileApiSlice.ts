import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ProfileData } from '../types/ProfileData';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://a2sv-application-platform-backend-team2.onrender.com',
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileData, void>({
      query: () => '/profile/me',
    }),
    updateProfile: builder.mutation<ProfileData, { full_name: string; email: string }>({
      query: (body) => ({
        url: '/profile/me',
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
