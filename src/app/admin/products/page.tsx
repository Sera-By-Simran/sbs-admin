'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api/client';
import { Product, Category } from '@/types/database';
import {
  Gem,
  Plus,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Eye,
  Check,
  Send,
} from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [publishingId, setPublishingId] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/api/admin/v1/products?limit=200'),
        api.get('/api/admin/v1/categories'),
      ]);

      if (prodRes.success) {
        setProducts(prodRes.data);
      }
      if (catRes.success) {
        setCategories(catRes.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handlePublishToggle(productId: string) {
    setPublishingId(productId);
    try {
      const res = await api.post(`/api/admin/v1/products/${productId}/publish`);
      if (res.success) {
        await loadData();
      }
    } catch (err: any) {
      alert(`Publish check failed: ${err?.message || 'Incomplete mandatory requirements'}`);
    } finally {
      setPublishingId(null);
    }
  }

  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchTerm ||
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' || p.primary_category_id === selectedCategory;

      const matchesStatus =
        selectedStatus === 'all' || p.status === selectedStatus;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  function formatPrice(paise: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(paise / 100);
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-sm">
            <Check className="w-2.5 h-2.5" />
            <span>Published</span>
          </span>
        );
      case 'in_review':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-sm">
            <Clock className="w-2.5 h-2.5" />
            <span>In Review</span>
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-semibold text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded-sm">
            <span>Archived</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-semibold text-sera-espresso/70 bg-sera-beige/60 px-2 py-0.5 rounded-sm">
            <span>Draft</span>
          </span>
        );
    }
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sera-taupe/20 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-sera-taupe font-semibold">
            Boutique Inventory
          </span>
          <h1 className="font-serif text-3xl text-sera-espresso font-normal mt-1">
            Product Catalogue
          </h1>
          <p className="text-xs text-sera-espresso/70 mt-1">
            Manage jewellery pieces, editorial descriptions, media attachments, and private supplier costs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => loadData()}
            className="p-2 border border-sera-taupe/40 bg-white/70 text-sera-espresso rounded-sm hover:bg-sera-beige/40 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sera-taupe ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center space-x-2 bg-sera-espresso text-sera-ivory px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Piece</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-sm flex items-start space-x-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white/80 border border-sera-taupe/30 rounded-sm p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by title or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-sera-ivory/60 border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso"
          />
          <Search className="w-3.5 h-3.5 text-sera-taupe absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-white border border-sera-taupe/40 rounded-sm px-3 py-1.5 focus:outline-none focus:border-sera-espresso"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-white border border-sera-taupe/40 rounded-sm px-3 py-1.5 focus:outline-none focus:border-sera-espresso"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="in_review">In Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 border border-sera-taupe/30 rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-sera-taupe space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-sera-espresso" />
            <span className="text-xs">Loading catalogue...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center text-sera-taupe">
            <Gem className="w-8 h-8 mx-auto mb-2 opacity-30 text-sera-espresso" />
            <p className="text-sm font-medium">No jewellery pieces found</p>
            <p className="text-xs mt-1">Create your first product piece to populate the boutique catalogue.</p>
            <Link
              href="/admin/products/new"
              className="mt-4 inline-flex items-center space-x-1.5 bg-sera-espresso text-sera-ivory px-3 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Product</span>
            </Link>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sera-taupe/20 bg-sera-beige/20 text-[10px] uppercase tracking-wider text-sera-taupe font-semibold">
                <th className="py-3 px-4">SKU & Piece</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Sourcing Cost</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sera-taupe/15 text-xs text-sera-espresso">
              {filteredProducts.map((p) => {
                const isPublished = p.status === 'published';
                return (
                  <tr key={p.id} className="hover:bg-sera-beige/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-sera-espresso">{p.name}</div>
                      <div className="font-mono text-[11px] text-sera-taupe">{p.sku}</div>
                    </td>

                    <td className="py-3 px-4 text-sera-espresso/80">
                      {categoryMap[p.primary_category_id] || 'Unassigned'}
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-sera-espresso">
                      {formatPrice(p.price_paise)}
                    </td>

                    <td className="py-3 px-4 font-mono text-sera-taupe text-[11px]">
                      {p.cost_price_paise ? (
                        <span className="text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded-sm">
                          {formatPrice(p.cost_price_paise)}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Private</span>
                      )}
                    </td>

                    <td className="py-3 px-4">{getStatusBadge(p.status)}</td>

                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handlePublishToggle(p.id)}
                        disabled={publishingId === p.id}
                        className={`inline-flex items-center space-x-1 text-[11px] px-2.5 py-1 rounded-sm border transition-colors ${
                          isPublished
                            ? 'border-emerald-600/40 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100'
                            : 'border-sera-espresso/40 text-sera-espresso hover:bg-sera-beige/50'
                        }`}
                        title={isPublished ? 'Published' : 'Publish piece'}
                      >
                        {publishingId === p.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Send className="w-3 h-3" />
                        )}
                        <span>{isPublished ? 'Published' : 'Publish'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
