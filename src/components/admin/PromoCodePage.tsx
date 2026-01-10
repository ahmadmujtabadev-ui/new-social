// src/components/admin/PromoCodePage.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { deletePromoCode, fetchPromoCodes } from '@/services/dashbord/asyncThunk';
import PromoCodeDetailsModal from './PromoCodeDetailsModal';


const PromoCodePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { promoCodes, loading, error } = useSelector((state: RootState) => state.dashboard);
  
  const [selectedPromo, setSelectedPromo] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = () => {
    dispatch(fetchPromoCodes());
  };

  const handleDelete = async (promoId: string) => {
    if (window.confirm('Are you sure you want to delete this promo code?')) {
      try {
        await dispatch(deletePromoCode(promoId)).unwrap();
        alert('Promo code deleted successfully');
        loadPromoCodes();
      } catch (error) {
        console.error('Failed to delete promo code:', error);
        alert('Failed to delete promo code');
      }
    }
  };

  const handleEdit = (promo: any) => {
    setSelectedPromo(promo);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedPromo(null);
    setShowModal(true);
  };

  const isPromoValid = (promo: any) => {
    const now = new Date();
    const startDate = new Date(promo.startDate);
    const endDate = new Date(promo.endDate);
    const hasNotStarted = now < startDate;
    const hasExpired = now > endDate;
    const limitReached = promo.usageLimit && promo.usageCount >= promo.usageLimit;
    
    return promo.isActive && !hasNotStarted && !hasExpired && !limitReached;
  };

  const getPromoStatus = (promo: any) => {
    const now = new Date();
    const startDate = new Date(promo.startDate);
    const endDate = new Date(promo.endDate);
    
    if (!promo.isActive) return 'Inactive';
    if (now < startDate) return 'Scheduled';
    if (now > endDate) return 'Expired';
    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) return 'Limit Reached';
    return 'Active';
  };

  const filteredPromos = promoCodes.filter(promo => {
    const matchesSearch = 
      promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'active') return matchesSearch && isPromoValid(promo);
    if (filterType === 'expired') return matchesSearch && new Date(promo.endDate) < new Date();
    if (filterType === 'scheduled') return matchesSearch && new Date(promo.startDate) > new Date();
    if (filterType === 'percent') return matchesSearch && promo.discountType === 'percent';
    if (filterType === 'flat') return matchesSearch && promo.discountType === 'flat';
    
    return matchesSearch;
  });

  if (loading && promoCodes.length === 0) {
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
            <h1 className="text-3xl font-bold text-yellow-500">Promo Codes Management</h1>
            <p className="text-gray-400 mt-1">Manage all promotional discount codes</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            + Create Promo Code
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search promo codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 bg-black-900 border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-black-900 border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="all">All Codes</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="expired">Expired</option>
            <option value="percent">Percentage</option>
            <option value="flat">Flat Amount</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-500 text-yellow-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-black-900 border border-yellow-500/30 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Total Codes</div>
          <div className="text-2xl font-bold text-yellow-500">{promoCodes.length}</div>
        </div>
        <div className="bg-black-900 border border-yellow-500/30 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Active</div>
          <div className="text-2xl font-bold text-yellow-500">
            {promoCodes.filter(p => isPromoValid(p)).length}
          </div>
        </div>
        <div className="bg-black-900 border border-yellow-500/30 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Scheduled</div>
          <div className="text-2xl font-bold text-yellow-500">
            {promoCodes.filter(p => new Date(p.startDate) > new Date()).length}
          </div>
        </div>
        <div className="bg-black-900 border border-yellow-500/30 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Expired</div>
          <div className="text-2xl font-bold text-gray-500">
            {promoCodes.filter(p => new Date(p.endDate) < new Date()).length}
          </div>
        </div>
        <div className="bg-black-900 border border-yellow-500/30 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Total Usage</div>
          <div className="text-2xl font-bold text-yellow-500">
            {promoCodes.reduce((sum, p) => sum + (p.usageCount || 0), 0)}
          </div>
        </div>
      </div>

      {/* Promo Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromos.map((promo) => {
          const status = getPromoStatus(promo);
        //   const isValid = isPromoValid(promo);
          
          return (
            <div key={promo._id} className="bg-black-900 border border-yellow-500/30 rounded-lg overflow-hidden hover:border-yellow-500 transition-all">
              <div className="p-6">
                {/* Code Badge */}
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-block px-4 py-2 text-lg font-bold bg-yellow-900/50 text-yellow-400 border border-yellow-500/30 rounded">
                    {promo.code}
                  </span>
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    status === 'Active' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30' :
                    status === 'Scheduled' ? 'bg-blue-900/50 text-blue-400 border border-blue-500/30' :
                    status === 'Expired' ? 'bg-gray-900/50 text-gray-400 border border-gray-500/30' :
                    status === 'Limit Reached' ? 'bg-red-900/50 text-red-400 border border-red-500/30' :
                    'bg-gray-900/50 text-gray-400 border border-gray-500/30'
                  }`}>
                    {status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-white text-base font-medium mb-4">
                  {promo.description}
                </p>

                {/* Discount Info */}
                <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                  <div className="text-3xl font-bold text-yellow-500">
                    {promo.discountType === 'percent' ? `${promo.discount}%` : `$${promo.discount}`}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {promo.discountType === 'percent' ? 'Percentage Off' : 'Flat Discount'}
                  </div>
                </div>

                {/* Date Range */}
                <div className="space-y-2 mb-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>Start: {new Date(promo.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>End: {new Date(promo.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Usage Stats */}
                {promo.usageLimit && (
                  <div className="mb-4 p-3 bg-black border border-yellow-500/30 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400">Usage</span>
                      <span className="text-xs text-yellow-400">
                        {promo.usageCount || 0} / {promo.usageLimit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(((promo.usageCount || 0) / promo.usageLimit) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {!promo.usageLimit && (
                  <div className="mb-4 p-3 bg-black border border-yellow-500/30 rounded">
                    <div className="text-xs text-gray-400">Usage Count</div>
                    <div className="text-lg font-bold text-yellow-500">{promo.usageCount || 0}</div>
                    <div className="text-xs text-gray-400">Unlimited uses</div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(promo)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(promo._id)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-yellow-500 border border-yellow-500/30 px-4 py-2 rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPromos.length === 0 && !loading && (
        <div className="text-center py-12 bg-zinc-900 border border-yellow-500/30 rounded-lg">
          <div className="text-yellow-500 text-6xl mb-4">🎟️</div>
          <h3 className="text-xl font-semibold text-yellow-500 mb-2">No promo codes found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm ? 'Try adjusting your search or filters' : 'Create your first promo code to get started'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreate}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Create Promo Code
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <PromoCodeDetailsModal
          promo={selectedPromo}
          onClose={() => {
            setShowModal(false);
            setSelectedPromo(null);
          }}
          onSuccess={loadPromoCodes}
        />
      )}
    </div>
  );
};

export default PromoCodePage;