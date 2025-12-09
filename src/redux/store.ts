import { configureStore } from "@reduxjs/toolkit";
import { formsSlice } from "./slices/userSlice"; // if you export the slice

export const store = configureStore({
  reducer: {
    forms: formsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "forms/vendor/submit/pending",
          "forms/vendor/submit/fulfilled",
          "forms/vendor/submit/rejected",
          "forms/sponsor/submit/pending",
          "forms/sponsor/submit/fulfilled",
          "forms/sponsor/submit/rejected",
        ],
        ignoredPaths: ["forms.errors"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
