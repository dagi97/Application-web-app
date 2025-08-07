// lib/redux/api/applicationApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const applicationApi = createApi({
  reducerPath: "applicationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://a2sv-application-platform-backend-team2.onrender.com/",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    //  Fetch Application Status
    getApplicationStatus: builder.query<any, void>({
      query: () => "applications/my-status",
    }),
    // Submit Application
    submitApplication: builder.mutation<void, string>({
      query: (appId) => ({
        url: `applications/${appId}`,
        method: "PATCH",
      }),
    }),
    // Delete Application
    deleteApplication: builder.mutation<void, string>({
      query: (appId) => ({
        url: `applications/${appId}`,
        method: "DELETE",
      }),
    }),
    // Fetch All Cycles
    getAllCycle: builder.query<any, void>({
      query: () => "cycles",
    }),
  }),
});

export const {
  useGetApplicationStatusQuery,
  useDeleteApplicationMutation,
  useSubmitApplicationMutation,
  useGetAllCycleQuery,
} = applicationApi;
