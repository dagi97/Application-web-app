import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQuery";
export interface AnalyticsData {
  total_applicants: number;
  acceptance_rate: number;
  average_review_time_days: number;
  application_funnel: {
    submitted: number;
    accepted: number;
    pending_review: number;
    in_progress: number;
  };
  school_distribution: Record<string, number>;
  country_distribution: Record<string, number>;
};
export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Cycle'], // Add tag types for cache invalidation
  endpoints: (builder) => ({
    // Cycle CRUD Operations
    getCycles: builder.query<CyclesResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: '/cycles',
        method: 'GET',
        params: { page, limit }
      }),
      providesTags: (result) => 
        result?.success 
          ? [
              ...result.data.cycles.map(({ id }) => ({ type: 'Cycle' as const, id })),
              { type: 'Cycle', id: 'LIST' }
            ]
          : [{ type: 'Cycle', id: 'LIST' }]
    }),
    createCycle: builder.mutation({
      query: (body) => ({
        url: "/admin/cycle",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: 'Cycle', id: 'LIST' }]
    }),
    updateCycle: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/cycles/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Cycle', id }]
    }),
    deleteCycle: builder.mutation<{ success: boolean; message: string }, string>({
  query: (id) => ({
    url: `/admin/cycles/${id}`,
    method: "DELETE",
  }),
  transformErrorResponse: (response: any) => {
    // Extract meaningful error message from the response
    return {
      success: false,
      message: response.data?.message || 'Failed to delete cycle'
    };
  },
  invalidatesTags: (result, error, id) => [
    { type: 'Cycle', id },
    { type: 'Cycle', id: 'LIST' } // Also invalidate the list
  ]
}),
    activateCycle: builder.mutation({
      query: (id) => ({
        url: `/admin/cycles/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Cycle', id }]
    }),
    getAnalytics: builder.query<AnalyticsData, void>({
  query: () => '/admin/analytics',
  transformResponse: (response: { success: boolean; data: AnalyticsData }) => {
    if (!response.success) throw new Error('Failed to fetch analytics');
    return response.data;
  },
}),
    deactivateCycle: builder.mutation({
      query: (id) => ({
        url: `/admin/cycles/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Cycle', id }]
    })
  }),
});

// Types for the API responses
type CyclesResponse = {
  success: boolean;
  data: {
    cycles: Cycle[];
    total_count: number;
    page: number;
    limit: number;
  };
  message: string;
};

type Cycle = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
};

export const {
  useGetCyclesQuery,
  useCreateCycleMutation,
  useUpdateCycleMutation,
  useDeleteCycleMutation,
  useActivateCycleMutation,
  useDeactivateCycleMutation,
  useGetAnalyticsQuery
} = adminApi;