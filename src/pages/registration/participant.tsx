"use client";

import Header from "@/components/Homepage.tsx/header";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "@/hooks/hooks";
import { submitParticipantAsync } from "@/services/auth/asyncThunk";
import Toast from "@/components/Toast";

const ParticipantSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  dob: Yup.date().required("DOB is required"),
  category: Yup.string()
    .oneOf(["Dance", "Musical Chair", "Guess the country name", "Other"])
    .required("Choose a category"),
  ageGroup: Yup.string().oneOf(["Adults", "Kids"]).required("Pick age group"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Enter a valid 10-digit Canadian phone number")
    .required("Contact number is required"),
  heardVia: Yup.array().min(1, "Pick at least one option"),
  excitement: Yup.number().min(1).max(5).required("Rate excitement"),
  terms: Yup.boolean().oneOf([true], "Please accept the terms"),
});

const initialValues = {
  name: "",
  email: "",
  dob: "",
  category: "",
  ageGroup: "",
  phone: "",
  heardVia: [] as string[],
  excitement: "",
  instagram: "",
  terms: false,
};

export default function ParticipantsForm() {
  const dispatch = useAppDispatch();

  return (
    <div className="min-h-screen bg-black text-[#f0b400]">
      <Header />

      {/* Responsive outer padding */}
      <div className="w-full mx-auto px-4 py-10 md:p-16">
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-[#f0b400] mb-4 md:mb-12 leading-tight">
            Participants Registration
          </h1>
          <p className="text-[#f0b400]/80 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Register to take part in our activities and competitions.
          </p>
        </div>

        {/* Responsive card */}
        <div className="bg-black border-2 border-[#f0b400]/40 p-6 md:p-12 shadow-2xl shadow-yellow-500/10 rounded-2xl">
          <Formik
            initialValues={initialValues}
            validationSchema={ParticipantSchema}
            onSubmit={async (vals, { resetForm, setSubmitting }) => {
              const payload = {
                name: vals.name.trim(),
                email: vals.email.trim().toLowerCase(),
                dob: vals.dob,
                category: vals.category,
                ageGroup: vals.ageGroup,
                phone: vals.phone.trim(),
                heardVia: vals.heardVia,
                excitement: Number(vals.excitement),
                instagram: vals.instagram.trim(),
                terms: vals.terms,
              };

              try {
                const action = await dispatch(
                  submitParticipantAsync(payload) as any
                );

                if (submitParticipantAsync.fulfilled.match(action)) {
                  resetForm();
                  Toast.fire({
                    icon: "success",
                    title: "Participant is added!",
                  });
                } else if (submitParticipantAsync.rejected.match(action)) {
                  const errMsg =
                    (action.payload as any)?.message ||
                    "Failed to submit registration. Please try again.";
                  Toast.fire({
                    icon: "error",
                    title: errMsg,
                  });
                }
              } catch (error: any) {
                Toast.fire({
                  icon: "error",
                  title:
                    error?.message ||
                    "Failed to submit registration. Please try again.",
                });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form>
                {/* A. Basic */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-lg md:text-xl">
                    A
                  </div>
                  <h2 className="text-[#f0b400] text-xl md:text-2xl font-black tracking-widest uppercase">
                    Your Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Name */}
                  <div>
                    <label className="block text-[#f0b400] text-sm font-bold mb-2">
                      Name *
                    </label>
                    <Field
                      name="name"
                      placeholder="e.g., Ayesha Khan"
                      className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition border-[#f0b400] focus:border-[#f0b400]"
                    />
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="text-red-500 text-xs font-semibold mt-1.5"
                    />
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-[#f0b400] text-sm font-bold mb-2">
                      Email *
                    </label>
                    <Field
                      name="email"
                      type="email"
                      placeholder="e.g., you@example.com"
                      className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition border-[#f0b400] focus:border-[#f0b400]"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-500 text-xs font-semibold mt-1.5"
                    />
                  </div>
                  {/* DOB */}
                  <div>
                    <label className="block text-[#f0b400] text-sm font-bold mb-2">
                      DOB *
                    </label>
                    <Field
                      name="dob"
                      type="date"
                      placeholder="Select your date of birth"
                      className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition border-[#f0b400] focus:border-[#f0b400]"
                    />
                    <ErrorMessage
                      name="dob"
                      component="p"
                      className="text-red-500 text-xs font-semibold mt-1.5"
                    />
                  </div>
                </div>

                <div className="h-0.5 bg-gradient-to-r from-[#f0b400]/40 to-transparent my-8 md:my-10" />

                {/* B. Activity Selection */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-lg md:text-xl">
                    B
                  </div>
                  <h2 className="text-[#f0b400] text-xl md:text-2xl font-black tracking-widest uppercase">
                    Activity Selection
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Category */}
                  <div>
                    <label className="block text-[#f0b400] text-sm font-bold mb-2">
                      Category *
                    </label>
                    <Field
                      as="select"
                      name="category"
                      className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition border-[#f0b400] focus:border-[#f0b400]"
                    >
                      <option value="">Select an activity…</option>
                      <option>Dance</option>
                      <option>Musical Chair</option>
                      <option>Guess the country name</option>
                      <option>Other</option>
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="p"
                      className="text-red-500 text-xs font-semibold mt-1.5"
                    />
                  </div>

                  {/* Age group */}
                  <div>
                    <label className="block text-[#f0b400] text-sm font-bold mb-2">
                      Age group *
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {["Adults", "Kids"].map((a) => (
                        <label
                          key={a}
                          className={`inline-flex items-center gap-2 px-4 py-3 rounded-full border-2 cursor-pointer ${
                            values.ageGroup === a
                              ? "border-[#f0b400] bg-black"
                              : "border-[#f0b400]/40 bg-black"
                          }`}
                        >
                          <input
                            type="radio"
                            name="ageGroup"
                            value={a}
                            checked={values.ageGroup === a}
                            onChange={(e) =>
                              setFieldValue("ageGroup", e.target.value)
                            }
                            className="accent-[#f0b400]"
                          />
                          <span className="text-[#f0b400] text-sm font-semibold">
                            {a}
                          </span>
                        </label>
                      ))}
                    </div>
                    <ErrorMessage
                      name="ageGroup"
                      component="p"
                      className="text-red-500 text-xs font-semibold mt-1.5"
                    />
                  </div>

                  {/* Phone – digits only, max 10 */}
                  <div>
                    <label className="block text-[#f0b400] text-sm font-bold mb-2">
                      Contact Number (Canada) *
                    </label>
                    <Field name="phone">
                      {({ field, form }: any) => (
                        <input
                          {...field}
                          placeholder="e.g., 6471234567"
                          inputMode="numeric"
                          maxLength={10}
                          onChange={(e) => {
                            const onlyDigits = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10);
                            form.setFieldValue("phone", onlyDigits);
                          }}
                          className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition border-[#f0b400] focus:border-[#f0b400]"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="phone"
                      component="p"
                      className="text-red-500 text-xs font-semibold mt-1.5"
                    />
                  </div>
                </div>

                <div className="h-0.5 bg-gradient-to-r from-[#f0b400]/40 to-transparent my-8 md:my-10" />

                {/* C. Survey */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-lg md:text-xl">
                    C
                  </div>
                  <h2 className="text-[#f0b400] text-xl md:text-2xl font-black tracking-widest uppercase">
                    Quick Survey
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Heard via */}
                  <div className="md:col-span-2">
                    <label className="block text-[#f0b400] text-sm font-bold mb-2">
                      How did you hear about us? *
                    </label>
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        "Social Media",
                        "Friend/Family",
                        "Website",
                        "Advertisement",
                        "Other",
                      ].map((opt) => (
                        <label
                          key={opt}
                          className="inline-flex items-center gap-2 px-4 py-3 bg-black border-2 border-[#f0b400]/40 rounded-full cursor-pointer"
                        >
                          <Field
                            type="checkbox"
                            name="heardVia"
                            value={opt}
                            className="accent-[#f0b400]"
                          />
                          <span className="text-[#f0b400] text-sm font-semibold">
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                    <ErrorMessage
                      name="heardVia"
                      component="p"
                      className="text-red-500 text-xs font-semibold mt-1.5"
                    />
                  </div>

                  {/* Excitement */}
                  <div>
                    <label className="block text-[#f0b400] text-sm font-bold mb-2">
                      Excitement (1–5) *
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <label
                          key={n}
                          className="inline-flex items-center gap-2"
                        >
                          <Field
                            type="radio"
                            name="excitement"
                            value={String(n)}
                            className="accent-[#f0b400]"
                          />
                          <span className="text-[#f0b400] text-sm">{n}</span>
                        </label>
                      ))}
                    </div>
                    <ErrorMessage
                      name="excitement"
                      component="p"
                      className="text-red-500 text-xs font-semibold mt-1.5"
                    />
                  </div>
                </div>

                {/* Instagram */}
                <div className="mb-6">
                  <label className="block text-[#f0b400] text-sm font-bold mb-2">
                    Instagram (optional)
                  </label>
                  <Field
                    name="instagram"
                    placeholder="@yourhandle"
                    className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 border-[#f0b400] rounded-xl outline-none focus:border-[#f0b400]"
                  />
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 p-4 md:p-5 bg-black rounded-xl border-2 border-[#f0b400]">
                  <Field
                    type="checkbox"
                    name="terms"
                    className="mt-1 accent-[#f0b400]"
                  />
                  <span className="text-sm text-[#f0b400]">
                    I agree to event rules and photo/video release.
                  </span>
                </div>
                <ErrorMessage
                  name="terms"
                  component="p"
                  className="text-red-500 text-xs font-semibold mt-1.5"
                />

                <div className="flex flex-wrap gap-4 justify-center mt-8 md:mt-10">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 md:px-10 py-3.5 md:py-4 rounded-full text-sm md:text-base font-black tracking-wide shadow-xl shadow-yellow-400/40 hover:shadow-2xl hover:scale-105 transition disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting…" : "Register"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
