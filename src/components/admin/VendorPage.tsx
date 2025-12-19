// src/components/admin/VendorsPage.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { Search, Eye, Trash2, RefreshCw, Filter } from 'lucide-react';
import VendorDetailsModal from './VendorDetailsModal';
import { deleteVendor, fetchVendors, updateVendor } from '@/services/dashbord/asyncThunk';
import { setFilters } from '@/redux/slices/dashboardslice';

const VendorsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { vendors, loading, currentPage, totalPages } = useAppSelector(
    (state) => state.dashboard
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadVendors();
  }, [currentPage, filterStatus]);

  const loadVendors = () => {
    dispatch(
      fetchVendors()
    );
  };

  const handleSearch = () => {
    dispatch(setFilters({ search: searchTerm, status: filterStatus }));
    loadVendors();
  };

  const handleStatusChange = async (vendorId: string, newStatus: string) => {
    try {
      await dispatch(updateVendor({ id: vendorId, updates: { status: newStatus } })).unwrap();
      loadVendors();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (vendorId: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;

    try {
      await dispatch(deleteVendor(vendorId)).unwrap();
      loadVendors();
    } catch (error) {
      console.error('Failed to delete vendor:', error);
      alert('Failed to delete vendor');
    }
  };

  const handleViewDetails = (vendor: any) => {
    setSelectedVendor(vendor);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vendors Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage all vendor registrations and booth assignments
          </p>
        </div>
        <button
          onClick={loadVendors}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-500 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by vendor name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="held">Held</option>
              <option value="approved">Approved</option>
              <option value="expired">Expired</option>
            </select>

            <button
              onClick={handleSearch}
              className="px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Vendors', value: vendors.length, color: 'blue' },
          { label: 'Held', value: vendors.filter(v => v.status === 'held').length, color: 'yellow' },
          { label: 'Approved', value: vendors.filter(v => v.status === 'approved').length, color: 'green' },
          { label: 'Expired', value: vendors.filter(v => v.status === 'expired').length, color: 'red' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No vendors found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booth #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendors.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {vendor.vendorName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-900">{vendor.contact?.personName}</div>
                        <div className="text-gray-500">{vendor.contact?.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendor.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-yellow-600">
                        #{vendor.boothNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={vendor.status}
                        onChange={(e) => handleStatusChange(vendor._id, e.target.value)}
                        className="text-sm px-3 py-1 rounded-full cursor-pointer border-0 focus:ring-2 focus:ring-yellow-400"
                        style={{
                          backgroundColor:
                            vendor.status === 'approved'
                              ? '#DEF7EC'
                              : vendor.status === 'held'
                              ? '#FEF3C7'
                              : '#FEE2E2',
                          color:
                            vendor.status === 'approved'
                              ? '#03543F'
                              : vendor.status === 'held'
                              ? '#92400E'
                              : '#991B1B',
                        }}
                      >
                        <option value="held">Held</option>
                        <option value="approved">Approved</option>
                        <option value="expired">Expired</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(vendor)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vendor._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedVendor && (
        <VendorDetailsModal
          vendor={selectedVendor}
          onClose={() => {
            setShowModal(false);
            setSelectedVendor(null);
          }}
        />
      )}
    </div>
  );
};

export default VendorsPage;