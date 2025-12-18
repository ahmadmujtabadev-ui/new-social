// =============================================================================
// hooks/useNavigationState.ts
// =============================================================================

/**
 * Hook to manage navigation state (scroll position, current step)
 * when navigating to/from the booth selection map
 */

import { useEffect } from 'react';

export const useNavigationState = () => {
  
  const saveNavigationState = (step: number, scrollY: number) => {
    try {
      sessionStorage.setItem('vendorFormStep', String(step));
      sessionStorage.setItem('vendorFormScroll', String(scrollY));
    } catch (error) {
      console.error('Error saving navigation state:', error);
    }
  };

  const loadNavigationState = (): { step: number | null; scrollY: number | null } => {
    try {
      const stepStr = sessionStorage.getItem('vendorFormStep');
      const scrollStr = sessionStorage.getItem('vendorFormScroll');
      
      return {
        step: stepStr ? parseInt(stepStr, 10) : null,
        scrollY: scrollStr ? parseInt(scrollStr, 10) : null,
      };
    } catch (error) {
      console.error('Error loading navigation state:', error);
      return { step: null, scrollY: null };
    }
  };

  const clearNavigationState = () => {
    try {
      sessionStorage.removeItem('vendorFormStep');
      sessionStorage.removeItem('vendorFormScroll');
    } catch (error) {
      console.error('Error clearing navigation state:', error);
    }
  };

  // Restore scroll position on mount
  useEffect(() => {
    const { scrollY } = loadNavigationState();
    
    if (scrollY !== null) {
      setTimeout(() => {
        window.scrollTo(0, scrollY);
        clearNavigationState();
      }, 100);
    }
  }, []);

  return {
    saveNavigationState,
    loadNavigationState,
    clearNavigationState,
  };
};
