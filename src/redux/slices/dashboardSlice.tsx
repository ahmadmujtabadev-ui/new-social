// src/redux/slices/dashboardSlice.ts
import { deleteSponsor, deleteVendor, fetchBooths, fetchSponsors, fetchStats, fetchVendors, updateSponsor, updateVendor } from "@/services/dashbord/asyncThunk";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// ============================================
// STATE
// ============================================

export interface DashboardState {
  vendors: any[];
  sponsors: any[];
  booths: any[];
  stats: any;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  filters: {
    search: string;
    status: string;
    category: string;
  };
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: DashboardState = {
  vendors: [],
  sponsors: [],
  booths: [],
  stats: { total: 0, submitted: 0, approved: 0 },
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  filters: {
    search: "",
    status: "",
    category: "",
  },
};

// ============================================
// SLICE
// ============================================

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<DashboardState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ===== Fetch Vendors =====
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload.items;
        state.totalPages = action.payload.pages;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch vendors";
      });

    // ===== Fetch Sponsors =====
    builder
      .addCase(fetchSponsors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSponsors.fulfilled, (state, action) => {
        state.loading = false;
        state.sponsors = action.payload;
      })
      .addCase(fetchSponsors.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch sponsors";
      });

    // ===== Fetch Booths =====
    builder
      .addCase(fetchBooths.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooths.fulfilled, (state, action) => {
        state.loading = false;
        state.booths = action.payload;
      })
      .addCase(fetchBooths.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch booths";
      });

    // ===== Fetch Stats =====
    builder
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to fetch stats";
      });

    // ===== Update Vendor =====
    builder
      .addCase(updateVendor.fulfilled, (state, action) => {
        const index = state.vendors.findIndex(
          (v) => v._id === action.payload._id
        );
        if (index !== -1) state.vendors[index] = action.payload;
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to update vendor";
      });

    // ===== Delete Vendor =====
    builder
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.vendors = state.vendors.filter((v) => v._id !== action.payload);
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to delete vendor";
      });

    // ===== Update Sponsor =====
    builder
      .addCase(updateSponsor.fulfilled, (state, action) => {
        const index = state.sponsors.findIndex(
          (s) => s._id === action.payload._id
        );
        if (index !== -1) state.sponsors[index] = action.payload;
      })
      .addCase(updateSponsor.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to update sponsor";
      });

    // ===== Delete Sponsor =====
    builder
      .addCase(deleteSponsor.fulfilled, (state, action) => {
        state.sponsors = state.sponsors.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteSponsor.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to delete sponsor";
      });
  },
});

export const { setFilters, clearFilters, setCurrentPage, clearError } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;