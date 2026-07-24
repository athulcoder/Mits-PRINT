import React from 'react';
import PaymentProviderConfigManager from '@/components/admin/PaymentProviderConfigManager';

export const metadata = {
  title: 'Payment Provider Configurations | Admin Dashboard',
  description: 'Manage and configure generic payment providers for your application.',
};

export default function PaymentProvidersPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <PaymentProviderConfigManager />
    </div>
  );
}
