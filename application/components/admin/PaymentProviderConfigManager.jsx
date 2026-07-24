'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Settings2,
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function PaymentProviderConfigManager() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProviderKey, setSelectedProviderKey] = useState(null);

  // Form state for selected provider
  const [formData, setFormData] = useState({});
  const [isActive, setIsActive] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [showSecrets, setShowSecrets] = useState({});
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', message: string }

  useEffect(() => {
    fetchProviders();
  }, []);

  async function fetchProviders() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/payment-providers');
      const data = await res.json();
      if (data.success) {
        setProviders(data.data);
        if (data.data.length > 0 && !selectedProviderKey) {
          selectProvider(data.data[0]);
        }
      } else {
        setError(data.error || 'Failed to load payment providers.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error while loading payment providers.');
    } finally {
      setLoading(false);
    }
  }

  function selectProvider(provider) {
    setSelectedProviderKey(provider.provider);
    setIsActive(provider.isActive);
    setIsLive(provider.isLive);
    
    // Initialize form values from provider fields + stored configuration
    const initialForm = {};
    const secretsState = {};

    provider.fields.forEach((field) => {
      initialForm[field.name] =
        provider.configuration?.[field.name] || field.defaultValue || '';
      if (field.isSecret) {
        secretsState[field.name] = false;
      }
    });

    setFormData(initialForm);
    setShowSecrets(secretsState);
    setValidationErrors({});
    setFeedback(null);
  }

  const selectedProvider = providers.find(
    (p) => p.provider === selectedProviderKey
  );

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => ({ ...prev, [fieldName]: null }));
    }
  };

  const toggleSecretVisibility = (fieldName) => {
    setShowSecrets((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedProvider) return;

    setSaving(true);
    setFeedback(null);
    setValidationErrors({});

    try {
      const res = await fetch('/api/admin/payment-providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider.provider,
          isActive,
          isLive,
          configuration: formData,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFeedback({
          type: 'success',
          message: data.message || 'Configuration saved successfully!',
        });
        // Refresh provider list to update status badges
        fetchProviders();
      } else {
        if (data.details) {
          setValidationErrors(data.details);
        }
        setFeedback({
          type: 'error',
          message: data.error || 'Failed to save configuration.',
        });
      }
    } catch (err) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: 'Network error occurred while saving configuration.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!selectedProvider) return;

    setTesting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/payment-providers/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider.provider,
          configuration: formData,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFeedback({
          type: 'success',
          message: data.message || 'Connection test successful!',
        });
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Connection test failed.',
        });
      }
    } catch (err) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: 'Network error during connection test.',
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-400 font-medium">Loading payment providers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-950/30 border border-red-800/50 rounded-xl text-red-300 max-w-2xl mx-auto flex items-center gap-3">
        <AlertCircle className="w-6 h-6 flex-shrink-0 text-red-400" />
        <div>
          <h3 className="font-semibold">Unable to load configurations</h3>
          <p className="text-sm text-red-400/90">{error}</p>
          <button
            onClick={fetchProviders}
            className="mt-3 px-4 py-1.5 text-xs font-semibold bg-red-900/50 hover:bg-red-800/60 rounded-lg text-red-200 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Payment Provider Configurations
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Configure dynamic payment gateways securely with automated credential encryption and secret masking.
          </p>
        </div>
        <button
          onClick={fetchProviders}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Available Providers */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-indigo-400" />
            Available Gateways ({providers.length})
          </h2>

          <div className="space-y-3">
            {providers.map((p) => {
              const isSelected = selectedProviderKey === p.provider;
              return (
                <button
                  key={p.provider}
                  onClick={() => selectProvider(p)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/80 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold text-lg">
                        {p.displayName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-base">
                          {p.displayName}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          p.isActive
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                          }`}
                        />
                        {p.isActive ? 'Active' : 'Disabled'}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          p.isLive
                            ? 'bg-purple-950/80 text-purple-300 border border-purple-800/50'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                        }`}
                      >
                        {p.isLive ? 'Live Mode' : 'Sandbox'}
                      </span>
                    </div>

                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-indigo-400 translate-x-1' : 'text-slate-600'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content: Configuration Form */}
        <div className="lg:col-span-8">
          {selectedProvider ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-sm">
              {/* Form Title & Toggles */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">
                      {selectedProvider.displayName} Configuration
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Dynamic settings schema for {selectedProvider.displayName}.
                  </p>
                </div>

                {/* Status Toggles */}
                <div className="flex items-center gap-4 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  {/* Enable/Disable Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600 relative"></div>
                    <span>{isActive ? 'Enabled' : 'Disabled'}</span>
                  </label>

                  <div className="h-4 w-px bg-slate-800" />

                  {/* Sandbox/Live Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                    <input
                      type="checkbox"
                      checked={isLive}
                      onChange={(e) => setIsLive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-amber-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 relative"></div>
                    <span>{isLive ? 'Live Mode' : 'Sandbox'}</span>
                  </label>
                </div>
              </div>

              {/* Feedback Alert */}
              {feedback && (
                <div
                  className={`p-4 rounded-xl text-sm flex items-start gap-3 border ${
                    feedback.type === 'success'
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                      : 'bg-red-950/40 border-red-800/60 text-red-200'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{feedback.message}</p>
                  </div>
                </div>
              )}

              {/* Dynamic Fields Form */}
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 gap-5">
                  {selectedProvider.fields.map((field) => {
                    const fieldError = validationErrors[field.name];
                    const isSecret = field.isSecret;
                    const isShowingSecret = showSecrets[field.name];

                    return (
                      <div key={field.name} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                            {isSecret ? (
                              <Lock className="w-3.5 h-3.5 text-indigo-400" />
                            ) : (
                              <Globe className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            {field.label}
                            {field.required && (
                              <span className="text-red-400 font-bold">*</span>
                            )}
                          </label>
                          {isSecret && (
                            <button
                              type="button"
                              onClick={() => toggleSecretVisibility(field.name)}
                              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition"
                            >
                              {isShowingSecret ? (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" /> Mask Value
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3.5 h-3.5" /> Reveal Input
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        <div className="relative">
                          <input
                            type={
                              isSecret && !isShowingSecret ? 'password' : 'text'
                            }
                            value={formData[field.name] || ''}
                            onChange={(e) =>
                              handleInputChange(field.name, e.target.value)
                            }
                            placeholder={field.placeholder || ''}
                            className={`w-full px-4 py-2.5 text-sm bg-slate-950/80 border rounded-xl focus:outline-none focus:ring-2 transition ${
                              fieldError
                                ? 'border-red-500/80 focus:ring-red-500/40 text-red-100'
                                : 'border-slate-800 focus:border-indigo-500/80 focus:ring-indigo-500/30 text-white'
                            }`}
                          />
                        </div>

                        {field.helpText && (
                          <p className="text-[11px] text-slate-400">
                            {field.helpText}
                          </p>
                        )}
                        {fieldError && (
                          <p className="text-xs text-red-400 font-medium">
                            {fieldError}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Security Note */}
                <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-400 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Sensitive secrets are encrypted using AES-256-GCM before storage and automatically masked when retrieved.
                  </span>
                </div>

                {/* Form Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testing || saving}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {testing ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                    ) : (
                      <Zap className="w-4 h-4 text-amber-400" />
                    )}
                    Test Connection
                  </button>

                  <button
                    type="submit"
                    disabled={saving || testing}
                    className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Save Configuration
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              Select a payment provider from the sidebar to configure its settings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
