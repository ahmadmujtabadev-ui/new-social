// hooks/useFormState.ts
import { useState } from 'react';
import { VendorFormData, Errors } from '@/constants/vendorTypes';
import { Category, EMPTY } from '@/constants/types';
import { BOOTH_KEY, DEFAULT_PRICING, DRAFT_KEY } from '@/lib/vendorformconfig';

export const useFormState = () => {
  const [formData, setFormData] = useState<VendorFormData>(() => {
    if (typeof window === 'undefined') return EMPTY;
    
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      console.log("raw 13", raw)

      const draft = raw ? (JSON.parse(raw) as Partial<VendorFormData>) : {};

      console.log("draft", draft)
      
      // Ensure proper type for isOakville
      const isOakvilleValue = draft.isOakville;
      const validIsOakville = 
        isOakvilleValue === 'yes' || isOakvilleValue === 'no' 
          ? isOakvilleValue 
          : '';
      
      return {
        ...EMPTY,
        ...draft,
        isOakville: validIsOakville,
        businessLogo: null,
        foodPhotos: [],
        clothingPhotos: [],
        jewelryPhotos: [],
        craftPhotos: [],
      } as VendorFormData;
    } catch {
      return EMPTY;
    }
  });

  const [errors, setErrors] = useState<Errors>({});

  // // Auto-save draft to localStorage
  // useEffect(() => {
  //   try {
  //     const serializable: Omit<
  //       VendorFormData,
  //       | 'businessLogo'
  //       | 'foodPhotos'
  //       | 'clothingPhotos'
  //       | 'jewelryPhotos'
  //       | 'craftPhotos'
  //     > & Record<string, unknown> = { ...formData };
      
  //     delete serializable.businessLogo;
  //     delete serializable.foodPhotos;
  //     delete serializable.clothingPhotos;
  //     delete serializable.jewelryPhotos;
  //     delete serializable.craftPhotos;
      
  //     localStorage.setItem(DRAFT_KEY, JSON.stringify(serializable));
  //   } catch {
  //     return;
  //   }
  // }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => {
      // Properly type the value based on the field name
      let fieldValue: any = type === 'checkbox' ? checked : value;
      
      // Ensure isOakville has the correct type
      if (name === 'isOakville') {
        fieldValue = (value === 'yes' || value === 'no') ? value : '';
      }
      
      const next: VendorFormData = {
        ...prev,
        [name]: fieldValue,
      };

      if (name === 'category') {
        try {
          localStorage.removeItem(BOOTH_KEY);
        } catch {
          return next;
        }
        next.boothNumber = '';
        next.amountToPay = value ? DEFAULT_PRICING[value as Category] : 0;
      }

      return next;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFile = (
    name: keyof VendorFormData,
    files: FileList | null,
    multiple = false
  ) => {
    if (!files || files.length === 0) {
      setFormData((f) => ({
        ...f,
        [name]: (multiple ? [] : null) as any,
      }));
      return;
    }

    setFormData((f) => ({
      ...f,
      [name]: multiple ? Array.from(files) : (files[0] as any),
    }));

    if (errors[name as string]) {
      setErrors((prev) => ({ ...prev, [name as string]: '' }));
    }
  };

  const resetForm = (afterSubmit = false) => {
    setFormData(EMPTY);
    setErrors({});
    
    try {
      localStorage.removeItem(DRAFT_KEY);
      if (afterSubmit) localStorage.removeItem(BOOTH_KEY);
    } catch {
      return;
    }
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    handleFile,
    resetForm,
  };
};