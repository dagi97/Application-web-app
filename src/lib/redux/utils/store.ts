import { configureStore } from '@reduxjs/toolkit';
import { profileApi } from '../api/ProfileApiSlice';
import { reviewsApi } from '../api/reviewsApiSlice';
import { authApi } from '../api/authApi';
import { applicationApi } from '../api/applicationApi';
import { managerApi } from '../api/managerApi'

export const store = configureStore({
  reducer: {
    [profileApi.reducerPath]: profileApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [applicationApi.reducerPath]: applicationApi.reducer, 
    [managerApi.reducerPath]: managerApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(profileApi.middleware)
      .concat(reviewsApi.middleware)
      .concat(authApi.middleware)
      .concat(applicationApi.middleware)
      .concat(managerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
