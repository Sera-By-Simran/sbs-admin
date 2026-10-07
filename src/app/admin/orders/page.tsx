'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import {
  ShoppingBag,
  Loader2,
  AlertCircle,
  RefreshCw,
  Truck,
  CheckCircle2,
  Clock,
  Package,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/admin/v1/orders');
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function formatPrice(paise: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(paise / 100);
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sera-taupe/20 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-sera-taupe font-semibold">
            Order Fulfillment
          </span>
          <h1 className="font-serif text-3xl text-sera-espresso font-normal mt-1">
            Confirmed Orders
          </h1>
          <p className="text-xs text-sera-espresso/70 mt-1">
            Track confirmed client orders, QC inspection status, and insured courier dispatch.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => loadOrders()}
            className="p-2 border border-sera-taupe/40 bg-white/70 text-sera-espresso rounded-sm hover:bg-sera-beige/40 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sera-taupe ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-sm flex items-start space-x-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white/80 border border-sera-taupe/30 rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-sera-taupe space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-sera-espresso" />
            <span className="text-xs">Loading orders vault...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-sera-taupe">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30 text-sera-espresso" />
            <p className="text-sm font-medium">No confirmed orders yet</p>
            <p className="text-xs mt-1">
              When a VIP enquiry is confirmed by the client, converting it will create a tracked order here.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sera-taupe/20 bg-sera-beige/20 text-[10px] uppercase tracking-wider text-sera-taupe font-semibold">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sera-taupe/15 text-xs text-sera-espresso">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-sera-beige/20 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-sera-espresso text-[11px]">
                    {ord.reference}
                  </td>
                  <td className="py-3 px-4 font-medium text-sera-espresso">
                    {ord.customers?.full_name || ord.ship_name}
                  </td>
                  <td className="py-3 px-4 text-sera-espresso/70">
                    {ord.ship_city || '—'}, {ord.ship_pincode || ''}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-sera-espresso">
                    {formatPrice(ord.total_paise)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-semibold text-sky-800 bg-sky-100/70 px-2 py-0.5 rounded-sm">
                      <Package className="w-2.5 h-2.5" />
                      <span>{ord.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-sm">
                      <span>{ord.payment_status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
