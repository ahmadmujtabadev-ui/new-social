// =============================================================================
// components/vendor/BoothAndPaymentSection.tsx
// =============================================================================

import React from "react";
import { FormikErrors, FormikTouched } from "formik";

interface BoothAndPaymentProps {
  values: any;
  errors: FormikErrors<any>;
  touched: FormikTouched<any>;
  showBoothSuccess: boolean;
  onGoToMap: () => void;
  onClearBooth: () => void;
  setFieldValue: (field: string, value: any) => void;
}

const BoothAndPaymentSection: React.FC<BoothAndPaymentProps> = ({
  values,
  errors,
  touched,
  showBoothSuccess,
  onGoToMap,
  onClearBooth,
}) => {
  // Helper function to safely render error messages
  const getErrorMessage = (error: string | string[] | FormikErrors<any> | FormikErrors<any>[] | undefined): string => {
    if (typeof error === 'string') {
      return error;
    }
    return '';
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
      </div>

      <div className="h-0.5 bg-gradient-to-r from-[#f0b400]/40 to-transparent my-10" />
    </>
  );
};

export default BoothAndPaymentSection;