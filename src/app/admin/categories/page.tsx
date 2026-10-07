'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import { Category } from '@/types/database';
import {
  FolderTree,
  Plus,
  Loader2,
  Check,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New category modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadCategories() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/admin/v1/categories');
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function handleNameChange(val: string) {
    setFormName(val);
    setFormSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.post('/api/admin/v1/categories', {
        name: formName.trim(),
        slug: formSlug.trim(),
        description: formDescription.trim() || undefined,
        sort_order: categories.length + 1,
      });

      setIsModalOpen(false);
      setFormName('');
      setFormSlug('');
      setFormDescription('');
      await loadCategories();
    } catch (err: any) {
      setError(err?.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sera-taupe/20 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-sera-taupe font-semibold">
            Taxonomy & Hierarchy
          </span>
          <h1 className="font-serif text-3xl text-sera-espresso font-normal mt-1">
            Categories
          </h1>
          <p className="text-xs text-sera-espresso/70 mt-1">
            Manage navigation hierarchies and luxury collection classifications.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => loadCategories()}
            className="p-2 border border-sera-taupe/40 bg-white/70 text-sera-espresso rounded-sm hover:bg-sera-beige/40 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sera-taupe ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-sera-espresso text-sera-ivory px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-sm flex items-start space-x-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white/80 border border-sera-taupe/30 rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-sera-taupe space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-sera-espresso" />
            <span className="text-xs">Loading categories...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-sera-taupe">
            <FolderTree className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No categories configured yet.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sera-taupe/20 bg-sera-beige/20 text-[10px] uppercase tracking-wider text-sera-taupe font-semibold">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sera-taupe/15 text-xs text-sera-espresso">
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-sera-beige/20 transition-colors">
                  <td className="py-3 px-4 font-mono text-sera-taupe text-[11px]">
                    {cat.sort_order ?? idx + 1}
                  </td>
                  <td className="py-3 px-4 font-semibold text-sera-espresso">
                    {cat.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-sera-taupe">
                    /{cat.slug}
                  </td>
                  <td className="py-3 px-4 text-sera-espresso/70 max-w-xs truncate">
                    {cat.description || '—'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Active</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-sera-espresso/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sera-ivory border border-sera-taupe/30 rounded-sm shadow-xl max-w-md w-full p-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-sera-taupe/20 pb-4 mb-4">
              <h2 className="font-serif text-xl text-sera-espresso">Create Category</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-sera-taupe hover:text-sera-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Necklaces"
                  className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. necklaces"
                  className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Editorial description for the category storefront page..."
                  className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso resize-none"
                />
              </div>

              <div className="pt-4 border-t border-sera-taupe/20 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-sera-taupe/40 text-sera-espresso rounded-sm text-xs uppercase tracking-wider font-semibold hover:bg-sera-beige/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sera-espresso text-sera-ivory rounded-sm text-xs uppercase tracking-wider font-semibold hover:opacity-90 disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
