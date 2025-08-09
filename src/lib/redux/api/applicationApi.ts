import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const applicationApi = createApi({
  reducerPath: "applicationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://a2sv-application-platform-backend-team2.onrender.com/",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNTkyYWM3Yi00Y2E2LTQ0Y2YtOGUwZC0wMDdiODA5NzIwNDciLCJleHAiOjE3NTQ1Njk5NDYsInR5cGUiOiJhY2Nlc3MifQ.l2mzwLH2FbUEtoLTlxOdVcFdnwQ40KGv-EnVNgPFq3c";
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get application status
    getApplicationStatus: builder.query<any, void>({
      query: () => "applications/my-status",
    }),
    // Get all active cycles
    getAllActiveCycle: builder.query<any, void>({
      query: () => "cycles/active",
    }),
    // Submit application
    submitApplicationFinal: builder.mutation<void, string>({
      query: (appId) => ({
        url: `applications/${appId}`,
        method: "PATCH",
      }),
    }),
    //Delete Application
    deleteApplication: builder.mutation<void, string>({
      query: (appId) => ({
        url: `applications/${appId}`,
        method: "DELETE",
      }),
    }),
    // Get a specific application
    getApplication: builder.query<any, string>({
      query: (appId) => `applications/${appId}`,
    }),

    // Update an application
    editApplication: builder.mutation<void, { appId: string; data: FormData }>({
      query: ({ appId, data }) => ({
        url: `applications/${appId}`,
        method: "PUT",
        body: data,
      }),
    }),
    // post a new application
    submitApplication: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "applications/",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetApplicationStatusQuery,
  useGetAllActiveCycleQuery,
  useSubmitApplicationMutation,
  useDeleteApplicationMutation,
  useGetApplicationQuery,
  useEditApplicationMutation,
  useSubmitApplicationFinalMutation,
} = applicationApi;
