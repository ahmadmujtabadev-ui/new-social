// src/components/admin/VendorDetailsModal.tsx
import React from 'react';
import { X, Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface VendorDetailsModalProps {
  vendor: any;
  onClose: () => void;
}

const VendorDetailsModal: React.FC<VendorDetailsModalProps> = ({ vendor, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Vendor Details</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Basic Information
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Vendor Name</p>
                  <p className="text-base font-medium text-gray-900">{vendor.vendorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="text-base font-medium text-gray-900">{vendor.category}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Booth Number</p>
                <p className="text-2xl font-bold text-yellow-600">#{vendor.boothNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  vendor.status === 'approved' ? 'bg-green-100 text-green-800' :
                  vendor.status === 'held' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                </span>
              </div>
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
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-base font-medium text-gray-900">{vendor.contact?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-base font-medium text-gray-900">{vendor.contact?.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact Person</p>
                  <p className="text-base font-medium text-gray-900">{vendor.contact?.personName}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">From Oakville:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    vendor.contact?.isOakville ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {vendor.contact?.isOakville ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          {vendor.pricing && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Pricing Details
              </h4>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Base Amount:</span>
                    <span className="text-lg font-semibold text-gray-900">
                      ${vendor.pricing.base?.toFixed(2)}
                    </span>
                  </div>

                  {vendor.pricing.promoCode && (
                    <>
                      <div className="flex justify-between items-center text-green-700">
                        <span>Promo Code: {vendor.pricing.promoCode}</span>
                        <span>
                          -{vendor.pricing.promoDiscount}
                          {vendor.pricing.promoDiscountType === 'percent' ? '%' : '$'}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-yellow-300 flex justify-between items-center">
                        <span className="text-gray-700 font-semibold">Final Amount:</span>
                        <span className="text-2xl font-bold text-yellow-600">
                          ${vendor.pricing.final?.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          {vendor.bookingTimeline && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Booking Timeline
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Submitted:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(vendor.bookingTimeline.submittedAt).toLocaleString()}
                  </span>
                </div>
                {vendor.bookingTimeline.heldUntil && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Held Until:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(vendor.bookingTimeline.heldUntil).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Category Specific Info */}
          {vendor.category === 'Food Vendor' && vendor.food && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Food Vendor Details
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Food Items</p>
                  <p className="text-base font-medium text-gray-900">{vendor.food.items}</p>
                </div>
                {vendor.food.needPower && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      Power Required: {vendor.food.watts}W
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {vendor.notes && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Additional Notes
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">{vendor.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsModal;