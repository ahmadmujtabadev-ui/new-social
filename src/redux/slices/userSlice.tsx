
import Toast from "@/components/Toast";
import {
  submitParticipantAsync,
  submitSponsorAsync,
  submitVendorAsync,
  submitVolunteerAsync,
  fetchSponsorsAsync,
} from "@/services/auth/asyncThunk";
import { createSlice } from "@reduxjs/toolkit";

export const formsSlice = createSlice({
  name: "forms",
  initialState: {
    isLoading: false,
    vendorSuccess: false,
    sponsorSuccess: false,
    participantSuccess: false,
    volunteerSuccess: false,
    sponsors: [],
    metaData: {},
    errors: {},
  },
  reducers: {
    setLoading: (state: any, action: any) => {
      state.isLoading = action.payload;
    },

    setVendorSuccess: (state: any, action: any) => {
      state.vendorSuccess = action.payload;
    },

    setSponsorSuccess: (state: any, action: any) => {
      state.sponsorSuccess = action.payload;
    },

    setParticipantSuccess: (state: any, action: any) => {
      state.participantSuccess = action.payload;
    },

    setVolunteerSuccess: (state: any, action: any) => {
      state.volunteerSuccess = action.payload;
    },

    setSponsors: (state: any, action: any) => {
      state.sponsors = action.payload;
    },

    setMetaData: (state: any, action: any) => {
      state.metaData = action.payload;
    },

    setErrors: (state: any, action: any) => {
      state.errors = action.payload;
    },

    clearErrors: (state: any) => {
      state.errors = {};
    },

    resetFormState: (state: any) => {
      state.vendorSuccess = false;
      state.sponsorSuccess = false;
      state.participantSuccess = false;
      state.volunteerSuccess = false;
      state.errors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== VENDOR SUBMIT =====
      .addCase(submitVendorAsync.pending, (state: any) => {
        state.isLoading = true;
        state.errors = {};
      })
      .addCase(submitVendorAsync.fulfilled, (state: any) => {
        state.isLoading = false;
        state.vendorSuccess = true;
        Toast.fire({
          icon: "success",
          title:
            "Thank you for applying! We’ve sent the next steps to your email. Your booth is reserved for the next 48 hours. Please complete the steps in the email to confirm your booking.",
        });
      })
      .addCase(submitVendorAsync.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.errors = action.payload || {};

        const errorMessage =
          action.payload?.error ||
          action.payload?.message ||
          "Vendor submission failed";

        Toast.fire({
          icon: "error",
          title: errorMessage,
          text: "",
        });
      })

      // ===== SPONSOR SUBMIT =====
      .addCase(submitSponsorAsync.pending, (state: any) => {
        state.isLoading = true;
        state.errors = {};
      })
      .addCase(submitSponsorAsync.fulfilled, (state: any) => {
        state.isLoading = false;
        state.sponsorSuccess = true;
        Toast.fire({
          icon: "success",
          title: "Sponsorship submitted successfully!",
        });
      })
      .addCase(submitSponsorAsync.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.errors = action.payload || {};
        Toast.fire({
          icon: "error",
          title:
            action.payload?.message || "Sponsorship submission failed",
        });
      })

      // ===== PARTICIPANT SUBMIT =====
      .addCase(submitParticipantAsync.pending, (state: any) => {
        state.isLoading = true;
        state.errors = {};
      })
      .addCase(submitParticipantAsync.fulfilled, (state: any) => {
        state.isLoading = false;
        state.participantSuccess = true;
        Toast.fire({
          icon: "success",
          title: "Participants added successfully!",
        });
      })
      .addCase(submitParticipantAsync.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.errors = action.payload || {};
        Toast.fire({
          icon: "error",
          title:
            action.payload?.message || "Participant submission failed",
        });
      })

      // ===== VOLUNTEER SUBMIT =====
      .addCase(submitVolunteerAsync.pending, (state: any) => {
        state.isLoading = true;
        state.errors = {};
      })
      .addCase(submitVolunteerAsync.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        state.volunteerSuccess = true;

        const msg =
          action.payload?.message ||
          "Thank you for volunteering! We'll be in touch with details before the event.";
        Toast.fire({
          icon: "success",
          title: msg,
        });
      })
      .addCase(submitVolunteerAsync.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.errors = action.payload || {};
        Toast.fire({
          icon: "error",
          title:
            action.payload?.message || "Volunteer submission failed",
        });
      })

      // ===== FETCH SPONSORS (for sponsor wall, etc.) =====
      .addCase(fetchSponsorsAsync.pending, (state: any) => {
        state.isLoading = true;
      })
      .addCase(fetchSponsorsAsync.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        state.sponsors = action.payload?.data || [];
        state.metaData = action.payload?.meta || {};
      })
      .addCase(fetchSponsorsAsync.rejected, (state: any, action: any) => {
        state.isLoading = false;
        Toast.fire({
          icon: "error",
          title:
            action.payload?.message || "Failed to fetch sponsors",
        });
      });
  },
});

export const {
  setLoading,
  setVendorSuccess,
  setSponsorSuccess,
  setParticipantSuccess,
  setVolunteerSuccess,
  setSponsors,
  setMetaData,
  setErrors,
  clearErrors,
  resetFormState,
} = formsSlice.actions;

export const selectForms = (state: any) => state.forms;

export default formsSlice.reducer;
