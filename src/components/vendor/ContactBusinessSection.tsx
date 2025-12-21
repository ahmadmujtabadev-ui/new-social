// components/vendor/ContactBusinessSection.tsx
import React from "react";
import { FormikErrors, FormikTouched } from "formik";
import { Field } from "formik";

interface VendorFormValues {
  personName: string;
  vendorName: string;
  email: string;
  phone: string;
  isOakville: "" | "yes" | "no";
  selectedEvent: string;
  businessLogo: File | null;
  instagram: string;
  facebook: string;
  [key: string]: any;
}

interface Props {
  values: VendorFormValues;
  errors: FormikErrors<VendorFormValues>;
  touched: FormikTouched<VendorFormValues>;
  setFieldValue: (field: string, value: any) => void;
}

const EVENT_OPTIONS = [
  { value: "oakville-eid-2026", label: "oakville-eid-2026", },
];

const ContactBusinessSection: React.FC<Props> = ({
  values,
  errors,
  touched,
  setFieldValue,
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

      {/* Select Event */}
      <div className="mb-6">
        <label className="block text-[#f0b400] text-sm font-bold mb-2">
          Select Event *
        </label>
        <Field
          as="select"
          name="selectedEvent"
          className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none cursor-pointer transition ${
            errors.selectedEvent && touched.selectedEvent
              ? "border-red-500"
              : "border-[#f0b400] focus:border-[#f0b400]"
          }`}
        >
          <option value="">Select the event you are interested in…</option>
          {EVENT_OPTIONS.map((event) => (
            <option key={event.value} value={event.value}>
              {event.label}
            </option>
          ))}
        </Field>
        {errors.selectedEvent && touched.selectedEvent && (
          <p className="text-red-500 text-xs font-semibold mt-1.5">
            {errors.selectedEvent}
          </p>
        )}
        <p className="text-[#f0b400]/70 text-xs mt-1.5">
          Choose how you want to be involved in the event
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-[#f0b400] text-sm font-bold mb-2">
            Person Name *
          </label>
          <Field
            name="personName"
            placeholder="Your full name"
            className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
              errors.personName && touched.personName
                ? "border-red-500"
                : "border-[#f0b400] focus:border-[#f0b400]"
            }`}
          />
          {errors.personName && touched.personName && (
            <p className="text-red-500 text-xs font-semibold mt-1.5">
              {errors.personName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[#f0b400] text-sm font-bold mb-2">
            Vendor Name *
          </label>
          <Field
            name="vendorName"
            placeholder="Business name"
            className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
              errors.vendorName && touched.vendorName
                ? "border-red-500"
                : "border-[#f0b400] focus:border-[#f0b400]"
            }`}
          />
          {errors.vendorName && touched.vendorName && (
            <p className="text-red-500 text-xs font-semibold mt-1.5">
              {errors.vendorName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[#f0b400] text-sm font-bold mb-2">
            Email Address *
          </label>
          <Field
            type="email"
            name="email"
            placeholder="you@example.com"
            className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
              errors.email && touched.email
                ? "border-red-500"
                : "border-[#f0b400] focus:border-[#f0b400]"
            }`}
          />
          {errors.email && touched.email && (
            <p className="text-red-500 text-xs font-semibold mt-1.5">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[#f0b400] text-sm font-bold mb-2">
            Phone Number *
          </label>
          <Field
            name="phone"
            type="tel"
            inputMode="numeric"
            maxLength={11}
            placeholder="1 (___) ___-____"
            className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
              errors.phone && touched.phone
                ? "border-red-500"
                : "border-[#f0b400] focus:border-[#f0b400]"
            }`}
          />
          {errors.phone && touched.phone && (
            <p className="text-red-500 text-xs font-semibold mt-1.5">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[#f0b400] text-sm font-bold mb-2">
            Is the business Oakville-based? *
          </label>
          <Field
            as="select"
            name="isOakville"
            className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none cursor-pointer transition ${
              errors.isOakville && touched.isOakville
                ? "border-red-500"
                : "border-[#f0b400] focus:border-[#f0b400]"
            }`}
          >
            <option value="">Select…</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Field>
          {errors.isOakville && touched.isOakville && (
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
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setFieldValue("businessLogo", file);
            }}
            className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 border-[#f0b400] rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0b400] file:text-black hover:file:bg-yellow-500"
          />
          {values.businessLogo && (
            <p className="text-emerald-400 text-xs mt-1.5">
              Selected: {values.businessLogo.name}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-[#f0b400] text-sm font-bold mb-2">
            Instagram
          </label>
          <Field
            name="instagram"
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
          <Field
            name="facebook"
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
