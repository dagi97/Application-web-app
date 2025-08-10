// lib/redux/api/applicationApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  mapApiToReviewDetail,
  ReviewDetail,
} from "@/lib/redux/types/applicantData";
import { getSession } from "next-auth/react";

// --- Interfaces ---
export interface ApplicantDetails {
  id: string;
  applicant_name: string;
  status: string;
  school: string;
  student_id: string;
  leetcode_handle: string;
  codeforces_handle: string;
  essay_why_a2sv: string;
  essay_about_you: string;
  resume_url: string;
  submitted_at: string;
  updated_at: string;
}

export interface ReviewDetails {
  id: string;
  application_id: string;
  reviewer_id: string;
  activity_check_notes: string;
  resume_score: number;
  essay_why_a2sv_score: number;
  essay_about_you_score: number;
  technical_interview_score: number;
  behavioral_interview_score: number;
  interview_notes: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewData {
  id: string;
  applicant_details: ApplicantDetails;
  review_details: ReviewDetails;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const managerApi = createApi({
  reducerPath: "managerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://a2sv-application-platform-backend-team2.onrender.com/",
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
    // Get reviewer feedback
    getReviewerFeedback: builder.query<APIResponse<ReviewData>, string>({
      query: (applicationId) => `manager/applications/${applicationId}/`,
    }),

    // Get all reviewers
    getAllReviewers: builder.query<any, void>({
      query: () => "manager/applications/available-reviewers",
    }),

    // Get application by ID
    getApplicationById: builder.query<any, string>({
      query: (appId) => `manager/applications/${appId}`,
    }),

    // endpoint for mapped ReviewDetail
    getMappedReviewDetail: builder.query<ReviewDetail | null, string>({
      async queryFn(applicationId, _queryApi, _extraOptions, fetchWithBQ) {
        const res: any = await fetchWithBQ(
          `manager/applications/${applicationId}`
        );
        if (res.error) return { error: res.error };

        if (res.data && res.data.success && res.data.data) {
          return { data: mapApiToReviewDetail(res.data) };
        }
        return { data: null };
      },
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
  useGetReviewerFeedbackQuery,
  useGetMappedReviewDetailQuery,
} = managerApi;
