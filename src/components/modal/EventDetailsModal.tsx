// src/components/admin/EventDetailsModal.tsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AppDispatch } from '@/redux/store';
import { createEvent, updateEvent } from '@/services/dashbord/asyncThunk';
import Toast from '../Toast';

interface EventDetailsModalProps {
  event?: any;
  onClose: () => void;
  onSuccess: () => void;
}

interface EventFormValues {
  title: string;
  badge: string;
  eventDate: string;
  eventTime: string;
  location: string;
  description: string;
  highlights: string[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  status: 'draft' | 'published' | 'archived';
  isActive: boolean;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Event title is required'),
  badge: Yup.string().required('Badge is required'),
  eventDate: Yup.string().required('Event date is required'),
  eventTime: Yup.string().required('Event time is required'),
  location: Yup.string().required('Location is required'),
  description: Yup.string().required('Description is required'),
  highlights: Yup.array().of(Yup.string()),
  primaryCtaLabel: Yup.string().required('Primary CTA label is required'),
  primaryCtaHref: Yup.string().required('Primary CTA link is required'),
  secondaryCtaLabel: Yup.string().required('Secondary CTA label is required'),
  secondaryCtaHref: Yup.string().required('Secondary CTA link is required'),
  status: Yup.string().oneOf(['draft', 'published', 'archived']),
  isActive: Yup.boolean()
});

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Helper to extract date and time from eventDateTime
  const getDateFromDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTimeFromDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formik = useFormik<EventFormValues>({
    initialValues: {
      title: event?.title || '',
      badge: event?.badge || '',
      eventDate: event?.eventDateTime ? getDateFromDateTime(event.eventDateTime) : '',
      eventTime: event?.eventDateTime ? getTimeFromDateTime(event.eventDateTime) : '',
      location: event?.location || '',
      description: event?.description || '',
      highlights: event?.highlights?.length > 0 ? event.highlights : [''],
      primaryCtaLabel: event?.primaryCta?.label || '',
      primaryCtaHref: event?.primaryCta?.href || '',
      secondaryCtaLabel: event?.secondaryCta?.label || '',
      secondaryCtaHref: event?.secondaryCta?.href || '',
      status: event?.status || 'draft',
      isActive: event?.isActive !== undefined ? event.isActive : true
    },
    validationSchema,
    validate: (values) => {
      const errors: any = {};
      
      // Validate that combined date and time is in the future
      if (values.eventDate && values.eventTime) {
        const eventDateTime = new Date(`${values.eventDate}T${values.eventTime}`);
        const now = new Date();
        
        if (eventDateTime <= now) {
          errors.eventDate = 'Event date and time must be in the future';
          errors.eventTime = 'Event date and time must be in the future';
        }
      }
      
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Combine date and time into ISO string
        const eventDateTime = new Date(`${values.eventDate}T${values.eventTime}`).toISOString();
        
        const payload = {
          title: values.title,
          badge: values.badge,
          eventDateTime: eventDateTime,
          location: values.location,
          description: values.description,
          highlights: values.highlights.filter(h => h.trim() !== ''),
          primaryCtaLabel: values.primaryCtaLabel,
          primaryCtaHref: values.primaryCtaHref,
          secondaryCtaLabel: values.secondaryCtaLabel,
          secondaryCtaHref: values.secondaryCtaHref,
          status: values.status,
          isActive: values.isActive
        };

        if (event) {
          await dispatch(updateEvent({ id: event._id, updates: payload })).unwrap();
          Toast.fire('Event updated successfully');
        } else {
          await dispatch(createEvent(payload)).unwrap();
          Toast.fire("Event created successfully");
        }
        onSuccess();
        onClose();
      } catch (error: any) {
        console.error('Failed to save event:', error);
        const errorMessage = error?.message || error?.error || 'Failed to save event';
        Toast.fire(errorMessage);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const addHighlight = () => {
    formik.setFieldValue('highlights', [...formik.values.highlights, '']);
  };

  const removeHighlight = (index: number) => {
    const newHighlights = formik.values.highlights.filter((_, i) => i !== index);
    formik.setFieldValue('highlights', newHighlights);
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...formik.values.highlights];
    newHighlights[index] = value;
    formik.setFieldValue('highlights', newHighlights);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 pb-24">
      <div className="bg-black border border-yellow-500/30 rounded-lg max-w-4xl w-full max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col">
        {/* Fixed Header */}
        <div className="bg-black border-b border-yellow-500/30 px-6 py-4 flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold text-yellow-500">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="text-yellow-500/60 hover:text-yellow-500 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto flex-1 px-6 py-6">
          <form onSubmit={formik.handleSubmit} id="event-form" className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-500">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-500/70 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 bg-black border border-yellow-500/30 text-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="mt-1 text-xs text-yellow-500/70">{formik.errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-500/70 mb-1">
                    Badge *
                  </label>
                  <input
                    type="text"
                    name="badge"
                    value={formik.values.badge}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g., Featured Event"
                    className="w-full px-3 py-2 bg-black border border-yellow-500/30 text-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-yellow-500/40"
                  />
                  {formik.touched.badge && formik.errors.badge && (
                    <p className="mt-1 text-xs text-yellow-500/70">{formik.errors.badge}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-500/70 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formik.values.eventDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 bg-black border border-yellow-500/30 text-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  {formik.touched.eventDate && formik.errors.eventDate && (
                    <p className="mt-1 text-xs text-yellow-500/70">{formik.errors.eventDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-500/70 mb-1">
                    Event Time *
                  </label>
                  <input
                    type="time"
                    name="eventTime"
                    value={formik.values.eventTime}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 bg-black border border-yellow-500/30 text-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  {formik.touched.eventTime && formik.errors.eventTime && (
                    <p className="mt-1 text-xs text-yellow-500/70">{formik.errors.eventTime}</p>
                  )}
                </div>
              </div>

              {(formik.errors.eventDate || formik.errors.eventTime) && (
                <p className="text-xs text-yellow-500/60">
                  Event must be scheduled in the future
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-yellow-500/70 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g., Tech Hub, Downtown"
                  className="w-full px-3 py-2 bg-black border border-yellow-500/30 text-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-yellow-500/40"
                />
                {formik.touched.location && formik.errors.location && (
                  <p className="mt-1 text-xs text-yellow-500/70">{formik.errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-500/70 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={4}
                  placeholder="Describe the event..."
                  className="w-full px-3 py-2 bg-black border border-yellow-500/30 text-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-yellow-500/40"
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="mt-1 text-xs text-yellow-500/70">{formik.errors.description}</p>
                )}
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-yellow-500">Highlights</h3>
                <button
                  type="button"
                  onClick={addHighlight}
                  className="text-yellow-500 hover:text-yellow-400 text-sm font-medium"
                >
                  + Add Highlight
                </button>
              </div>
              
              {formik.values.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleHighlightChange(index, e.target.value)}
                    placeholder="e.g., Free Entry"
                    className="flex-1 px-3 py-2 bg-black border border-yellow-500/30 text-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-yellow-500/40"
                  />
                  {formik.values.highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="px-3 py-2 text-yellow-500 hover:text-yellow-400 border border-yellow-500/30 rounded-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-500">Call to Actions</h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-yellow-500/70 mb-1">
                      Primary CTA Label *
                    </label>
                    <input
                      type="text"
                      name="primaryCtaLabel"
                      value={formik.values.primaryCtaLabel}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="e.g., Get Free Tickets"
                      className="w-full px-3 py-2 bg-black border border-yellow-500/30 text-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-yellow-500/40"
                    />
                    {formik.touched.primaryCtaLabel && formik.errors.primaryCtaLabel && (
                      <p className="mt-1 text-xs text-yellow-500/70">{formik.errors.primaryCtaLabel}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-500/70 mb-1">
                      Primary CTA Link *
                    </label>
                    <input
                      type="text"
                      name="primaryCtaHref"
                      value={formik.values.primaryCtaHref}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-black border border-yellow-500/30 text-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-yellow-500/40"
                    />
                    {formik.touched.primaryCtaHref && formik.errors.primaryCtaHref && (
                      <p className="mt-1 text-xs text-yellow-500/70">{formik.errors.primaryCtaHref}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-yellow-500/70 mb-1">
                      Secondary CTA Label *
                    </label>
                    <input
                      type="text"
                      name="secondaryCtaLabel"
                      value={formik.values.secondaryCtaLabel}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="e.g., Join us"
                      className="w-full px-3 py-2 bg-black border border-yellow-500/30 text-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-yellow-500/40"
                    />
                    {formik.touched.secondaryCtaLabel && formik.errors.secondaryCtaLabel && (
                      <p className="mt-1 text-xs text-yellow-500/70">{formik.errors.secondaryCtaLabel}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-500/70 mb-1">
                      Secondary CTA Link *
                    </label>
                    <input
                      type="text"
                      name="secondaryCtaHref"
                      value={formik.values.secondaryCtaHref}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="/#joinus"
                      className="w-full px-3 py-2 bg-black border border-yellow-500/30 text-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-yellow-500/40"
                    />
                    {formik.touched.secondaryCtaHref && formik.errors.secondaryCtaHref && (
                      <p className="mt-1 text-xs text-yellow-500/70">{formik.errors.secondaryCtaHref}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-500">Status</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-500/70 mb-1">
                    Publication Status
                  </label>
                  <select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 bg-black border border-yellow-500/30 text-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formik.values.isActive}
                      onChange={formik.handleChange}
                      className="w-4 h-4 text-yellow-500 bg-black border-yellow-500/30 rounded focus:ring-yellow-500"
                    />
                    <span className="text-sm font-medium text-yellow-500/70">Active Event</span>
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="bg-black border-t border-yellow-500/30 px-6 py-4 flex gap-3 justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-yellow-500/30 rounded-lg text-yellow-500 hover:bg-yellow-500/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="event-form"
            disabled={formik.isSubmitting}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;