// ============================================
// src/pages/admin/vendors/index.tsx
// ============================================
import VolunteersPage from '@/components/admin/VolunteersPage';
import AdminLayout from '@/layouts/adminLayout';
import React from 'react';


const VendorsIndexPage: React.FC = () => {
  return (
    <AdminLayout>
      <VolunteersPage />
    </AdminLayout>
  );
};

export default VendorsIndexPage;