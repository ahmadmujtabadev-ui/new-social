import { Category } from "@/constants/types";
import { PromoType, VendorFormData } from "@/constants/vendorTypes";


export const STORAGE_VERSION = "v1";
export const DRAFT_KEY = `vendorFormDraft:${STORAGE_VERSION}`;
export const BOOTH_KEY = "selectedBooth";
export const SCROLL_KEY = "vendorFormScrollPosition";

export const CATEGORY_OPTIONS: Category[] = [
  "Food Vendor",
  "Clothing Vendor",
  "Jewelry Vendor",
  "Craft Booth",
];

export const DEFAULT_PRICING: Record<Category, number> = {
  "Food Vendor": 350,
  "Clothing Vendor": 350,
  "Jewelry Vendor": 350,
  "Craft Booth": 350,
};

export const EMPTY: VendorFormData = {
  personName: "",
  vendorName: "",
  email: "",
  phone: "",
  isOakville: "",
  instagram: "",
  facebook: "",
  businessLogo: null,
  category: "",
  foodItems: "",
  needPowerFood: "",
  foodWatts: "",
  clothingType: "",
  jewelryType: "",
  craftDetails: "",
  needPowerCraft: "",
  craftWatts: "",
  boothNumber: "",
  promoCode: "",
  notes: "",
  terms: false,
  amountToPay: 0,
  foodPhotos: [],
  clothingPhotos: [],
  jewelryPhotos: [],
  craftPhotos: [],
};

export const PROMO_CODES: Record<string, PromoType> = {
  EARLY25: {
    discount: 25,
    discountType: "percent",
    description: "25% Early Bird Discount",
    startDate: "2025-11-15",
    endDate: "2025-12-12",
  },
  SAVE50: {
    discount: 50,
    discountType: "flat",
    description: "$50 Off Special",
    startDate: "2025-12-19",
    endDate: "2026-01-02",
  },
  VIP20: {
    discount: 20,
    discountType: "percent",
    description: "20% VIP Discount",
    startDate: "2026-01-15",
    endDate: "2026-01-31",
  },
};

export const HOLD_MS = 15000;

export const FORMSPARK_FORM_ID = "xQkwW6DQP";
export const FORMSPARK_URL = `https://submit-form.com/${FORMSPARK_FORM_ID}`;
export const SHEETDB_API_URL = "https://sheetdb.io/api/v1/3yt3d1sid36uv";
