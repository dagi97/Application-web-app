import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ProfileData } from "../types/ProfileData";
import { getSession } from "next-auth/react";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://a2sv-application-platform-backend-team2.onrender.com",
    prepareHeaders: async (headers) => {
      // ✅ Get the NextAuth session
      const session = await getSession();

      if (session?.access) {
        headers.set("Authorization", `Bearer ${session.access}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileData, void>({
      query: () => "/profile/me",
    }),
    updateProfile: builder.mutation<
      ProfileData,
      { full_name: string; email: string }
    >({
      query: (body) => ({
        url: "/profile/me",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
