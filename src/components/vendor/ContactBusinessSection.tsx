import { Errors, VendorFormData } from "@/constants/vendorTypes";
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

const ContactBusinessSection: React.FC<Props> = ({
  formData,
  errors,
  onChange,
  onFileChange,
}) => {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-lg md:text-xl">
          A
        </div>
        <h2 className="text-[#f0b400] text-xl md:text-2xl font-black tracking-widest uppercase">
          Contact & Business
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-[#f0b400] text-sm font-bold mb-2">
            Person Name *
          </label>
          <input
            name="personName"
            value={formData.personName}
            onChange={onChange}
            placeholder="Your full name"
            className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
              errors.personName
                ? "border-red-500"
                : "border-[#f0b400] focus:border-[#f0b400]"
            }`}
          />
          {errors.personName && (
            <p className="text-red-500 text-xs font-semibold mt-1.5">
              {errors.personName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[#f0b400] text-sm font-bold mb-2">
            Vendor Name *
          </label>
          <input
            name="vendorName"
            value={formData.vendorName}
            onChange={onChange}
            placeholder="Business name"
            className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
              errors.vendorName
                ? "border-red-500"
                : "border-[#f0b400] focus:border-[#f0b400]"
            }`}
          />
          {errors.vendorName && (
            <p className="text-red-500 text-xs font-semibold mt-1.5">
              {errors.vendorName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[#f0b400] text-sm font-bold mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="you@example.com"
            className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
              errors.email
                ? "border-red-500"
                : "border-[#f0b400] focus:border-[#f0b400]"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs font-semibold mt-1.5">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[#f0b400] text-sm font-bold mb-2">
            Phone Number *
          </label>
          <input
            name="phone"
            type="tel"
            inputMode="numeric"
            maxLength={11}
            value={formData.phone}
            onChange={onChange}
            placeholder="1 (___) ___-____"
            className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
              errors.phone
                ? "border-red-500"
                : "border-[#f0b400] focus:border-[#f0b400]"
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs font-semibold mt-1.5">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[#f0b400] text-sm font-bold mb-2">
            Is the business Oakville-based? *
          </label>
          <select
            name="isOakville"
            value={formData.isOakville}
            onChange={onChange}
            className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none cursor-pointer transition ${
              errors.isOakville
                ? "border-red-500"
                : "border-[#f0b400] focus:border-[#f0b400]"
            }`}
          >
            <option value="">Select…</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.isOakville && (
            <p className="text-red-500 text-xs font-semibold mt-1.5">
              {errors.isOakville}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[#f0b400] text-sm font-bold mb-2">
            Business Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange("businessLogo", e.target.files)}
            className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 border-[#f0b400] rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0b400] file:text-black hover:file:bg-yellow-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-[#f0b400] text-sm font-bold mb-2">
            Instagram
          </label>
          <input
            name="instagram"
            value={formData.instagram}
            onChange={onChange}
            placeholder="@handle"
            className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 border-[#f0b400] rounded-xl outline-none focus:border-[#f0b400] transition"
          />
          <p className="text-[#f0b400]/70 text-xs mt-1.5">
            Optional — helps us feature you.
          </p>
        </div>
        <div>
          <label className="block text-[#f0b400] text-sm font-bold mb-2">
            Facebook
          </label>
          <input
            name="facebook"
            value={formData.facebook}
            onChange={onChange}
            placeholder="facebook.com/yourpage"
            className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 border-[#f0b400] rounded-xl outline-none focus:border-[#f0b400] transition"
          />
        </div>
      </div>

      <div className="h-0.5 bg-gradient-to-r from-[#f0b400]/40 to-transparent my-10" />
    </>
  );
};

export default ContactBusinessSection;
