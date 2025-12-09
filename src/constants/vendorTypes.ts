export type Category =
  | "Food Vendor"
  | "Clothing Vendor"
  | "Jewelry Vendor"
  | "Craft Booth";

export type VendorFormData = {
  personName: string;
  vendorName: string;
  email: string;
  phone: string;
  isOakville: "" | "yes" | "no";
  instagram: string;
  facebook: string;
  businessLogo: File | null;
  category: "" | Category;
  foodItems: string;
  needPowerFood: "" | "yes" | "no";
  foodWatts: string;
  clothingType: string;
  jewelryType: string;
  craftDetails: string;
  needPowerCraft: "" | "yes" | "no";
  craftWatts: string;
  boothNumber: string;
  promoCode: string;
  notes: string;
  terms: boolean;
  amountToPay: number;
  foodPhotos: File[];
  clothingPhotos: File[];
  jewelryPhotos: File[];
  craftPhotos: File[];
};

export type Errors = Record<string, string>;

export type PromoType = {
  discount: number;
  discountType: "percent" | "flat";
  description: string;
  startDate: string;
  endDate: string;
};

export type AppliedPromo = {
  code: string;
  discount: number;
  discountType: "percent" | "flat";
  description: string;
};
