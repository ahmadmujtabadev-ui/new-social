"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Homepage.tsx/header";
import { TermsCheckboxWithModal } from "@/components/common/TermsModal";
import { BOOTH_KEY, DEFAULT_PRICING, SCROLL_KEY } from "@/lib/vendorformconfig";
import ContactBusinessSection from "@/components/vendor/ContactBusinessSection";
import CategorySection from "@/components/vendor/CategorySection";
import BoothAndPaymentSection from "@/components/vendor/BoothAndPaymentSection";

// Custom hooks
import { useFormState } from "@/hooks/useFormState";
import { useBoothManagement } from "@/hooks/useBoothMaangement";
import { usePromoCode } from "@/hooks/usePromoCode";
import { validateForm } from "@/utils/vendor/formValidations";
import { createSubmissionPayload, submitToFormspark } from "@/utils/vendor/formSubmission";

const VendorForm: React.FC = () => {
  const router = useRouter();

  // Custom hooks
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    handleFile,
    resetForm,
  } = useFormState();

  const {
    bookedBooths,
    isCheckingBooth,
    checkBoothAvailability,
    saveBoothToSheet,
    fetchBookedBooths,
  } = useBoothManagement();

  // Calculate base price
  const basePrice = useMemo(() => {
    const currentBoothNumber = formData.boothNumber;
    const stored = typeof window !== 'undefined' ? localStorage.getItem(BOOTH_KEY) : null;

    if (stored) {
      try {
        const booth = JSON.parse(stored) as { price?: number; id?: number };
        if (
          typeof booth?.price === 'number' &&
          (!currentBoothNumber || String(booth.id) === currentBoothNumber)
        ) {
          return booth.price;
        }
      } catch {
        if (formData.category) return DEFAULT_PRICING[formData.category];
        return 0;
      }
    }

    if (formData.category) return DEFAULT_PRICING[formData.category];
    return 0;
  }, [formData.category, formData.boothNumber]);

  const {
    appliedPromo,
    promoError,
    setPromoError,
    discountedPrice,
    applyPromo,
    removePromo,
    getDiscountAmount,
    discountLabel,
  } = usePromoCode(basePrice);

  // Local state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<string | null>(null);
  const [showBoothSuccess, setShowBoothSuccess] = useState(false);

  // Load booth from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(BOOTH_KEY);
      if (!raw) return;

      const booth = JSON.parse(raw) as {
        id: number;
        category: "food" | "clothing" | "jewelry" | "craft";
        price?: number;
      };

      const boothId = String(booth.id);
      if (bookedBooths.has(boothId)) {
        localStorage.removeItem(BOOTH_KEY);
        setErrors((prev) => ({
          ...prev,
          boothNumber: "This booth is no longer available. Please select another.",
        }));
        return;
      }

      setFormData((f) => ({ ...f, boothNumber: boothId }));
      setShowBoothSuccess(true);
      setTimeout(() => setShowBoothSuccess(false), 5000);
    } catch {
      return;
    }
  }, [bookedBooths, setFormData, setErrors]);

  // Restore scroll position
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem(SCROLL_KEY);
    if (savedScrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
        sessionStorage.removeItem(SCROLL_KEY);
      }, 100);
    }
  }, []);

  const goToMap = () => {
    const cat = formData.category
      ? `?category=${encodeURIComponent(formData.category)}`
      : "";
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
      }
    } catch {
      return;
    }
    router.push(`/booking/page${cat}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccessMessage(null);

    // Validate form
    const validation = validateForm(formData, bookedBooths);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Double-check booth availability
    const availabilityCheck = await checkBoothAvailability(formData.boothNumber);
    if (!availabilityCheck.available) {
      setErrors((prev) => ({
        ...prev,
        boothNumber: availabilityCheck.message || "This booth is not available.",
      }));
      setSubmitError(availabilityCheck.message || "The booth is already selected.");
      return;
    }

    // Create submission payload
    const payload = createSubmissionPayload(
      formData,
      basePrice,
      discountedPrice,
      appliedPromo,
      getDiscountAmount
    );

    try {
      setIsSubmitting(true);

      // Save booth to SheetDB first
      const boothResult = await saveBoothToSheet(
        formData.boothNumber,
        formData.category
      );

      if (!boothResult.success) {
        setSubmitError(boothResult.message || "Failed to reserve the booth. Please try again.");
        return;
      }

      // Submit to Formspark
      const result = await submitToFormspark(payload);

      if (!result.success) {
        setSubmitError(result.error || "Submission failed");
        return;
      }

      // Calculate hold until time
      // const heldUntil = new Date(new Date().getTime() + HOLD_MS);

      setSubmitSuccessMessage(
        `Thank you for applying! Your booth is reserved for the next 48 hours. Please complete the next steps we send you to confirm your booking.`
      );

      // Refresh booked booths
      await fetchBookedBooths();

      // Reset form
      resetForm(true);
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError(
        "Network error while submitting. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetClick = () => {
    resetForm(false);
    setSubmitError(null);
    setSubmitSuccessMessage(null);
  };

  const discountAmount = getDiscountAmount();

  return (
    <div className="min-h-screen bg-black from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <div className="relative w-full mx-auto px-20 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-yellow-400 via-pink-400 to-purple-400 mb-4">
            Vendor Registration
          </h1>
          <p className="text-gray-300 text-lg">
            Submit your application so we can review exclusivity and confirm next steps.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <ContactBusinessSection
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onFileChange={handleFile}
          />

          <CategorySection
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onFileChange={handleFile}
          />

          <BoothAndPaymentSection
            formData={formData}
            errors={errors}
            basePrice={basePrice}
            discountedPrice={discountedPrice}
            appliedPromo={appliedPromo}
            promoError={promoError}
            discountAmount={discountAmount}
            onChange={handleChange}            // ✅ add this
            discountLabel={discountLabel}
            showBoothSuccess={showBoothSuccess}
            onGoToMap={goToMap}
            onClearBooth={() => {
              setFormData((f) => ({ ...f, boothNumber: "" }));
              try {
                localStorage.removeItem(BOOTH_KEY);
              } catch {
                return;
              }
            }}
            onPromoChange={(value) => {
              setFormData((f) => ({ ...f, promoCode: value }));
              setPromoError("");
            }}
            onApplyPromo={() => applyPromo(formData.promoCode)}
            onRemovePromo={removePromo}
          />

          {isCheckingBooth && (
            <div className="text-center text-yellow-400 font-semibold">
              Checking booth availability...
            </div>
          )}

          <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
            <label className="block text-gray-300 font-semibold mb-2">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Any additional information you'd like to share..."
            />
          </div>

          <TermsCheckboxWithModal
            checked={formData.terms}
            error={errors.terms}
            onChange={(checked) =>
              setFormData((prev) => ({ ...prev, terms: checked }))
            }
          />

          {submitError && (
            <p className="text-red-500 text-center text-sm font-semibold mt-6">
              {submitError}
            </p>
          )}

          {submitSuccessMessage && (
            <p className="text-emerald-400 text-center text-sm font-semibold mt-6 max-w-2xl mx-auto">
              {submitSuccessMessage}
            </p>
          )}

          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <button
              type="submit"
              disabled={isSubmitting || isCheckingBooth}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-10 py-4 rounded-full text-base font-black tracking-wide shadow-xl shadow-yellow-400/40 hover:shadow-2xl hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting…" : "Submit for Review"}
            </button>

            <button
              type="button"
              onClick={handleResetClick}
              className="bg-transparent text-[#f0b400] px-10 py-4 rounded-full border-2 border-[#f0b400] text-base font-bold hover:bg-[#f0b400] hover:text-black transition"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorForm;

//. remove backend use spreadsheet and sheetdb for endpoints and use spartform for form saving 

///first thing to explain

/// vendor page 1400 + lines ka tha ham ne 340 lines 
/// custom hooks + code ko split kiya ha new components me 
/// contact business wala compoent separate kiya ha 
/// category section ko sepate component me divide kiya ha 
/// boothandpayment section ko separete compoent me use kiya ha 

///second thing to explain 

/// react js ke ander custom hooks hoty han 
/// useformhook taky ham is components ke form ke sare functions ko separate hook se manage kr skty, jis me all form data , errors , file handling 
/// useboothselection hook is me ham booth selection ke sare fuctions ko use kr rhy han jis me 

