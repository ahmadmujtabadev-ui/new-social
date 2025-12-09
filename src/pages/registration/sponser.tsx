import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { useDispatch } from "react-redux"; // 👇 Redux import

import Header from "@/components/Homepage.tsx/header";
import { TermsCheckboxWithModal } from "@/components/common/TermsModal";
import Toast from "@/components/Toast";

// 👇 Updated Imports
import { API_BASE_URL } from "@/config/apiconfig";
import { 
  submitSponsorAsync, 
  fetchSponsorsAsync 
} from "@/services/auth/asyncThunk"; // Adjust path to where you saved the thunks

// 👇 Interface definitions
const TIERS = [
  {
    id: "Platinum" as const,
    displayName: "PLATINUM SPONSOR",
    price: "$750",
    perks: [
      "Premium booth in prime location",
      "Logo featured on all promotional material",
      "Stage acknowledgment during event",
      "Sponsor banner displayed at entrance",
      "Dedicated social media feature post + story",
      "20 complimentary raffle tickets",
    ],
    gradient: "from-yellow-400 to-yellow-600",
  },
  {
    id: "Gold" as const,
    displayName: "GOLD SPONSOR",
    price: "$500",
    perks: [
      "Standard booth space",
      "Logo included on social media and flyers",
      "Recognized during sponsor thank-you announcements",
      "Shared social media story mention",
      "10 complimentary raffle tickets",
    ],
    gradient: "from-yellow-300 to-yellow-500",
  },
  {
    id: "Silver" as const,
    displayName: "SILVER SPONSOR",
    price: "$250",
    perks: [
      "Name listed on sponsor banner",
      "Limited logo presence on social media flyer",
      "Shared sponsor acknowledgment post",
      "Promotional cards displayed at shared sponsor table",
    ],
    gradient: "from-yellow-200 to-yellow-400",
  },
];

const SponsorSchema = Yup.object({
  businessName: Yup.string().trim().required("Business name is required"),
  ownerName: Yup.string().trim().required("Owner name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(
      /^(\+?\d{1,4}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?[\d\s-]{6,}$/,
      "Enter a valid phone number"
    )
    .required("Phone is required"),
  oneLiner: Yup.string().max(140, "Keep it under 140 chars"),
  instagram: Yup.string()
    .matches(/^@?[\w.]+$/, "Invalid Instagram handle (e.g., @yourbusiness)")
    .max(30, "Instagram handle too long"),
  facebook: Yup.string()
    .matches(/^[\w.]+$/, "Invalid Facebook handle (no spaces or special chars)")
    .max(50, "Facebook handle too long"),
  category: Yup.string()
    .oneOf(["Platinum", "Gold", "Silver"])
    .required("Please choose a tier"),
  comments: Yup.string().max(500, "Comments must be under 500 characters"),
  terms: Yup.boolean().oneOf([true], "You must accept the terms"),
});

interface SponsorFormValues {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  oneLiner: string;
  instagram: string;
  facebook: string;
  category: "Platinum" | "Gold" | "Silver";
  logoFile: File | null;
  comments: string;
  terms: boolean;
}

interface Sponsor {
  _id: string;
  businessName: string;
  category: string;
  oneLiner: string;
  instagram: string;
  facebook: string;
  logoPath: string | null;
}

const initialValues: SponsorFormValues = {
  businessName: "",
  ownerName: "",
  email: "",
  phone: "",
  oneLiner: "",
  instagram: "",
  facebook: "",
  category: "Platinum",
  logoFile: null,
  comments: "",
  terms: false,
};

const SponsorForm: React.FC = () => {
  const dispatch = useDispatch<any>(); // Using 'any' to avoid strict store typing issues
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ✅ 1. Fetch Sponsors on Load using the Thunk
  useEffect(() => {
    const loadSponsors = async () => {
      try {
        // Dispatch fetch action and unwrap result
        const result = await dispatch(fetchSponsorsAsync({})).unwrap();
        if (result && Array.isArray(result.sponsors)) {
          setSponsors(result.sponsors);
        } else if (Array.isArray(result)) {
           // Handle case where API returns array directly
           setSponsors(result);
        }
      } catch (err) {
        console.error("Failed to load sponsors", err);
      }
    };
    loadSponsors();
  }, [dispatch]);

  // ✅ 2. Handle Submit using Redux Thunk
  const handleSubmit = async (
    values: SponsorFormValues,
    { resetForm, setSubmitting }: FormikHelpers<SponsorFormValues>
  ) => {
    try {
      setIsLoading(true);

      // We pass the raw values object. 
      // The thunk 'submitSponsorAsync' handles FormData conversion.
      const result = await dispatch(submitSponsorAsync(values)).unwrap();

      const saved = result?.sponsor as Sponsor | undefined;

      if (saved) {
        setSponsors((prev) => [
          ...prev,
          {
            _id: saved._id,
            businessName: saved.businessName,
            category: saved.category,
            oneLiner: saved.oneLiner,
            instagram: saved.instagram,
            facebook: saved.facebook,
            logoPath: saved.logoPath,
          },
        ]);
      }

      resetForm();
      setLogoPreview(null);

      Toast.fire({
        icon: "success",
        title: result?.message || "Sponsor application submitted successfully!",
      });

    } catch (err: any) {
      console.error("[SPONSOR] Submission error:", err);
      Toast.fire({
        icon: "error",
        title: err?.message || "Error submitting form. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#f0b400]">
      <Header />

      <div className="w-full mx-auto px-4 py-10 md:p-16">
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-[#f0b400] mb-4 md:mb-12 leading-tight">
            Become a Sponsor
          </h1>
          <p className="text-[#f0b400]/80 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Support the festival and get your brand in front of our community.
            Choose a tier, share your details, and upload your logo—easy.
          </p>
        </div>

        <div className="bg-black border-2 border-[#f0b400]/40 p-6 md:p-12 shadow-2xl shadow-yellow-500/10 rounded-2xl">
          <Formik
            initialValues={initialValues}
            validationSchema={SponsorSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, values, errors }) => (
              <Form>
                {/* SECTION A - Business Details */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-lg md:text-xl">
                    A
                  </div>
                  <h2 className="text-[#f0b400] text-xl md:text-2xl font-black tracking-widest uppercase">
                    Business Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[#f0b400] text-sm font-bold mb-2">
                      Business Name *
                    </label>
                    <Field
                      name="businessName"
                      placeholder="e.g., Lumi Designs"
                      className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition border-[#f0b400] focus:border-[#f0b400]"
                    />
                    <ErrorMessage
                      name="businessName"
                      component="p"
                      className="text-red-500 text-xs font-semibold mt-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-[#f0b400] text-sm font-bold mb-2">
                      Owner Name *
                    </label>
                    <Field
                      name="ownerName"
                      placeholder="e.g., Jane Doe"
                      className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition border-[#f0b400] focus:border-[#f0b400]"
                    />
                    <ErrorMessage
                      name="ownerName"
                      component="p"
                      className="text-red-500 text-xs font-semibold mt-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-[#f0b400] text-sm font-bold mb-2">
                      Email *
                    </label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition border-[#f0b400] focus:border-[#f0b400]"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-500 text-xs font-semibold mt-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-[#f0b400] text-sm font-bold mb-2">
                      Phone *
                    </label>
                    <Field
                      name="phone"
                       maxLength={11}
                      placeholder="+1 (___) ___-____"
                      className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition border-[#f0b400] focus:border-[#f0b400]"
                    />
                    <ErrorMessage
                      name="phone"
                      component="p"
                      className="text-red-500 text-xs font-semibold mt-1.5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[#f0b400] text-sm font-bold mb-2">
                      Define business in one line
                    </label>
                    <Field
                      name="oneLiner"
                      placeholder="A short tagline for your business"
                      className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition border-[#f0b400] focus:border-[#f0b400]"
                    />
                    <ErrorMessage
                      name="oneLiner"
                      component="p"
                      className="text-red-500 text-xs font-semibold mt-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-[#f0b400] text-sm font-bold mb-2">
                      Instagram Handle
                    </label>
                    <Field
                      name="instagram"
                      placeholder="@yourbusiness"
                      className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition border-[#f0b400] focus:border-[#f0b400]"
                    />
                    <ErrorMessage
                      name="instagram"
                      component="p"
                      className="text-red-500 text-xs font-semibold mt-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-[#f0b400] text-sm font-bold mb-2">
                      Facebook Handle
                    </label>
                    <Field
                      name="facebook"
                      placeholder="yourbusiness"
                      className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition border-[#f0b400] focus:border-[#f0b400]"
                    />
                    <ErrorMessage
                      name="facebook"
                      component="p"
                      className="text-red-500 text-xs font-semibold mt-1.5"
                    />
                  </div>
                </div>

                <div className="h-0.5 bg-gradient-to-r from-[#f0b400]/40 to-transparent my-8 md:my-10" />

                {/* SECTION B - Tier Plan */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-lg md:text-xl">
                    B
                  </div>
                  <h2 className="text-[#f0b400] text-xl md:text-2xl font-black tracking-widest uppercase">
                    Choose Your Tier
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {TIERS.map((t) => {
                    const selected = values.category === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFieldValue("category", t.id)}
                        className={`group text-left rounded-2xl border-2 p-5 md:p-6 transition relative bg-black
                          ${
                            selected
                              ? "border-[#f0b400] shadow-xl shadow-yellow-500/30"
                              : "border-[#f0b400]/40 hover:border-[#f0b400]"
                          }`}
                      >
                        <div
                          className={`inline-flex items-center justify-center px-3 py-1 text-[11px] md:text-xs font-black text-black rounded-full bg-gradient-to-r ${t.gradient} mb-3 md:mb-4`}
                        >
                          {t.displayName}
                        </div>
                        <div className="text-2xl md:text-3xl font-black text-[#f0b400] mb-2">
                          {t.price}
                        </div>
                        <ul className="space-y-1.5 text-xs md:text-sm text-[#f0b400]/85">
                          {t.perks.map((p) => (
                            <li key={p} className="flex items-start gap-2">
                              <span className="mt-1 h-2 w-2 rounded-full bg-[#f0b400] inline-block" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                        {selected && (
                          <div className="absolute right-3 top-3 md:right-4 md:top-4 text-[#f0b400] font-black">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <ErrorMessage
                  name="category"
                  component="p"
                  className="text-red-500 text-xs font-semibold -mt-4 mb-6"
                />

                <div className="h-0.5 bg-gradient-to-r from-[#f0b400]/40 to-transparent my-8 md:my-10" />

                {/* SECTION C - Logo, Comments & Terms */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-lg md:text-xl">
                    C
                  </div>
                  <h2 className="text-[#f0b400] text-xl md:text-2xl font-black tracking-widest uppercase">
                    Logo, Comments & Confirmation
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[#f0b400] text-sm font-bold mb-2">
                      Business Logo (PNG/JPG/SVG, &lt; 2MB)
                    </label>
                    <input
                      id="logoFile"
                      name="logoFile"
                      type="file"
                      accept="image/*"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file =
                          (e.target.files && e.target.files[0]) || null;
                        setFieldValue("logoFile", file);
                        setLogoPreview(file ? URL.createObjectURL(file) : null);
                      }}
                      className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 border-[#f0b400] rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0b400] file:text-black hover:file:bg-yellow-500"
                    />
                    <ErrorMessage
                      name="logoFile"
                      component="p"
                      className="text-red-500 text-xs font-semibold mt-1.5"
                    />
                    {logoPreview && (
                      <div className="mt-3">
                        <Image
                          src={logoPreview}
                          alt="Logo preview"
                          width={112}
                          height={112}
                          className="h-24 w-24 md:h-28 md:w-28 object-contain border border-[#f0b400] rounded-xl bg-black"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#f0b400] text-sm font-bold mb-2">
                      Comments (Optional)
                    </label>
                    <Field
                      as="textarea"
                      name="comments"
                      placeholder="Any additional information or special requests..."
                      rows={4}
                      className="w-full px-4 py-3.5 text-sm text-white bg-black border-2 rounded-xl outline-none transition border-[#f0b400] focus:border-[#f0b400] resize-none"
                    />
                    <div className="flex justify-between items-center mt-1.5">
                      <ErrorMessage
                        name="comments"
                        component="p"
                        className="text-red-500 text-xs font-semibold"
                      />
                      <span className="text-xs text-[#f0b400]/70">
                        {values.comments.length}/500
                      </span>
                    </div>
                  </div>
                </div>

                <TermsCheckboxWithModal
                  checked={values.terms}
                  error={typeof errors.terms === "string" ? errors.terms : ""}
                  onChange={(checked) => setFieldValue("terms", checked)}
                />

                <div className="flex flex-wrap gap-4 justify-center mt-8 md:mt-10">
                  <button
                    type="submit"
                    disabled={isLoading || isSubmitting}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 md:px-10 py-3.5 md:py-4 rounded-full text-sm md:text-base font-black tracking-wide shadow-xl shadow-yellow-400/40 hover:shadow-2xl hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading || isSubmitting
                      ? "Submitting…"
                      : "Submit Sponsorship"}
                  </button>
                  <button
                    type="reset"
                    onClick={() => {
                      setFieldValue("logoFile", null);
                      setLogoPreview(null);
                    }}
                    className="bg-transparent text-[#f0b400] px-8 md:px-10 py-3.5 md:py-4 rounded-full border-2 border-[#f0b400] text-sm md:text-base font-bold hover:bg-[#f0b400] hover:text-black transition"
                  >
                    Clear Form
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Sponsors Wall */}
        <section className="mt-12 md:mt-16">
          <h2 className="text-[#f0b400] text-xl md:text-2xl font-black tracking-widest uppercase text-center mb-6">
            Our Sponsors
          </h2>
          <div className="grid gap-6 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {sponsors.length === 0 ? (
              <div className="text-[#f0b400]/70 text-center col-span-full">
                Sponsor logos will appear here after submission.
              </div>
            ) : (
              sponsors.map((s) => (
                <article
                  key={s._id}
                  title={`${s.businessName} — ${s.category}`}
                  className="border-2 border-[#f0b400]/60 rounded-2xl bg-black p-4 md:p-5 flex flex-col items-center justify-center text-center"
                >
                  <div className="text-[11px] md:text-xs font-black text-[#f0b400] mb-2">
                    {s.category}
                  </div>
                  <div className="w-24 h-16 md:w-28 md:h-20 flex items-center justify-center mb-3 bg-black">
                    {s.logoPath ? (
                      <img
                        /* 👇 Updated: Uses API_BASE_URL via backticks */
                        src={`${API_BASE_URL}${s.logoPath}`}
                        alt={`${s.businessName} logo`}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-[#f0b400]/60 text-xs">No logo</div>
                    )}
                  </div>
                  <div className="font-semibold text-white text-sm md:text-base">
                    {s.businessName}
                  </div>
                  {s.oneLiner && (
                    <div className="text-[11px] md:text-xs text-[#f0b400]/80 mt-1">
                      {s.oneLiner}
                    </div>
                  )}
                  {(s.instagram || s.facebook) && (
                    <div className="flex gap-2 mt-2 text-lg">
                      {s.instagram && (
                        <a
                          href={`https://instagram.com/${s.instagram.replace(
                            "@",
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#f0b400] hover:text-yellow-300"
                        >
                          📷
                        </a>
                      )}
                      {s.facebook && (
                        <a
                          href={`https://facebook.com/${s.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#f0b400] hover:text-yellow-300"
                        >
                          📘
                        </a>
                      )}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SponsorForm;
