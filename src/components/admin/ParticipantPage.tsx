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
      'KIDS': 'from-pink-500 to-pink-600',
      'TEENS': 'from-purple-500 to-purple-600',
      'ADULTS': 'from-blue-500 to-blue-600',
      'SENIORS': 'from-green-500 to-green-600',
    };
    return colors[category?.toUpperCase()] || 'from-gray-500 to-gray-600';
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      'KIDS': 'bg-pink-100 text-pink-800',
      'TEENS': 'bg-purple-100 text-purple-800',
      'ADULTS': 'bg-blue-100 text-blue-800',
      'SENIORS': 'bg-green-100 text-green-800',
    };
    return colors[category?.toUpperCase()] || 'bg-gray-100 text-gray-800';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Participants Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage event participants and registrations
          </p>
        </div>
        <button
          onClick={loadParticipants}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Kids</p>
              <p className="text-2xl font-bold mt-1">
                {participants.filter(p => p.category?.toUpperCase() === 'KIDS').length}
              </p>
            </div>
            <Users className="w-8 h-8 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Teens</p>
              <p className="text-2xl font-bold mt-1">
                {participants.filter(p => p.category?.toUpperCase() === 'TEENS').length}
              </p>
            </div>
            <Users className="w-8 h-8 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Adults</p>
              <p className="text-2xl font-bold mt-1">
                {participants.filter(p => p.category?.toUpperCase() === 'ADULTS').length}
              </p>
            </div>
            <Users className="w-8 h-8 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total</p>
              <p className="text-2xl font-bold mt-1">{participants.length}</p>
            </div>
            <Users className="w-8 h-8 opacity-50" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredParticipants.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No participants found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Excitement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredParticipants.map((participant) => (
                  <tr key={participant._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getCategoryColor(participant.category)} flex items-center justify-center`}>
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {participant.name}
                          </div>
                          {participant.dob && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(participant.dob).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-900">{participant.email}</div>
                        <div className="text-gray-500">{participant.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(participant.category)}`}>
                        {participant.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        {getAgeGroupBadge(participant.ageGroup)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-lg ${i < (participant.excitement || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(participant)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(participant._id)}
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
    </div>
  );
};

export default ParticipantsPage;