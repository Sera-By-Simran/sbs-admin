'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import { BookOpen, Plus, Loader2, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';

export default function AdminEditorialPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    pillar: 'styling',
    excerpt: '',
    body: '',
    status: 'draft',
    author_display_name: 'Simran / SÉRA Editorial',
  });
  const [saving, setSaving] = useState(false);

  async function loadPosts() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/admin/v1/editorial');
      if (res.success) {
        setPosts(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load editorial articles');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/api/admin/v1/editorial', formData);
      if (res.success) {
        setShowModal(false);
        setFormData({
          title: '',
          slug: '',
          pillar: 'styling',
          excerpt: '',
          body: '',
          status: 'draft',
          author_display_name: 'Simran / SÉRA Editorial',
        });
        await loadPosts();
      }
    } catch (err: any) {
      alert(`Save failed: ${err?.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Archive this editorial article?')) return;
    try {
      await api.delete(`/api/admin/v1/editorial/${id}`);
      await loadPosts();
    } catch (err: any) {
      alert(`Delete failed: ${err?.message}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sera-taupe/20 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold">
            Brand Storytelling
          </span>
          <h1 className="font-serif text-2xl text-sera-espresso font-normal">
            SÉRA EDIT (The Journal)
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadPosts}
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
            <span>Write Essay</span>
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
          <span>Loading articles...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center bg-white border border-sera-taupe/20 rounded-sm p-8">
          <BookOpen className="w-8 h-8 text-sera-taupe/40 mx-auto mb-2" />
          <h3 className="font-serif text-lg text-sera-espresso mb-1">No Journal Entries</h3>
          <p className="text-xs text-sera-taupe max-w-sm mx-auto mb-4">
            Publish journal entries regarding jewellery care, styling inspirations, and craftsmanship.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1.5 bg-sera-espresso text-sera-ivory rounded-sm text-xs uppercase tracking-wider font-semibold"
          >
            Write First Entry
          </button>
        </div>
      ) : (
        <div className="bg-white border border-sera-taupe/20 rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-sera-ivory border-b border-sera-taupe/20 text-sera-taupe uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4">Pillar</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sera-taupe/15">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-sera-ivory/30">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-sera-espresso block">{post.title}</span>
                    <span className="text-[11px] font-mono text-sera-taupe">/edit/{post.slug}</span>
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] font-semibold text-sera-taupe">
                    {post.pillar}
                  </td>
                  <td className="py-3 px-4 text-sera-espresso/80">
                    {post.author_display_name || 'Simran'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] uppercase font-semibold ${
                      post.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(post.id)}
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

      {/* Write Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-sera-espresso/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-sera-ivory border border-sera-taupe/30 rounded-sm shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-sera-taupe/20 pb-3">
              <h3 className="font-serif text-lg text-sera-espresso">Write Journal Entry</h3>
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
                Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. The Alchemy of 18K Gold Vermeil"
                value={formData.title}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    title: val,
                    slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                  });
                }}
                className="w-full bg-white border border-sera-taupe/30 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-sera-espresso"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold block mb-1">
                  Pillar
                </label>
                <select
                  value={formData.pillar}
                  onChange={(e) => setFormData({ ...formData, pillar: e.target.value })}
                  className="w-full bg-white border border-sera-taupe/30 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-sera-espresso"
                >
                  <option value="styling">Styling & Capsule</option>
                  <option value="craft">Artisan Craft</option>
                  <option value="care">Jewellery Care</option>
                  <option value="philosophy">Conscious Luxury</option>
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
                Excerpt
              </label>
              <textarea
                rows={2}
                placeholder="Brief intro appearing on journal cards"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full bg-white border border-sera-taupe/30 px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-sera-espresso"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold block mb-1">
                Body Content
              </label>
              <textarea
                rows={6}
                placeholder="Essay content..."
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
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
                {saving ? 'Saving...' : 'Publish Essay'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
