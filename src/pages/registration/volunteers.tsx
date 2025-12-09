

"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "@/components/Homepage.tsx/header";
import { submitVolunteerAsync } from "@/services/auth/asyncThunk";
import { resetFormState, selectForms } from "@/redux/slices/userSlice";
import { TermsCheckboxWithModal } from "@/components/common/TermsModal";
import Toast from "@/components/Toast";

type Errors = Record<string, string>;

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  slot: string;
  emName: string;
  emRelation: string;
  emPhone: string;
  terms: boolean;
};

const VOLUNTEER_SLOTS = [
  "Afternoon Shift (2pm - 6pm)",
  "Evening Shift (5pm - 9pm)",
  "Night Shift (7pm - 11pm)",
  "Full Day (4pm - 11pm)",
] as const;

const STORAGE_VERSION = "v1";
const DRAFT_KEY = `volunteerFormDraft:${STORAGE_VERSION}`;

const EMPTY: FormData = {
  fullName: "",
  email: "",
  phone: "",
  slot: "",
  emName: "",
  emRelation: "",
  emPhone: "",
  terms: false,
};

const VolunteerForm: React.FC = () => {
  const dispatch = useDispatch();
  const { isLoading, volunteerSuccess } = useSelector(selectForms);

  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window === "undefined") return EMPTY;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      const draft = raw ? (JSON.parse(raw) as Partial<FormData>) : {};
      return { ...EMPTY, ...draft };
    } catch {
      return EMPTY;
    }
  });

  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    } catch {
      // ignore
    }
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as any;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e: Errors = {};

    if (!formData.fullName.trim()) e.fullName = "Full name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      e.email = "Invalid email format";
    if (!formData.phone.trim()) e.phone = "Phone number is required";
    if (!formData.slot) e.slot = "Please select a volunteer slot";

    if (!formData.emName.trim())
      e.emName = "Emergency contact name is required";
    if (!formData.emRelation.trim())
      e.emRelation = "Emergency contact relation is required";
    if (!formData.emPhone.trim())
      e.emPhone = "Emergency contact phone is required";

    if (!formData.terms) e.terms = "Please accept the terms to proceed";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      slot: formData.slot,
      emName: formData.emName.trim(),
      emRelation: formData.emRelation.trim(),
      emPhone: formData.emPhone.trim(),
      terms: formData.terms,
    };

    dispatch(submitVolunteerAsync(payload) as any);
  };

  useEffect(() => {
    if (!volunteerSuccess) return;
    handleReset(true);
    dispatch(resetFormState());
  }, [volunteerSuccess, dispatch]);

  const handleReset = (afterSubmit = false) => {
    setFormData(EMPTY);
    setErrors({});
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }

    Toast.fire({
      icon: "success",
      title: afterSubmit
        ? "Thank you for volunteering! We'll be in touch soon."
        : "Form has been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-black text-[#f0b400]">
      <Header />

      <div className="w-full mx-auto px-4 py-10 md:p-16">
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-[#f0b400] mb-4 md:mb-12 leading-tight">
            Volunteer Registration
          </h1>
          <p className="text-[#f0b400]/80 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Join our team and help make this event a success! Sign up for a
            volunteer shift below.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-black border-2 border-[#f0b400]/40 p-6 md:p-12 shadow-2xl shadow-yellow-500/10 rounded-2xl"
        >
          {/* Section A - Your Information */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-lg md:text-xl">
              A
            </div>
            <h2 className="text-[#f0b400] text-xl md:text-2xl font-black tracking-widest uppercase">
              Your Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-[#f0b400] text-sm font-bold mb-2">
                Full Name *
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
                  errors.fullName
                    ? "border-red-500"
                    : "border-[#f0b400] focus:border-[#f0b400]"
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs font-semibold mt-1.5">
                  {errors.fullName}
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
                onChange={handleChange}
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
                maxLength={11}
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (___) ___-____"
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
          </div>

          <div className="h-0.5 bg-gradient-to-r from-[#f0b400]/40 to-transparent my-8 md:my-10" />

          {/* Section B - Shift */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-lg md:text-xl">
              B
            </div>
            <h2 className="text-[#f0b400] text-xl md:text-2xl font-black tracking-widest uppercase">
              Select Your Shift
            </h2>
          </div>

          <div className="mb-6">
            <label className="block text-[#f0b400] text-sm font-bold mb-2">
              Volunteer Slot *
            </label>
            <select
              name="slot"
              value={formData.slot}
              onChange={handleChange}
              className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none cursor-pointer transition ${
                errors.slot
                  ? "border-red-500"
                  : "border-[#f0b400] focus:border-[#f0b400]"
              }`}
            >
              <option value="">Select a time slot…</option>
              {VOLUNTEER_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.slot && (
              <p className="text-red-500 text-xs font-semibold mt-1.5">
                {errors.slot}
              </p>
            )}
          </div>

          <div className="h-0.5 bg-gradient-to-r from-[#f0b400]/40 to-transparent my-8 md:my-10" />

          {/* Section C - Emergency Contact */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-lg md:text-xl">
              C
            </div>
            <h2 className="text-[#f0b400] text-xl md:text-2xl font-black tracking-widest uppercase">
              Emergency Contact
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-[#f0b400] text-sm font-bold mb-2">
                Contact Name *
              </label>
              <input
                name="emName"
                value={formData.emName}
                onChange={handleChange}
                placeholder="Emergency contact name"
                className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
                  errors.emName
                    ? "border-red-500"
                    : "border-[#f0b400] focus:border-[#f0b400]"
                }`}
              />
              {errors.emName && (
                <p className="text-red-500 text-xs font-semibold mt-1.5">
                  {errors.emName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#f0b400] text-sm font-bold mb-2">
                Relation *
              </label>
              <input
                name="emRelation"
                value={formData.emRelation}
                onChange={handleChange}
                placeholder="e.g., Parent, Spouse, Friend"
                className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
                  errors.emRelation
                    ? "border-red-500"
                    : "border-[#f0b400] focus:border-[#f0b400]"
                }`}
              />
              {errors.emRelation && (
                <p className="text-red-500 text-xs font-semibold mt-1.5">
                  {errors.emRelation}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#f0b400] text-sm font-bold mb-2">
                Contact Phone *
              </label>
              <input
                name="emPhone"
                 maxLength={11}
                value={formData.emPhone}
                onChange={handleChange}
                placeholder="+1 (___) ___-____"
                className={`w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition ${
                  errors.emPhone
                    ? "border-red-500"
                    : "border-[#f0b400] focus:border-[#f0b400]"
                }`}
              />
              {errors.emPhone && (
                <p className="text-red-500 text-xs font-semibold mt-1.5">
                  {errors.emPhone}
                </p>
              )}
            </div>
          </div>

          <div className="h-0.5 bg-gradient-to-r from-[#f0b400]/40 to-transparent my-8 md:my-10" />

          {/* Terms */}
          <TermsCheckboxWithModal
            checked={formData.terms}
            error={errors.terms}
            onChange={(checked) =>
              setFormData((prev) => ({ ...prev, terms: checked }))
            }
          />


          <div className="flex flex-wrap gap-4 justify-center mt-8 md:mt-10">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 md:px-10 py-3.5 md:py-4 rounded-full text-sm md:text-base font-black tracking-wide shadow-xl shadow-yellow-400/40 hover:shadow-2xl hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting…" : "Register as Volunteer"}
            </button>
            <button
              type="button"
              onClick={() => handleReset(false)}
              className="bg-transparent text-[#f0b400] px-8 md:px-10 py-3.5 md:py-4 rounded-full border-2 border-[#f0b400] text-sm md:text-base font-bold hover:bg-[#f0b400] hover:text-black transition"
            >
              Clear Form
            </button>
          </div>

          <p className="text-[#f0b400]/70 text-xs mt-8 text-center">
            Thank you for your interest in volunteering! We will contact you
            with more details before the event.
          </p>
        </form>
      </div>
    </div>
  );
};

export default VolunteerForm;
