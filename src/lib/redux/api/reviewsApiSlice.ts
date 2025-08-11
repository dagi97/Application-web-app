import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ReviewsResponse } from "../types/reviewData";

export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
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
