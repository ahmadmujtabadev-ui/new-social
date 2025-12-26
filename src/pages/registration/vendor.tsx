"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import Header from "@/components/Homepage.tsx/header";
import { TermsCheckboxWithModal } from "@/components/common/TermsModal";
import { BOOTH_KEY, SCROLL_KEY } from "@/lib/vendorformconfig";
import ContactBusinessSection from "@/components/vendor/ContactBusinessSection";
import BoothAndPaymentSection from "@/components/vendor/BoothAndPaymentSection";
import { resetFormState, selectForms } from "@/redux/slices/userSlice";
import { submitVendorAsync } from "@/services/auth/asyncThunk";
import CategorySection from "@/components/vendor/CategorySection";

// ============================================================================
// TYPES
// ============================================================================

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
  category: string;

  foodItems: string;
  needPowerFood: "" | "yes" | "no";
  foodWatts: string;
  foodPhotos: File[];

  clothingType: string;
  clothingPhotos: File[];

  jewelryType: string;
  jewelryPhotos: File[];

  craftDetails: string;
  needPowerCraft: "" | "yes" | "no";
  craftWatts: string;
  craftPhotos: File[];

  // ✅ PROMO FIELDS
  promoCode: string;
  amountToPay: number;
  appliedPromoCode: string;
  appliedPromoDiscount: number;
  appliedPromoType: "" | "percent" | "flat";

  boothNumber: string;
  notes: string;
  terms: boolean;
}

interface FileStore {
  businessLogo: File | null;
  foodPhotos: File[];
  clothingPhotos: File[];
  jewelryPhotos: File[];
  craftPhotos: File[];
}

// ============================================================================
// FILE STORAGE UTILITIES
// ============================================================================

const FILE_STORE_KEY = "vendorFormFiles";
const fileStore: { current: FileStore | null } = { current: null };

const saveFilesToMemory = (files: FileStore) => {
  fileStore.current = files;
  try {
    sessionStorage.setItem(
      FILE_STORE_KEY,
      JSON.stringify({
        businessLogo: files.businessLogo
          ? { name: files.businessLogo.name, size: files.businessLogo.size }
          : null,
        foodPhotos: files.foodPhotos.map((f) => ({ name: f.name, size: f.size })),
        clothingPhotos: files.clothingPhotos.map((f) => ({ name: f.name, size: f.size })),
        jewelryPhotos: files.jewelryPhotos.map((f) => ({ name: f.name, size: f.size })),
        craftPhotos: files.craftPhotos.map((f) => ({ name: f.name, size: f.size })),
      })
    );
  } catch (error) {
    console.error("Error saving file metadata:", error);
  }
};

const loadFilesFromMemory = (): FileStore => {
  if (fileStore.current) return fileStore.current;
  return {
    businessLogo: null,
    foodPhotos: [],
    clothingPhotos: [],
    jewelryPhotos: [],
    craftPhotos: [],
  };
};

const clearFilesFromMemory = () => {
  fileStore.current = null;
  try {
    sessionStorage.removeItem(FILE_STORE_KEY);
  } catch {}
};

// ============================================================================
// PRICING (same idea as old DEFAULT_PRICING)
// Adjust values if your pricing differs
// ============================================================================

const DEFAULT_PRICING: Record<string, number> = {
  "Food Vendor": 350,
  "Clothing Vendor": 200,
  "Jewelry Vendor": 200,
  "Craft Booth": 200,
};

const getBasePrice = (values: VendorFormValues) => {
  if (typeof window === "undefined") return 0;

  // Try selected booth price first
  try {
    const stored = localStorage.getItem(BOOTH_KEY);
    if (stored) {
      const booth = JSON.parse(stored) as { id?: number; price?: number };
      if (
        typeof booth?.price === "number" &&
        (!values.boothNumber || String(booth.id) === values.boothNumber)
      ) {
        return booth.price;
      }
    }
  } catch {}

  // Fallback to category default
  return values.category ? DEFAULT_PRICING[values.category] ?? 0 : 0;
};

// ============================================================================
// INITIAL VALUES
// ============================================================================

const createEmptyValues = (): VendorFormValues => ({
  personName: "",
  vendorName: "",
  email: "",
  phone: "",
  isOakville: "",
  selectedEvent: "",
  businessLogo: null,
  instagram: "",
  facebook: "",
  category: "",

  foodItems: "",
  needPowerFood: "",
  foodWatts: "",
  foodPhotos: [],

  clothingType: "",
  clothingPhotos: [],

  jewelryType: "",
  jewelryPhotos: [],

  craftDetails: "",
  needPowerCraft: "",
  craftWatts: "",
  craftPhotos: [],

  promoCode: "",
  amountToPay: 0,
  appliedPromoCode: "",
  appliedPromoDiscount: 0,
  appliedPromoType: "",

  boothNumber: "",
  notes: "",
  terms: false,
});

const getInitialValues = (): VendorFormValues => {
  if (typeof window === "undefined") return createEmptyValues();

  try {
    const savedData = sessionStorage.getItem("vendorFormDraft");
    const savedFiles = loadFilesFromMemory();

    if (!savedData) {
      return { ...createEmptyValues(), ...savedFiles };
    }

    const parsed = JSON.parse(savedData);
    return {
      ...createEmptyValues(),
      ...parsed,
      ...savedFiles,
    };
  } catch {
    return createEmptyValues();
  }
};

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const step1Schema = Yup.object({
  personName: Yup.string().required("Person name is required"),
  vendorName: Yup.string().required("Vendor name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  isOakville: Yup.string()
    .oneOf(["yes", "no"], "Please select Yes or No")
    .required("Please select Yes or No"),
  selectedEvent: Yup.string().required("Please select an event"),
});

const step2Schema = Yup.object({
  category: Yup.string().required("Please choose a category"),
  foodItems: Yup.string().when("category", {
    is: "Food Vendor",
    then: (schema) => schema.required("List up to 2 items"),
  }),
  needPowerFood: Yup.string().when("category", {
    is: "Food Vendor",
    then: (schema) =>
      schema.oneOf(["yes", "no"]).required("Power requirement is required"),
  }),
  foodWatts: Yup.string().when(["category", "needPowerFood"], {
    is: (category: string, needPower: string) =>
      category === "Food Vendor" && needPower === "yes",
    then: (schema) => schema.required("Specify equipment watts"),
  }),
  clothingType: Yup.string().when("category", {
    is: "Clothing Vendor",
    then: (schema) => schema.required("Tell us the type of clothes"),
  }),
  jewelryType: Yup.string().when("category", {
    is: "Jewelry Vendor",
    then: (schema) => schema.required("Tell us the jewelry type"),
  }),
  craftDetails: Yup.string().when("category", {
    is: "Craft Booth",
    then: (schema) => schema.required("Give some details about your items"),
  }),
  needPowerCraft: Yup.string().when("category", {
    is: "Craft Booth",
    then: (schema) =>
      schema.oneOf(["yes", "no"]).required("Power requirement is required"),
  }),
  craftWatts: Yup.string().when(["category", "needPowerCraft"], {
    is: (category: string, needPower: string) =>
      category === "Craft Booth" && needPower === "yes",
    then: (schema) => schema.required("Specify equipment watts"),
  }),
});

const step3Schema = Yup.object({
  boothNumber: Yup.string().required("Please select a booth on the map"),
  terms: Yup.boolean().oneOf([true], "Please accept the terms to proceed"),
});

const validationSchemas = [step1Schema, step2Schema, step3Schema];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const VendorForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading, vendorSuccess } = useSelector(selectForms);
  const [currentStep, setCurrentStep] = useState(1);
  const [showBoothSuccess, setShowBoothSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formikResetRef = useRef<(() => void) | null>(null);

  const filesRestoredRef = useRef(false);

  useEffect(() => {
    const savedStep = sessionStorage.getItem("vendorFormStep");
    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10));
      sessionStorage.removeItem("vendorFormStep");
    }
  }, []);

  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem(SCROLL_KEY);
    if (savedScrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
        sessionStorage.removeItem(SCROLL_KEY);
      }, 100);
    }
  }, []);

  // Handle successful submission
  useEffect(() => {
    if (vendorSuccess) {
      const clearForm = async () => {
        sessionStorage.removeItem("vendorFormDraft");
        sessionStorage.removeItem(FILE_STORE_KEY);
        sessionStorage.removeItem("vendorFormStep");
        sessionStorage.removeItem(SCROLL_KEY);
        localStorage.removeItem(BOOTH_KEY);
        clearFilesFromMemory();

        setCurrentStep(1);
        setSubmitError(null);
        setShowBoothSuccess(false);
        filesRestoredRef.current = false;

        await new Promise((resolve) => setTimeout(resolve, 100));

        if (formikResetRef.current) {
          formikResetRef.current();
        }

        window.scrollTo({ top: 0, behavior: "smooth" });

        setTimeout(() => {
          dispatch(resetFormState());
        }, 3000);
      };

      clearForm();
    }
  }, [vendorSuccess, dispatch]);

  const goToMap = (values: VendorFormValues) => {
    const cat = values.category ? `?category=${encodeURIComponent(values.category)}` : "";

    try {
      saveFilesToMemory({
        businessLogo: values.businessLogo,
        foodPhotos: values.foodPhotos,
        clothingPhotos: values.clothingPhotos,
        jewelryPhotos: values.jewelryPhotos,
        craftPhotos: values.craftPhotos,
      });

      const { businessLogo, foodPhotos, clothingPhotos, jewelryPhotos, craftPhotos, ...dataToSave } =
        values;

        console.log(businessLogo, foodPhotos, clothingPhotos, jewelryPhotos, craftPhotos)
      sessionStorage.setItem("vendorFormDraft", JSON.stringify(dataToSave));
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
      sessionStorage.setItem("vendorFormStep", String(currentStep));
    } catch (error) {
      console.error("Error saving form state:", error);
    }

    router.push(`/booking/page${cat}`);
  };

  const saveFormDraft = (values: VendorFormValues) => {
    try {
      const { businessLogo, foodPhotos, clothingPhotos, jewelryPhotos, craftPhotos, ...dataToSave } =
        values;
                console.log(businessLogo, foodPhotos, clothingPhotos, jewelryPhotos, craftPhotos)

      sessionStorage.setItem("vendorFormDraft", JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handleNext = async (values: VendorFormValues, helpers: FormikHelpers<VendorFormValues>) => {
    const currentSchema = validationSchemas[currentStep - 1];

    try {
      await currentSchema.validate(values, { abortEarly: false });

      saveFilesToMemory({
        businessLogo: values.businessLogo,
        foodPhotos: values.foodPhotos,
        clothingPhotos: values.clothingPhotos,
        jewelryPhotos: values.jewelryPhotos,
        craftPhotos: values.craftPhotos,
      });

      setCurrentStep((prev) => Math.min(prev + 1, 3));
      window.scrollTo({ top: 0, behavior: "smooth" });

      saveFormDraft(values);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) errors[err.path] = err.message;
        });
        helpers.setErrors(errors);
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAllFormState = () => {
    sessionStorage.removeItem("vendorFormDraft");
    sessionStorage.removeItem(FILE_STORE_KEY);
    sessionStorage.removeItem("vendorFormStep");
    sessionStorage.removeItem(SCROLL_KEY);
    localStorage.removeItem(BOOTH_KEY);
    clearFilesFromMemory();

    setCurrentStep(1);
    setSubmitError(null);
    setShowBoothSuccess(false);
    filesRestoredRef.current = false;
  };

    const handleSubmit = async (values: any, helpers: FormikHelpers<VendorFormValues>) => {
      console.log("values", values)
      setSubmitError(null);
      try {
        await dispatch(submitVendorAsync(values) as any);
        clearAllFormState();
        helpers.resetForm({ values: createEmptyValues() });
      } catch (error) {
        console.error("Submission error:", error);
        setSubmitError("An error occurred during submission. Please try again.");
      }
    };

  const handleReset = (resetForm: any) => {
    sessionStorage.removeItem("vendorFormDraft");
    sessionStorage.removeItem(FILE_STORE_KEY);
    sessionStorage.removeItem("vendorFormStep");
    sessionStorage.removeItem(SCROLL_KEY);
    localStorage.removeItem(BOOTH_KEY);
    clearFilesFromMemory();

    setSubmitError(null);
    setCurrentStep(1);
    setShowBoothSuccess(false);
    filesRestoredRef.current = false;

    resetForm({ values: createEmptyValues() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const steps = [
    { number: 1, title: "Business Details", description: "Contact & Business Information" },
    { number: 2, title: "Category", description: "Select Category & Details" },
    { number: 3, title: "Booth & Payment", description: "Select Booth & Review" },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="relative w-full mx-auto px-4 md:px-8 lg:px-20 py-16">
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10"></div>
          <h1 className="relative text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4">
            Vendor Registration
          </h1>
          <p className="relative text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            Complete this form to register as a vendor. Follow the 3-step process to complete your application.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-black text-lg md:text-xl transition-all duration-300 ${
                      currentStep === step.number
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black scale-110 shadow-lg shadow-yellow-400/50"
                        : currentStep > step.number
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="mt-2 text-center hidden md:block">
                    <p className={`text-sm font-bold ${currentStep >= step.number ? "text-yellow-400" : "text-gray-500"}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                      currentStep > step.number
                        ? "bg-gradient-to-r from-emerald-500 to-yellow-400"
                        : "bg-gray-700"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <p className="text-yellow-400 font-bold text-lg">{steps[currentStep - 1].title}</p>
            <p className="text-gray-400 text-sm">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        <Formik
          initialValues={getInitialValues()}
          validationSchema={validationSchemas[currentStep - 1]}
          onSubmit={handleSubmit}
          enableReinitialize={false}
        >
          {(formikProps) => {
            const { values, errors, touched, setFieldValue, resetForm } = formikProps;

            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
              if (!filesRestoredRef.current) {
                const savedFiles = loadFilesFromMemory();
                if (
                  savedFiles.businessLogo ||
                  savedFiles.foodPhotos.length > 0 ||
                  savedFiles.clothingPhotos.length > 0 ||
                  savedFiles.jewelryPhotos.length > 0 ||
                  savedFiles.craftPhotos.length > 0
                ) {
                  setFieldValue("businessLogo", savedFiles.businessLogo);
                  setFieldValue("foodPhotos", savedFiles.foodPhotos);
                  setFieldValue("clothingPhotos", savedFiles.clothingPhotos);
                  setFieldValue("jewelryPhotos", savedFiles.jewelryPhotos);
                  setFieldValue("craftPhotos", savedFiles.craftPhotos);
                }
                filesRestoredRef.current = true;
              }

              try {
                const raw = localStorage.getItem(BOOTH_KEY);
                if (raw) {
                  const booth = JSON.parse(raw);
                  setFieldValue("boothNumber", String(booth.id));
                  setShowBoothSuccess(true);
                  setTimeout(() => setShowBoothSuccess(false), 5000);
                }
              } catch {}
            }, [setFieldValue]);

            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
              const timer = setTimeout(() => {
                saveFilesToMemory({
                  businessLogo: values.businessLogo,
                  foodPhotos: values.foodPhotos,
                  clothingPhotos: values.clothingPhotos,
                  jewelryPhotos: values.jewelryPhotos,
                  craftPhotos: values.craftPhotos,
                });
                saveFormDraft(values);
              }, 1000);

              return () => clearTimeout(timer);
            }, [values]);

            return (
              <Form className="space-y-8">
                {currentStep === 1 && (
                  <div className="transition-all duration-500 ease-in-out">
                    <ContactBusinessSection
                      values={values}
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="transition-all duration-500 ease-in-out">
                    <CategorySection
                      values={values}
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                    />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="transition-all duration-500 ease-in-out space-y-8">
                    <BoothAndPaymentSection
                      values={values}
                      errors={errors}
                      touched={touched}
                      showBoothSuccess={showBoothSuccess}
                      onGoToMap={() => goToMap(values)}
                      onClearBooth={() => {
                        setFieldValue("boothNumber", "");
                        localStorage.removeItem(BOOTH_KEY);
                      }}
                      setFieldValue={setFieldValue}
                      basePrice={getBasePrice(values)} // ✅ PASS BASE PRICE
                    />

                    <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-colors duration-300">
                      <label className="block text-gray-300 font-semibold mb-2">
                        Notes (optional)
                      </label>
                      <textarea
                        name="notes"
                        value={values.notes}
                        onChange={(e) => setFieldValue("notes", e.target.value)}
                        rows={4}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                        placeholder="Any additional information you'd like to share..."
                      />
                    </div>

                    <TermsCheckboxWithModal
                      checked={values.terms}
                      error={touched.terms ? (errors.terms as any) : undefined}
                      onChange={(checked) => setFieldValue("terms", checked)}
                    />

                    {submitError && (
                      <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 transition-all duration-300">
                        <p className="text-red-400 text-center text-sm font-semibold">
                          {submitError}
                        </p>
                      </div>
                    )}

                    {vendorSuccess && (
                      <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-xl p-4 transition-all duration-300">
                        <p className="text-emerald-400 text-center text-sm font-semibold">
                          Thank you for applying! Your booth is reserved for the next 48 hours. Please complete the next steps we send you to confirm your booking.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-4 justify-center mt-10">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="bg-transparent text-gray-400 px-10 py-4 rounded-full border-2 border-gray-600 text-base font-bold hover:bg-gray-700 hover:text-white transition-all duration-300"
                    >
                      ← Previous
                    </button>
                  )}

                  {currentStep < 3 && (
                    <button
                      type="button"
                      onClick={() => handleNext(values, formikProps)}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-10 py-4 rounded-full text-base font-black tracking-wide shadow-xl shadow-yellow-400/40 hover:shadow-2xl hover:shadow-yellow-400/60 hover:scale-105 transition-all duration-300 transform"
                    >
                      Next →
                    </button>
                  )}

                  {currentStep === 3 && (
                    <>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-10 py-4 rounded-full text-base font-black tracking-wide shadow-xl shadow-yellow-400/40 hover:shadow-2xl hover:shadow-yellow-400/60 hover:scale-105 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isLoading ? "Submitting…" : "Submit for Review"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReset(resetForm)}
                        className="bg-transparent text-[#f0b400] px-10 py-4 rounded-full border-2 border-[#f0b400] text-base font-bold hover:bg-[#f0b400] hover:text-black transition-all duration-300"
                      >
                        Clear Form
                      </button>
                    </>
                  )}
                </div>

                <div className="text-center text-gray-500 text-sm mt-6">
                  Step {currentStep} of 3
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default VendorForm;
