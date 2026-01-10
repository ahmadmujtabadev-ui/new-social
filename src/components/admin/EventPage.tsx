// src/components/admin/EventPage.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchEvents, deleteEvent } from '@/services/dashbord/asyncThunk';
import EventDetailsModal from '../modal/EventDetailsModal';

const EventPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { events, loading, error } = useSelector((state: RootState) => state.dashboard);
  
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    dispatch(fetchEvents());
  };

  const handleDelete = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await dispatch(deleteEvent(eventId)).unwrap();
        alert('Event deleted successfully');
        loadEvents();
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Failed to delete event');
      }
    }
  };

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedEvent(null);
    setShowModal(true);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.badge.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && events.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-yellow-500">Events Management</h1>
            <p className="text-gray-400 mt-1">Manage all community events</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            + Create Event
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 bg-black-900 border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-500 text-yellow-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-black-900 border border-yellow-500/30 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Total Events</div>
          <div className="text-2xl font-bold text-yellow-500">{events.length}</div>
        </div>
        <div className="bg-black-900 border border-yellow-500/30 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Published</div>
          <div className="text-2xl font-bold text-yellow-500">
            {events.filter(e => e.status === 'published').length}
          </div>
        </div>
        <div className="bg-black-900 border border-yellow-500/30 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Draft</div>
          <div className="text-2xl font-bold text-yellow-500">
            {events.filter(e => e.status === 'draft').length}
          </div>
        </div>
        <div className="bg-black-900 border border-yellow-500/30 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Archived</div>
          <div className="text-2xl font-bold text-gray-500">
            {events.filter(e => e.status === 'archived').length}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event._id} className="bg-black-900 border border-yellow-500/30 rounded-lg overflow-hidden hover:border-yellow-500 transition-all">
            <div className="p-6">
              {/* Badge */}
              <div className="mb-3">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                  event.status === 'published' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30' :
                  event.status === 'draft' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30' :
                  'bg-gray-900/50 text-gray-400 border border-gray-500/30'
                }`}>
                  {event.badge}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-yellow-500 mb-2">{event.title}</h3>

              {/* Date & Location */}
              <div className="space-y-2 mb-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⏰</span>
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{event.location}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {event.description}
              </p>

              {/* Highlights */}
              {event.highlights && event.highlights.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-gray-400 mb-2">Highlights:</div>
                  <div className="flex flex-wrap gap-2">
                    {event.highlights.slice(0, 3).map((highlight: string, idx: number) => (
                      <span key={idx} className="text-xs bg-yellow-900/30 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded">
                        {highlight}
                      </span>
                    ))}
                    {event.highlights.length > 3 && (
                      <span className="text-xs bg-zinc-800 text-gray-400 border border-gray-500/30 px-2 py-1 rounded">
                        +{event.highlights.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded ${
                  event.isActive ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30' : 'bg-zinc-800 text-gray-400 border border-gray-500/30'
                }`}>
                  {event.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-yellow-500 border border-yellow-500/30 px-4 py-2 rounded text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && !loading && (
        <div className="text-center py-12 bg-zinc-900 border border-yellow-500/30 rounded-lg">
          <div className="text-yellow-500 text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-yellow-500 mb-2">No events found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm ? 'Try adjusting your search' : 'Create your first event to get started'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreate}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Create Event
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => {
            setShowModal(false);
            setSelectedEvent(null);
          }}
          onSuccess={loadEvents}
        />
      )}
    </div>
  );
};

export default EventPage;