// src/pages/admin/promocodes/index.tsx
import PromoCodePage from '@/components/admin/PromoCodePage';
import AdminLayout from '@/layouts/adminLayout';
import React from 'react';

const PromoCodesIndexPage: React.FC = () => {
  return (
    <AdminLayout>
      <PromoCodePage />
    </AdminLayout>
  );
};

export default PromoCodesIndexPage;