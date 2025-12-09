

import { createAsyncThunk } from "@reduxjs/toolkit";
import ls from "localstorage-slim";
import { HttpService } from "../index";
import { authBaseService } from "./endpoints";
import { API_BASE_URL } from "@/config/apiconfig"; 

export const submitVendorAsync = createAsyncThunk(
  "forms/vendor/submit",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      // ✅ CORRECT: Uses imported variable and backticks
      const response = await fetch(`${API_BASE_URL}/api/forms/vendor`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        return rejectWithValue(
          errorData || { message: "Failed to submit vendor form" }
        );
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      } else if (error.message) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "An unexpected error occurred" });
      }
    }
  }
);



export const submitSponsorAsync = createAsyncThunk(
  "forms/sponsor/submit",
  async (data: any, { rejectWithValue }) => {
    try {
      const token: string = `${ls.get("access_token", { decrypt: true })}`;
      if (token) {
        HttpService.setToken(token);
      }

      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const response = await authBaseService.submitSponsor(formData);

      if (response.data?.success === false) {
        return rejectWithValue(response.data);
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      } else if (error.message) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "An unexpected error occurred" });
      }
    }
  }
);

export const submitParticipantAsync = createAsyncThunk(
  "forms/participant/submit",
  async (data: any, { rejectWithValue }) => {
    try {
      // ✅ CORRECT: Uses imported variable
      const res = await fetch(`${API_BASE_URL}/api/forms/participant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        return rejectWithValue(json);
      }
      return json;
    } catch (err: any) {
      return rejectWithValue({ message: err.message || "Network error" });
    }
  }
);


export const submitVolunteerAsync = createAsyncThunk(
  "forms/volunteer/submit",
  async (data: any, { rejectWithValue }) => {
    try {
      // 👇 FIXED: Removed the complex/broken fallback logic.
      // Now uses API_BASE_URL directly like the others.
      const res = await fetch(`${API_BASE_URL}/api/forms/volunteer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        return rejectWithValue(
          json || { message: "Failed to submit volunteer form" }
        );
      }


      return json;
    } catch (error: any) {
      console.error("Volunteer submit error:", error);
      if (error?.message) {
        return rejectWithValue({ message: error.message });
      }
      return rejectWithValue({ message: "An unexpected error occurred" });
    }
  }
);


export const fetchSponsorsAsync = createAsyncThunk(
  "forms/sponsor/fetch",
  async (params: any = {}, { rejectWithValue }) => {
    try {
      // Token optional for public sponsors list
      const token: string = `${ls.get("access_token", { decrypt: true })}`;
      if (token) {
        HttpService.setToken(token);
      }

      const response = await authBaseService.getSponsors(params);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Failed to fetch sponsors" });
    }
  }
);