/* eslint-disable @typescript-eslint/no-explicit-any */

// formik/utils.ts
import { FormikHelpers } from 'formik';

// Define types for initial values
interface LoginValues {
  email: string;
  password: string;
  agreeToTerms: boolean;
}

interface SignupValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  conditions: boolean;
}

interface ResetRequestValues {
  email: string;
}

interface ChangePasswordValues {
  password: string;
  confirm_password: string;
}

interface ProfileSetupValues {
  title: string;
  org: string;
  years_exp: string;
  area_interest: string[];
  legislation: string[];
  bio: string;
  campaign_type: string[];
  strategy_goal: string[];
  region: string[];
  stakeholders: string[];
  com_channel: string[];
  collab_initiatives: boolean;
  network: string[];
}

interface ProfileEditValues {
  fullname: string;
  avatar: string;
  only_avatar: boolean;
  role: string;
  country: string;
  sector: string[];
  objective: string;
  bio: string;
}

interface UpdatePasswordValues {
  currentPassword: string;
  newPassword: string;
}

interface EmailValues {
  email: string;
}

// Common initial values for forms
export const authInitialValues = {
  login: {
    email: '',
    password: '',
    agreeToTerms: false
  } as LoginValues,
  signup: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    conditions: false,
  } as SignupValues,
  resetRequest: {
    email: ''
  } as ResetRequestValues,
  changePassword: {
    password: '',
    confirm_password: ''
  } as ChangePasswordValues
};

export const profileInitialValues = {
  setup: {
    title: '',
    org: '',
    years_exp: '',
    area_interest: [],
    legislation: [],
    bio: '',
    campaign_type: [],
    strategy_goal: [],
    region: [],
    stakeholders: [],
    com_channel: [],
    collab_initiatives: false,
    network: []
  } as ProfileSetupValues,
  edit: {
    fullname: '',
    avatar: '',
    only_avatar: false,
    role: '',
    country: '',
    sector: [],
    objective: '',
    bio: ''
  } as ProfileEditValues,
  updatePassword: {
    currentPassword: '',
    newPassword: ''
  } as UpdatePasswordValues,
  email: {
    email: ''
  } as EmailValues
};

// Error response types
interface ApiErrorResponse {
  response?: {
    data?: {
      errors?: Record<string, string[]>;
      message?: string;
    };
  };
}

// Helper functions for form handling
export const handleFormError = (
  error: ApiErrorResponse,
  setFieldError: (field: string, message: string) => void
): void => {
  if (error.response?.data?.errors) {
    // Handle validation errors from API
    Object.keys(error.response.data.errors).forEach(field => {
      const errorMessages = error.response?.data?.errors?.[field];
      if (errorMessages && errorMessages.length > 0) {
        setFieldError(field, errorMessages[0]);
      }
    });
  } else if (error.response?.data?.message) {
    // Handle general error messages
    setFieldError('general', error.response.data.message);
  } else {
    // Handle unknown errors
    setFieldError('general', 'An unexpected error occurred');
  }
};

export const formatFormData = <T extends Record<string, any>>(
  values: T,
  excludeFields: string[] = []
): Partial<T> => {
  const formData = { ...values };

  // Remove excluded fields
  excludeFields.forEach(field => {
    delete formData[field as keyof T];
  });

  // Remove empty strings and null values
  Object.keys(formData).forEach(key => {
    if (formData[key] === '' || formData[key] === null) {
      delete formData[key as keyof T];
    }
  });

  return formData;
};

// Form validation helpers
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};

// Async validation function
export const validateEmailExists = async (): Promise<boolean> => {
  try {
    // Replace with your actual API call
    // const response = await checkEmailExists(email);
    // return response.exists;
    return false; // Placeholder
  } catch (error) {
    console.error('Email validation error:', error);
    return false;
  }
};

// Form submission options
interface FormSubmissionOptions {
  formatData?: boolean;
  excludeFields?: string[];
}

// Form submission helpers
export const createFormSubmissionHandler = <T extends Record<string, any>, R = any>(
  apiCall: (data: T | Partial<T>) => Promise<R>,
  successCallback?: (response: R, formikActions: FormikHelpers<T>) => void,
  errorCallback?: (error: ApiErrorResponse, formikActions: FormikHelpers<T>) => void,
  options: FormSubmissionOptions = {}
) => {
  return async (values: T, formikActions: FormikHelpers<T>): Promise<void> => {
    const { setSubmitting, setFieldError, setStatus } = formikActions;

    console.log("values 129", values);
    try {
      setStatus(null);

      // Format form data if needed
      const formData = options.formatData
        ? formatFormData(values, options.excludeFields)
        : values;

      // Make API call
      const response = await apiCall(formData as T);

      // Handle success
      if (successCallback) {
        successCallback(response, formikActions);
      }
    } catch (error) {
      console.error('Form submission error:', error);

      // Handle errors
      if (errorCallback) {
        errorCallback(error as ApiErrorResponse, formikActions);
      } else {
        handleFormError(error as ApiErrorResponse, setFieldError);
      }
    } finally {
      setSubmitting(false);
    }
  };
};

// Form reset helpers
export const resetFormWithDelay = (
  resetForm: () => void,
  delay: number = 3000
): void => {
  setTimeout(() => {
    resetForm();
  }, delay);
};

// Field value transformers
export const transformers = {
  email: (value: string): string => value.toLowerCase().trim(),
  phone: (value: string): string => value.replace(/\D/g, ''),
  name: (value: string): string => value.trim().replace(/\s+/g, ' '),
  capitalize: (value: string): string => 
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
};