import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

// Initialize with your hardcoded tokens for development
const initialState: AuthState = {
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZTFlODJiNS1mYWRmLTRiOTEtOGUzNi04N2ViNmViMzE0NWQiLCJleHAiOjE3NTQ3Mzk1ODYsInR5cGUiOiJhY2Nlc3MifQ.p_vUEIv7u-cH6Q1ISUnUUBSh-PIErKFbPu4LduQdku0",
  refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZTFlODJiNS1mYWRmLTRiOTEtOGUzNi04N2ViNmViMzE0NWQiLCJleHAiOjE3NTUxNzQ5OTIsInR5cGUiOiJyZWZyZXNoIn0.Key91sRbRUHi_dlAdsxEiWmPbCuGlIKJ6Lei0rJsVWQ",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
    }
  },
});

export const { setCredentials, updateAccessToken, clearCredentials } = authSlice.actions;
export default authSlice.reducer;