import { configureStore } from '@reduxjs/toolkit';
import { reviewsApi } from '../api/reviewsApiSlice';
import { profileApi } from '../api/ProfileApiSlice';

export const store = configureStore({
  reducer: {
    [reviewsApi.reducerPath]: reviewsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(reviewsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
