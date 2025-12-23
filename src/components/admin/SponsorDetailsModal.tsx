// src/components/admin/SponsorDetailsModal.tsx
import React from 'react';
import { X, Mail, Phone, Award, Building2, User } from 'lucide-react';

interface SponsorDetailsModalProps {
  sponsor: any;
  onClose: () => void;
}

const SponsorDetailsModal: React.FC<SponsorDetailsModalProps> = ({ sponsor, onClose }) => {
  const getCategoryBadge = (category: string) => {
    if (category?.includes('PLATINUM')) return 'bg-yellow-500/30 text-yellow-400 border-yellow-500';
    if (category?.includes('GOLD')) return 'bg-yellow-500/20 text-yellow-500 border-yellow-500';
    if (category?.includes('SILVER')) return 'bg-gray-700 text-gray-400 border-gray-600';
    return 'bg-gray-700 text-gray-400 border-gray-600';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-black rounded-lg shadow-xl max-w-2xl w-full h-[70vh] overflow-y-auto border border-yellow-500">
        {/* Header */}
        <div className="sticky top-0 bg-black border-b border-yellow-500 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-yellow-500">Sponsor Details</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/20 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Category Badge */}
          <div className="flex justify-center">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl ${getCategoryBadge(sponsor.category)} border shadow-lg`}>
              <Award className="w-6 h-6" />
              <span className="text-lg font-bold">{sponsor.category}</span>
            </div>
          </div>

          {/* Business Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Business Information
            </h4>
            <div className="bg-black rounded-lg p-4 space-y-3 border border-yellow-500">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-yellow-500" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Business Name</p>
                  <p className="text-base font-medium text-gray-300">{sponsor.businessName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-yellow-500" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Owner Name</p>
                  <p className="text-base font-medium text-gray-300">{sponsor.ownerName}</p>
                </div>
              </div>

              {sponsor.oneLiner && (
                <div className="pt-3 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Description</p>
                  <p className="text-base text-gray-300">{sponsor.oneLiner}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Contact Information
            </h4>
            <div className="bg-black rounded-lg p-4 space-y-3 border border-yellow-500">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-yellow-500" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email Address</p>
                  <a
                    href={`mailto:${sponsor.email}`}
                    className="text-base font-medium text-yellow-500 hover:text-yellow-400"
                  >
                    {sponsor.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-yellow-500" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone Number</p>
                  <a
                    href={`tel:${sponsor.phone}`}
                    className="text-base font-medium text-yellow-500 hover:text-yellow-400"
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
              <div className="bg-black rounded-lg p-4 flex justify-center border border-yellow-500">
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
              <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4">
                <p className="text-sm text-yellow-500">
                  ✓ Terms accepted on {new Date(sponsor.termsAcceptedAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Registration Date */}
          {sponsor.createdAt && (
            <div className="bg-black rounded-lg p-4 border border-yellow-500">
              <p className="text-sm text-gray-400">Registration Date</p>
              <p className="text-base font-medium text-gray-300">
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
        <div className="sticky bottom-0 bg-black border-t border-yellow-500 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SponsorDetailsModal;