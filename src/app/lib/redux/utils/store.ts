import { configureStore } from '@reduxjs/toolkit';
import { profileApi } from '../api/ProfileApiSlice';
import { reviewsApi } from '../api/reviewsApiSlice';

export const store = configureStore({
  reducer: {
    [profileApi.reducerPath]: profileApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(profileApi.middleware)
      .concat(reviewsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
