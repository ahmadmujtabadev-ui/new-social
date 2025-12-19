// ============================================
// src/pages/admin/index.tsx
// ============================================
import DashboardHome from '@/components/admin/DashboardHome';
import AdminLayout from '@/layouts/adminLayout';
import React from 'react';


const AdminDashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      <DashboardHome/>
    </AdminLayout>
  );
};

export default AdminDashboardPage;


