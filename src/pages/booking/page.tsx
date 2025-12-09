"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
// 👇 CHANGE 1: Import the variable directly
import { API_BASE_URL } from "@/config/apiconfig";

type BoothCategory = "craft" | "clothing" | "jewelry" | "food";

interface Table {
  id: number;
  category: BoothCategory;
  x: number;
  y: number;
  width: number;
  height: number;
  price: number;
}

const CATEGORY_COLORS: Record<BoothCategory, string> = {
  craft: "rgba(64, 224, 208, 0.7)",
  clothing: "rgba(219, 112, 147, 0.7)",
  jewelry: "rgba(255, 140, 0, 0.7)",
  food: "rgba(210, 180, 140, 0.7)",
};

const TABLES: Table[] = [
  { id: 17, category: "craft", x: 15, y: 18, width: 5, height: 8, price: 350 },
  { id: 16, category: "craft", x: 22, y: 18, width: 5, height: 8, price: 200 },
  { id: 15, category: "craft", x: 29, y: 18, width: 5, height: 8, price: 200 },
  { id: 14, category: "craft", x: 36, y: 18, width: 5, height: 8, price: 200 },

  { id: 13, category: "clothing", x: 61, y: 18, width: 5, height: 8, price: 200 },
  { id: 12, category: "clothing", x: 68, y: 18, width: 5, height: 8, price: 200 },
  { id: 11, category: "clothing", x: 75, y: 18, width: 5, height: 8, price: 200 },
  { id: 10, category: "clothing", x: 82, y: 18, width: 5, height: 8, price: 350 },

  { id: 18, category: "food", x: 4.5, y: 20, width: 5, height: 8, price: 350 },
  { id: 19, category: "food", x: 4.5, y: 36, width: 5, height: 8, price: 200 },
  { id: 20, category: "food", x: 4.5, y: 48, width: 5, height: 8, price: 200 },
  { id: 21, category: "food", x: 4.5, y: 60, width: 5, height: 8, price: 200 },
  { id: 22, category: "food", x: 4.5, y: 72, width: 5, height: 8, price: 200 },

  { id: 9, category: "clothing", x: 92, y: 25, width: 5, height: 8, price: 350 },
  { id: 8, category: "clothing", x: 92, y: 37, width: 5, height: 8, price: 200 },
  { id: 7, category: "clothing", x: 92, y: 49, width: 5, height: 8, price: 200 },
  { id: 6, category: "clothing", x: 92, y: 61, width: 5, height: 8, price: 200 },
  { id: 5, category: "clothing", x: 92, y: 73, width: 5, height: 8, price: 200 },

  { id: 29, category: "craft", x: 16, y: 33, width: 5, height: 8, price: 350 },
  { id: 30, category: "craft", x: 25, y: 32, width: 5, height: 8, price: 350 },
  { id: 28, category: "craft", x: 16, y: 46, width: 5, height: 8, price: 200 },
  { id: 31, category: "craft", x: 27, y: 45, width: 5, height: 8, price: 200 },
  { id: 27, category: "craft", x: 16, y: 60, width: 5, height: 8, price: 350 },
  { id: 32, category: "craft", x: 25, y: 59, width: 5, height: 8, price: 350 },

  { id: 35, category: "clothing", x: 70, y: 33, width: 5, height: 8, price: 350 },
  { id: 36, category: "jewelry", x: 80, y: 32, width: 5, height: 8, price: 350 },
  { id: 34, category: "clothing", x: 70, y: 46, width: 5, height: 8, price: 200 },
  { id: 37, category: "jewelry", x: 80, y: 45, width: 5, height: 8, price: 200 },
  { id: 33, category: "clothing", x: 70, y: 60, width: 5, height: 8, price: 350 },
  { id: 38, category: "jewelry", x: 80, y: 59, width: 5, height: 8, price: 350 },

  { id: 23, category: "food", x: 10, y: 78, width: 5, height: 8, price: 200 },
  { id: 24, category: "food", x: 16, y: 78, width: 5, height: 8, price: 200 },
  { id: 25, category: "food", x: 23, y: 78, width: 5, height: 8, price: 400 },

  { id: 26, category: "craft", x: 35, y: 78, width: 5, height: 8, price: 250 },

  { id: 1, category: "craft", x: 58, y: 78, width: 5, height: 8, price: 250 },

  { id: 2, category: "jewelry", x: 72, y: 78, width: 5, height: 8, price: 400 },
  { id: 3, category: "jewelry", x: 79, y: 78, width: 5, height: 8, price: 200 },
  { id: 4, category: "jewelry", x: 85, y: 78, width: 5, height: 8, price: 200 },
];

const BOOTH_KEY = "selectedBooth";

type BoothApiItem = {
  boothNumber: string;
  status: string;
};

export default function SeatingMap() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [hoveredTable, setHoveredTable] = useState<number | null>(null);
  const [bookedIds, setBookedIds] = useState<number[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category");
  const normalizedCategory: BoothCategory | null = useMemo(() => {
    if (!categoryParam) return null;
    const map: Record<string, BoothCategory> = {
      "Craft Booth": "craft",
      "Clothing Vendor": "clothing",
      "Jewelry Vendor": "jewelry",
      "Food Vendor": "food",
    };
    return (map[categoryParam] as BoothCategory) ?? null;
  }, [categoryParam]);

  // 👇 CHANGE 2: Removed "const apiBase = config.API_ENDPOINT;"
  
  useEffect(() => {
    let mounted = true;

    const fetchStatus = async () => {
      try {
        // 👇 CHANGE 3: Simplified URL using correct backticks
        const url = `${API_BASE_URL}/api/forms/booths/active`;

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();

        let ids: number[] = [];

        if (Array.isArray(data.booths)) {
          const booths = data.booths as BoothApiItem[];

          ids = booths
            .filter(
              (b) =>
                b &&
                (b.status === "booked" || b.status === "confirmed") &&
                typeof b.boothNumber !== "undefined"
            )
            .map((b) => Number(b.boothNumber))
            .filter((n) => Number.isFinite(n));
        }

        if (mounted && Array.isArray(ids)) {
          setBookedIds(ids);
        }
      } catch {
        // ignore network errors silently
      }
    };

    fetchStatus();
    const id = setInterval(fetchStatus, 10000); // refresh every 10s
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []); // 👇 CHANGE 4: Removed dependency on apiBase

  const isBooked = (id: number) => bookedIds.includes(id);

  // ✅ Selection logic – only on map
  const handleTableClick = (table: Table) => {
    const matchesCategory =
      !!normalizedCategory && table.category === normalizedCategory;
    if (!matchesCategory) return; // wrong category

    if (isBooked(table.id)) return; // already booked

    setSelectedTable((prev) => (prev?.id === table.id ? null : table));
  };

  const handleProceedToBooking = () => {
    if (!selectedTable) return;
    try {
      localStorage.setItem(BOOTH_KEY, JSON.stringify(selectedTable));
    } catch {
      // ignore
    }
    router.push("/registration/vendor");
  };

  const hoveredTableData = hoveredTable
    ? TABLES.find((t) => t.id === hoveredTable)
    : null;

  return (
    <div className="min-h-screen bg-gray-900 p-2 sm:p-4 md:p-8">
      <Button
        type="button"
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 border border-[#f4c63f] bg-transparent text-sm font-semibold text-[#f4c63f] shadow-sm shadow-[#f4c63f]/40 transition-colors transition-shadow duration-200 hover:bg-[#f4c63f] hover:text-gray-900 hover:shadow-lg active:scale-[0.98]"
      >
        <span className="text-lg">←</span>
        <span>Back to Selection</span>
      </Button>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 text-center">
          Select Your Booth
          {normalizedCategory ? ` — ${normalizedCategory.toUpperCase()}` : ""}
        </h1>

        {selectedTable && (
          <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">
                  Selected Booth
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  Table {selectedTable.id}
                </p>
                <p className="text-xs text-gray-600 capitalize mt-1">
                  {selectedTable.category} Booth
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 uppercase tracking-wide">
                  Price
                </p>
                <p className="text-3xl font-bold text-green-600">
                  ${selectedTable.price}
                </p>
              </div>
            </div>
            <button
              onClick={handleProceedToBooking}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-200"
            >
              Proceed to Booking
            </button>
          </div>
        )}

        <div className="relative w-full bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
          <div
            className="relative w-full"
            style={{ paddingBottom: "56.25%" }}
          >
            <Image
              src="/venue-map.jpg"
              alt="Venue Seating Map"
              fill
              className="object-contain"
              priority
            />

            {/* Tooltip */}
            {hoveredTableData && (
              <div
                className="absolute z-50 bg-white rounded-lg shadow-xl p-3 pointer-events-none border-2 border-blue-500"
                style={{
                  left: `${hoveredTableData.x + hoveredTableData.width / 2}%`,
                  top: `${hoveredTableData.y - 8}%`,
                  transform: "translateX(-50%)",
                  minWidth: "150px",
                }}
              >
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900">
                    Booth #{hoveredTableData.id}
                  </p>

                  {!normalizedCategory ? (
                    <p className="text-xs text-red-600 mt-1 font-semibold">
                      Please select a category first
                    </p>
                  ) : hoveredTableData.category !== normalizedCategory ? (
                    <p className="text-xs text-red-600 mt-1 font-semibold">
                      Not available for this category
                    </p>
                  ) : isBooked(hoveredTableData.id) ? (
                    <>
                      <p className="text-xs text-gray-600 capitalize">
                        {hoveredTableData.category} Booth
                      </p>
                      <p className="text-lg font-bold text-gray-500 mt-1">
                        BOOKED
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-gray-600 capitalize">
                        {hoveredTableData.category} Booth
                      </p>
                      <p className="text-lg font-bold text-green-600 mt-1">
                        ${hoveredTableData.price}
                      </p>
                      <p className="text-xs font-semibold mt-1 text-green-600">
                        AVAILABLE
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {TABLES.map((table) => {
              const hasCategory = !!normalizedCategory;
              const matchesCategory =
                hasCategory && table.category === normalizedCategory;
              const booked = isBooked(table.id);
              const selected = selectedTable?.id === table.id;
              const hovered = hoveredTable === table.id;

              const isSelectable = matchesCategory && !booked;

              let backgroundColor = "transparent";

              if (!hasCategory) {
                backgroundColor = "transparent";
              } else if (!matchesCategory) {
                backgroundColor = "transparent";
              } else if (booked) {
                backgroundColor = "rgba(107,114,128,0.6)";
              } else if (selected) {
                backgroundColor = "rgba(34, 197, 94, 0.7)";
              } else if (hovered && isSelectable) {
                backgroundColor = CATEGORY_COLORS[table.category];
              }

              return (
                <button
                  key={table.id}
                  onClick={() => handleTableClick(table)}
                  onMouseEnter={() => setHoveredTable(table.id)}
                  onMouseLeave={() => setHoveredTable(null)}
                  aria-disabled={!isSelectable}
                  className="absolute transition-all duration-200 rounded-md border-2 flex items-center justify-center font-bold text-white"
                  style={{
                    left: `${table.x}%`,
                    top: `${table.y}%`,
                    width: `${table.width}%`,
                    height: `${table.height}%`,
                    backgroundColor,
                    borderColor: selected ? "#22c55e" : "transparent",
                    transform:
                      hovered && isSelectable && !selected
                        ? "scale(1.05)"
                        : "scale(1)",
                    zIndex: selected ? 30 : hovered ? 20 : 10,
                    fontSize: selected
                      ? "clamp(6px, 0.8vw, 10px)"
                      : "clamp(10px, 1.5vw, 16px)",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                    cursor: isSelectable ? "pointer" : "not-allowed",
                    opacity: !isSelectable && !selected ? 0.85 : 1,
                  }}
                  aria-label={`Table ${table.id} - ${table.category} booth - ${
                    booked ? "booked" : "available"
                  }`}
                >
                  {booked ? "BOOKED" : selected ? "✓" : ""}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 sm:mt-4 text-center text-gray-400 text-xs sm:text-sm px-2">
          <p>
            Selection is done only on this map. Only booths in your chosen
            category are selectable; others will show “Not available for this
            category” when you hover.
          </p>
        </div>
      </div>
    </div>
  );
}

