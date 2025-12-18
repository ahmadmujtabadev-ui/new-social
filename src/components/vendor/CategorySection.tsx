// =============================================================================
// components/vendor/CategorySection.tsx
// =============================================================================

import React from "react";
import { FormikErrors, FormikTouched, Field } from "formik";

const CATEGORY_OPTIONS = ["Food Vendor", "Clothing Vendor", "Jewelry Vendor", "Craft Booth"];

interface CategorySectionProps {
  values: any;
  errors: FormikErrors<any>;
  touched: FormikTouched<any>;
  setFieldValue: (field: string, value: any) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  values,
  errors,
  touched,
  setFieldValue,
}) => {
  const handleMultiFileChange = (fieldName: string, files: FileList | null) => {
    if (!files) {
      setFieldValue(fieldName, []);
      return;
    }
    setFieldValue(fieldName, Array.from(files));
  };

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
          B
        </div>
        <h2 className="text-[#f0b400] text-xl md:text-2xl font-black tracking-widest uppercase">
          Category
        </h2>
      </div>

      <div className="mb-6">
        <Field
          as="select"
          name="category"
          className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none cursor-pointer transition ${
            errors.category && touched.category
              ? "border-red-500"
              : "border-[#f0b400] focus:border-[#f0b400]"
          }`}
        >
          <option value="">Select…</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Field>
        {errors.category && touched.category && (
          <p className="text-red-500 text-xs font-semibold mt-1.5">
            {getErrorMessage(errors.category)}
          </p>
        )}
      </div>

      {values.category === "Food Vendor" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-[#f0b400] text-sm font-bold mb-2">
              What are you planning to sell? (Max 2 items) *
            </label>
            <Field
              name="foodItems"
              placeholder="e.g., Samosas, Chaat"
              className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
                errors.foodItems && touched.foodItems
                  ? "border-red-500"
                  : "border-[#f0b400] focus:border-[#f0b400]"
              }`}
            />
            {errors.foodItems && touched.foodItems && (
              <p className="text-red-500 text-xs font-semibold mt-1.5">
                {getErrorMessage(errors.foodItems)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[#f0b400] text-sm font-bold mb-2">
              Attach a picture for reference
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleMultiFileChange("foodPhotos", e.target.files)}
              className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 border-[#f0b400] rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0b400] file:text-black hover:file:bg-yellow-500"
            />
            {values.foodPhotos.length > 0 && (
              <p className="text-emerald-400 text-xs mt-1.5">
                {values.foodPhotos.length} file(s) selected
              </p>
            )}
          </div>

          <div>
            <label className="block text-[#f0b400] text-sm font-bold mb-2">
              Do you need a power outlet? *
            </label>
            <Field
              as="select"
              name="needPowerFood"
              className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none cursor-pointer transition ${
                errors.needPowerFood && touched.needPowerFood
                  ? "border-red-500"
                  : "border-[#f0b400] focus:border-[#f0b400]"
              }`}
            >
              <option value="">Select…</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </Field>
            {errors.needPowerFood && touched.needPowerFood && (
              <p className="text-red-500 text-xs font-semibold mt-1.5">
                {getErrorMessage(errors.needPowerFood)}
              </p>
            )}
          </div>

          {values.needPowerFood === "yes" && (
            <div>
              <label className="block text-[#f0b400] text-sm font-bold mb-2">
                Equipment power (watts) *
              </label>
              <Field
                name="foodWatts"
                placeholder="e.g., 1500W"
                className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
                  errors.foodWatts && touched.foodWatts
                    ? "border-red-500"
                    : "border-[#f0b400] focus:border-[#f0b400]"
                }`}
              />
              {errors.foodWatts && touched.foodWatts && (
                <p className="text-red-500 text-xs font-semibold mt-1.5">
                  {getErrorMessage(errors.foodWatts)}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {values.category === "Clothing Vendor" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-[#f0b400] text-sm font-bold mb-2">
              Which type of clothes? *
            </label>
            <Field
              name="clothingType"
              placeholder="e.g., South Asian formalwear"
              className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
                errors.clothingType && touched.clothingType
                  ? "border-red-500"
                  : "border-[#f0b400] focus:border-[#f0b400]"
              }`}
            />
            {errors.clothingType && touched.clothingType && (
              <p className="text-red-500 text-xs font-semibold mt-1.5">
                {getErrorMessage(errors.clothingType)}
              </p>
            )}
          </div>
          <div>
            <label className="block text-[#f0b400] text-sm font-bold mb-2">
              Attach photographs for reference
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleMultiFileChange("clothingPhotos", e.target.files)}
              className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 border-[#f0b400] rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0b400] file:text-black hover:file:bg-yellow-500"
            />
            {values.clothingPhotos.length > 0 && (
              <p className="text-emerald-400 text-xs mt-1.5">
                {values.clothingPhotos.length} file(s) selected
              </p>
            )}
          </div>
        </div>
      )}

      {values.category === "Jewelry Vendor" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-[#f0b400] text-sm font-bold mb-2">
              Type of jewelry? *
            </label>
            <Field
              name="jewelryType"
              placeholder="e.g., Bridal sets, everyday wear"
              className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
                errors.jewelryType && touched.jewelryType
                  ? "border-red-500"
                  : "border-[#f0b400] focus:border-[#f0b400]"
              }`}
            />
            {errors.jewelryType && touched.jewelryType && (
              <p className="text-red-500 text-xs font-semibold mt-1.5">
                {getErrorMessage(errors.jewelryType)}
              </p>
            )}
          </div>
          <div>
            <label className="block text-[#f0b400] text-sm font-bold mb-2">
              Attach pictures for reference
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleMultiFileChange("jewelryPhotos", e.target.files)}
              className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 border-[#f0b400] rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0b400] file:text-black hover:file:bg-yellow-500"
            />
            {values.jewelryPhotos.length > 0 && (
              <p className="text-emerald-400 text-xs mt-1.5">
                {values.jewelryPhotos.length} file(s) selected
              </p>
            )}
          </div>
        </div>
      )}

      {values.category === "Craft Booth" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-[#f0b400] text-sm font-bold mb-2">
              Give some details about your items? *
            </label>
            <Field
              as="textarea"
              name="craftDetails"
              rows={3}
              className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
                errors.craftDetails && touched.craftDetails
                  ? "border-red-500"
                  : "border-[#f0b400] focus:border-[#f0b400]"
              }`}
            />
            {errors.craftDetails && touched.craftDetails && (
              <p className="text-red-500 text-xs font-semibold mt-1.5">
                {getErrorMessage(errors.craftDetails)}
              </p>
            )}
          </div>
          <div>
            <label className="block text-[#f0b400] text-sm font-bold mb-2">
              Attach pictures for reference
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleMultiFileChange("craftPhotos", e.target.files)}
              className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 border-[#f0b400] rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0b400] file:text-black hover:file:bg-yellow-500"
            />
            {values.craftPhotos.length > 0 && (
              <p className="text-emerald-400 text-xs mt-1.5">
                {values.craftPhotos.length} file(s) selected
              </p>
            )}
          </div>
          <div>
            <label className="block text-[#f0b400] text-sm font-bold mb-2">
              Do you need a power outlet? *
            </label>
            <Field
              as="select"
              name="needPowerCraft"
              className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none cursor-pointer transition ${
                errors.needPowerCraft && touched.needPowerCraft
                  ? "border-red-500"
                  : "border-[#f0b400] focus:border-[#f0b400]"
              }`}
            >
              <option value="">Select…</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </Field>
            {errors.needPowerCraft && touched.needPowerCraft && (
              <p className="text-red-500 text-xs font-semibold mt-1.5">
                {getErrorMessage(errors.needPowerCraft)}
              </p>
            )}
          </div>
          {values.needPowerCraft === "yes" && (
            <div>
              <label className="block text-[#f0b400] text-sm font-bold mb-2">
                Equipment power (watts) *
              </label>
              <Field
                name="craftWatts"
                placeholder="e.g., 300W"
                className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
                  errors.craftWatts && touched.craftWatts
                    ? "border-red-500"
                    : "border-[#f0b400] focus:border-[#f0b400]"
                }`}
              />
              {errors.craftWatts && touched.craftWatts && (
                <p className="text-red-500 text-xs font-semibold mt-1.5">
                  {getErrorMessage(errors.craftWatts)}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="h-0.5 bg-gradient-to-r from-[#f0b400]/40 to-transparent my-10" />
    </>
  );
};

export default CategorySection;