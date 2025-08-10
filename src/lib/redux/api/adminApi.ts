import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQuery"; // Your custom baseQuery with reauth
import type {
  ApiSuccessResponse,
  GetAllUsersData,
  GetUserByIdResponse,
} from "@/types/admin/api";
import type { User } from "@/types/admin/User";

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
}

type Cycle = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
};

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

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Cycle"],

  endpoints: (builder) => ({
    // User endpoints
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "/admin/users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: [{ type: "User", id: "List" }],
    }),

    getPaginatedUsers: builder.query({
      query: ({ page = 1, limit = 5 }) =>
        `admin/users?page=${page}&limit=${limit}`,
      transformResponse: (response: ApiSuccessResponse) => response.data,
      providesTags: (result) =>
        result?.users
          ? [
              ...result.users.map(({ id }: User) => ({ type: "User", id })),
              { type: "User", id: "List" },
            ]
          : [{ type: "User", id: "List" }],
    }),

    getAllUsersForSearch: builder.query<GetAllUsersData, void>({
      query: () => `admin/users?limit=100`,
      transformResponse: (response: ApiSuccessResponse) => response.data,
      providesTags: (result) =>
        result?.users
          ? [
              ...result.users.map(({ id }: User) => ({ type: "User", id })),
              { type: "User", id: "List" },
            ]
          : [{ type: "User", id: "List" }],
      keepUnusedDataFor: 300,
    }),

    getUserById: builder.query({
      query: (user_id) => `/admin/users/${user_id}`,
      transformResponse: (response: GetUserByIdResponse) => response.data,
      providesTags: (result, error, user_id) => [{ type: "User", id: user_id }],
    }),

    updateUserById: builder.mutation({
      query: ({ user_id, updatedUser }) => ({
        url: `/admin/users/${user_id}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: (result, error, { user_id }) => [
        { type: "User", id: user_id },
        { type: "User", id: "List" },
      ],
    }),

    deleteUserById: builder.mutation({
      query: (user_id) => ({
        url: `/admin/users/${user_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, user_id) => [
        { type: "User", id: user_id },
        { type: "User", id: "List" },
      ],
    }),

    // Cycle endpoints
    getCycles: builder.query<CyclesResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: "/cycles",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (result) =>
        result?.success
          ? [
              ...result.data.cycles.map(({ id }) => ({ type: "Cycle", id })),
              { type: "Cycle", id: "List" },
            ]
          : [{ type: "Cycle", id: "List" }],
    }),

    createCycle: builder.mutation({
      query: (body) => ({
        url: "/admin/cycle",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Cycle", id: "List" }],
    }),

    updateCycle: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/cycles/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Cycle", id }],
    }),

    deleteCycle: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/admin/cycles/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response: any) => ({
        success: false,
        message: response.data?.message || "Failed to delete cycle",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Cycle", id },
        { type: "Cycle", id: "List" },
      ],
    }),

    activateCycle: builder.mutation({
      query: (id) => ({
        url: `/admin/cycles/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Cycle", id }],
    }),

    deactivateCycle: builder.mutation({
      query: (id) => ({
        url: `/admin/cycles/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Cycle", id }],
    }),

    // Analytics endpoint
    getAnalytics: builder.query<AnalyticsData, void>({
      query: () => "/admin/analytics",
      transformResponse: (response: { success: boolean; data: AnalyticsData }) => {
        if (!response.success) throw new Error("Failed to fetch analytics");
        return response.data;
      },
    }),
  }),
});

export const {
  // User hooks
  useCreateUserMutation,
  useGetPaginatedUsersQuery,
  useGetAllUsersForSearchQuery,
  useGetUserByIdQuery,
  useUpdateUserByIdMutation,
  useDeleteUserByIdMutation,

  // Cycle hooks
  useGetCyclesQuery,
  useCreateCycleMutation,
  useUpdateCycleMutation,
  useDeleteCycleMutation,
  useActivateCycleMutation,
  useDeactivateCycleMutation,

  // Analytics hook
  useGetAnalyticsQuery,
} = adminApi;

export default adminApi;
