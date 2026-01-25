// src/components/admin/VendorsPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { Eye, Trash2, RefreshCw, Calendar } from 'lucide-react';
import VendorDetailsModal from './VendorDetailsModal';
import { deleteVendor, fetchVendors, updateVendor, fetchEvents } from '@/services/dashbord/asyncThunk';
import { RootState } from '@/redux/store';

interface EventOption {
  value: string;
  label: string;
}

const VendorsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  // Get vendors and events from Redux store
  const { vendors, loading: vendorsLoading, currentPage, totalPages } = useAppSelector(
    (state: RootState) => state.dashboard
  );

  const { events = [], loading: eventsLoading } = useAppSelector(
    (state: RootState) => state.dashboard
  );

  const [filterStatus, setFilterStatus] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch events and vendors on mount
  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchVendors());
  }, [dispatch]);

  // Filter only published and active events
  const publishedEvents = useMemo(() => {
    const list = Array.isArray(events) ? events : [];
    return list.filter((event: any) =>
      event?.status === 'published' && event?.isActive
    );
  }, [events]);

  // Create event options for dropdown
  const eventOptions: EventOption[] = useMemo(() => {
    return publishedEvents
      .map((event: any) => {
        const title = event?.title || 'Untitled Event';
        const dateTime = event?.eventDateTime
          ? new Date(event.eventDateTime).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
          : '';
        return {
          value: event?._id || '',
          label: `${title}${dateTime ? ` - ${dateTime}` : ''}`,
        };
      })
      .filter((opt) => opt.value);
  }, [publishedEvents]);

  // FRONTEND FILTERING - Filter vendors based on selected event and status
  const filteredVendors = useMemo(() => {
    const list = Array.isArray(vendors) ? vendors : [];

    return list.filter((vendor: any) => {
      // Filter by event
      if (selectedEventId) {
        const vendorEventId = vendor?.selectedEvent?._id || vendor?.selectedEvent;
        if (vendorEventId !== selectedEventId) {
          return false;
        }
      }

      // Filter by status
      if (filterStatus && vendor?.status !== filterStatus) {
        return false;
      }

      return true;
    });
  }, [vendors, selectedEventId, filterStatus]);

  const handleStatusChange = async (vendorId: string, newStatus: string) => {
    if (!['booked', 'confirmed'].includes(newStatus)) {
      alert('Invalid status. Only "Booked" and "Confirmed" are allowed.');
      return;
    }

    try {
      await dispatch(updateVendor({ id: vendorId, updates: { status: newStatus } })).unwrap();
      dispatch(fetchVendors());
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (vendorId: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;

    try {
      await dispatch(deleteVendor(vendorId)).unwrap();
      dispatch(fetchVendors());
    } catch (error) {
      console.error('Failed to delete vendor:', error);
      alert('Failed to delete vendor');
    }
  };

  const handleViewDetails = (vendor: any) => {
    setSelectedVendor(vendor);
    setShowModal(true);
  };

  const handleRefresh = () => {
    dispatch(fetchEvents());
    dispatch(fetchVendors());
  };

  const isSelectDisabled = eventsLoading || eventOptions.length === 0;
  const loading = vendorsLoading || eventsLoading;

  return (
    <div className="space-y-6 bg-black min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-yellow-500">Vendors Management</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage all vendor registrations and booth assignments
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Event Filter */}
        <div className="bg-black rounded-lg border border-yellow-500/30 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-yellow-500" />
            <label className="text-sm font-medium text-yellow-500">
              Filter by Event
            </label>
          </div>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            disabled={isSelectDisabled}
            className={`w-full px-4 py-2.5 bg-black border border-yellow-500/50 text-yellow-100 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${isSelectDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            style={{
              backgroundColor: "#000", // closed select bg
              color: "#FDE68A", // text-yellow-ish
            }}
          >
            <option
              value=""
              className="bg-black text-yellow-100"
              style={{ backgroundColor: "#000", color: "#FDE68A" }}
            >
              {eventsLoading
                ? "Loading events..."
                : eventOptions.length
                  ? "All Events"
                  : "No active events available"}
            </option>

            {eventOptions.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-black text-yellow-100"
                style={{ backgroundColor: "#000", color: "#FDE68A" }}
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="bg-black rounded-lg border border-yellow-500/30 p-4">
          <label className="block text-sm font-medium text-yellow-500 mb-2">
            Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2.5 bg-black-900 border border-yellow-500/50 text-yellow-100 rounded-lg focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">All Statuses</option>
            <option value="booked">Booked</option>
            <option value="confirmed">Confirmed</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black rounded-lg border border-yellow-500 p-4">
          <p className="text-sm text-gray-400">Total Vendors</p>
          <p className="text-2xl font-bold text-yellow-500 mt-1">
            {filteredVendors.length}
          </p>
        </div>
        <div className="bg-black rounded-lg border border-yellow-500 p-4">
          <p className="text-sm text-gray-400">Booked</p>
          <p className="text-2xl font-bold text-yellow-500 mt-1">
            {filteredVendors.filter((v: any) => v.status === 'booked').length}
          </p>
        </div>
        <div className="bg-black rounded-lg border border-yellow-500 p-4">
          <p className="text-sm text-gray-400">Confirmed</p>
          <p className="text-2xl font-bold text-yellow-500 mt-1">
            {filteredVendors.filter((v: any) => v.status === 'confirmed').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-black rounded-lg border border-yellow-500 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-yellow-500" />
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {selectedEventId
                ? 'No vendors found for this event'
                : 'No vendors found'}
            </p>
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
                    Event
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
                {filteredVendors.map((vendor: any) => (
                  <tr key={vendor._id} className="hover:bg-gray-900 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-300">
                        {vendor.vendorName}
                      </div>
                      {vendor.contact?.isOakville && (
                        <span className="text-xs bg-blue-900/50 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded mt-1 inline-block">
                          Oakville
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300 font-medium">
                        {vendor.selectedEvent?.title || 'N/A'}
                      </div>
                      {vendor.selectedEvent?.eventDateTime && (
                        <div className="text-xs text-gray-500">
                          {new Date(vendor.selectedEvent.eventDateTime).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      )}
                      {vendor.selectedEvent?.location && (
                        <div className="text-xs text-gray-500">
                          📍 {vendor.selectedEvent.location}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-300">{vendor.contact?.personName}</div>
                        <div className="text-gray-500 text-xs">{vendor.contact?.email}</div>
                        <div className="text-gray-500 text-xs">{vendor.contact?.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm bg-yellow-900/30 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded">
                        {vendor.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="text-sm font-bold text-yellow-500">
                          #{vendor.boothNumber}
                        </span>
                        {vendor.boothTableCategory && (
                          <div className="text-xs text-gray-500">{vendor.boothTableCategory}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={vendor.status}
                        onChange={(e) => handleStatusChange(vendor._id, e.target.value)}
                        className={`text-sm px-3 py-1 rounded-full cursor-pointer border focus:ring-2 focus:ring-yellow-500 bg-black ${vendor.status === 'booked'
                            ? 'text-yellow-500 border-yellow-500'
                            : vendor.status === 'confirmed'
                              ? 'text-green-500 border-green-500'
                              : 'text-gray-500 border-gray-500'
                          }`}
                      >
                        <option value="booked">Booked</option>
                        <option value="confirmed">Confirmed</option>
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
                          className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition"
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