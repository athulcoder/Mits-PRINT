'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Key,
  Printer,
  LogOut,
  Menu,
  X,
  Shield,
  LayoutDashboard,
  UserCheck,
} from 'lucide-react';
import PaymentProviderConfigManager from './PaymentProviderConfigManager';
import GoogleAuthConfigManager from './GoogleAuthConfigManager';

export default function AdminSidebarLayout() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('gateways'); // 'gateways' | 'google-auth' | 'printers'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // Clear admin session cookies
      document.cookie = 'admin_route_secret=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    {
      id: 'gateways',
      label: 'Payment Gateways',
      icon: CreditCard,
      description: 'Configure Razorpay, Paytm & single gateway rules',
    },
    {
      id: 'google-auth',
      label: 'Google Auth Config',
      icon: Key,
      description: 'OAuth Client ID, secrets & domain restriction',
    },
    {
      id: 'printers',
      label: 'Printer System',
      icon: Printer,
      description: 'Printer status and operational condition',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row font-sans">
      {/* Mobile Top Navigation Bar */}
      <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <Image src="/mitsprint.png" alt="MITS Print" width={32} height={32} className="rounded-lg" />
          <span className="font-bold text-slate-900 text-base">MITS Print Admin</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition border border-slate-200"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Admin Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Header Branding */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <Image src="/mitsprint.png" alt="MITS Logo" width={40} height={40} className="rounded-xl shadow-xs" />
            <div>
              <h1 className="font-extrabold text-slate-900 text-lg leading-tight">MITS PRINT</h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                Admin Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              System Management
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-3 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin User Card & Logout */}
        <div className="p-4 m-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">System Admin</p>
              <p className="text-[11px] text-slate-500 truncate">admin@mitsprint.com</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl">
        {/* Page Top Header */}
        <div className="mb-8 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            <Shield className="w-4 h-4" />
            Admin Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {activeTab === 'gateways' && 'Payment Gateway Configurations'}
            {activeTab === 'google-auth' && 'Google OAuth & Authentication'}
            {activeTab === 'printers' && 'Printer Status & Diagnostics'}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {activeTab === 'gateways' && 'Manage payment providers and enforce single active gateway policy.'}
            {activeTab === 'google-auth' && 'Configure Google Client ID, secrets, and restricted domain filters.'}
            {activeTab === 'printers' && 'View printer operational condition and status diagnostics.'}
          </p>
        </div>

        {/* Tab Content Components */}
        {activeTab === 'gateways' && <PaymentProviderConfigManager />}
        {activeTab === 'google-auth' && <GoogleAuthConfigManager />}
        {activeTab === 'printers' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-600">
            <Printer className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-lg">Printer Management Module</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Printers are configured and connected to the print queue service.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
