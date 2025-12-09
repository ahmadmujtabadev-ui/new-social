"use client";
import { useEffect, useState } from "react";

export interface SelectedBooth {
  id: number;
  category: string;
  price: number;
}

export function useSelectedBooth() {
  const [booth, setBooth] = useState<SelectedBooth | null>(null);

  useEffect(() => {
    const read = () => {
      try {
        const raw = sessionStorage.getItem("selectedBooth");
        setBooth(raw ? JSON.parse(raw) : null);
      } catch {
        setBooth(null);
      }
    };

    read();

    // In case another tab/page changes it.
    const onStorage = (e: StorageEvent) => {
      if (e.key === "selectedBooth") read();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const clearBooth = () => {
    sessionStorage.removeItem("selectedBooth");
    setBooth(null);
  };

  return { booth, setBooth, clearBooth };
}
