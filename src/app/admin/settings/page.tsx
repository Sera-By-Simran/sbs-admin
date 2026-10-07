'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import {
  Sliders,
  Loader2,
  AlertCircle,
  Save,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [trustItems, setTrustItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function loadSettings() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/admin/v1/settings');
      if (res.success) {
        const dict: Record<string, any> = {};
        (res.data.settings || []).forEach((s: any) => {
          dict[s.key] = s.value;
        });
        setSettings(dict);
        setTrustItems(res.data.trust_items || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function handleSaveSetting(key: string, value: any) {
    setSavingKey(key);
    setSuccessMsg(null);
    try {
      await api.put('/api/admin/v1/settings', { key, value });
      setSuccessMsg(`Setting "${key}" updated successfully`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(`Failed to save: ${err?.message}`);
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div className="max-w-4xl space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sera-taupe/20 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-sera-taupe font-semibold">
            Boutique Configuration
          </span>
          <h1 className="font-serif text-3xl text-sera-espresso font-normal mt-1">
            Site Settings & Policies
          </h1>
          <p className="text-xs text-sera-espresso/70 mt-1">
            Global announcement bar, official contact channels, and trust assurances.
          </p>
        </div>

        <button
          onClick={() => loadSettings()}
          className="p-2 border border-sera-taupe/40 bg-white/70 text-sera-espresso rounded-sm hover:bg-sera-beige/40 transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-sera-taupe ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-sm flex items-start space-x-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm flex items-start space-x-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-sera-taupe space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-sera-espresso" />
          <span className="text-xs">Loading configuration...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Announcement Bar Setting */}
          <div className="bg-white/80 border border-sera-taupe/30 rounded-sm p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-lg text-sera-espresso">Announcement Header</h2>
            <div>
              <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                Announcement Banner Text
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={settings['announcement_bar_text'] || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, announcement_bar_text: e.target.value })
                  }
                  className="flex-1 px-3 py-2 text-xs bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso"
                />
                <button
                  onClick={() =>
                    handleSaveSetting('announcement_bar_text', settings['announcement_bar_text'])
                  }
                  disabled={savingKey === 'announcement_bar_text'}
                  className="px-4 py-2 bg-sera-espresso text-sera-ivory rounded-sm text-xs uppercase tracking-wider font-semibold hover:opacity-90 disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {savingKey === 'announcement_bar_text' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>

          {/* Official Contact & Channels */}
          <div className="bg-white/80 border border-sera-taupe/30 rounded-sm p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-lg text-sera-espresso">Official Channels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                  WhatsApp Support Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings['contact_whatsapp'] || ''}
                    placeholder="+91 98765 43210"
                    onChange={(e) =>
                      setSettings({ ...settings, contact_whatsapp: e.target.value })
                    }
                    className="flex-1 px-3 py-2 text-xs bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso font-mono"
                  />
                  <button
                    onClick={() =>
                      handleSaveSetting('contact_whatsapp', settings['contact_whatsapp'])
                    }
                    disabled={savingKey === 'contact_whatsapp'}
                    className="px-3 py-2 bg-sera-espresso text-sera-ivory rounded-sm text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                  Support Email Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={settings['contact_email'] || ''}
                    placeholder="concierge@serabysimran.in"
                    onChange={(e) =>
                      setSettings({ ...settings, contact_email: e.target.value })
                    }
                    className="flex-1 px-3 py-2 text-xs bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso"
                  />
                  <button
                    onClick={() =>
                      handleSaveSetting('contact_email', settings['contact_email'])
                    }
                    disabled={savingKey === 'contact_email'}
                    className="px-3 py-2 bg-sera-espresso text-sera-ivory rounded-sm text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Assurances List */}
          <div className="bg-white/80 border border-sera-taupe/30 rounded-sm p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-lg text-sera-espresso">Active Trust Assurances</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trustItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border border-sera-taupe/20 rounded-sm bg-sera-ivory/40 flex items-center space-x-3 text-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-sera-champagne flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sera-espresso">{item.title}</h4>
                    <p className="text-[11px] text-sera-taupe">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
