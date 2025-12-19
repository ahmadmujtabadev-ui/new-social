// src/components/admin/SponsorDetailsModal.tsx
import React from 'react';
import { X, Mail, Phone, Award, Building2, User } from 'lucide-react';

interface SponsorDetailsModalProps {
  sponsor: any;
  onClose: () => void;
}

const SponsorDetailsModal: React.FC<SponsorDetailsModalProps> = ({ sponsor, onClose }) => {
  const getCategoryColor = (category: string) => {
    if (category?.includes('PLATINUM')) return 'from-purple-600 to-purple-700';
    if (category?.includes('GOLD')) return 'from-yellow-500 to-yellow-600';
    if (category?.includes('SILVER')) return 'from-gray-400 to-gray-500';
    return 'from-gray-600 to-gray-700';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Sponsor Details</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Category Badge */}
          <div className="flex justify-center">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r ${getCategoryColor(sponsor.category)} text-white shadow-lg`}>
              <Award className="w-6 h-6" />
              <span className="text-lg font-bold">{sponsor.category}</span>
            </div>
          </div>

          {/* Business Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Business Information
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Business Name</p>
                  <p className="text-base font-medium text-gray-900">{sponsor.businessName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Owner Name</p>
                  <p className="text-base font-medium text-gray-900">{sponsor.ownerName}</p>
                </div>
              </div>

              {sponsor.oneLiner && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-base text-gray-900">{sponsor.oneLiner}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Contact Information
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <a
                    href={`mailto:${sponsor.email}`}
                    className="text-base font-medium text-blue-600 hover:underline"
                  >
                    {sponsor.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <a
                    href={`tel:${sponsor.phone}`}
                    className="text-base font-medium text-green-600 hover:underline"
                  >
                    {sponsor.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Logo */}
          {sponsor.logoPath && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Business Logo
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
                <img
                  src={sponsor.logoPath}
                  alt={sponsor.businessName}
                  className="max-h-40 object-contain"
                />
              </div>
            </div>
          )}

          {/* Terms */}
          {sponsor.termsAcceptedAt && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Terms & Conditions
              </h4>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  ✓ Terms accepted on {new Date(sponsor.termsAcceptedAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Registration Date */}
          {sponsor.createdAt && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Registration Date</p>
              <p className="text-base font-medium text-gray-900">
                {new Date(sponsor.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SponsorDetailsModal;