// components/vendor/ContactBusinessSection.tsx
import React, { useEffect, useMemo } from "react";
import { Field, FormikErrors, FormikTouched } from "formik";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchEvents } from "@/services/dashbord/asyncThunk";

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

export type UiEventOption = { value: string; label: string };

export function getEventId(event: any): string {
  return String(event?._id ?? event?.id ?? "");
}

export function getEventLabel(event: any): string {
  return String(event?.title ?? event?.name ?? event?.eventName ?? "Untitled Event");
}

const ContactBusinessSection: React.FC<Props> = ({
  values,
  errors,
  touched,
  setFieldValue,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { events = [], loading, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Filter only published and active events for frontend display
  const publishedEvents = useMemo(() => {
    const list = Array.isArray(events) ? events : [];
    return list.filter((event: any) => event?.status === "published" && !!event?.isActive);
  }, [events]);

  const eventOptions: UiEventOption[] = useMemo(() => {
    return publishedEvents
      .map((e: any) => ({
        value: getEventId(e),
        label: getEventLabel(e),
      }))
      .filter((opt) => opt.value); // remove invalid ids
  }, [publishedEvents]);

  // If selectedEvent is no longer valid after fetching (event removed/unpublished), reset it
  useEffect(() => {
    if (!values.selectedEvent) return;
    const stillExists = eventOptions.some((o) => o.value === values.selectedEvent);
    if (!stillExists) {
      setFieldValue("selectedEvent", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventOptions]);

  const isSelectDisabled = loading || eventOptions.length === 0;

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
          disabled={isSelectDisabled}
          className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none cursor-pointer transition ${
            errors.selectedEvent && touched.selectedEvent
              ? "border-red-500"
              : "border-[#f0b400] focus:border-[#f0b400]"
          } ${isSelectDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <option value="">
            {loading
              ? "Loading events…"
              : eventOptions.length
              ? "Select the event you are interested in…"
              : "No active events available"}
          </option>

          {eventOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Field>

        {Boolean(error) && (
          <p className="text-red-500 text-xs font-semibold mt-1.5">
            {String(error)}
          </p>
        )}

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
