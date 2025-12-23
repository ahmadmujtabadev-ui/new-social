// src/components/admin/VendorsPage.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { Eye, Trash2, RefreshCw } from 'lucide-react';
import VendorDetailsModal from './VendorDetailsModal';
import { deleteVendor, fetchVendors, updateVendor } from '@/services/dashbord/asyncThunk';

const VendorsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { vendors, loading, currentPage, totalPages } = useAppSelector(
    (state) => state.dashboard
  );

  const [filterStatus] = useState('');
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
          <h2 className="text-2xl font-bold text-yellow-500">Vendors Management</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage all vendor registrations and booth assignments
          </p>
        </div>
        <button
          onClick={loadVendors}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Vendors', value: vendors.length },
          { label: 'Held', value: vendors.filter(v => v.status === 'held').length },
          { label: 'Approved', value: vendors.filter(v => v.status === 'approved').length },
          { label: 'Available', value: vendors.filter(v => v.status === 'available').length },
        ].map((stat) => (
          <div key={stat.label} className="bg-black rounded-lg border border-yellow-500 p-4">
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className="text-2xl font-bold text-yellow-500 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-black rounded-lg border border-yellow-500 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-yellow-500" />
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No vendors found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black border-b border-yellow-500">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Booth #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-black divide-y divide-gray-800">
                {vendors.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-black transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-300">
                        {vendor.vendorName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-300">{vendor.contact?.personName}</div>
                        <div className="text-gray-500">{vendor.contact?.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {vendor.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-yellow-500">
                        #{vendor.boothNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={vendor.status}
                        onChange={(e) => handleStatusChange(vendor._id, e.target.value)}
                        className={`text-sm px-3 py-1 rounded-full cursor-pointer border focus:ring-2 focus:ring-yellow-500 ${
                          vendor.status === 'approved'
                            ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500'
                            : vendor.status === 'held'
                            ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400'
                            : 'bg-gray-700 text-gray-400 border-gray-600'
                        }`}
                      >
                        <option value="held">Held</option>
                        <option value="approved">Approved</option>
                        <option value="available">Available</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(vendor)}
                          className="p-2 text-yellow-500 hover:bg-yellow-500/20 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vendor._id)}
                          className="p-2 text-yellow-500 hover:bg-yellow-500/20 rounded-lg transition"
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
        <div className="flex items-center justify-between bg-black rounded-lg border border-yellow-500 px-4 py-3">
          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              className="px-3 py-1 border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
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