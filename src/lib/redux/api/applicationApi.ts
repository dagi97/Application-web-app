 
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

// --- API Slice ---

export const applicationApi = createApi({
  reducerPath: "applicationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://a2sv-application-platform-backend-team2.onrender.com/",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        // TODO: Replace hardcoded token with dynamic retrieval (e.g., localStorage)
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZTFlODJiNS1mYWRmLTRiOTEtOGUzNi04N2ViNmViMzE0NWQiLCJleHAiOjE3NTQ3Mjg3MTIsInR5cGUiOiJhY2Nlc3MifQ.t_hJlZl4OGYgn5JRsevmRxSc9nUgpz3o4BWreWrSZS0";
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
 

    submitApplication: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "applications/",
        method: "POST",
        body: formData,
      }),
    }),
 

    assignReviewer: builder.mutation<void, { appId: string; reviewer_id: string }>({
      query: ({ appId, reviewer_id }) => ({
        url: `manager/applications/${appId}/assign`,
        method: "PATCH",
        body: { reviewer_id },
      }),
    }),

    getReviewerFeedback: builder.query<APIResponse<ReviewData>, string>({
      query: (applicationId) => `manager/applications/${applicationId}/`,
 
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

// --- Exported Hooks ---

export const {
  useGetApplicationStatusQuery,
  useAssignReviewerMutation,
  useGetReviewerFeedbackQuery,
  useGetAllActiveCycleQuery,
  useSubmitApplicationMutation,
  useDeleteApplicationMutation,
  useGetApplicationQuery,
  useEditApplicationMutation,
  useSubmitApplicationFinalMutation,
 
} = applicationApi;
