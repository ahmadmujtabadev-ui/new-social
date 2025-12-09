// hooks/useBoothManagement.ts
import { useState, useCallback } from 'react';

interface BoothData {
  b_boothID: string;
  b_category: string;
  b_status: 'booked' | 'available';
  b_bookedTime: string;
}

const BOOTH_EXPIRY_MS = 48 * 60 * 60 * 1000; // 48 hours

export const useBoothManagement = () => {
  const [bookedBooths, setBookedBooths] = useState<Set<string>>(new Set());
  const [isCheckingBooth, setIsCheckingBooth] = useState(false);

  const isBoothExpired = (bookedTime: string): boolean => {
    if (!bookedTime) return true;

    const bookedDate = new Date(bookedTime);
    const now = new Date();
    const diffMs = now.getTime() - bookedDate.getTime();

    return diffMs > BOOTH_EXPIRY_MS;
  };

  const fetchBookedBooths = useCallback(async (): Promise<Set<string>> => {
    try {
      const response = await fetch('/api/booths/list');
      if (!response.ok) throw new Error('Failed to fetch booth data');

      const data: BoothData[] = await response.json();
      const booked = new Set<string>();

      data.forEach((row) => {
        if (row.b_boothID && row.b_status === 'booked' && row.b_bookedTime) {
          if (!isBoothExpired(row.b_bookedTime)) {
            booked.add(String(row.b_boothID));
          }
        }
      });

      setBookedBooths(booked);
      return booked;
    } catch (error) {
      console.error('Error fetching booked booths:', error);
      return bookedBooths;
    }
  }, [bookedBooths]);

  const checkBoothAvailability = useCallback(
    async (
      boothId: string
    ): Promise<{
      available: boolean;
      message?: string;
    }> => {
      try {
        setIsCheckingBooth(true);

        const latestBooked = await fetchBookedBooths();

        if (latestBooked.has(String(boothId))) {
          return {
            available: false,
            message:
              'This booth is already booked. You can book it again after 48 hours.',
          };
        }

        return { available: true };
      } catch (error) {
        console.error('Error checking booth availability:', error);
        return { available: true };
      } finally {
        setIsCheckingBooth(false);
      }
    },
    [fetchBookedBooths]
  );

  const saveBoothToSheet = useCallback(
    async (
      boothId: string,
      category: string
    ): Promise<{ success: boolean; message?: string }> => {
      try {
        const availabilityCheck = await checkBoothAvailability(boothId);

        if (!availabilityCheck.available) {
          return {
            success: false,
            message: availabilityCheck.message || 'Booth is not available',
          };
        }

        const response = await fetch('/api/booths/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ boothId, category }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Failed to save booth booking');
        }

        await fetchBookedBooths();

        return { success: true };
      } catch (error) {
        console.error('Error saving booth to sheet:', error);
        return {
          success: false,
          message: 'Failed to save booth booking',
        };
      }
    },
    [checkBoothAvailability, fetchBookedBooths]
  );

  // useEffect(() => {
  //   fetchBookedBooths();
  //   const interval = setInterval(fetchBookedBooths, 60000); // refresh every 60s
  //   return () => clearInterval(interval);
  // }, [fetchBookedBooths]);

  return {
    bookedBooths,
    isCheckingBooth,
    checkBoothAvailability,
    saveBoothToSheet,
    fetchBookedBooths,
  };
};
