import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const detailsApi = createApi({
  reducerPath: "detailsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://a2sv-application-platform-backend-team2.onrender.com/",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("reviewer_token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getApplicationDetail: builder.query({
      query: (application_id) => `/reviews/${application_id}/`,
    }),
  }),
});

export const { useGetApplicationDetailQuery } = detailsApi;
