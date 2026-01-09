// src/redux/slices/dashboardSlice.ts
import {
  deleteSponsor,
  deleteVendor,
  deleteParticipant,
  deleteVolunteer,
  fetchBooths,
  fetchSponsors,
  fetchStats,
  fetchVendors,
  fetchParticipants,
  fetchVolunteers,
  updateSponsor,
  updateVendor,
  updateParticipant,
  updateVolunteer,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchEvents
} from "@/services/dashbord/asyncThunk";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// ============================================
// TYPES
// ============================================

interface VendorStats {
  total: number;
  approved: number;
  submitted: number;
  held: number;
  confirmed: number;
  expired: number;
  rejected: number;
  byCategory: {
    [key: string]: number;
  };
}

interface SponsorStats {
  total: number;
  byTier: {
    [key: string]: number;
  };
}

interface BoothStats {
  total: number;
  available: number;
  booked: number;
  held: number;
  confirmed: number;
}

interface ParticipantStats {
  total: number;
  byCategory: {
    [key: string]: number;
  };
  byAgeGroup: {
    [key: string]: number;
  };
}

interface VolunteerStats {
  total: number;
  bySlot: {
    [key: string]: number;
  };
}

interface Stats {
  vendors: VendorStats;
  sponsors: SponsorStats;
  booths: BoothStats;
  participants: ParticipantStats;
  volunteers: VolunteerStats;
}

// ============================================
// STATE
// ============================================

export interface DashboardState {
  vendors: any[];
  sponsors: any[];
  booths: any[];
  events: any[];
  participants: any[];
  volunteers: any[];
  stats: Stats | null;
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
  participants: [],
  volunteers: [],
  events: [],
  stats: null,
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

    // ===== Fetch Participants =====
    builder
      .addCase(fetchParticipants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParticipants.fulfilled, (state, action) => {
        state.loading = false;
        state.participants = action.payload;
      })
      .addCase(fetchParticipants.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch participants";
      });

    // ===== Fetch Volunteers =====
    builder
      .addCase(fetchVolunteers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVolunteers.fulfilled, (state, action) => {
        state.loading = false;
        state.volunteers = action.payload;
      })
      .addCase(fetchVolunteers.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch volunteers";
      });

    // ===== Fetch Stats =====
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
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

    // ===== Update Participant =====
    builder
      .addCase(updateParticipant.fulfilled, (state, action) => {
        const index = state.participants.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.participants[index] = action.payload;
      })
      .addCase(updateParticipant.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to update participant";
      });

    // ===== Delete Participant =====
    builder
      .addCase(deleteParticipant.fulfilled, (state, action) => {
        state.participants = state.participants.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteParticipant.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to delete participant";
      });

    // ===== Update Volunteer =====
    builder
      .addCase(updateVolunteer.fulfilled, (state, action) => {
        const index = state.volunteers.findIndex(
          (v) => v._id === action.payload._id
        );
        if (index !== -1) state.volunteers[index] = action.payload;
      })
      .addCase(updateVolunteer.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to update volunteer";
      });

    // ===== Delete Volunteer =====
    builder
      .addCase(deleteVolunteer.fulfilled, (state, action) => {
        state.volunteers = state.volunteers.filter((v) => v._id !== action.payload);
      })
      .addCase(deleteVolunteer.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to delete volunteer";
      });
    // ===== Fetch Events =====
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch events";
      });

    // ===== Create Event =====
    builder
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create event";
      });

    // ===== Update Event =====
    builder
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) state.events[index] = action.payload;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to update event";
      });

    // ===== Delete Event =====
    builder
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => e._id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to delete event";
      });
  },
});

export const { setFilters, clearFilters, setCurrentPage, clearError } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;