// src/components/admin/ParticipantsPage.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { Search, Eye, Trash2, RefreshCw, Users, Calendar } from 'lucide-react';
import { deleteParticipant, fetchParticipants } from '@/services/dashbord/asyncThunk';

const ParticipantsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { participants, loading } = useAppSelector((state) => state.dashboard);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
console.log(selectedParticipant, showModal)
  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = () => {
    dispatch(fetchParticipants());
  };

  const handleDelete = async (participantId: string) => {
    if (!confirm('Are you sure you want to delete this participant?')) return;

    try {
      await dispatch(deleteParticipant(participantId)).unwrap();
      loadParticipants();
    } catch (error) {
      console.error('Failed to delete participant:', error);
      alert('Failed to delete participant');
    }
  };

  const handleViewDetails = (participant: any) => {
    setSelectedParticipant(participant);
    setShowModal(true);
  };

  const filteredParticipants = participants.filter((participant) =>
    participant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'KIDS': 'from-yellow-500 to-yellow-600',
      'TEENS': 'from-amber-500 to-amber-600',
      'ADULTS': 'from-yellow-600 to-amber-700',
      'SENIORS': 'from-amber-600 to-yellow-700',
    };
    return colors[category?.toUpperCase()] || 'from-gray-700 to-gray-800';
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      'KIDS': 'bg-yellow-500 text-black',
      'TEENS': 'bg-amber-500 text-black',
      'ADULTS': 'bg-yellow-600 text-white',
      'SENIORS': 'bg-amber-600 text-white',
    };
    return colors[category?.toUpperCase()] || 'bg-gray-700 text-white';
  };

  const getAgeGroupBadge = (ageGroup: string) => {
    const groups: Record<string, string> = {
      'UNDER_12': 'Under 12',
      '13_17': '13-17',
      '18_35': '18-35',
      '36_50': '36-50',
      'ABOVE_50': '50+'
    };
    return groups[ageGroup] || ageGroup;
  };

  return (
    <div className="space-y-6 bg-black min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-yellow-500">Participants Management</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage event participants and registrations
          </p>
        </div>
        <button
          onClick={loadParticipants}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-medium rounded-lg hover:from-yellow-600 hover:to-amber-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="bg-gray-900 rounded-lg border border-yellow-500/30 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black border border-yellow-500/50 rounded-lg text-yellow-100 placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-black border border-yellow-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black/70 text-sm font-medium">Kids</p>
              <p className="text-2xl font-bold mt-1">
                {participants.filter(p => p.category?.toUpperCase() === 'KIDS').length}
              </p>
            </div>
            <Users className="w-8 h-8 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-4 text-black border border-amber-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black/70 text-sm font-medium">Teens</p>
              <p className="text-2xl font-bold mt-1">
                {participants.filter(p => p.category?.toUpperCase() === 'TEENS').length}
              </p>
            </div>
            <Users className="w-8 h-8 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-600 to-amber-700 rounded-lg p-4 text-white border border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Adults</p>
              <p className="text-2xl font-bold mt-1">
                {participants.filter(p => p.category?.toUpperCase() === 'ADULTS').length}
              </p>
            </div>
            <Users className="w-8 h-8 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-600 to-yellow-700 rounded-lg p-4 text-white border border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Total</p>
              <p className="text-2xl font-bold mt-1">{participants.length}</p>
            </div>
            <Users className="w-8 h-8 opacity-50" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-lg border border-yellow-500/30 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-yellow-500" />
          </div>
        ) : filteredParticipants.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No participants found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black border-b border-yellow-500/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Participant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Age Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Excitement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {filteredParticipants.map((participant) => (
                  <tr key={participant._id} className="hover:bg-gray-800 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getCategoryColor(participant.category)} flex items-center justify-center`}>
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-yellow-100">
                            {participant.name}
                          </div>
                          {participant.dob && (
                            <div className="text-xs text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(participant.dob).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-yellow-100">{participant.email}</div>
                        <div className="text-gray-400">{participant.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(participant.category)}`}>
                        {participant.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-gray-800 text-yellow-500 border border-yellow-500/30 rounded-full text-xs font-medium">
                        {getAgeGroupBadge(participant.ageGroup)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-lg ${i < (participant.excitement || 0) ? 'text-yellow-500' : 'text-gray-700'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(participant)}
                          className="p-2 text-yellow-500 hover:bg-yellow-500/10 border border-yellow-500/30 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(participant._id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition"
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
    </div>
  );
};

export default ParticipantsPage;