import { configureStore } from '@reduxjs/toolkit';
import { profileApi } from '../api/ProfileApiSlice';
import { reviewsApi } from '../api/reviewsApiSlice';
import { authApi } from '../api/authApi';

export const store = configureStore({
  reducer: {
    [profileApi.reducerPath]: profileApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(profileApi.middleware)
      .concat(reviewsApi.middleware)
      .concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
