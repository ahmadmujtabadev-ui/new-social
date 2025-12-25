import React from 'react';
import AdminLayout from '@/layouts/adminLayout';
import Booth from '@/components/admin/Booth';

const SponsorsIndexPage: React.FC = () => {
  return (
    <AdminLayout>
      <Booth/>
    </AdminLayout>
  );
};

export default SponsorsIndexPage;