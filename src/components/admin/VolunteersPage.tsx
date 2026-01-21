// src/components/admin/VolunteersPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { Search, Eye, Trash2, RefreshCw, Heart, Clock, Calendar, Phone, X, Mail, CheckCircle } from 'lucide-react';
import { deleteVolunteer, fetchVolunteers, fetchEvents } from '@/services/dashbord/asyncThunk';
import { RootState } from '@/redux/store';

interface EventOption {
  value: string;
  label: string;
}

const VolunteersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Get volunteers and events from Redux store
  const { volunteers, loading: volunteersLoading } = useAppSelector(
    (state: RootState) => state.dashboard
  );
  
  const { events = [], loading: eventsLoading } = useAppSelector(
    (state: RootState) => state.dashboard
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch events on mount
  useEffect(() => {
    dispatch(fetchEvents());
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
          ? new Date(event.eventDateTime).toLocaleDateString()
          : event?.date || '';
        return {
          value: event?._id || '',
          label: `${title}${dateTime ? ` - ${dateTime}` : ''}`,
        };
      })
      .filter((opt) => opt.value);
  }, [publishedEvents]);

  // Auto-select first event when events load
  useEffect(() => {
    if (eventOptions.length > 0 && !selectedEventId) {
      setSelectedEventId(eventOptions[0].value);
    }
  }, [eventOptions]);

  // Load volunteers when event filter changes
  useEffect(() => {
    loadVolunteers();
  }, [selectedEventId]);

  const loadVolunteers = () => {
    const params: any = {};
    if (selectedEventId) params.eventId = selectedEventId;
    
    dispatch(fetchVolunteers(params));
  };

  const handleDelete = async (volunteerId: string) => {
    if (!confirm('Are you sure you want to delete this volunteer?')) return;

    try {
      await dispatch(deleteVolunteer(volunteerId)).unwrap();
      loadVolunteers();
    } catch (error) {
      console.error('Failed to delete volunteer:', error);
      alert('Failed to delete volunteer');
    }
  };

  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const isSelectDisabled = eventsLoading || eventOptions.length === 0;
  const loading = volunteersLoading || eventsLoading;

  // Filter volunteers by search term and event
  const filteredVolunteers = useMemo(() => {
    let result = volunteers;

    // Filter by event
    if (selectedEventId) {
      result = result?.filter((volunteer: any) =>
        volunteer?.selectedEvent?._id === selectedEventId ||
        volunteer?.selectedEvent === selectedEventId
      );
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter((volunteer: any) =>
        volunteer.fullName?.toLowerCase().includes(search) ||
        volunteer.email?.toLowerCase().includes(search) ||
        volunteer.phone?.toLowerCase().includes(search) ||
        volunteer.slot?.toLowerCase().includes(search)
      );
    }

    return result;
  }, [volunteers, selectedEventId, searchTerm]);

  console.log("filtered", filteredVolunteers)
  const getSlotBadgeColor = (slot: string) => {
    const slotLower = slot?.toLowerCase() || '';
    if (slotLower.includes('morning')) return 'bg-yellow-500/30 text-yellow-400 border border-yellow-500';
    if (slotLower.includes('afternoon')) return 'bg-yellow-500/20 text-yellow-500 border border-yellow-500';
    if (slotLower.includes('evening')) return 'bg-yellow-400/20 text-yellow-400 border border-yellow-400';
    if (slotLower.includes('night')) return 'bg-gray-700 text-gray-400 border border-gray-600';
    if (slotLower.includes('fullday') || slotLower.includes('full day')) return 'bg-yellow-500/20 text-yellow-500 border border-yellow-500';
    return 'bg-gray-700 text-gray-400 border border-gray-600';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const countSlot = (keyword: string) => {
    return filteredVolunteers?.filter((v: any) => v.slot?.toLowerCase().includes(keyword)).length;
  };

  return (
    <div className="space-y-6 bg-black min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-yellow-500">Volunteers Management</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage event volunteers and shift assignments
          </p>
        </div>
        <button
          onClick={loadVolunteers}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Event Filter */}
      <div className="bg-black rounded-lg border border-yellow-500/30 p-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-yellow-500" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-yellow-500 mb-2">
              Filter by Event *
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => handleEventChange(e.target.value)}
              disabled={isSelectDisabled}
              className={`w-full px-4 py-2.5 bg-black-900 border border-yellow-500/50 text-yellow-100 rounded-lg focus:ring-2 focus:ring-yellow-500 ${
                isSelectDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <option value="">
                {eventsLoading
                  ? 'Loading events...'
                  : eventOptions.length
                  ? 'All Events'
                  : 'No active events available'}
              </option>
              {eventOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-black rounded-lg border border-yellow-500 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or shift..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black border border-gray-700 text-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-black border border-yellow-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Morning</p>
              <p className="text-2xl font-bold mt-1 text-yellow-500">{countSlot('morning')}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="bg-black border border-yellow-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Afternoon</p>
              <p className="text-2xl font-bold mt-1 text-yellow-500">{countSlot('afternoon')}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="bg-black border border-yellow-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Evening</p>
              <p className="text-2xl font-bold mt-1 text-yellow-500">{countSlot('evening')}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="bg-black border border-yellow-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Night</p>
              <p className="text-2xl font-bold mt-1 text-yellow-500">{countSlot('night')}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="bg-black border border-yellow-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total</p>
              <p className="text-2xl font-bold mt-1 text-yellow-500">{filteredVolunteers?.length}</p>
            </div>
            <Heart className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-black rounded-lg border border-yellow-500 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-yellow-500" />
          </div>
        ) : filteredVolunteers?.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">
              {selectedEventId
                ? 'No volunteers found for this event'
                : searchTerm
                ? 'No volunteers match your search'
                : 'No volunteers found'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black border-b border-yellow-500">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase">
                    Volunteer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase">
                    Shift
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase">
                    Emergency Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-black divide-y divide-gray-800">
                {filteredVolunteers?.map((volunteer: any) => (
                  <tr key={volunteer?._id} className="hover:bg-gray-900 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center border border-yellow-500">
                          <Heart className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-300">
                            {volunteer?.fullName}
                          </div>
                          {volunteer.termsAcceptedAt && (
                            <div className="text-xs text-yellow-500">
                              ✓ Terms accepted
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">
                        {volunteer?.selectedEvent?.title || 'N/A'}
                      </div>
                      {volunteer.selectedEvent?.eventDateTime && (
                        <div className="text-xs text-gray-500">
                          {new Date(volunteer?.selectedEvent?.eventDateTime).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-300">{volunteer?.email}</div>
                        <div className="text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {volunteer?.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSlotBadgeColor(volunteer?.slot)}`}>
                        {volunteer?.slot}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {volunteer?.emergency ? (
                        <div className="text-sm">
                          <div className="text-gray-300 font-medium">
                            {volunteer?.emergency?.name}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {volunteer?.emergency?.relation}
                          </div>
                          <div className="text-gray-500 text-xs flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {volunteer?.emergency?.phone}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedVolunteer(volunteer);
                            setShowModal(true);
                          }}
                          className="p-2 text-yellow-500 hover:bg-yellow-500/20 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(volunteer?._id)}
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

      {/* Modal */}
      {showModal && selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-black rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-yellow-500">
            {/* Modal Header */}
            <div className="bg-black border-b border-yellow-500 p-6 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-yellow-500/20 rounded-lg transition text-gray-400 hover:text-yellow-500"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-xl flex items-center justify-center border border-yellow-500">
                  <Heart className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-yellow-500">{selectedVolunteer.fullName}</h3>
                  <p className="text-gray-400 mt-1">Volunteer Details</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Event Information */}
              <div>
                <h4 className="text-lg font-semibold text-yellow-500 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Event
                </h4>
                <div className="bg-black rounded-lg p-4 border border-yellow-500">
                  <p className="text-gray-300 font-medium">
                    {selectedVolunteer?.selectedEvent?.title || 'N/A'}
                  </p>
                  {selectedVolunteer.selectedEvent?.eventDateTime && (
                    <p className="text-gray-400 text-sm mt-1">
                      {formatDate(selectedVolunteer?.selectedEvent?.eventDateTime)}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-semibold text-yellow-500 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </h4>
                <div className="bg-black rounded-lg p-4 space-y-3 border border-yellow-500">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-gray-300 font-medium">{selectedVolunteer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="text-gray-300 font-medium">{selectedVolunteer.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shift Information */}
              <div>
                <h4 className="text-lg font-semibold text-yellow-500 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Shift Assignment
                </h4>
                <div className="bg-black rounded-lg p-4 border border-yellow-500">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getSlotBadgeColor(selectedVolunteer.slot)}`}>
                    {selectedVolunteer.slot}
                  </span>
                </div>
              </div>

              {/* Emergency Contact */}
              {selectedVolunteer.emergency && (
                <div>
                  <h4 className="text-lg font-semibold text-yellow-500 mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Emergency Contact
                  </h4>
                  <div className="bg-black rounded-lg p-4 space-y-3 border border-yellow-500">
                    <div>
                      <p className="text-sm text-gray-400">Name</p>
                      <p className="text-gray-300 font-medium">{selectedVolunteer.emergency.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Relation</p>
                      <p className="text-gray-300 font-medium">{selectedVolunteer.emergency.relation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="text-gray-300 font-medium">{selectedVolunteer.emergency.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status & Dates */}
              <div>
                <h4 className="text-lg font-semibold text-yellow-500 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Registration Details
                </h4>
                <div className="bg-black rounded-lg p-4 space-y-3 border border-yellow-500">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Registered</span>
                    <span className="text-gray-300 text-sm">{formatDate(selectedVolunteer.createdAt)}</span>
                  </div>
                  {selectedVolunteer.termsAcceptedAt && (
                    <div className="flex items-center gap-2 text-yellow-500 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Terms accepted on {formatDate(selectedVolunteer.termsAcceptedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-black border-t border-yellow-500 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-400 hover:bg-gray-800 rounded-lg transition border border-gray-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedVolunteer._id);
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition"
              >
                Delete Volunteer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteersPage;