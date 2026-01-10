// =============================================================================
// components/vendor/BoothAndPaymentSection.tsx
// =============================================================================

import React, { useEffect, useMemo, useState } from "react";
import { FormikErrors, FormikTouched } from "formik";

type PromoType = {
  discount: number;
  discountType: "percent" | "flat";
  description: string;
  startDate: string;
  endDate: string;
};

const PROMO_CODES: Record<string, PromoType> = {
  EARLY25: {
    discount: 25,
    discountType: "percent",
    description: "25% Early Bird Discount",
    startDate: "2025-11-15",
    endDate: "2026-01-31",
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

type AppliedPromo = {
  code: string;
  discount: number;
  discountType: "percent" | "flat";
  description: string;
};

function validatePromo(code: string): {
  valid: boolean;
  message: string;
  promo?: PromoType;
} {
  const promo = PROMO_CODES[code.toUpperCase()];
  if (!promo) return { valid: false, message: "Invalid promo code." };

  const now = new Date();
  const start = new Date(promo.startDate);
  const end = new Date(promo.endDate);

  if (now < start) {
    return { valid: false, message: `This promo will start on ${promo.startDate}.` };
  }
  if (now > end) {
    return { valid: false, message: `This promo expired on ${promo.endDate}.` };
  }

  return { valid: true, message: "Promo applied.", promo };
}

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
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  const [promoError, setPromoError] = useState("");

  const getErrorMessage = (
    error: string | string[] | FormikErrors<any> | FormikErrors<any>[] | undefined
  ): string => {
    if (typeof error === "string") return error;
    return "";
  };

  useEffect(() => {
    const code = String(values.appliedPromoCode || "").trim();
    const type = values.appliedPromoType as "percent" | "flat" | "";
    const discount = Number(values.appliedPromoDiscount || 0);

    if (!code || !type || !discount) return;

    if (!appliedPromo || appliedPromo.code !== code) {
      setAppliedPromo({
        code,
        discount,
        discountType: type,
        description: PROMO_CODES[code]?.description || "Promo applied",
      });
    }
  }, [values.appliedPromoCode, values.appliedPromoType, values.appliedPromoDiscount]);

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.discountType === "percent") {
      return (basePrice * appliedPromo.discount) / 100;
    }
    return appliedPromo.discount;
  }, [appliedPromo, basePrice]);

  const discountedPrice = useMemo(() => {
    if (!appliedPromo) return basePrice;
    return Math.max(0, basePrice - discountAmount);
  }, [appliedPromo, basePrice, discountAmount]);

  const discountLabel = appliedPromo
    ? appliedPromo.discountType === "percent"
      ? `${appliedPromo.discount}%`
      : `$${appliedPromo.discount.toFixed(2)}`
    : "";

  useEffect(() => {
    setFieldValue("amountToPay", discountedPrice);

    if (appliedPromo) {
      setFieldValue("appliedPromoCode", appliedPromo.code);
      setFieldValue("appliedPromoDiscount", appliedPromo.discount);
      setFieldValue("appliedPromoType", appliedPromo.discountType);
    } else {
      setFieldValue("appliedPromoCode", "");
      setFieldValue("appliedPromoDiscount", 0);
      setFieldValue("appliedPromoType", "");
    }
  }, [appliedPromo, discountedPrice, setFieldValue]);

  const applyPromo = () => {
    const code = String(values.promoCode || "").trim().toUpperCase();

    if (!code) {
      setPromoError("Please enter a promo code.");
      setAppliedPromo(null);
      return;
    }

    const result = validatePromo(code);
    if (!result.valid || !result.promo) {
      setPromoError(result.message);
      setAppliedPromo(null);
      return;
    }

    setPromoError("");
    setAppliedPromo({
      code,
      discount: result.promo.discount,
      discountType: result.promo.discountType,
      description: result.promo.description,
    });
  };

  const removePromo = () => {
    setPromoError("");
    setAppliedPromo(null);
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
                  <span>-{discountAmount.toFixed(2)}</span>
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
              className="flex-1 px-4 py-3.5 text-sm text-white bg-black border-2 border-[#f0b400] rounded-xl outline-none"
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
                className="px-4 py-3 rounded-xl bg-[#f0b400] text-black font-bold text-sm whitespace-nowrap"
              >
                Apply
              </button>
            )}
          </div>

          {promoError && (
            <p className="text-red-500 text-xs font-semibold mt-1.5">{promoError}</p>
          )}
        </div>
      </div>

      <div className="h-0.5 bg-gradient-to-r from-[#f0b400]/40 to-transparent my-10" />
    </>
  );
};

export default BoothAndPaymentSection;
