import { Errors, VendorFormData } from "@/constants/vendorTypes";
import { CATEGORY_OPTIONS } from "@/lib/vendorformconfig";
import React from "react";


type Props = {
  formData: VendorFormData;
  errors: Errors;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onFileChange: (
    name: keyof VendorFormData,
    files: FileList | null,
    multiple?: boolean
  ) => void;
};

const CategorySection: React.FC<Props> = ({
  formData,
  errors,
  onChange,
  onFileChange,
}) => {
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
        <select
          name="category"
          value={formData.category}
          onChange={onChange}
          className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none cursor-pointer transition ${
            errors.category
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
        </select>
        {errors.category && (
          <p className="text-red-500 text-xs font-semibold mt-1.5">
            {errors.category}
          </p>
        )}
      </div>

      {formData.category === "Food Vendor" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-[#f0b400] text-sm font-bold mb-2">
              What are you planning to sell? (Max 2 items) *
            </label>
            <input
              name="foodItems"
              value={formData.foodItems}
              onChange={onChange}
              placeholder="e.g., Samosas, Chaat"
              className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
                errors.foodItems
                  ? "border-red-500"
                  : "border-[#f0b400] focus:border-[#f0b400]"
              }`}
            />
            {errors.foodItems && (
              <p className="text-red-500 text-xs font-semibold mt-1.5">
                {errors.foodItems}
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
              onChange={(e) => onFileChange("foodPhotos", e.target.files, true)}
              className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 border-[#f0b400] rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0b400] file:text-black hover:file:bg-yellow-500"
            />
          </div>

          <div>
            <label className="block text-[#f0b400] text-sm font-bold mb-2">
              Do you need a power outlet? *
            </label>
            <select
              name="needPowerFood"
              value={formData.needPowerFood}
              onChange={onChange}
              className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none cursor-pointer transition ${
                errors.needPowerFood
                  ? "border-red-500"
                  : "border-[#f0b400] focus:border-[#f0b400]"
              }`}
            >
              <option value="">Select…</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
            {errors.needPowerFood && (
              <p className="text-red-500 text-xs font-semibold mt-1.5">
                {errors.needPowerFood}
              </p>
            )}
          </div>

          {formData.needPowerFood === "yes" && (
            <div>
              <label className="block text-[#f0b400] text-sm font-bold mb-2">
                Equipment power (watts) *
              </label>
              <input
                name="foodWatts"
                value={formData.foodWatts}
                onChange={onChange}
                placeholder="e.g., 1500W"
                className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
                  errors.foodWatts
                    ? "border-red-500"
                    : "border-[#f0b400] focus:border-[#f0b400]"
                }`}
              />
              {errors.foodWatts && (
                <p className="text-red-500 text-xs font-semibold mt-1.5">
                  {errors.foodWatts}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {formData.category === "Clothing Vendor" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-[#f0b400] text-sm font-bold mb-2">
              Which type of clothes? *
            </label>
            <input
              name="clothingType"
              value={formData.clothingType}
              onChange={onChange}
              placeholder="e.g., South Asian formalwear"
              className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
                errors.clothingType
                  ? "border-red-500"
                  : "border-[#f0b400] focus:border-[#f0b400]"
              }`}
            />
            {errors.clothingType && (
              <p className="text-red-500 text-xs font-semibold mt-1.5">
                {errors.clothingType}
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
              onChange={(e) =>
                onFileChange("clothingPhotos", e.target.files, true)
              }
              className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 border-[#f0b400] rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0b400] file:text-black hover:file:bg-yellow-500"
            />
          </div>
        </div>
      )}

      {formData.category === "Jewelry Vendor" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-[#f0b400] text-sm font-bold mb-2">
              Type of jewelry? *
            </label>
            <input
              name="jewelryType"
              value={formData.jewelryType}
              onChange={onChange}
              placeholder="e.g., Bridal sets, everyday wear"
              className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
                errors.jewelryType
                  ? "border-red-500"
                  : "border-[#f0b400] focus:border-[#f0b400]"
              }`}
            />
            {errors.jewelryType && (
              <p className="text-red-500 text-xs font-semibold mt-1.5">
                {errors.jewelryType}
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
              onChange={(e) =>
                onFileChange("jewelryPhotos", e.target.files, true)
              }
              className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 border-[#f0b400] rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0b400] file:text-black hover:file:bg-yellow-500"
            />
          </div>
        </div>
      )}

      {formData.category === "Craft Booth" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-[#f0b400] text-sm font-bold mb-2">
              Give some details about your items? *
            </label>
            <textarea
              name="craftDetails"
              value={formData.craftDetails}
              onChange={onChange}
              rows={3}
              className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
                errors.craftDetails
                  ? "border-red-500"
                  : "border-[#f0b400] focus:border-[#f0b400]"
              }`}
            />
            {errors.craftDetails && (
              <p className="text-red-500 text-xs font-semibold mt-1.5">
                {errors.craftDetails}
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
              onChange={(e) => onFileChange("craftPhotos", e.target.files, true)}
              className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 border-[#f0b400] rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0b400] file:text-black hover:file:bg-yellow-500"
            />
          </div>
          <div>
            <label className="block text-[#f0b400] text-sm font-bold mb-2">
              Do you need a power outlet? *
            </label>
            <select
              name="needPowerCraft"
              value={formData.needPowerCraft}
              onChange={onChange}
              className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none cursor-pointer transition ${
                errors.needPowerCraft
                  ? "border-red-500"
                  : "border-[#f0b400] focus:border-[#f0b400]"
              }`}
            >
              <option value="">Select…</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
            {errors.needPowerCraft && (
              <p className="text-red-500 text-xs font-semibold mt-1.5">
                {errors.needPowerCraft}
              </p>
            )}
          </div>
          {formData.needPowerCraft === "yes" && (
            <div>
              <label className="block text-[#f0b400] text-sm font-bold mb-2">
                Equipment power (watts) *
              </label>
              <input
                name="craftWatts"
                value={formData.craftWatts}
                onChange={onChange}
                placeholder="e.g., 300W"
                className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
                  errors.craftWatts
                    ? "border-red-500"
                    : "border-[#f0b400] focus:border-[#f0b400]"
                }`}
              />
              {errors.craftWatts && (
                <p className="text-red-500 text-xs font-semibold mt-1.5">
                  {errors.craftWatts}
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
