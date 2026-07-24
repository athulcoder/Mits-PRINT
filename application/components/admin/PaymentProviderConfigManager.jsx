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
  Info,
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
  const [feedback, setFeedback] = useState(null);

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
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
        <RefreshCw className="w-7 h-7 text-indigo-600 animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading payment gateways...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800 max-w-xl mx-auto flex items-center gap-3">
        <AlertCircle className="w-6 h-6 flex-shrink-0 text-red-600" />
        <div>
          <h3 className="font-semibold text-sm">Unable to load gateway configurations</h3>
          <p className="text-xs text-red-600 mt-0.5">{error}</p>
          <button
            onClick={fetchProviders}
            className="mt-3 px-3.5 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6 text-slate-900">
      {/* Single Gateway Notice Banner */}
      <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-indigo-950">
        <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-indigo-900">Single Active Gateway Rule:</span> Only 1 payment gateway can be active at a time. Enabling a provider will automatically set all other gateways to inactive mode.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar: Gateways List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-indigo-600" />
            Payment Providers ({providers.length})
          </h2>

          <div className="space-y-2.5">
            {providers.map((p) => {
              const isSelected = selectedProviderKey === p.provider;
              return (
                <button
                  key={p.provider}
                  onClick={() => selectProvider(p)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-600/10'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-bold text-base">
                        {p.displayName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">
                          {p.displayName}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          p.isActive
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.isActive ? 'bg-emerald-600' : 'bg-slate-400'
                          }`}
                        />
                        {p.isActive ? 'Active Gateway' : 'Inactive'}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          p.isLive
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {p.isLive ? 'Live' : 'Sandbox'}
                      </span>
                    </div>

                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-indigo-600 translate-x-1' : 'text-slate-400'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Form Section */}
        <div className="lg:col-span-8">
          {selectedProvider ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              {/* Header & Status Toggles */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedProvider.displayName} Settings
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure API keys and mode for {selectedProvider.displayName}.
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  {/* Enable Gateway Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                    />
                    <span>{isActive ? 'Enabled' : 'Disabled'}</span>
                  </label>

                  <div className="h-4 w-px bg-slate-200" />

                  {/* Mode Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={isLive}
                      onChange={(e) => setIsLive(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                    />
                    <span>{isLive ? 'Live Mode' : 'Sandbox Mode'}</span>
                  </label>
                </div>
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

              {/* Dynamic Fields Form */}
              <form onSubmit={handleSave} className="space-y-5">
                <div className="space-y-4">
                  {selectedProvider.fields.map((field) => {
                    const fieldError = validationErrors[field.name];
                    const isSecret = field.isSecret;
                    const isShowingSecret = showSecrets[field.name];

                    return (
                      <div key={field.name} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                            {isSecret ? (
                              <Lock className="w-3.5 h-3.5 text-indigo-600" />
                            ) : (
                              <Globe className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            {field.label}
                            {field.required && (
                              <span className="text-red-500 font-bold">*</span>
                            )}
                          </label>
                          {isSecret && (
                            <button
                              type="button"
                              onClick={() => toggleSecretVisibility(field.name)}
                              className="text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 transition"
                            >
                              {isShowingSecret ? (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" /> Mask Secret
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3.5 h-3.5" /> Reveal Secret
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
                            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all font-mono ${
                              fieldError
                                ? 'border-red-400 focus:ring-red-500/20 text-red-900'
                                : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-600/10'
                            }`}
                          />
                        </div>

                        {field.helpText && (
                          <p className="text-[11px] text-slate-500">
                            {field.helpText}
                          </p>
                        )}
                        {fieldError && (
                          <p className="text-xs text-red-600 font-medium">
                            {fieldError}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Security Note */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    Sensitive credentials are encrypted with AES-256-GCM before database storage.
                  </span>
                </div>

                {/* Form Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testing || saving}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {testing ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
                    ) : (
                      <Zap className="w-4 h-4 text-amber-600" />
                    )}
                    Test Connection
                  </button>

                  <button
                    type="submit"
                    disabled={saving || testing}
                    className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
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
          ) : null}
        </div>
      </div>
    </div>
  );
}
