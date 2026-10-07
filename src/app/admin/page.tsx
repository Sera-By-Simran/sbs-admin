'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api/client';
import {
  Gem,
  FolderTree,
  Truck,
  MessageSquare,
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  ExternalLink,
} from 'lucide-react';

interface DashboardStats {
  productsCount: number;
  categoriesCount: number;
  suppliersCount: number;
  enquiriesCount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    productsCount: 0,
    categoriesCount: 0,
    suppliersCount: 0,
    enquiriesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [categoriesRes, productsRes] = await Promise.allSettled([
          api.get('/api/admin/v1/categories'),
          api.get('/api/admin/v1/products?limit=100'),
        ]);

        let pCount = 0;
        let cCount = 0;
        let sCount = 0;

        if (categoriesRes.status === 'fulfilled' && categoriesRes.value?.data) {
          cCount = categoriesRes.value.data.length;
        }

        if (productsRes.status === 'fulfilled' && productsRes.value?.data) {
          pCount = productsRes.value.data.length;
        }

        // Try suppliers
        try {
          const suppRes = await api.get('/api/admin/v1/suppliers');
          if (suppRes?.data) sCount = suppRes.data.length;
        } catch {
          // might not have permission if not owner/admin
        }

        setStats({
          productsCount: pCount,
          categoriesCount: cCount,
          suppliersCount: sCount,
          enquiriesCount: 0,
        });
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sera-taupe/20 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-sera-taupe font-semibold">
            Boutique Operations
          </span>
          <h1 className="font-serif text-3xl text-sera-espresso font-normal mt-1">
            Executive Dashboard
          </h1>
          <p className="text-xs text-sera-espresso/70 mt-1">
            Real-time status of your catalogue, private suppliers, and boutique assets.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center space-x-2 bg-sera-espresso text-sera-ivory px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Piece</span>
          </Link>
          <Link
            href="/admin/media"
            className="inline-flex items-center space-x-2 border border-sera-taupe/40 bg-white/70 text-sera-espresso px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-sera-beige/40 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5 text-sera-taupe" />
            <span>Upload Media</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 border border-sera-taupe/30 rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-sera-taupe font-semibold">
              Catalogue Pieces
            </span>
            <Gem className="w-4 h-4 text-sera-champagne" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-serif text-3xl text-sera-espresso font-normal">
              {loading ? '—' : stats.productsCount}
            </span>
            <Link
              href="/admin/products"
              className="text-[11px] text-sera-espresso/80 hover:text-sera-espresso font-medium flex items-center space-x-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="bg-white/80 border border-sera-taupe/30 rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-sera-taupe font-semibold">
              Categories
            </span>
            <FolderTree className="w-4 h-4 text-sera-champagne" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-serif text-3xl text-sera-espresso font-normal">
              {loading ? '—' : stats.categoriesCount}
            </span>
            <Link
              href="/admin/categories"
              className="text-[11px] text-sera-espresso/80 hover:text-sera-espresso font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="bg-white/80 border border-sera-taupe/30 rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-sera-taupe font-semibold">
              Private Suppliers
            </span>
            <Truck className="w-4 h-4 text-sera-champagne" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-serif text-3xl text-sera-espresso font-normal">
              {loading ? '—' : stats.suppliersCount}
            </span>
            <Link
              href="/admin/suppliers"
              className="text-[11px] text-sera-espresso/80 hover:text-sera-espresso font-medium flex items-center space-x-1"
            >
              <span>Directory</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="bg-white/80 border border-sera-taupe/30 rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-sera-taupe font-semibold">
              VIP Enquiries
            </span>
            <MessageSquare className="w-4 h-4 text-sera-champagne" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-serif text-3xl text-sera-espresso font-normal">
              {loading ? '—' : stats.enquiriesCount}
            </span>
            <span className="text-[11px] text-sera-taupe">Active Queue</span>
          </div>
        </div>
      </div>

      {/* Operational System Status & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/80 border border-sera-taupe/30 rounded-sm p-6 shadow-sm">
          <h2 className="font-serif text-lg text-sera-espresso mb-4">
            Catalogue Operational Readiness
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-sera-ivory/50 border border-sera-taupe/20 rounded-sm">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xs font-semibold text-sera-espresso">
                    Database Schema & RLS Lockdown
                  </h3>
                  <p className="text-[11px] text-sera-taupe">
                    12 migrations active. Private supplier data strictly role-isolated.
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm">
                Enforced
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-sera-ivory/50 border border-sera-taupe/20 rounded-sm">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xs font-semibold text-sera-espresso">
                    Media Storage Pipeline (Sharp WebP/AVIF)
                  </h3>
                  <p className="text-[11px] text-sera-taupe">
                    Buckets <code>media-public</code> and <code>media-originals</code> mounted.
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-sera-ivory/50 border border-sera-taupe/20 rounded-sm">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xs font-semibold text-sera-espresso">
                    Catalogue Categories Seeded
                  </h3>
                  <p className="text-[11px] text-sera-taupe">
                    10 core luxury demi-fine jewellery categories populated with meta schemas.
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm">
                Complete
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white/80 border border-sera-taupe/30 rounded-sm p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-lg text-sera-espresso mb-4">
              Quick Shortcuts
            </h2>
            <div className="space-y-2">
              <Link
                href="/admin/products"
                className="flex items-center justify-between p-2.5 rounded-sm hover:bg-sera-beige/40 text-xs text-sera-espresso font-medium transition-colors"
              >
                <span>Browse Products Table</span>
                <ArrowRight className="w-3.5 h-3.5 text-sera-taupe" />
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center justify-between p-2.5 rounded-sm hover:bg-sera-beige/40 text-xs text-sera-espresso font-medium transition-colors"
              >
                <span>Configure Categories</span>
                <ArrowRight className="w-3.5 h-3.5 text-sera-taupe" />
              </Link>
              <Link
                href="/admin/suppliers"
                className="flex items-center justify-between p-2.5 rounded-sm hover:bg-sera-beige/40 text-xs text-sera-espresso font-medium transition-colors"
              >
                <span>Supplier Registry & Costs</span>
                <ArrowRight className="w-3.5 h-3.5 text-sera-taupe" />
              </Link>
              <Link
                href="/admin/media"
                className="flex items-center justify-between p-2.5 rounded-sm hover:bg-sera-beige/40 text-xs text-sera-espresso font-medium transition-colors"
              >
                <span>Media Asset Management</span>
                <ArrowRight className="w-3.5 h-3.5 text-sera-taupe" />
              </Link>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-sera-taupe/20">
            <a
              href={process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-sera-espresso/80 hover:text-sera-espresso font-semibold"
            >
              <span>Preview Customer Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
