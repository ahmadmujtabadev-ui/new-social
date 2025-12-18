// hooks/useFormPersistence.ts
/**
 * Hook to manage form data persistence using sessionStorage
 * Files are NOT persisted - only their metadata for display purposes
 */

import { useEffect } from 'react';

export interface FormPersistenceOptions {
  storageKey: string;
  values: Record<string, any>;
  enabled?: boolean;
}

export const useFormPersistence = ({
  storageKey,
  values,
  enabled = true,
}: FormPersistenceOptions) => {
  
  // Auto-save form data (excluding File objects)
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      try {
        const serializableData = serializeFormData(values);
        sessionStorage.setItem(storageKey, JSON.stringify(serializableData));
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    }, 1000); // Debounce saves

    return () => clearTimeout(timer);
  }, [values, storageKey, enabled]);

  const clearPersistedData = () => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing persisted data:', error);
    }
  };

  return { clearPersistedData };
};

/**
 * Serialize form data, converting File objects to metadata
 */
const serializeFormData = (data: Record<string, any>): Record<string, any> => {
  const serialized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value instanceof File) {
      // Store file metadata only
      serialized[key] = { 
        _isFile: true, 
        name: value.name,
        size: value.size,
        type: value.type 
      };
    } else if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
      // Handle array of files
      serialized[key] = value.map(file => ({
        _isFile: true,
        name: file.name,
        size: file.size,
        type: file.type
      }));
    } else {
      serialized[key] = value;
    }
  }

  return serialized;
};

/**
 * Load persisted form data from sessionStorage
 */
export const loadPersistedFormData = (storageKey: string): Record<string, any> | null => {
  if (typeof window === 'undefined') return null;

  try {
    const saved = sessionStorage.getItem(storageKey);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    
    // Convert file metadata back to null/empty arrays
    // (User will need to re-upload files)
    return deserializeFormData(parsed);
  } catch (error) {
    console.error('Error loading persisted data:', error);
    return null;
  }
};

/**
 * Deserialize form data, handling file metadata
 */
const deserializeFormData = (data: Record<string, any>): Record<string, any> => {
  const deserialized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === 'object' && '_isFile' in value) {
      // File metadata - set to null (user must re-upload)
      deserialized[key] = null;
    } else if (Array.isArray(value) && value.length > 0 && value[0]?._isFile) {
      // Array of file metadata - set to empty array
      deserialized[key] = [];
    } else {
      deserialized[key] = value;
    }
  }

  return deserialized;
};