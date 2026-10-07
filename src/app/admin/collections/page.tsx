'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import { Layers, Plus, Loader2, AlertCircle, RefreshCw, Eye, Edit3, Trash2 } from 'lucide-react';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    kind: 'collection',
    tagline: '',
    status: 'draft',
    sort_order: 0,
  });
  const [saving, setSaving] = useState(false);

  async function loadCollections() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/admin/v1/collections');
      if (res.success) {
        setCollections(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCollections();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/api/admin/v1/collections', formData);
      if (res.success) {
        setShowModal(false);
        setFormData({
          name: '',
          slug: '',
          kind: 'collection',
          tagline: '',
          status: 'draft',
          sort_order: 0,
        });
        await loadCollections();
      }
    } catch (err: any) {
      alert(`Failed to save: ${err?.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to archive this collection?')) return;
    try {
      await api.delete(`/api/admin/v1/collections/${id}`);
      await loadCollections();
    } catch (err: any) {
      alert(`Delete failed: ${err?.message}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sera-taupe/20 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold">
            Merchandising Engine
          </span>
          <h1 className="font-serif text-2xl text-sera-espresso font-normal">
            Collections & Curated Capsules
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadCollections}
            className="p-2 border border-sera-taupe/30 rounded-sm text-sera-espresso hover:bg-white text-xs font-semibold flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-3.5 py-2 bg-sera-espresso text-sera-ivory rounded-sm text-xs font-semibold uppercase tracking-wider hover:opacity-90 flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-sera-champagne" />
            <span>Create Capsule</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-sm text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-sera-taupe text-xs">
          <Loader2 className="w-6 h-6 animate-spin mb-2" />
          <span>Loading collections...</span>
        </div>
      ) : collections.length === 0 ? (
        <div className="py-16 text-center bg-white border border-sera-taupe/20 rounded-sm p-8">
          <Layers className="w-8 h-8 text-sera-taupe/40 mx-auto mb-2" />
          <h3 className="font-serif text-lg text-sera-espresso mb-1">No Collections Defined</h3>
          <p className="text-xs text-sera-taupe max-w-sm mx-auto mb-4">
            Curate capsules by grouping jewellery pieces under distinct themes, seasonal edits, or occasions.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1.5 bg-sera-espresso text-sera-ivory rounded-sm text-xs uppercase tracking-wider font-semibold"
          >
            Create First Collection
          </button>
        </div>
      ) : (
        <div className="bg-white border border-sera-taupe/20 rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-sera-ivory border-b border-sera-taupe/20 text-sera-taupe uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Kind</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sera-taupe/15">
              {collections.map((col) => (
                <tr key={col.id} className="hover:bg-sera-ivory/30">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-sera-espresso block">{col.name}</span>
                    <span className="text-[11px] text-sera-taupe">{col.tagline || '—'}</span>
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] font-semibold text-sera-taupe">
                    {col.kind}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-sera-taupe">
                    /{col.slug}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] uppercase font-semibold ${
                      col.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {col.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{col.sort_order}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleDelete(col.id)}
                      className="p-1 hover:text-rose-700 text-sera-taupe"
                      title="Archive"
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

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-sera-espresso/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-sera-ivory border border-sera-taupe/30 rounded-sm shadow-xl max-w-md w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-sera-taupe/20 pb-3">
              <h3 className="font-serif text-lg text-sera-espresso">New Curated Capsule</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-sera-taupe hover:text-sera-espresso text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold block mb-1">
                Collection Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Solstice Sovereign"
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    name: val,
                    slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                  });
                }}
                className="w-full bg-white border border-sera-taupe/30 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-sera-espresso"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold block mb-1">
                Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-white border border-sera-taupe/30 px-3 py-2 text-xs font-mono rounded-sm focus:outline-none focus:border-sera-espresso"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold block mb-1">
                  Kind
                </label>
                <select
                  value={formData.kind}
                  onChange={(e) => setFormData({ ...formData, kind: e.target.value })}
                  className="w-full bg-white border border-sera-taupe/30 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-sera-espresso"
                >
                  <option value="collection">Collection</option>
                  <option value="edit">Editorial Edit</option>
                  <option value="occasion">Occasion</option>
                  <option value="campaign">Campaign</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold block mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-white border border-sera-taupe/30 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-sera-espresso"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold block mb-1">
                Tagline
              </label>
              <input
                type="text"
                placeholder="A poetic one-sentence summary"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-white border border-sera-taupe/30 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-sera-espresso"
              />
            </div>

            <div className="pt-3 border-t border-sera-taupe/20 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-3.5 py-1.5 border border-sera-taupe/30 rounded-sm text-xs font-semibold text-sera-espresso"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-1.5 bg-sera-espresso text-sera-ivory rounded-sm text-xs uppercase tracking-wider font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Collection'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
