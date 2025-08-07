import { configureStore } from '@reduxjs/toolkit';
import { profileApi } from '../api/ProfileApiSlice';

export const store = configureStore({
  reducer: {
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(profileApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;