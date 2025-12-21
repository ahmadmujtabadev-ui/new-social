// src/components/admin/VolunteersPage.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { Search, Eye, Trash2, RefreshCw, Heart, Clock, Phone, X, Mail, Calendar, CheckCircle } from 'lucide-react';
import { deleteVolunteer, fetchVolunteers } from '@/services/dashbord/asyncThunk';

const VolunteersPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { volunteers, loading } = useAppSelector((state) => state.dashboard);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadVolunteers();
    }, []);

    const loadVolunteers = () => {
        dispatch(fetchVolunteers());
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

    const handleViewDetails = (volunteer: any) => {
        setSelectedVolunteer(volunteer);
        setShowModal(true);
    };

    const filteredVolunteers = volunteers.filter((volunteer) =>
        volunteer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.slot?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSlotColor = (slot: string) => {
        const slotLower = slot?.toLowerCase() || '';
        if (slotLower.includes('morning')) return 'from-orange-400 to-orange-500';
        if (slotLower.includes('afternoon')) return 'from-yellow-400 to-yellow-500';
        if (slotLower.includes('evening')) return 'from-indigo-500 to-indigo-600';
        if (slotLower.includes('night')) return 'from-purple-500 to-purple-600';
        if (slotLower.includes('fullday') || slotLower.includes('full day')) return 'from-pink-500 to-pink-600';
        return 'from-gray-500 to-gray-600';
    };

    const getSlotBadgeColor = (slot: string) => {
        const slotLower = slot?.toLowerCase() || '';
        if (slotLower.includes('morning')) return 'bg-orange-100 text-orange-800';
        if (slotLower.includes('afternoon')) return 'bg-yellow-100 text-yellow-800';
        if (slotLower.includes('evening')) return 'bg-indigo-100 text-indigo-800';
        if (slotLower.includes('night')) return 'bg-purple-100 text-purple-800';
        if (slotLower.includes('fullday') || slotLower.includes('full day')) return 'bg-pink-100 text-pink-800';
        return 'bg-gray-100 text-gray-800';
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
        return volunteers.filter(v => v.slot?.toLowerCase().includes(keyword)).length;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Volunteers Management</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage event volunteers and shift assignments
                    </p>
                </div>
                <button
                    onClick={loadVolunteers}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
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
                        placeholder="Search by name, email, phone, or shift..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm">Morning</p>
                            <p className="text-2xl font-bold mt-1">{countSlot('morning')}</p>
                        </div>
                        <Clock className="w-8 h-8 opacity-50" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-100 text-sm">Afternoon</p>
                            <p className="text-2xl font-bold mt-1">{countSlot('afternoon')}</p>
                        </div>
                        <Clock className="w-8 h-8 opacity-50" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-indigo-100 text-sm">Evening</p>
                            <p className="text-2xl font-bold mt-1">{countSlot('evening')}</p>
                        </div>
                        <Clock className="w-8 h-8 opacity-50" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">Night</p>
                            <p className="text-2xl font-bold mt-1">{countSlot('night')}</p>
                        </div>
                        <Clock className="w-8 h-8 opacity-50" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-pink-100 text-sm">Total</p>
                            <p className="text-2xl font-bold mt-1">{volunteers.length}</p>
                        </div>
                        <Heart className="w-8 h-8 opacity-50" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : filteredVolunteers.length === 0 ? (
                    <div className="text-center py-12">
                        <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No volunteers found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Volunteer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Shift
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Emergency Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredVolunteers.map((volunteer) => (
                                    <tr key={volunteer._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getSlotColor(volunteer.slot)} flex items-center justify-center`}>
                                                    <Heart className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {volunteer.fullName}
                                                    </div>
                                                    {volunteer.termsAcceptedAt && (
                                                        <div className="text-xs text-green-600">
                                                            ✓ Terms accepted
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm">
                                                <div className="text-gray-900">{volunteer.email}</div>
                                                <div className="text-gray-500 flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {volunteer.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSlotBadgeColor(volunteer.slot)}`}>
                                                {volunteer.slot}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {volunteer.emergency ? (
                                                <div className="text-sm">
                                                    <div className="text-gray-900 font-medium">
                                                        {volunteer.emergency.name}
                                                    </div>
                                                    <div className="text-gray-500 text-xs">
                                                        {volunteer.emergency.relation}
                                                    </div>
                                                    <div className="text-gray-500 text-xs flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        {volunteer.emergency.phone}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(volunteer)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(volunteer._id)}
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
            {showModal && selectedVolunteer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className={`bg-gradient-to-br ${getSlotColor(selectedVolunteer.slot)} p-6 text-white relative`}>
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Heart className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">{selectedVolunteer.fullName}</h3>
                                    <p className="text-white/80 mt-1">Volunteer Details</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Contact Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-purple-600" />
                                    Contact Information
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="text-gray-900 font-medium">{selectedVolunteer.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="text-gray-900 font-medium">{selectedVolunteer.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shift Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-purple-600" />
                                    Shift Assignment
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getSlotBadgeColor(selectedVolunteer.slot)}`}>
                                        {selectedVolunteer.slot}
                                    </span>
                                </div>
                            </div>

                            {/* Emergency Contact */}
                            {selectedVolunteer.emergency && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Phone className="w-5 h-5 text-red-600" />
                                        Emergency Contact
                                    </h4>
                                    <div className="bg-red-50 rounded-lg p-4 space-y-3">
                                        <div>
                                            <p className="text-sm text-red-600">Name</p>
                                            <p className="text-gray-900 font-medium">{selectedVolunteer.emergency.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-red-600">Relation</p>
                                            <p className="text-gray-900 font-medium">{selectedVolunteer.emergency.relation}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-red-600">Phone</p>
                                            <p className="text-gray-900 font-medium">{selectedVolunteer.emergency.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Status & Dates */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                    Registration Details
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Status</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedVolunteer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                selectedVolunteer.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {selectedVolunteer.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Registered</span>
                                        <span className="text-gray-900 text-sm">{formatDate(selectedVolunteer.createdAt)}</span>
                                    </div>
                                    {selectedVolunteer.termsAcceptedAt && (
                                        <div className="flex items-center gap-2 text-green-600 text-sm">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Terms accepted on {formatDate(selectedVolunteer.termsAcceptedAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(selectedVolunteer._id);
                                    setShowModal(false);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
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