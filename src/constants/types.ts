export type Errors = Record<string, string>;
export type Category =
  | "Food Vendor"
  | "Clothing Vendor"
  | "Jewelry Vendor"
  | "Craft Booth"


export const CATEGORY_OPTIONS: Category[] = [
  "Food Vendor",
  "Clothing Vendor",
  "Jewelry Vendor",
  "Craft Booth",

] as const;

export const DEFAULT_PRICING: Record<Category, number> = {
  "Food Vendor": 250,
  "Clothing Vendor": 200,
  "Jewelry Vendor": 200,
  "Craft Booth": 200,
};

export type FormData = {
  // Vendor fields
  personName: string;
  vendorName: string;
  email: string;
  phone: string;
  isOakville: string;
  businessLogo: File | null;
  instagram: string;
  facebook: string;
  category: Category | "";
  foodItems: string;
  foodPhotos: File[];
  needPowerFood: string;
  foodWatts: string;
  clothingType: string;
  clothingPhotos: File[];
  jewelryType: string;
  jewelryPhotos: File[];
  craftDetails: string;
  craftPhotos: File[];
  needPowerCraft: string;
  craftWatts: string;
  amountToPay: number;
  boothNumber: string;
  promoCode: string;
  notes: string;
  terms: boolean;
  
  // Volunteer fields
  age: string;
  schoolName: string;
  timeSlots: string[];
};

export const EMPTY: any = {
  // Vendor fields
  personName: "",
  vendorName: "",
  email: "",
  phone: "",
  isOakville: "",
  businessLogo: null,
  instagram: "",
  facebook: "",
  category: "",
  foodItems: "",
  foodPhotos: [],
  needPowerFood: "",
  foodWatts: "",
  clothingType: "",
  clothingPhotos: [],
  jewelryType: "",
  jewelryPhotos: [],
  craftDetails: "",
  craftPhotos: [],
  needPowerCraft: "",
  craftWatts: "",
  amountToPay: 0,
  boothNumber: "",
  promoCode: "",
  notes: "",
  terms: false,
  
  // Volunteer fields
  age: "",
  schoolName: "",
  timeSlots: [],
};
