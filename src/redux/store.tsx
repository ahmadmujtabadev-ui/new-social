// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import formsReducer from "./slices/userSlice";          // adjust path/name to your actual file
import dashboardReducer from "./slices/dashboardSlice";  // IMPORTANT: default import
import adminReducer from "./slices/adminSlice";          // adjust path/name to your actual file

export const store = configureStore({
  reducer: {
    forms: formsReducer,
    dashboard: dashboardReducer,
    admin:adminReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
