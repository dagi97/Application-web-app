// src/lib/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { adminApi } from './api/adminApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware),
});

// Make sure these exports exist
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;