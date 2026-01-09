// src/services/dashbord/asyncThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import ls from "localstorage-slim";
import { HttpService } from "@/services/index";
import { dashboardService } from "./endpoints";

const setTokenIfAny = () => {
  const token = ls.get("access_token", { decrypt: true }) as string;
  if (token) HttpService.setToken(token);
};

// ============================================
// VENDORS
// ============================================

export const fetchVendors = createAsyncThunk(
  "dashboard/fetchVendors",
  async (_: void, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      const res = await dashboardService.vendors();
      const data = res;
      console.log("Fetched vendors data:", data);
      if (Array.isArray(data)) {
        return { items: data, total: data.length, page: 1, pages: 1 };
      }
      return data;
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

// ============================================
// SPONSORS
// ============================================

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

// ============================================
// PARTICIPANTS
// ============================================

export const fetchParticipants = createAsyncThunk(
  "dashboard/fetchParticipants",
  async (_: void, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      const res = await dashboardService.participants();
      console.log("Fetched participants data:", res);
      return res;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch participants");
    }
  }
);

export const updateParticipant = createAsyncThunk(
  "dashboard/updateParticipant",
  async ({ id, updates }: { id: string; updates: Partial<any> }, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      const res = await dashboardService.updateParticipant(id, updates);
      return res.data || res;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to update participant");
    }
  }
);

export const deleteParticipant = createAsyncThunk(
  "dashboard/deleteParticipant",
  async (id: string, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      await dashboardService.deleteParticipant(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to delete participant");
    }
  }
);

// ============================================
// VOLUNTEERS
// ============================================

export const fetchVolunteers = createAsyncThunk(
  "dashboard/fetchVolunteers",
  async (_: void, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      const res = await dashboardService.volunteers();
      console.log("Fetched volunteers data:", res);
      return res;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch volunteers");
    }
  }
);

export const updateVolunteer = createAsyncThunk(
  "dashboard/updateVolunteer",
  async ({ id, updates }: { id: string; updates: Partial<any> }, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      const res = await dashboardService.updateVolunteer(id, updates);
      return res.data || res;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to update volunteer");
    }
  }
);

export const deleteVolunteer = createAsyncThunk(
  "dashboard/deleteVolunteer",
  async (id: string, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      await dashboardService.deleteVolunteer(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to delete volunteer");
    }
  }
);

// ============================================
// BOOTHS & STATS
// ============================================

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
      const res = await dashboardService.stats();
      console.log("Fetched stats data:", res);
      const statsData = res?.data.stats || res;
      return statsData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch stats");
    }
  }
);


export const fetchEvents = createAsyncThunk(
  "dashboard/fetchEvents",
  async (_: void, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      const res = await dashboardService.events();
      console.log("Fetched events data:", res);
      return res;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch events");
    }
  }
);

export const createEvent = createAsyncThunk(
  "dashboard/createEvent",
  async (eventData: any, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      const res = await dashboardService.createEvent(eventData);
      return res.data || res;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to create event");
    }
  }
);

export const updateEvent = createAsyncThunk(
  "dashboard/updateEvent",
  async ({ id, updates }: { id: string; updates: Partial<any> }, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      const res = await dashboardService.updateEvent(id, updates);
      return res.data || res;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to update event");
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "dashboard/deleteEvent",
  async (id: string, { rejectWithValue }) => {
    try {
      setTokenIfAny();
      await dashboardService.deleteEvent(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to delete event");
    }
  }
);