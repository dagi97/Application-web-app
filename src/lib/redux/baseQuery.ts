import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { RootState } from "./store";
import { updateAccessToken } from "./slices/authSlice";

const baseUrl = "https://a2sv-application-platform-backend-team2.onrender.com";

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (!refreshToken) return result;

    const refreshResult: any = await baseQuery(
      {
        url: "/auth/token/refresh",
        method: "POST",
        headers: { Authorization: `Bearer ${refreshToken}` },
      },
      api,
      extraOptions
    );

    if (refreshResult?.data?.data?.access) {
      api.dispatch(updateAccessToken(refreshResult.data.data.access));

      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
