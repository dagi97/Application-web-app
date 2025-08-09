import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// --- API Slice ---

export const applicationApi = createApi({
  reducerPath: "applicationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://a2sv-application-platform-backend-team2.onrender.com/",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        // TODO: Replace hardcoded token with dynamic retrieval (e.g., localStorage)
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlN2I0Nzc4My1hMTIzLTQwODEtYjVjYS0zNjAzNDBlNzgyMDMiLCJleHAiOjE3NTQ3Mzg2ODgsInR5cGUiOiJhY2Nlc3MifQ.EbyGg6zzIGpdO6bAOFAhhfY_wZeTxH4OUp-IauX64Rg";
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
    // post a new application
    submitApplication: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "applications/",
        method: "POST",
        body: formData,
      }),
    }),
    //edit an existing application
    editApplication: builder.mutation<void, { appId: string; data: FormData }>({
      query: ({ appId, data }) => ({
        url: `applications/${appId}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

// --- Exported Hooks ---

export const {
  useGetApplicationStatusQuery,
  useGetAllActiveCycleQuery,
  useSubmitApplicationMutation,
  useDeleteApplicationMutation,
  useGetApplicationQuery,
  useSubmitApplicationFinalMutation,
  useEditApplicationMutation,
} = applicationApi;
