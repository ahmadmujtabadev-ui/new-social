import { AppliedPromo, Errors, VendorFormData } from "@/constants/vendorTypes";
import React from "react";

type Props = {
  formData: VendorFormData;
  errors: Errors;
  basePrice: number;
  discountedPrice: number;
  discountAmount: number;
  discountLabel: string;
  appliedPromo: AppliedPromo | null;
  promoError: string;
  showBoothSuccess: boolean;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onGoToMap: () => void;
  onClearBooth: () => void;
  onPromoChange: (value: string) => void;
  onApplyPromo: () => void;
  onRemovePromo: () => void;
};

const BoothAndPaymentSection: React.FC<Props> = ({
  formData,
  errors,
  basePrice,
  discountedPrice,
  discountAmount,
  discountLabel,
  appliedPromo,
  promoError,
  showBoothSuccess,
  onChange,
  onGoToMap,
  onClearBooth,
  onPromoChange,
  onApplyPromo,
  onRemovePromo,
}) => {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-lg md:text-xl">
          C
        </div>
        <h2 className="text-[#f0b400] text-xl md:text-2xl font-black tracking-widest uppercase">
          Select Booth on Map & Review
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <label className="block text-[#f0b400] text-sm font-bold mb-2">
            Booth *
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              name="boothNumber"
              value={formData.boothNumber}
              readOnly
              placeholder="Select on map"
              className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
                errors.boothNumber
                  ? "border-red-500"
                  : "border-[#f0b400] focus:border-[#f0b400]"
              }`}
              onChange={onChange}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onGoToMap}
                className="px-4 py-3 rounded-xl bg-[#f0b400] text-black font-bold text-sm whitespace-nowrap"
              >
                {formData.boothNumber ? "Change on Map" : "Choose on Map"}
              </button>
              {formData.boothNumber && (
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
          {errors.boothNumber && (
            <p className="text-red-500 text-xs font-semibold mt-1.5">
              {errors.boothNumber}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[#f0b400] text-sm font-bold mb-2">
            Amount to pay
          </label>
          <div className="w-full px-4 py-3.5 text-sm bg-black text-[#f0b400] border-2 border-[#f0b400] rounded-xl">
            {appliedPromo ? (
              <div className="space-y-1">
                <div className="flex justify-between text-[#f0b400]/85">
                  <span>Original:</span>
                  <span className="line-through">
                    ${basePrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({discountLabel})</span>
                  <span>-{discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-emerald-400">
                    ${discountedPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-emerald-400">
                  ${basePrice.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <input
              name="promoCode"
              value={formData.promoCode}
              onChange={(e) => onPromoChange(e.target.value)}
              placeholder="Promo code (optional)"
              className="flex-1 px-4 py-3.5 text-sm text-white bg-black border-2 border-[#f0b400] rounded-xl outline-none"
            />
            {appliedPromo ? (
              <button
                type="button"
                onClick={onRemovePromo}
                className="px-4 py-3 rounded-xl border-2 border-[#f0b400] text-[#f0b400] text-sm whitespace-nowrap hover:bg-[#f0b400] hover:text-black transition"
              >
                Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={onApplyPromo}
                className="px-4 py-3 rounded-xl bg-[#f0b400] text-black text-sm whitespace-nowrap"
              >
                Apply
              </button>
            )}
          </div>
          {promoError && (
            <p className="text-red-500 text-xs font-semibold mt-1.5">
              {promoError}
            </p>
          )}
        </div>
      </div>

      <div className="h-0.5 bg-gradient-to-r from-[#f0b400]/40 to-transparent my-10" />
    </>
  );
};

export default BoothAndPaymentSection;
