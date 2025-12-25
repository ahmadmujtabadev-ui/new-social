"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Search, Filter } from "lucide-react";
import { API_BASE_URL } from "@/config/apiconfig";

interface Booth {
  _id: string;
  id: number;
  category: string;
  price: number;
  status: string;
  heldUntil?: string | null;
  heldBy?: string | null;
}

export default function BoothAdminTable() {
  const [booths, setBooths] = useState<Booth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [updatingBoothId, setUpdatingBoothId] = useState<string | null>(null);

  const fetchBooths = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/booth`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();
      const boothsArray = Array.isArray(data) ? data : (Array.isArray(data.booths) ? data.booths : []);
      
      setBooths(boothsArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch booths");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (boothId: string, newStatus: string) => {
    try {
      setUpdatingBoothId(boothId);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/booth/${boothId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update: ${response.status}`);
      }

      await fetchBooths();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update booth status");
      alert("Failed to update booth status");
    } finally {
      setUpdatingBoothId(null);
    }
  };

  useEffect(() => {
    fetchBooths();
    const interval = setInterval(() => {
      fetchBooths();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const normalizeCategoryForFilter = (category: string): string => {
    const map: Record<string, string> = {
      "Craft Booth": "craft",
      "Clothing Vendor": "clothing",
      "Jewelry Vendor": "jewelry",
      "Food Vendor": "food",
    };
    return map[category] || category.toLowerCase();
  };

  const isBoothHeld = (booth: Booth): boolean => {
    if (!booth.heldUntil) return false;
    return new Date(booth.heldUntil) > new Date();
  };

  const filteredBooths = booths.filter((booth) => {
    const matchesSearch = booth.id.toString().includes(searchTerm) ||
                         booth.category.toLowerCase().includes(searchTerm.toLowerCase());
    const normalizedCategory = normalizeCategoryForFilter(booth.category);
    const matchesCategory = filterCategory === "all" || normalizedCategory === filterCategory;
    const matchesStatus = filterStatus === "all" || booth.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-yellow-500">Booths Management</h2>
          <p className="text-sm text-gray-400 mt-1">
            Monitor and manage all event booths
          </p>
        </div>
        <button
          onClick={() => {
            fetchBooths();
          }}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

   
      {/* Filters */}
      <div className="bg-black rounded-lg border border-yellow-500 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-transparent border border-yellow-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-transparent border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500 appearance-none cursor-pointer"
            >
              <option value="all" className="bg-black">All Categories</option>
              <option value="craft" className="bg-black">Craft</option>
              <option value="clothing" className="bg-black">Clothing</option>
              <option value="jewelry" className="bg-black">Jewelry</option>
              <option value="food" className="bg-black">Food</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-transparent border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500 appearance-none cursor-pointer"
            >
              <option value="all" className="bg-black">All Statuses</option>
              <option value="available" className="bg-black">Available</option>
              <option value="held" className="bg-black">Booked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">Error: {error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-black rounded-lg border border-yellow-500 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-yellow-500" />
          </div>
        ) : filteredBooths.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No booths found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black border-b border-yellow-500">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Booth ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Booked Until
                  </th>
                </tr>
              </thead>
              <tbody className="bg-black divide-y divide-gray-800">
                {filteredBooths.map((booth) => (
                  <tr key={booth._id} className="hover:bg-black transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-white font-semibold">#{booth.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-300 capitalize">{booth.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-yellow-500 font-semibold">${booth.price}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={booth.status}
                        onChange={(e) => handleStatusChange(booth._id, e.target.value)}
                        disabled={updatingBoothId === booth._id}
                        className={`text-sm px-3 py-1 rounded-full cursor-pointer border focus:ring-2 focus:ring-yellow-500 bg-black ${
                          updatingBoothId === booth._id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        } ${
                          booth.status === "available"
                            ? "text-green-400 border-green-400"
                            : booth.status === "held"
                            ? "text-yellow-400 border-yellow-400"
                            : booth.status === "booked" || booth.status === "confirmed"
                            ? "text-red-400 border-red-400"
                            : "text-gray-400 border-gray-400"
                        }`}
                      >
                        <option value="available" className="bg-black">Available</option>
                        <option value="held" className="bg-black">Booked</option>
                        <option value="confirmed" className="bg-black">Confirmed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booth.heldUntil && isBoothHeld(booth) ? (
                        <span className="text-gray-300 text-sm">
                          {new Date(booth.heldUntil).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results Count */}
      {!loading && filteredBooths.length > 0 && (
        <div className="text-center text-gray-400 text-sm">
          Showing {filteredBooths.length} of {booths.length} booths
        </div>
      )}
    </div>
  );
}