import React from 'react';
import ParticipantPage  from '@/components/admin/ParticipantPage'; 
import AdminLayout from '@/layouts/adminLayout';

const SponsorsIndexPage: React.FC = () => {
  return (
    <AdminLayout>
      <ParticipantPage/>
    </AdminLayout>
  );
};

export default SponsorsIndexPage;