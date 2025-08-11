import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ReviewsResponse } from "../types/reviewData";
import { getSession } from "next-auth/react";

export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://a2sv-application-platform-backend-team2.onrender.com/",
    prepareHeaders: async (headers) => {
     
      const session = await getSession();

      if (session?.access) {
        headers.set("Authorization", `Bearer ${session.access}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAssignedReviews: builder.query<
      ReviewsResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/reviews/assigned/?page=${page}&limit=${limit}`,
    }),
  }),
});

export const { useGetAssignedReviewsQuery } = reviewsApi;