import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExp?: number; // Optional: store decoded expiration
}

// Dev-only initial tokens (move to .env for production)
const devAccessToken = process.env.REACT_APP_DEV_ACCESS_TOKEN || null;
const devRefreshToken = process.env.REACT_APP_DEV_REFRESH_TOKEN || null;

const initialState: AuthState = {
  accessToken: devAccessToken,
  refreshToken: devRefreshToken,
  accessTokenExp: devAccessToken ? jwtDecode<{ exp: number }>(devAccessToken).exp : undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.accessTokenExp = action.payload.accessToken
        ? jwtDecode<{ exp: number }>(action.payload.accessToken).exp
        : undefined;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.accessTokenExp = jwtDecode<{ exp: number }>(action.payload).exp;
    },
    updateRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.accessTokenExp = undefined;
    },
  },
});

export const {
  setCredentials,
  updateAccessToken,
  updateRefreshToken,
  clearCredentials,
} = authSlice.actions;

export default authSlice.reducer;
