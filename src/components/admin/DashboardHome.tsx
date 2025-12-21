// src/components/admin/DashboardHome.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import {
  Users,
  Trophy,
  Store,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { fetchSponsors, fetchStats, fetchVendors } from '@/services/dashbord/asyncThunk';

const DashboardHome: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, vendors, loading } = useAppSelector((state) => state.dashboard);
  console.log("stats",stats)

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchVendors());
    dispatch(fetchSponsors());
  }, [dispatch]);

  const recentVendors = vendors.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-gray-900">
        <h2 className="text-2xl font-bold mb-2">Welcome to Admin Dashboard</h2>
        <p className="text-gray-800">
          Manage your event vendors, sponsors, and booth assignments all in one place
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vendors</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.vendors?.total || 0}
              </p>
              <p className="text-sm text-green-600 mt-1">↑ Active registrations</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.vendors?.approved || 0}
              </p>
              <p className="text-sm text-green-600 mt-1">✓ Confirmed vendors</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.vendors?.submitted || 0}
              </p>
              <p className="text-sm text-yellow-600 mt-1">⏳ Awaiting approval</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sponsors</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.sponsors?.total || 0}
              </p>
              <p className="text-sm text-purple-600 mt-1">★ Active partnerships</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Booth Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Available</span>
              <span className="text-sm font-medium text-green-600">
                {stats?.booths?.available || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Held</span>
              <span className="text-sm font-medium text-yellow-600">
                {stats?.booths?.held || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Booked</span>
              <span className="text-sm font-medium text-blue-600">
                {stats?.booths?.booked || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Confirmed</span>
              <span className="text-sm font-medium text-green-600">
                {stats?.booths?.confirmed || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Sponsor Tiers</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Platinum</span>
              <span className="text-sm font-medium text-purple-600">
                {stats?.sponsors?.byTier?.['PLATINUM SPONSOR'] || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Gold</span>
              <span className="text-sm font-medium text-yellow-600">
                {stats?.sponsors?.byTier?.['GOLD SPONSOR'] || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Silver</span>
              <span className="text-sm font-medium text-gray-600">
                {stats?.sponsors?.byTier?.['SILVER SPONSOR'] || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Vendor Categories</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Food Vendors</span>
              <span className="text-sm font-medium text-gray-900">
                {stats?.vendors?.byCategory?.['Food Vendor'] || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Craft Booths</span>
              <span className="text-sm font-medium text-gray-900">
                {stats?.vendors?.byCategory?.['Craft Booth'] || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Clothing</span>
              <span className="text-sm font-medium text-gray-900">
                {stats?.vendors?.byCategory?.['Clothing Vendor'] || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Jewelry</span>
              <span className="text-sm font-medium text-gray-900">
                {stats?.vendors?.byCategory?.['Jewelry Vendor'] || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Vendor Registrations</h3>
          <Link
            href="/admin/vendors"
            className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : recentVendors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No recent activity</div>
          ) : (
            <div className="space-y-4">
              {recentVendors.map((vendor) => (
                <div
                  key={vendor._id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Store className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{vendor.vendorName}</p>
                      <p className="text-xs text-gray-500">{vendor.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        Booth #{vendor.boothNumber || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {vendor.bookingTimeline?.submittedAt
                          ? new Date(vendor.bookingTimeline.submittedAt).toLocaleDateString()
                          : vendor.createdAt
                          ? new Date(vendor.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        vendor.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : vendor.status === 'held'
                          ? 'bg-yellow-100 text-yellow-800'
                          : vendor.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : vendor.status === 'expired'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
        <Link
          href="/admin/vendors"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Manage Vendors</h4>
              <p className="text-sm text-gray-600">View and update vendor status</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/sponsors"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Manage Sponsors</h4>
              <p className="text-sm text-gray-600">View sponsor partnerships</p>
            </div>
          </div>
        </Link>
{/* 
        <Link
          href="/admin/booths"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
              <Store className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Manage Booths</h4>
              <p className="text-sm text-gray-600">View booth assignments</p>
            </div>
          </div>
        </Link> */}
      </div>
    </div>
  );
};

export default DashboardHome;