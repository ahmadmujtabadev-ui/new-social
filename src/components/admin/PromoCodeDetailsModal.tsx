// src/components/modal/PromoCodeDetailsModal.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { createPromoCode, fetchPromoCodes, updatePromoCode, fetchEvents } from '@/services/dashbord/asyncThunk';
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
    const { events = [] } = useSelector((state: RootState) => state.dashboard);
    
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discount: '',
        discountType: 'percent' as 'percent' | 'flat',
        description: '',
        startDate: '',
        endDate: '',
        isActive: true,
        promoScope: 'all' as 'all' | 'specific',
        applicableEvents: [] as string[],
        maxDiscountAmount: '',
        minPurchaseAmount: '',
    });

    // Fetch events when modal opens
    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);

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
                promoScope: promo.promoScope || 'all',
                applicableEvents: promo.applicableEvents?.map((e: any) => e._id || e) || [],
                maxDiscountAmount: promo.maxDiscountAmount?.toString() || '',
                minPurchaseAmount: promo.minPurchaseAmount?.toString() || '',
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

    const handleEventToggle = (eventId: string) => {
        setFormData(prev => ({
            ...prev,
            applicableEvents: prev.applicableEvents.includes(eventId)
                ? prev.applicableEvents.filter(id => id !== eventId)
                : [...prev.applicableEvents, eventId]
        }));
    };

    const handleSelectAllEvents = () => {
        const allEventIds = events.map((e: any) => e._id);
        setFormData(prev => ({
            ...prev,
            applicableEvents: allEventIds
        }));
    };

    const handleDeselectAllEvents = () => {
        setFormData(prev => ({
            ...prev,
            applicableEvents: []
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate event-specific promos
        if (formData.promoScope === 'specific' && formData.applicableEvents.length === 0) {
            Toast.fire('Please select at least one event for specific scope promos');
            return;
        }

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
                promoScope: formData.promoScope,
                applicableEvents: formData.promoScope === 'specific' ? formData.applicableEvents : [],
                maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
                minPurchaseAmount: formData.minPurchaseAmount ? parseFloat(formData.minPurchaseAmount) : 0,
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

    // Helper function to get event ID
    const getEventId = (event: any): string => {
        return String(event?._id ?? event?.id ?? "");
    };

    // Helper function to get event label
    const getEventLabel = (event: any): string => {
        return String(event?.title ?? event?.name ?? event?.eventName ?? "Untitled Event");
    };

    // Helper function to get event date
    const getEventDate = (event: any): string => {
        const dateField = event?.date ?? event?.startDate ?? event?.eventDate;
        if (!dateField) return '';
        try {
            return new Date(dateField).toLocaleDateString();
        } catch {
            return '';
        }
    };

    // Filter only published and active events
    const availableEvents = events.filter((event: any) => 
        event?.status === "published" && !!event?.isActive
    );

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
            <div className="bg-zinc-900 border border-yellow-500/30 rounded-lg w-full max-w-4xl my-4 sm:my-8">
                <div className="p-3 sm:p-4 md:p-6 max-h-[75vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-500">
                            {promo ? 'Edit Promo Code' : 'Create New Promo Code'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors text-2xl sm:text-3xl w-8 h-8 flex items-center justify-center"
                        >
                            ×
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {/* Basic Info Section */}
                        <div className="bg-black/50 p-3 sm:p-4 rounded-lg border border-yellow-500/20">
                            <h3 className="text-base sm:text-lg font-semibold text-yellow-400 mb-3 sm:mb-4">Basic Information</h3>
                            
                            <div className="space-y-3 sm:space-y-4">
                                {/* Code */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                                        Promo Code *
                                    </label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., SUMMER25"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-black border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 uppercase"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Use uppercase letters and numbers (no spaces)
                                    </p>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows={3}
                                        placeholder="e.g., 25% Early Bird Discount"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-black border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Discount Settings Section */}
                        <div className="bg-black/50 p-3 sm:p-4 rounded-lg border border-yellow-500/20">
                            <h3 className="text-base sm:text-lg font-semibold text-yellow-400 mb-3 sm:mb-4">Discount Settings</h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {/* Discount Type */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                                        Discount Type *
                                    </label>
                                    <select
                                        name="discountType"
                                        value={formData.discountType}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-black border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <option value="percent">Percentage (%)</option>
                                        <option value="flat">Flat Amount ($)</option>
                                    </select>
                                </div>

                                {/* Discount Value */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
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
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-black border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>

                                {/* Max Discount Cap */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                                        Max Discount Cap
                                    </label>
                                    <input
                                        type="number"
                                        name="maxDiscountAmount"
                                        value={formData.maxDiscountAmount}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        placeholder="e.g., 100"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-black border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Max amount for % discounts
                                    </p>
                                </div>

                                {/* Min Purchase */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                                        Min Purchase
                                    </label>
                                    <input
                                        type="number"
                                        name="minPurchaseAmount"
                                        value={formData.minPurchaseAmount}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        placeholder="e.g., 50"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-black border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Min purchase required
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Date Range Section */}
                        <div className="bg-black/50 p-3 sm:p-4 rounded-lg border border-yellow-500/20">
                            <h3 className="text-base sm:text-lg font-semibold text-yellow-400 mb-3 sm:mb-4">Validity Period</h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-black border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                                        End Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        required
                                        min={formData.startDate}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-black border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Event Scope Section */}
                        <div className="bg-black/50 p-3 sm:p-4 rounded-lg border border-yellow-500/20">
                            <h3 className="text-base sm:text-lg font-semibold text-yellow-400 mb-3 sm:mb-4">Event Applicability</h3>
                            
                            <div className="space-y-3 sm:space-y-4">
                                {/* Promo Scope */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                                        Apply To *
                                    </label>
                                    <select
                                        name="promoScope"
                                        value={formData.promoScope}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-black border border-yellow-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <option value="all">All Events</option>
                                        <option value="specific">Specific Events Only</option>
                                    </select>
                                </div>

                                {/* Event Selection */}
                                {formData.promoScope === 'specific' && (
                                    <div>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                            <label className="block text-xs sm:text-sm font-medium text-gray-300">
                                                Select Events *
                                            </label>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={handleSelectAllEvents}
                                                    className="text-xs px-2 sm:px-3 py-1 bg-yellow-900/50 text-yellow-400 border border-yellow-500/30 rounded hover:bg-yellow-900/70 transition-colors"
                                                >
                                                    Select All
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleDeselectAllEvents}
                                                    className="text-xs px-2 sm:px-3 py-1 bg-zinc-800 text-gray-400 border border-gray-500/30 rounded hover:bg-zinc-700 transition-colors"
                                                >
                                                    Clear All
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="max-h-48 sm:max-h-64 overflow-y-auto border border-yellow-500/30 rounded-lg p-2 bg-black">
                                            {availableEvents && availableEvents.length > 0 ? (
                                                <div className="space-y-2">
                                                    {availableEvents.map((event: any) => {
                                                        const eventId = getEventId(event);
                                                        const eventLabel = getEventLabel(event);
                                                        const eventDate = getEventDate(event);
                                                        
                                                        return (
                                                            <div 
                                                                key={eventId}
                                                                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-yellow-900/20 rounded cursor-pointer transition-colors"
                                                                onClick={() => handleEventToggle(eventId)}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={formData.applicableEvents.includes(eventId)}
                                                                    onChange={() => handleEventToggle(eventId)}
                                                                    className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 bg-black border-yellow-500/30 rounded focus:ring-yellow-500 flex-shrink-0"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-white font-medium text-sm sm:text-base truncate">{eventLabel}</div>
                                                                    {eventDate && (
                                                                        <div className="text-xs text-gray-400">
                                                                            📅 {eventDate}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-center py-6 sm:py-8 text-gray-400">
                                                    <div className="text-3xl sm:text-4xl mb-2">📅</div>
                                                    <p className="text-sm">No active events available.</p>
                                                    <p className="text-xs mt-1">Create and publish events first.</p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {formData.applicableEvents.length > 0 && (
                                            <p className="text-xs text-yellow-400 mt-2">
                                                ✓ {formData.applicableEvents.length} event(s) selected
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Section */}
                        <div className="bg-black/50 p-3 sm:p-4 rounded-lg border border-yellow-500/20">
                            <h3 className="text-base sm:text-lg font-semibold text-yellow-400 mb-3 sm:mb-4">Status</h3>
                            
                            <div className="flex items-center gap-2 sm:gap-3">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 bg-black border-yellow-500/30 rounded focus:ring-yellow-500 flex-shrink-0"
                                />
                                <label className="text-xs sm:text-sm font-medium text-gray-300">
                                    Active (Users can use this code)
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-zinc-800 hover:bg-zinc-700 text-white border border-yellow-500/30 rounded-lg transition-colors font-medium"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : promo ? 'Update Promo Code' : 'Create Promo Code'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PromoCodeDetailsModal;