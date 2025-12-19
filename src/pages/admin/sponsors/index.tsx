// ============================================
// src/pages/admin/sponsors/index.tsx
// ============================================
import React from 'react';
import SponsorsPage  from '@/components/admin/SponsorPage'; 
import AdminLayout from '@/layouts/adminLayout';

const SponsorsIndexPage: React.FC = () => {
  return (
    <AdminLayout>
      <SponsorsPage/>
    </AdminLayout>
  );
};

export default SponsorsIndexPage;