// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginAsync } from "@/services/admin/asyncThunk";

interface AuthState {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  isAuthenticated: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("adminToken");
      }
    },
    setAuthFromStorage: (state, action: PayloadAction<{ token: string }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token; // Changed from accessToken to token
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;
        state.user = action.payload.user || null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      });
  },
});

export const { clearAuthError, logout, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;