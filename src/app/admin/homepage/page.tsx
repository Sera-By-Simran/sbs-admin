'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import { LayoutGrid, Plus, Loader2, AlertCircle, RefreshCw, MoveUp, MoveDown, Check } from 'lucide-react';

export default function AdminHomepageBuilderPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const defaultPresetSections = [
    { type: 'hero', name: 'Editorial Hero Banner', variant: 'full_bleed', sort: 0, status: 'published' },
    { type: 'trust_strip', name: 'The SÉRA Standards Trust Strip', variant: 'inline', sort: 1, status: 'published' },
    { type: 'category_grid', name: 'Curated Category Portals', variant: 'quad_grid', sort: 2, status: 'published' },
    { type: 'featured_products', name: 'Signature Pieces Selection', variant: 'carousel', sort: 3, status: 'published' },
    { type: 'showroom_teaser', name: 'Digital Anatomy Showroom Spotlight', variant: 'split_canvas', sort: 4, status: 'published' },
    { type: 'founder_story', name: 'The SÉRA Craft & Philosophy', variant: 'narrative', sort: 5, status: 'published' },
  ];

  async function loadSections() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/admin/v1/homepage');
      if (res.success && res.data.length > 0) {
        setSections(res.data);
      } else {
        setSections(defaultPresetSections);
      }
    } catch {
      setSections(defaultPresetSections);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSections();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sera-taupe/20 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold">
            Storefront Layout Engine
          </span>
          <h1 className="font-serif text-2xl text-sera-espresso font-normal">
            Homepage Section Builder
          </h1>
        </div>

        <button
          onClick={loadSections}
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

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-sera-taupe text-xs">
          <Loader2 className="w-6 h-6 animate-spin mb-2" />
          <span>Loading layout structure...</span>
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl">
          <span className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold block">
            Active Storefront Sections (Top to Bottom Sequence)
          </span>

          <div className="space-y-2">
            {sections.map((sec, index) => (
              <div
                key={sec.type + index}
                className="bg-white border border-sera-taupe/20 p-4 rounded-sm flex items-center justify-between shadow-sm hover:border-sera-espresso/30 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <span className="font-mono text-xs text-sera-taupe font-bold w-6">
                    0{index + 1}
                  </span>
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-sera-espresso">
                      {sec.name || sec.type.toUpperCase().replace(/_/g, ' ')}
                    </h4>
                    <span className="text-[10px] uppercase tracking-wider text-sera-taupe font-mono">
                      Type: {sec.type} • Variant: {sec.variant || 'default'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-sm text-[10px] uppercase font-semibold">
                    Published
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
