/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import ls from "localstorage-slim";
import { HttpService } from "../index";
import { authBaseService } from "./endpoints";

interface VendorFormData {
  personName: string;
  vendorName: string;
  email: string;
  phone: string;
  isOakville: string;
  selectedEvent: string;
  businessLogo: File | null;
  instagram: string;
  facebook: string;
  category: string;
  foodItems: string;
  needPowerFood: string;
  foodWatts: string;
  foodPhotos: File[];
  clothingType: string;
  clothingPhotos: File[];
  jewelryType: string;
  jewelryPhotos: File[];
  craftDetails: string;
  needPowerCraft: string;
  craftWatts: string;
  craftPhotos: File[];
  boothNumber: string;
  notes: string;
  terms: boolean;
}

export const submitVendorAsync = createAsyncThunk(
  "forms/vendor/submit",
  async (data: VendorFormData, { rejectWithValue }) => {
    try {
      // Set authentication token
      const token = ls.get("access_token", { decrypt: true }) as string;
      if (token) {
        HttpService.setToken(token);
      }

      // Create FormData and append all fields
      const formData = new FormData();

      // Append text fields
      const textFields: (keyof VendorFormData)[] = [
        'personName',
        'vendorName',
        'email',
        'phone',
        'isOakville',
        'selectedEvent',
        'instagram',
        'facebook',
        'category',
        'foodItems',
        'needPowerFood',
        'foodWatts',
        'clothingType',
        'jewelryType',
        'craftDetails',
        'needPowerCraft',
        'craftWatts',
        'boothNumber',
        'notes',
      ];

      textFields.forEach((field) => {
        const value = data[field];
        if (value !== null && value !== undefined && value !== '') {
          formData.append(field, String(value));
        }
      });

      // Append terms as string
      formData.append('terms', String(data.terms));

      // Append single file (businessLogo)
      if (data.businessLogo instanceof File) {
        formData.append('businessLogo', data.businessLogo);
      }

      // Append multiple files with proper array notation
      const fileArrayFields: { key: keyof VendorFormData; name: string }[] = [
        { key: 'foodPhotos', name: 'foodPhotos' },
        { key: 'clothingPhotos', name: 'clothingPhotos' },
        { key: 'jewelryPhotos', name: 'jewelryPhotos' },
        { key: 'craftPhotos', name: 'craftPhotos' },
      ];

      fileArrayFields.forEach(({ key, name }) => {
        const files = data[key];
        if (Array.isArray(files)) {
          files.forEach((file) => {
            if (file instanceof File) {
              // Append with array notation for backend processing
              formData.append(`${name}[]`, file);
            }
          });
        }
      });

      // Log FormData contents for debugging
      console.log('FormData contents:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, value.name, value.size, 'bytes');
        } else {
          console.log(`${key}:`, value);
        }
      }

      // Submit to backend
      const response = await authBaseService.submitVendor(formData);

      // Handle response
      if (response.data?.success === false) {
        return rejectWithValue(response.data);
      }

      return response.data;
    } catch (error: any) {
      console.error('Submit vendor error:', error);
      
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
      const token: string = `${ls.get("access_token", { decrypt: true })}`;
      if (token) {
        HttpService.setToken(token);
      }

      const response = await authBaseService.submitParticipant(data);
      
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

export const submitVolunteerAsync = createAsyncThunk(
  "forms/volunteer/submit",
  async (data: any, { rejectWithValue }) => {
    try {
      const token: string = `${ls.get("access_token", { decrypt: true })}`;
      if (token) {
        HttpService.setToken(token);
      }

      const response = await authBaseService.submitVolunteer(data);
      
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