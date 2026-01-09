// src/pages/admin/events/index.tsx
import EventPage from '@/components/admin/EventPage';
import AdminLayout from '@/layouts/adminLayout';
import React from 'react';

const EventsIndexPage: React.FC = () => {
  return (
    <AdminLayout>
      <EventPage />
    </AdminLayout>
  );
};

export default EventsIndexPage;