import React from 'react';
import PaymentProviderConfigManager from '@/components/admin/PaymentProviderConfigManager';

export const metadata = {
  title: 'Admin Dashboard | Payment Configurations',
  description: 'Manage admin settings and payment provider configurations.',
};

export default function AdminDashPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <PaymentProviderConfigManager />
    </div>
  );
}
