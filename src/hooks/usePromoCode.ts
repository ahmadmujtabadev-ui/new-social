// hooks/usePromoCode.ts
import { useState, useMemo } from 'react';
import { AppliedPromo, PromoType } from '@/constants/vendorTypes';
import { PROMO_CODES } from '@/lib/vendorformconfig';

export const usePromoCode = (basePrice: number) => {
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  const [promoError, setPromoError] = useState('');

  const validatePromo = (
    code: string
  ): { valid: boolean; message?: string; promo?: PromoType } => {
    const promo = PROMO_CODES[code.toUpperCase()];
    
    if (!promo) {
      return { valid: false, message: 'Invalid promo code.' };
    }

    const now = new Date();
    const start = new Date(promo.startDate);
    const end = new Date(promo.endDate);

    if (now < start) {
      return {
        valid: false,
        message: `This promo will start on ${promo.startDate}.`,
      };
    }

    if (now > end) {
      return {
        valid: false,
        message: `This promo expired on ${promo.endDate}.`,
      };
    }

    return { valid: true, promo };
  };

  const applyPromo = (code: string) => {
    if (!code.trim()) return;

    const result = validatePromo(code);
    
    if (!result.valid || !result.promo) {
      setPromoError(result.message || 'Invalid promo code.');
      setAppliedPromo(null);
      return;
    }

    setPromoError('');
    setAppliedPromo({
      code: code.toUpperCase(),
      discount: result.promo.discount,
      discountType: result.promo.discountType,
      description: result.promo.description,
    });
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  const discountedPrice = useMemo(() => {
    if (!appliedPromo) return basePrice;
    
    if (appliedPromo.discountType === 'percent') {
      const cut = (basePrice * appliedPromo.discount) / 100;
      return Math.max(0, basePrice - cut);
    }
    
    return Math.max(0, basePrice - appliedPromo.discount);
  }, [basePrice, appliedPromo]);

  const getDiscountAmount = () => {
    if (!appliedPromo) return 0;
    
    if (appliedPromo.discountType === 'percent') {
      return (basePrice * appliedPromo.discount) / 100;
    }
    
    return appliedPromo.discount;
  };

  const discountLabel = appliedPromo
    ? appliedPromo.discountType === 'percent'
      ? `${appliedPromo.discount}%`
      : `$${appliedPromo.discount.toFixed(2)}`
    : '';

  return {
    appliedPromo,
    promoError,
    setPromoError,
    discountedPrice,
    applyPromo,
    removePromo,
    getDiscountAmount,
    discountLabel,
  };
};