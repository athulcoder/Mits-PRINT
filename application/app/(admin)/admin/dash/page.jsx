import React from 'react';
import AdminSidebarLayout from '@/components/admin/AdminSidebarLayout';

export const metadata = {
  title: 'Admin Dashboard | MITS Print',
  description: 'Manage payment gateways, Google Auth configuration, and printer settings.',
};

export default function AdminDashboardPage() {
  return <AdminSidebarLayout />;
}
