import { configureStore } from "@reduxjs/toolkit";
import adminApi from "./api/adminApi";
import filterSliceReducer from './slices/admin/filterSlice';


export const store = configureStore({
    reducer : {
        [adminApi.reducerPath]: adminApi.reducer,
        filter: filterSliceReducer
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(adminApi.middleware),


})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
