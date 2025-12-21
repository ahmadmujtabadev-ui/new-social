// src/components/admin/VendorDetailsModal.tsx
import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, Download, Image as ImageIcon, Zap } from 'lucide-react';

interface VendorDetailsModalProps {
  vendor: any;
  onClose: () => void;
}

const VendorDetailsModal: React.FC<VendorDetailsModalProps> = ({ vendor, onClose }) => {

  const handleDownload = (path: string, filename: string) => {
    const url = path;
    if (!url) return;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to render image gallery
  const renderImageGallery = (paths: string[], title: string) => {
    if (!paths || paths.length === 0) return null;

    return (
      <div className="mt-4">
        <h5 className="text-sm font-medium text-gray-700 mb-2">{title}</h5>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {paths.map((path, index) => {
            const imageUrl = path;
            if (!imageUrl) return null;

            return (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`${title} ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <button
                    onClick={() => window.open(imageUrl, '_blank')}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                    title="View full size"
                  >
                    <ImageIcon className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDownload(path, `${title}-${index + 1}.jpg`)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
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
          {/* Business Logo */}
          {vendor.businessLogoPath && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Business Logo
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <img
                  src={vendor.businessLogoPath || ''}
                  alt="Business Logo"
                  className="h-24 w-24 object-contain rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/100?text=Logo';
                  }}
                />
                <button
                  onClick={() => handleDownload(vendor.businessLogoPath, 'business-logo.jpg')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Download className="w-4 h-4" />
                  Download Logo
                </button>
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Basic Information
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                  <p className="text-sm text-gray-600">Selected Event</p>

                <p className="text-base font-medium text-gray-900">{vendor.selectedEvent}</p>

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
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${vendor.status === 'approved' ? 'bg-green-100 text-green-800' :
                    vendor.status === 'held' ? 'bg-yellow-100 text-yellow-800' :
                      vendor.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        vendor.status === 'expired' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
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
                  <span className={`px-2 py-1 rounded text-xs font-medium ${vendor.contact?.isOakville ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {vendor.contact?.isOakville ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {/* Social Media */}
              {(vendor.socials?.instagram || vendor.socials?.facebook) && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Social Media</p>
                  <div className="flex gap-2">
                    {vendor.socials?.instagram && (
                      <a
                        href={`https://instagram.com/${vendor.socials.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-pink-100 text-pink-800 rounded text-xs hover:bg-pink-200 transition"
                      >
                        📷 {vendor.socials.instagram}
                      </a>
                    )}
                    {vendor.socials?.facebook && (
                      <a
                        href={`https://facebook.com/${vendor.socials.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 transition"
                      >
                        👤 {vendor.socials.facebook}
                      </a>
                    )}
                  </div>
                </div>
              )}
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

          {/* Food Vendor Details */}
          {vendor.category === 'Food Vendor' && vendor.food && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Food Vendor Details
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Food Items</p>
                  <p className="text-base font-medium text-gray-900">{vendor.food.items}</p>
                </div>
                {vendor.food.needPower && (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Power Required: {vendor.food.watts}W
                    </span>
                  </div>
                )}
                {renderImageGallery(vendor.food.photoPaths, 'Food Photos')}
              </div>
            </div>
          )}

          {/* Clothing Vendor Details */}
          {vendor.category === 'Clothing Vendor' && vendor.clothing && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Clothing Vendor Details
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Clothing Type</p>
                  <p className="text-base font-medium text-gray-900">{vendor.clothing.clothingType}</p>
                </div>
                {renderImageGallery(vendor.clothing.photoPaths, 'Clothing Photos')}
              </div>
            </div>
          )}

          {/* Jewelry Vendor Details */}
          {vendor.category === 'Jewelry Vendor' && vendor.jewelry && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Jewelry Vendor Details
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Jewelry Type</p>
                  <p className="text-base font-medium text-gray-900">{vendor.jewelry.jewelryType}</p>
                </div>
                {renderImageGallery(vendor.jewelry.photoPaths, 'Jewelry Photos')}
              </div>
            </div>
          )}

          {/* Craft Booth Details */}
          {vendor.category === 'Craft Booth' && vendor.craft && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Craft Booth Details
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Craft Details</p>
                  <p className="text-base font-medium text-gray-900">{vendor.craft.details}</p>
                </div>
                {vendor.craft.needPower && (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Power Required: {vendor.craft.watts}W
                    </span>
                  </div>
                )}
                {renderImageGallery(vendor.craft.photoPaths, 'Craft Photos')}
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