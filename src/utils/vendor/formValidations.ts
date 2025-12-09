// utils/formValidation.ts
import { VendorFormData, Errors } from '@/constants/vendorTypes';

export const validateForm = (
  formData: VendorFormData,
  bookedBooths: Set<string>
): { isValid: boolean; errors: Errors } => {
  const errors: Errors = {};

  // Basic contact validation
  if (!formData.personName) errors.personName = 'Person name is required';
  if (!formData.vendorName) errors.vendorName = 'Vendor name is required';
  if (!formData.email) errors.email = 'Email is required';
  if (!formData.phone) errors.phone = 'Phone is required';
  if (!formData.isOakville) errors.isOakville = 'Please select Yes or No';
  if (!formData.category) errors.category = 'Please choose a category';

  // Category-specific validation
  if (formData.category === 'Food Vendor') {
    if (!formData.foodItems) errors.foodItems = 'List up to 2 items';
    if (!formData.needPowerFood) errors.needPowerFood = 'Power requirement is required';
    if (formData.needPowerFood === 'yes' && !formData.foodWatts) {
      errors.foodWatts = 'Specify equipment watts';
    }
  }

  if (formData.category === 'Clothing Vendor') {
    if (!formData.clothingType) errors.clothingType = 'Tell us the type of clothes';
  }

  if (formData.category === 'Jewelry Vendor') {
    if (!formData.jewelryType) errors.jewelryType = 'Tell us the jewelry type';
  }

  if (formData.category === 'Craft Booth') {
    if (!formData.craftDetails) errors.craftDetails = 'Give some details about your items';
    if (!formData.needPowerCraft) errors.needPowerCraft = 'Power requirement is required';
    if (formData.needPowerCraft === 'yes' && !formData.craftWatts) {
      errors.craftWatts = 'Specify equipment watts';
    }
  }

  // Booth validation
  if (!formData.boothNumber) {
    errors.boothNumber = 'Please select a booth on the map';
  } else if (bookedBooths.has(formData.boothNumber)) {
    errors.boothNumber = 'This booth is already taken. Please select another.';
  }

  // Terms validation
  if (!formData.terms) errors.terms = 'Please accept the terms to proceed';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};