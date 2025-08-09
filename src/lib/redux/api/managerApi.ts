// lib/redux/api/applicationApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const managerApi = createApi({
  reducerPath: "managerApi",
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
    // Get all reviewers
    getAllReviewers: builder.query<any, void>({
      query: () => "manager/applications/available-reviewers",
    }),
    // Get application by ID
    getApplicationById: builder.query<any, string>({
      query: (appId) => `manager/applications/${appId}`,
    }),
    // assign reviwer to an application
    assignReviewer: builder.mutation<
      void,
      { appId: string; reviewer_id: string }
    >({
      query: ({ appId, reviewer_id }) => ({
        url: `manager/applications/${appId}/assign`,
        method: "PATCH",
        body: { reviewer_id },
      }),
    }),

    // decide on an application
    decideApplication: builder.mutation<
      unknown,
      {
        appId: string;
        status: "accepted" | "rejected";
        decision_notes: string;
      }
    >({
      query: ({ appId, status, decision_notes }) => ({
        url: `manager/applications/${appId}/decide`,
        method: "PATCH",
        body: { status, decision_notes },
      }),
    }),
  }),
});

export const {
  useAssignReviewerMutation,
  useDecideApplicationMutation,
  useGetAllReviewersQuery,
  useGetApplicationByIdQuery,
} = managerApi;
