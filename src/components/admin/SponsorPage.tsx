// src/components/admin/SponsorsPage.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';

import { Search, Eye, Trash2, RefreshCw, Award } from 'lucide-react';
import SponsorDetailsModal from './SponsorDetailsModal';
import { deleteSponsor, fetchSponsors } from '@/services/dashbord/asyncThunk';

const SponsorsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sponsors, loading } = useAppSelector((state) => state.dashboard);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSponsor, setSelectedSponsor] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadSponsors();
  }, []);

  const loadSponsors = () => {
    dispatch(fetchSponsors());
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

  const filteredSponsors = sponsors.filter((sponsor) =>
    sponsor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sponsor.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sponsor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    if (category?.includes('PLATINUM')) return 'from-purple-600 to-purple-700';
    if (category?.includes('GOLD')) return 'from-yellow-500 to-yellow-600';
    if (category?.includes('SILVER')) return 'from-gray-400 to-gray-500';
    return 'from-gray-600 to-gray-700';
  };

  const getCategoryBadgeColor = (category: string) => {
    if (category?.includes('PLATINUM')) return 'bg-purple-100 text-purple-800';
    if (category?.includes('GOLD')) return 'bg-yellow-100 text-yellow-800';
    if (category?.includes('SILVER')) return 'bg-gray-200 text-gray-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sponsors Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage event sponsors and partnership tiers
          </p>
        </div>
        <button
          onClick={loadSponsors}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-500 transition"
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
            placeholder="Search by business name, owner, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Platinum</p>
              <p className="text-2xl font-bold mt-1">
                {sponsors.filter(s => s.category?.includes('PLATINUM')).length}
              </p>
            </div>
            <Award className="w-8 h-8 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Gold</p>
              <p className="text-2xl font-bold mt-1">
                {sponsors.filter(s => s.category?.includes('GOLD')).length}
              </p>
            </div>
            <Award className="w-8 h-8 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100 text-sm">Silver</p>
              <p className="text-2xl font-bold mt-1">
                {sponsors.filter(s => s.category?.includes('SILVER')).length}
              </p>
            </div>
            <Award className="w-8 h-8 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Total</p>
              <p className="text-2xl font-bold mt-1">{sponsors.length}</p>
            </div>
            <Award className="w-8 h-8 opacity-50" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredSponsors.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No sponsors found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSponsors.map((sponsor) => (
                  <tr key={sponsor._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getCategoryColor(sponsor.category)} flex items-center justify-center`}>
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {sponsor.businessName}
                          </div>
                          {sponsor.oneLiner && (
                            <div className="text-xs text-gray-500 max-w-xs truncate">
                              {sponsor.oneLiner}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sponsor.ownerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-900">{sponsor.email}</div>
                        <div className="text-gray-500">{sponsor.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(sponsor.category)}`}>
                        {sponsor.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(sponsor)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sponsor._id)}
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