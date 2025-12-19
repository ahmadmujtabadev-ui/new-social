// src/redux/thunks/dashboardThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import ls from "localstorage-slim";
import { HttpService } from "@/services/index";
import { dashboardService } from "./endpoints";

// or keep types in this file if you want

const setTokenIfAny = () => {
  const token = ls.get("access_token", { decrypt: true }) as string;
  if (token) HttpService.setToken(token);
};

export const fetchVendors = createAsyncThunk(
  "dashboard/fetchVendors",
  async (_: void, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      const res = await dashboardService.vendors();

      const data = res;
      console.log("Fetched vendors data:", data);
      // support both array and paginated response
      if (Array.isArray(data)) {
        return { items: data, total: data.length, page: 1, pages: 1 };
      }

      return data; // {items,total,page,pages}
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed");
    }
  }
);

export const fetchSponsors = createAsyncThunk(
  "dashboard/fetchSponsors",
  async (_: void, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      const res = await dashboardService.sponsors();
      console.log("Fetched sponsors data:", res);
      return res;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed");
    }
  }
);

export const fetchBooths = createAsyncThunk(
  "dashboard/fetchBooths",
  async (_: void, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      const res = await dashboardService.booths();
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed");
    }
  }
);

export const fetchStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_: void, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      const res = await dashboardService.stats();
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed");
    }
  }
);

export const updateVendor = createAsyncThunk(
  "dashboard/updateVendor",
  async ({ id, updates }: { id: string; updates: Partial<any> }, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      const res = await dashboardService.updateVendor(id, updates);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed");
    }
  }
);

export const deleteVendor = createAsyncThunk(
  "dashboard/deleteVendor",
  async (id: string, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      await dashboardService.deleteVendor(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed");
    }
  }
);

export const updateSponsor = createAsyncThunk(
  "dashboard/updateSponsor",
  async ({ id, updates }: { id: string; updates: Partial<any> }, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      const res = await dashboardService.updateSponsor(id, updates);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed");
    }
  }
);

export const deleteSponsor = createAsyncThunk(
  "dashboard/deleteSponsor",
  async (id: string, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      await dashboardService.deleteSponsor(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed");
    }
  }
);
