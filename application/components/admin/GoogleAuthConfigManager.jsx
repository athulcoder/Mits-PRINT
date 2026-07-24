'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Key,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  Globe,
  Check,
} from 'lucide-react';

export default function GoogleAuthConfigManager() {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [allowedDomains, setAllowedDomains] = useState('@mgits.ac.in');
  const [isActive, setIsActive] = useState(true);
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchAuthConfig();
  }, []);

  async function fetchAuthConfig() {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/auth-config');
      const data = await res.json();
      if (data.success && data.data) {
        setClientId(data.data.clientId || '');
        setClientSecret(data.data.clientSecret || '');
        setAllowedDomains(data.data.allowedDomains || '@mgits.ac.in');
        setIsActive(data.data.isActive ?? true);
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to load Google Auth configuration.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/auth-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          clientSecret,
          allowedDomains,
          isActive,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFeedback({ type: 'success', message: 'Google Auth configuration updated successfully!' });
        if (data.data?.clientSecret) {
          setClientSecret(data.data.clientSecret);
        }
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to update configuration.' });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Network error occurred while saving configuration.' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
        <RefreshCw className="w-7 h-7 text-indigo-600 animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading Google Auth Settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Top Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Google OAuth & Firebase Authentication</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure Google Client ID and restricted email domain authentication.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
            />
            <span>{isActive ? 'Google Auth Enabled' : 'Disabled'}</span>
          </label>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <p className="font-medium text-xs sm:text-sm">{feedback.message}</p>
          </div>
        )}

        {/* Configuration Form */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* Client ID */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Google Client ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="e.g. 175592205643-....apps.googleusercontent.com"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Found under GCP Console / Firebase Console Google Auth provider settings.
            </p>
          </div>

          {/* Client Secret */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Google Client Secret <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showSecret ? 'Mask Secret' : 'Reveal Secret'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                required
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="e.g. GOCSPX-..."
                className="w-full px-4 py-3 pr-12 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all font-mono"
              />
            </div>
          </div>

          {/* Allowed Domain Restriction */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Allowed Domain Filter
            </label>
            <input
              type="text"
              value={allowedDomains}
              onChange={(e) => setAllowedDomains(e.target.value)}
              placeholder="e.g. @mgits.ac.in"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all"
            />
            <p className="text-[11px] text-slate-500">
              Only Google accounts matching this domain suffix will be allowed to sign in.
            </p>
          </div>

          {/* Security Note */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>
              Google credentials are securely encrypted using AES-256-GCM before saving to the database.
            </span>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Save Google Auth Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
