'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import { Compass, Plus, Loader2, AlertCircle, RefreshCw, Trash2, ArrowRight } from 'lucide-react';

export default function AdminRedirectsPage() {
  const [redirects, setRedirects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromPath, setFromPath] = useState('');
  const [toPath, setToPath] = useState('');
  const [statusCode, setStatusCode] = useState('301');
  const [saving, setSaving] = useState(false);

  async function loadRedirects() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/admin/v1/redirects');
      if (res.success) {
        setRedirects(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load redirects');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRedirects();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!fromPath.startsWith('/')) {
      alert('Source path must start with /');
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/api/admin/v1/redirects', {
        from_path: fromPath.trim(),
        to_path: toPath.trim(),
        status_code: statusCode,
      });
      if (res.success) {
        setFromPath('');
        setToPath('');
        await loadRedirects();
      }
    } catch (err: any) {
      alert(`Save failed: ${err?.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this redirect rule?')) return;
    try {
      await api.delete(`/api/admin/v1/redirects?id=${id}`);
      await loadRedirects();
    } catch (err: any) {
      alert(`Delete failed: ${err?.message}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sera-taupe/20 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold">
            SEO & URL Governance
          </span>
          <h1 className="font-serif text-2xl text-sera-espresso font-normal">
            Redirects Manager (301 & 302)
          </h1>
        </div>

        <button
          onClick={loadRedirects}
          className="p-2 border border-sera-taupe/30 rounded-sm text-sera-espresso hover:bg-white text-xs font-semibold flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-sm text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add New Rule Box */}
      <div className="bg-white border border-sera-taupe/20 p-5 rounded-sm shadow-sm max-w-2xl">
        <span className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold block mb-3">
          Create New URL Mapping Rule
        </span>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs items-end">
          <div className="sm:col-span-2">
            <label className="text-[10px] uppercase text-sera-taupe font-semibold block mb-1">
              From Path (e.g. /shop)
            </label>
            <input
              type="text"
              required
              placeholder="/old-collection"
              value={fromPath}
              onChange={(e) => setFromPath(e.target.value)}
              className="w-full bg-sera-ivory/40 border border-sera-taupe/30 px-3 py-2 rounded-sm font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-sera-taupe font-semibold block mb-1">
              To Target Path
            </label>
            <input
              type="text"
              required
              placeholder="/boutique"
              value={toPath}
              onChange={(e) => setToPath(e.target.value)}
              className="w-full bg-sera-ivory/40 border border-sera-taupe/30 px-3 py-2 rounded-sm font-mono focus:outline-none"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 bg-sera-espresso text-sera-ivory rounded-sm uppercase tracking-wider font-semibold text-[11px] hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Add Rule'}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-sera-taupe text-xs">
          <Loader2 className="w-6 h-6 animate-spin mb-2" />
          <span>Loading URL mappings...</span>
        </div>
      ) : redirects.length === 0 ? (
        <div className="py-16 text-center bg-white border border-sera-taupe/20 rounded-sm p-8">
          <Compass className="w-8 h-8 text-sera-taupe/40 mx-auto mb-2" />
          <h3 className="font-serif text-lg text-sera-espresso mb-1">No Active Redirects</h3>
          <p className="text-xs text-sera-taupe max-w-sm mx-auto">
            Configure 301 permanent redirects to protect link equity and preserve bookmarks.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-sera-taupe/20 rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-sera-ivory border-b border-sera-taupe/20 text-sera-taupe uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">From Path</th>
                <th className="py-3 px-4">To Path</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Hit Count</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sera-taupe/15">
              {redirects.map((r) => (
                <tr key={r.id} className="hover:bg-sera-ivory/30">
                  <td className="py-3 px-4 font-mono font-semibold text-sera-espresso">
                    {r.from_path}
                  </td>
                  <td className="py-3 px-4 font-mono text-sera-taupe">
                    {r.to_path}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded-sm text-[10px] font-mono font-bold">
                      {r.status_code}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{r.hits}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1 text-sera-taupe hover:text-rose-700"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
