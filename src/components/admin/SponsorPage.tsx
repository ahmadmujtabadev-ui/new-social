// src/components/admin/SponsorsPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { Search, Eye, Trash2, RefreshCw, Award, Calendar } from 'lucide-react';
import SponsorDetailsModal from './SponsorDetailsModal';
import { deleteSponsor, fetchSponsors, fetchEvents } from '@/services/dashbord/asyncThunk';
import { RootState } from '@/redux/store';

interface EventOption {
  value: string;
  label: string;
}

const SponsorsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Get sponsors and events from Redux store
  const { sponsors, loading: sponsorsLoading } = useAppSelector(
    (state: RootState) => state.dashboard
  );
  
  const { events = [], loading: eventsLoading } = useAppSelector(
    (state: RootState) => state.dashboard
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedSponsor, setSelectedSponsor] = useState<any>(null);
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

  // Load sponsors when event filter changes
  useEffect(() => {
    loadSponsors();
  }, [selectedEventId]);

  const loadSponsors = () => {
    const params: any = {};
    if (selectedEventId) params.eventId = selectedEventId;
    
    dispatch(fetchSponsors(params));
  };

  const handleDelete = async (sponsorId: string) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) return;

    try {
      await dispatch(deleteSponsor(sponsorId)).unwrap();
      loadSponsors();
    } catch (error) {
      console.error('Failed to delete sponsor:', error);
      alert('Failed to delete sponsor');
    }
  };

  const handleViewDetails = (sponsor: any) => {
    setSelectedSponsor(sponsor);
    setShowModal(true);
  };

  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const isSelectDisabled = eventsLoading || eventOptions.length === 0;
  const loading = sponsorsLoading || eventsLoading;

  // Filter sponsors by search term and event (in case backend doesn't filter)
  const filteredSponsors = useMemo(() => {
    let result = sponsors ;

    // Filter by event
    if (selectedEventId) {
      result = result?.filter((sponsor: any) => 
        sponsor?.selectedEvent?._id === selectedEventId ||
        sponsor?.selectedEvent === selectedEventId
      );
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter((sponsor: any) =>
        sponsor.businessName?.toLowerCase().includes(search) ||
        sponsor.ownerName?.toLowerCase().includes(search) ||
        sponsor.email?.toLowerCase().includes(search)
      );
    }

    return result;
  }, [sponsors, selectedEventId, searchTerm]);

  const getCategoryBadgeColor = (category: string) => {
    if (category?.includes('PLATINUM')) return 'bg-yellow-500/30 text-yellow-400 border border-yellow-500';
    if (category?.includes('GOLD')) return 'bg-yellow-500/20 text-yellow-500 border border-yellow-500';
    if (category?.includes('SILVER')) return 'bg-gray-700 text-gray-400 border border-gray-600';
    return 'bg-gray-700 text-gray-400 border border-gray-600';
  };

  return (
    <div className="space-y-6 bg-black min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-yellow-500">Sponsors Management</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage event sponsors and partnership tiers
          </p>
        </div>
        <button
          onClick={loadSponsors}
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
            placeholder="Search by business name, owner, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black-900 border border-gray-700 text-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-black border border-yellow-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Platinum</p>
              <p className="text-2xl font-bold mt-1 text-yellow-500">
                {filteredSponsors?.filter((s: any) => s.category?.includes('PLATINUM')).length}
              </p>
            </div>
            <Award className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="bg-black border border-yellow-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Gold</p>
              <p className="text-2xl font-bold mt-1 text-yellow-500">
                {filteredSponsors?.filter((s: any) => s?.category?.includes('GOLD')).length}
              </p>
            </div>
            <Award className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="bg-black border border-yellow-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Silver</p>
              <p className="text-2xl font-bold mt-1 text-yellow-500">
                {filteredSponsors?.filter((s: any) => s?.category?.includes('SILVER')).length}
              </p>
            </div>
            <Award className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="bg-black border border-yellow-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total</p>
              <p className="text-2xl font-bold mt-1 text-yellow-500">
                {filteredSponsors?.length}
              </p>
            </div>
            <Award className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-black rounded-lg border border-yellow-500 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-yellow-500" />
          </div>
        ) : filteredSponsors?.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">
              {selectedEventId
                ? 'No sponsors found for this event'
                : searchTerm
                ? 'No sponsors match your search'
                : 'No sponsors found'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black-900 border-b border-yellow-500">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-black divide-y divide-gray-800">
                {filteredSponsors?.map((sponsor: any) => (
                  <tr key={sponsor?._id} className="hover:bg-gray-900 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center border border-yellow-500">
                          <Award className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-300">
                            {sponsor?.businessName}
                          </div>
                          {sponsor?.oneLiner && (
                            <div className="text-xs text-gray-500 max-w-xs truncate">
                              {sponsor?.oneLiner}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">
                        {sponsor?.selectedEvent?.title || 'N/A'}
                      </div>
                      {sponsor?.selectedEvent?.eventDateTime && (
                        <div className="text-xs text-gray-500">
                          {new Date(sponsor?.selectedEvent?.eventDateTime).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {sponsor?.ownerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-300">{sponsor?.email}</div>
                        <div className="text-gray-500">{sponsor?.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(sponsor?.category)}`}>
                        {sponsor?.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(sponsor)}
                          className="p-2 text-yellow-500 hover:bg-yellow-500/20 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sponsor?._id)}
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
      {showModal && selectedSponsor && (
        <SponsorDetailsModal
          sponsor={selectedSponsor}
          onClose={() => {
            setShowModal(false);
            setSelectedSponsor(null);
          }}
        />
      )}
    </div>
  );
};

export default SponsorsPage;