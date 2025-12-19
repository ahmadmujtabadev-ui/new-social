// src/services/admin/asyncThunk.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { authBaseService } from "./endpoints";

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  user?: any;
  message?: string;
}

export const loginAsync = createAsyncThunk<
  AdminLoginResponse,
  AdminLoginPayload,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const res = await authBaseService.login(payload);
    console.log("Login response:", res.data.data);

    // store token for later use
    if (res.data.message === "Login accessToken") {
      localStorage.setItem("adminToken", res.data.data.accessToken);
    }

    return res.data.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Login failed";
    return rejectWithValue(msg);
  }
});
