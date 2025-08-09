import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "@/types/admin/User";
import { ApiSuccessResponse, GetAllUsersData, GetUserByIdResponse } from "@/types/admin/api";

const tempToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZTFlODJiNS1mYWRmLTRiOTEtOGUzNi04N2ViNmViMzE0NWQiLCJleHAiOjE3NTQ3NTc2ODUsInR5cGUiOiJhY2Nlc3MifQ.TPSTdXYEqvGXjx8PiQ6HEbuXnISxY24wfJPNdfl46LQ"; //Replace this with a code that gets the actual token when you get acess to the authSlice

const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://a2sv-application-platform-backend-team2.onrender.com",

    prepareHeaders: (headers, { getState }) => {
      const token = tempToken;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["User", "Cycle"],

  endpoints: (builder) => ({
    //To Create a user
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "/admin/users",
        method: "POST",
        body: newUser,
      }),

      invalidatesTags: [{ type: "User", id: "List" }],
    }),

    //Get all users
    getPaginatedUsers: builder.query({
  query: ({ page = 1, limit = 5 }) =>
    `admin/users?page=${page}&limit=${limit}`, // ✅ no slash before ?
  transformResponse: (response: ApiSuccessResponse) => response.data,
  providesTags: (result) =>
    result?.users
      ? [
          ...result.users.map(({ id }: User) => ({
            type: "User" as const,
            id,
          })),
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
          ...result.users.map(({ id }: User) => ({
            type: "User" as const,
            id,
          })),
          { type: "User" as const, id: "LIST" },
        ]
      : [{ type: "User" as const, id: "LIST" }],
  keepUnusedDataFor: 300,
}),


    //Get user by Id
    getUserById: builder.query({
      query: (user_id) => `/admin/users/${user_id}`,
      transformResponse: (response: GetUserByIdResponse) => response.data,
      providesTags: (result, error, user_id) => [{ type: "User", id: user_id }],
    }),

    //Upadte user
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

    //Delete user
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
  }),
});

export const {
  useCreateUserMutation,
  useGetPaginatedUsersQuery,
  useGetAllUsersForSearchQuery,
  useGetUserByIdQuery,
  useUpdateUserByIdMutation,
  useDeleteUserByIdMutation,
} = adminApi;

export default adminApi;
