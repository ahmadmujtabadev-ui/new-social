// =============================================================================
// hooks/useBoothSelection.ts
// =============================================================================

/**
 * Simplified hook to manage booth selection from localStorage
 * Backend handles booth availability validation and pricing
 */

import { useState, useEffect } from 'react';

export interface SelectedBooth {
  id: number;
  category: string;
  price?: number; // Optional - backend will provide final price
}

export const useBoothSelection = (storageKey: string = 'selectedBooth') => {
  const [selectedBooth, setSelectedBooth] = useState<SelectedBooth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load booth from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const booth = JSON.parse(raw) as SelectedBooth;
        setSelectedBooth(booth);
      }
    } catch (error) {
      console.error('Error loading booth selection:', error);
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  const clearBooth = () => {
    try {
      localStorage.removeItem(storageKey);
      setSelectedBooth(null);
    } catch (error) {
      console.error('Error clearing booth:', error);
    }
  };

  const saveBooth = (booth: SelectedBooth) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(booth));
      setSelectedBooth(booth);
    } catch (error) {
      console.error('Error saving booth:', error);
    }
  };

  return {
    selectedBooth,
    isLoading,
    clearBooth,
    saveBooth,
    boothId: selectedBooth?.id ? String(selectedBooth.id) : '',
  };
};