'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api/client';
import { Category, Supplier } from '@/types/database';
import {
  ArrowLeft,
  Gem,
  Loader2,
  AlertCircle,
  Check,
  Lock,
  Sparkles,
} from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priceInr, setPriceInr] = useState('');
  const [comparePriceInr, setComparePriceInr] = useState('');
  const [sourcingCostInr, setSourcingCostInr] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [availability, setAvailability] = useState('available_to_order');
  const [badge, setBadge] = useState('new_in');
  const [status, setStatus] = useState('draft');

  useEffect(() => {
    async function loadFormDeps() {
      try {
        const [catRes, suppRes] = await Promise.allSettled([
          api.get('/api/admin/v1/categories'),
          api.get('/api/admin/v1/suppliers'),
        ]);

        if (catRes.status === 'fulfilled' && catRes.value.success) {
          setCategories(catRes.value.data);
          if (catRes.value.data.length > 0) {
            setCategoryId(catRes.value.data[0].id);
          }
        }

        if (suppRes.status === 'fulfilled' && suppRes.value.success) {
          setSuppliers(suppRes.value.data);
        }
      } catch (err) {
        console.error('Failed loading form dependencies:', err);
      } finally {
        setLoadingInitial(false);
      }
    }

    loadFormDeps();
  }, []);

  function handleNameChange(val: string) {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(generatedSlug);

    if (!sku) {
      const initials = val
        .split(' ')
        .map((w) => w[0]?.toUpperCase() || '')
        .join('')
        .slice(0, 3);
      setSku(`SBS-${initials || 'JW'}-${Math.floor(100 + Math.random() * 900)}`);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const pricePaise = Math.round(parseFloat(priceInr) * 100);
      if (isNaN(pricePaise) || pricePaise <= 0) {
        throw new Error('Please enter a valid retail selling price');
      }

      const comparePaise = comparePriceInr
        ? Math.round(parseFloat(comparePriceInr) * 100)
        : null;

      const costPaise = sourcingCostInr
        ? Math.round(parseFloat(sourcingCostInr) * 100)
        : null;

      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        sku: sku.trim(),
        primary_category_id: categoryId || null,
        price_paise: pricePaise,
        compare_at_paise: comparePaise,
        cost_price_paise: costPaise,
        supplier_id: supplierId || null,
        short_description: shortDescription.trim() || null,
        public_availability: availability,
        badge,
        status,
        currency: 'INR',
      };

      const res = await api.post('/api/admin/v1/products', payload);
      if (res.success) {
        router.push('/admin/products');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to create piece');
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingInitial) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-sera-taupe space-y-2 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-sera-espresso" />
        <span className="text-xs">Loading catalogue parameters...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sera-taupe/20 pb-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products"
            className="p-1.5 border border-sera-taupe/30 rounded-sm hover:bg-sera-beige/40 text-sera-espresso"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-sera-taupe font-semibold">
              Boutique Creation
            </span>
            <h1 className="font-serif text-2xl text-sera-espresso font-normal">
              New Jewellery Piece
            </h1>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-sm flex items-start space-x-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Details */}
        <div className="bg-white/80 border border-sera-taupe/30 rounded-sm p-6 shadow-sm space-y-4">
          <h2 className="font-serif text-lg text-sera-espresso border-b border-sera-taupe/20 pb-2">
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                Piece Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Celestial Diamond Solitaire Pendant"
                className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                SKU Reference *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. SBS-NK-101"
                className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="celestial-diamond-solitaire-pendant"
                className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                Primary Category *
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
              Short Editorial Description
            </label>
            <textarea
              rows={3}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Handcrafted in 18k solid gold vermeil with brilliant-cut moissanite accents..."
              className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso resize-none"
            />
          </div>
        </div>

        {/* Pricing & Private Sourcing Cost */}
        <div className="bg-white/80 border border-sera-taupe/30 rounded-sm p-6 shadow-sm space-y-4">
          <h2 className="font-serif text-lg text-sera-espresso border-b border-sera-taupe/20 pb-2">
            2. Commercials & Sourcing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                Retail Selling Price (₹ INR) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={priceInr}
                onChange={(e) => setPriceInr(e.target.value)}
                placeholder="4990"
                className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                Compare-at MRP (₹ INR)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={comparePriceInr}
                onChange={(e) => setComparePriceInr(e.target.value)}
                placeholder="6990"
                className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso font-mono"
              />
            </div>

            <div>
              <div className="flex items-center space-x-1.5 mb-1">
                <label className="block text-xs uppercase tracking-wider text-amber-900 font-semibold">
                  Private Sourcing Cost (₹ INR)
                </label>
                <Lock className="w-3 h-3 text-amber-700" />
              </div>
              <input
                type="number"
                min="0"
                step="1"
                value={sourcingCostInr}
                onChange={(e) => setSourcingCostInr(e.target.value)}
                placeholder="1650"
                className="w-full px-3 py-2 text-sm bg-amber-50/40 border border-amber-200 rounded-sm focus:outline-none focus:border-amber-700 font-mono"
              />
              <span className="text-[10px] text-amber-800/80 block mt-0.5">
                Role-isolated. Never exposed to public APIs.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
              Private Supplier Workshop
            </label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full md:w-1/2 px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso"
            >
              <option value="">Unassigned</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.code ? `(${s.code})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Curation & Availability */}
        <div className="bg-white/80 border border-sera-taupe/30 rounded-sm p-6 shadow-sm space-y-4">
          <h2 className="font-serif text-lg text-sera-espresso border-b border-sera-taupe/20 pb-2">
            3. Merchandising & Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                Availability Mode
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso"
              >
                <option value="available_to_order">Available to Order</option>
                <option value="made_to_order">Made to Order</option>
                <option value="limited">Limited Edition</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="sold_out">Sold Out</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                Boutique Badge
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso"
              >
                <option value="new_in">New In</option>
                <option value="bestseller">Bestseller</option>
                <option value="limited_edition">Limited Edition</option>
                <option value="none">None</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                Publishing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso"
              >
                <option value="draft">Draft (Private)</option>
                <option value="in_review">In Review</option>
                <option value="published">Published (Live)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-sera-taupe/20">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 border border-sera-taupe/40 text-sera-espresso rounded-sm text-xs uppercase tracking-wider font-semibold hover:bg-sera-beige/30 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-sera-espresso text-sera-ivory rounded-sm text-xs uppercase tracking-wider font-semibold hover:opacity-90 disabled:opacity-50 flex items-center space-x-2 transition-opacity shadow-sm"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Creating Piece...</span>
              </>
            ) : (
              <>
                <Gem className="w-3.5 h-3.5 text-sera-champagne" />
                <span>Save Jewellery Piece</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
