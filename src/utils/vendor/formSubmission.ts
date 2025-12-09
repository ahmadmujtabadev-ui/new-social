// utils/formSubmission.ts
import { VendorFormData, AppliedPromo } from '@/constants/vendorTypes';
import { FORMSPARK_URL, HOLD_MS } from '@/lib/vendorformconfig';

interface SubmissionPayload {
  [key: string]: string | number | boolean;
}

export const createSubmissionPayload = (
  formData: VendorFormData,
  basePrice: number,
  discountedPrice: number,
  appliedPromo: AppliedPromo | null,
  getDiscountAmount: () => number
): SubmissionPayload => {
  const submittedAt = new Date();
  const heldUntil = new Date(submittedAt.getTime() + HOLD_MS);

  return {
    personName: formData.personName,
    vendorName: formData.vendorName,
    email: formData.email,
    phone: formData.phone,
    isOakville: formData.isOakville,
    instagram: formData.instagram,
    facebook: formData.facebook,
    category: formData.category,
    foodItems: formData.foodItems,
    needPowerFood: formData.needPowerFood,
    foodWatts: formData.foodWatts,
    clothingType: formData.clothingType,
    jewelryType: formData.jewelryType,
    craftDetails: formData.craftDetails,
    needPowerCraft: formData.needPowerCraft,
    craftWatts: formData.craftWatts,
    boothNumber: formData.boothNumber,
    baseAmount: basePrice,
    finalAmount: discountedPrice,
    promoCode: formData.promoCode || '',
    appliedPromoCode: appliedPromo?.code || '',
    appliedPromoDiscount: appliedPromo ? getDiscountAmount() : 0,
    appliedPromoType: appliedPromo?.discountType || '',
    notes: formData.notes,
    terms: formData.terms ? 'true' : 'false',
    submittedAt: submittedAt.toISOString(),
    heldUntil: heldUntil.toISOString(),
  };
};

export const submitToFormspark = async (
  payload: SubmissionPayload
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(FORMSPARK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Formspark error:', response.status, text);
      return {
        success: false,
        error: 'There was a problem submitting your application. Please try again.',
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Submit error:', err);
    return {
      success: false,
      error: 'Network error while submitting. Please check your connection and try again.',
    };
  }
};

export const getSuccessMessage = (): string => {
  return `Thank you for applying! Your booth is reserved for the next 48 hours. Please complete the next steps we send you to confirm your booking.`;
};