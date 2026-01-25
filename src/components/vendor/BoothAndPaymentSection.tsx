// =============================================================================
// components/vendor/BoothAndPaymentSection.tsx
// =============================================================================

import React, { useEffect, useMemo, useState } from "react";
import { FormikErrors, FormikTouched } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchPromoCodes } from "@/services/dashbord/asyncThunk";

type AppliedPromo = {
  code: string;
  discount: number;
  discountType: "percent" | "flat";
  description: string;
};

interface BoothAndPaymentProps {
  values: any;
  errors: FormikErrors<any>;
  touched: FormikTouched<any>;
  showBoothSuccess: boolean;
  onGoToMap: () => void;
  onClearBooth: () => void;
  setFieldValue: (field: string, value: any) => void;
  basePrice: number;
}

const BoothAndPaymentSection: React.FC<BoothAndPaymentProps> = ({
  values,
  errors,
  touched,
  showBoothSuccess,
  onGoToMap,
  onClearBooth,
  setFieldValue,
  basePrice,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { promoCodes, loading: promoLoading } = useSelector((state: RootState) => state.dashboard);
  
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  const [promoError, setPromoError] = useState("");

  // GET EVENT ID FROM FORM VALUES
  const eventId = values.selectedEvent;

  // Fetch promo codes on mount
  useEffect(() => {
    if (promoCodes.length === 0) {
      dispatch(fetchPromoCodes());
    }
  }, [dispatch]);

  const getErrorMessage = (
    error: string | string[] | FormikErrors<any> | FormikErrors<any>[] | undefined
  ): string => {
    if (typeof error === "string") return error;
    return "";
  };

  // ✅ Validate promo code against the selected event
  const validatePromo = (code: string): {
    valid: boolean;
    message: string;
    promo?: any;
  } => {
    // CHECK IF EVENT IS SELECTED
    if (!eventId) {
      return { valid: false, message: "Please select an event first." };
    }

    const promo = promoCodes.find(p => p.code === code.toUpperCase());
    
    if (!promo) {
      return { valid: false, message: "Invalid promo code." };
    }

    // Check if active
    if (!promo.isActive) {
      return { valid: false, message: "This promo code is inactive." };
    }

    // Check dates
    const now = new Date();
    const start = new Date(promo.startDate);
    const end = new Date(promo.endDate);

    if (now < start) {
      return { 
        valid: false, 
        message: `This promo will start on ${start.toLocaleDateString()}.` 
      };
    }
    if (now > end) {
      return { 
        valid: false, 
        message: `This promo expired on ${end.toLocaleDateString()}.` 
      };
    }

    // Check usage limit
    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return { valid: false, message: "This promo code has reached its usage limit." };
    }

    // ✅ CRITICAL: Check if promo is valid for the SELECTED EVENT
    if (promo.promoScope === 'specific') {
      // Check if this promo is applicable to the selected event
      const isValidForEvent = promo.applicableEvents?.some(
        (evt: any) => {
          // Handle both populated (object) and non-populated (string) event references
          const evtId = evt._id || evt;
          return evtId.toString() === eventId.toString();
        }
      );
      
      if (!isValidForEvent) {
        return { 
          valid: false, 
          message: "This promo code is not valid for the selected event." 
        };
      }
    }
    // If promoScope is 'all', it's valid for all events

    // Check minimum purchase amount
    if (promo.minPurchaseAmount && basePrice < promo.minPurchaseAmount) {
      return {
        valid: false,
        message: `Minimum purchase amount of $${promo.minPurchaseAmount.toFixed(2)} required.`
      };
    }

    return { valid: true, message: "Promo applied successfully!", promo };
  };

  // Restore applied promo from form values on mount
  useEffect(() => {
    const code = String(values.appliedPromoCode || "").trim();
    const type = values.appliedPromoType as "percent" | "flat" | "";
    const discount = Number(values.appliedPromoDiscount || 0);
    const description = values.appliedPromoDescription || "";

    if (!code || !type || !discount) return;

    if (!appliedPromo || appliedPromo.code !== code) {
      setAppliedPromo({
        code,
        discount,
        discountType: type,
        description: description || "Promo applied",
      });
    }
  }, [values.appliedPromoCode, values.appliedPromoType, values.appliedPromoDiscount]);

  // Re-validate promo if event changes
  useEffect(() => {
    if (appliedPromo && eventId) {
      const result = validatePromo(appliedPromo.code);
      if (!result.valid) {
        setPromoError(result.message);
        setAppliedPromo(null);
      }
    }
  }, [eventId]);

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    
    let amount = 0;
    if (appliedPromo.discountType === "percent") {
      amount = (basePrice * appliedPromo.discount) / 100;
    } else {
      amount = appliedPromo.discount;
    }

    // Apply max discount cap if it exists
    const promoData = promoCodes.find(p => p.code === appliedPromo.code);
    if (promoData?.maxDiscountAmount && amount > promoData.maxDiscountAmount) {
      amount = promoData.maxDiscountAmount;
    }

    return Math.min(amount, basePrice);
  }, [appliedPromo, basePrice, promoCodes]);

  const discountedPrice = useMemo(() => {
    if (!appliedPromo) return basePrice;
    return Math.max(0, basePrice - discountAmount);
  }, [appliedPromo, basePrice, discountAmount]);

  const discountLabel = appliedPromo
    ? appliedPromo.discountType === "percent"
      ? `${appliedPromo.discount}%`
      : `$${appliedPromo.discount.toFixed(2)}`
    : "";

  // Update form values when promo changes
  useEffect(() => {
    setFieldValue("amountToPay", discountedPrice);

    if (appliedPromo) {
      setFieldValue("appliedPromoCode", appliedPromo.code);
      setFieldValue("appliedPromoDiscount", appliedPromo.discount);
      setFieldValue("appliedPromoType", appliedPromo.discountType);
      setFieldValue("appliedPromoDescription", appliedPromo.description);
    } else {
      setFieldValue("appliedPromoCode", "");
      setFieldValue("appliedPromoDiscount", 0);
      setFieldValue("appliedPromoType", "");
      setFieldValue("appliedPromoDescription", "");
    }
  }, [appliedPromo, discountedPrice, setFieldValue]);

  const applyPromo = () => {
    const code = String(values.promoCode || "").trim().toUpperCase();

    if (!code) {
      setPromoError("Please enter a promo code.");
      setAppliedPromo(null);
      return;
    }

    // ✅ Validate against selected event
    const result = validatePromo(code);
    
    if (!result.valid || !result.promo) {
      setPromoError(result.message);
      setAppliedPromo(null);
      return;
    }

    // Apply the valid promo
    setPromoError("");
    setAppliedPromo({
      code: result.promo.code,
      discount: result.promo.discount,
      discountType: result.promo.discountType,
      description: result.promo.description,
    });
  };

  const removePromo = () => {
    setPromoError("");
    setAppliedPromo(null);
    setFieldValue("promoCode", "");
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-lg md:text-xl">
          C
        </div>
        <h2 className="text-[#f0b400] text-xl md:text-2xl font-black tracking-widest uppercase">
          Select Booth on Map
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <div>
          <label className="block text-[#f0b400] text-sm font-bold mb-2">
            Booth Number *
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              name="boothNumber"
              value={values.boothNumber}
              readOnly
              placeholder="Select on map"
              className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
                errors.boothNumber && touched.boothNumber
                  ? "border-red-500"
                  : "border-[#f0b400] focus:border-[#f0b400]"
              }`}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onGoToMap}
                className="px-4 py-3 rounded-xl bg-[#f0b400] text-black font-bold text-sm whitespace-nowrap"
              >
                {values.boothNumber ? "Change on Map" : "Choose on Map"}
              </button>
              {values.boothNumber && (
                <button
                  type="button"
                  onClick={onClearBooth}
                  className="px-4 py-3 rounded-xl border-2 border-[#f0b400] text-[#f0b400] text-sm whitespace-nowrap hover:bg-[#f0b400] hover:text-black transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {showBoothSuccess && (
            <p className="text-emerald-400 text-xs font-semibold mt-1.5">
              Booth selection loaded from the map.
            </p>
          )}

          {errors.boothNumber && touched.boothNumber && (
            <p className="text-red-500 text-xs font-semibold mt-1.5">
              {getErrorMessage(errors.boothNumber)}
            </p>
          )}

          <p className="text-[#f0b400]/70 text-xs mt-1.5">
            Note: Pricing and availability will be verified by our team
          </p>
        </div>

        {/* Amount + Promo */}
        <div>
          <label className="block text-[#f0b400] text-sm font-bold mb-2">
            Amount to pay
          </label>

          <div className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 border-[#f0b400] rounded-xl">
            {appliedPromo ? (
              <div className="space-y-1">
                <div className="flex justify-between text-white/70">
                  <span>Original:</span>
                  <span className="line-through">${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({discountLabel})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-emerald-400">${discountedPrice.toFixed(2)}</span>
                </div>
                <p className="text-emerald-400 text-xs">{appliedPromo.description}</p>
              </div>
            ) : (
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-emerald-400">${basePrice.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <input
              name="promoCode"
              value={values.promoCode || ""}
              onChange={(e) => {
                setFieldValue("promoCode", e.target.value);
                setPromoError("");
              }}
              placeholder="Promo code (optional)"
              disabled={promoLoading}
              className="flex-1 px-4 py-3.5 text-sm text-white bg-black border-2 border-[#f0b400] rounded-xl outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {appliedPromo ? (
              <button
                type="button"
                onClick={removePromo}
                className="px-4 py-3 rounded-xl border-2 border-[#f0b400] text-[#f0b400] text-sm whitespace-nowrap hover:bg-[#f0b400] hover:text-black transition"
              >
                Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={applyPromo}
                disabled={promoLoading}
                className="px-4 py-3 rounded-xl bg-[#f0b400] text-black font-bold text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-500 transition"
              >
                {promoLoading ? "Loading..." : "Apply"}
              </button>
            )}
          </div>

          {promoError && (
            <p className="text-red-500 text-xs font-semibold mt-1.5">{promoError}</p>
          )}

          {appliedPromo && !promoError && (
            <p className="text-emerald-400 text-xs font-semibold mt-1.5">
              ✓ Promo code {appliedPromo.code} applied successfully!
            </p>
          )}
        </div>
      </div>

      <div className="h-0.5 bg-gradient-to-r from-[#f0b400]/40 to-transparent my-10" />
    </>
  );
};

export default BoothAndPaymentSection;