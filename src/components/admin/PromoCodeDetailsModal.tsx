// src/components/modal/PromoCodeDetailsModal.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { createPromoCode, fetchPromoCodes, updatePromoCode } from '@/services/dashbord/asyncThunk';
import Toast from '../Toast';

interface PromoCodeDetailsModalProps {
    promo: any | null;
    onClose: () => void;
    onSuccess: () => void;
}

const PromoCodeDetailsModal: React.FC<PromoCodeDetailsModalProps> = ({
    promo,
    onClose,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discount: '',
        discountType: 'percent' as 'percent' | 'flat',
        description: '',
        startDate: '',
        endDate: '',
        isActive: true,
        usageLimit: '',
    });

    useEffect(() => {
        if (promo) {
            setFormData({
                code: promo.code || '',
                discount: promo.discount?.toString() || '',
                discountType: promo.discountType || 'percent',
                description: promo.description || '',
                startDate: promo.startDate ? new Date(promo.startDate).toISOString().split('T')[0] : '',
                endDate: promo.endDate ? new Date(promo.endDate).toISOString().split('T')[0] : '',
                isActive: promo.isActive !== undefined ? promo.isActive : true,
                usageLimit: promo.usageLimit?.toString() || '',
            });
        }
    }, [promo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                code: formData.code.toUpperCase(),
                discount: parseFloat(formData.discount),
                discountType: formData.discountType,
                description: formData.description,
                startDate: formData.startDate,
                endDate: formData.endDate,
                isActive: formData.isActive,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
            };

            if (promo) {
                await dispatch(updatePromoCode({ id: promo._id, updates: payload })).unwrap();
                Toast.fire('Promo code updated successfully');
            } else {
                await dispatch(createPromoCode(payload)).unwrap();
                Toast.fire('Promo code created successfully');
            }

            dispatch(fetchPromoCodes());
            onClose();
        } catch (error: any) {
            console.error('Error saving promo code:', error);
            Toast.fire(error || 'Failed to save promo code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-yellow-500/30 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-yellow-500">
                            {promo ? 'Edit Promo Code' : 'Create New Promo Code'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Promo Code *
                            </label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                                placeholder="e.g., SUMMER25"
                                className="w-full px-4 py-2 bg-black border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 uppercase"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Use uppercase letters and numbers (no spaces)
                            </p>
                        </div>

                        {/* Discount Type & Amount */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Discount Type *
                                </label>
                                <select
                                    name="discountType"
                                    value={formData.discountType}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-black border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    <option value="percent">Percentage (%)</option>
                                    <option value="flat">Flat Amount ($)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Discount Value *
                                </label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step={formData.discountType === 'percent' ? '1' : '0.01'}
                                    max={formData.discountType === 'percent' ? '100' : undefined}
                                    placeholder={formData.discountType === 'percent' ? '25' : '50.00'}
                                    className="w-full px-4 py-2 bg-black border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={3}
                                placeholder="25% Early Bird Discount"
                                className="w-full px-4 py-2 bg-black border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Start Date *
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-black border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    End Date *
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                    min={formData.startDate}
                                    className="w-full px-4 py-2 bg-black border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>
                        </div>

                        {/* Usage Limit */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Usage Limit (Optional)
                            </label>
                            <input
                                type="number"
                                name="usageLimit"
                                value={formData.usageLimit}
                                onChange={handleChange}
                                min="1"
                                placeholder="Leave empty for unlimited"
                                className="w-full px-4 py-2 bg-black border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Maximum number of times this code can be used
                            </p>
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-5 h-5 text-yellow-500 bg-black border-yellow-500/30 rounded focus:ring-yellow-500"
                            />
                            <label className="text-sm font-medium text-gray-300">
                                Active (Users can use this code)
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-yellow-500/30 rounded-lg transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : promo ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PromoCodeDetailsModal;