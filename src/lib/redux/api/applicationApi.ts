import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const applicationApi = createApi({
  reducerPath: "applicationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://a2sv-application-platform-backend-team2.onrender.com/",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NGJmMWUyMy0xM2Q2LTQ1MmQtYTRiNi1jNDVmMmViMTU1YWQiLCJleHAiOjE3NTQ3Mjg0ODQsInR5cGUiOiJhY2Nlc3MifQ.PXmvTRsT5lnboX_HFKcv0KG-k4gtWLRVEojxKaQiZvM";
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
    // delete an application
    deleteApplication: builder.mutation<void, string>({
      query: (appId) => ({
        url: `applications/${appId}`,
        method: "DELETE",
      }),
    }),

    //  get a specific application
    getApplication: builder.query<any, string>({
      query: (appId) => `applications/${appId}`,
    }),

    //  edit/update an application
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
