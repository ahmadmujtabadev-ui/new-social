// ============================================
// src/pages/admin/vendors/index.tsx
// ============================================
import VendorsPage from '@/components/admin/VendorPage';
import AdminLayout from '@/layouts/adminLayout';
import React from 'react';


const VendorsIndexPage: React.FC = () => {
  return (
    <AdminLayout>
      <VendorsPage />
    </AdminLayout>
  );
};

export default VendorsIndexPage;