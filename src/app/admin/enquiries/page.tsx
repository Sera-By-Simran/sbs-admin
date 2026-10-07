'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import {
  MessageSquare,
  Loader2,
  AlertCircle,
  RefreshCw,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowRight,
  User,
  ShoppingBag,
} from 'lucide-react';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeEnquiry, setActiveEnquiry] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);

  async function loadEnquiries() {
    setLoading(true);
    setError(null);
    try {
      const url = selectedStatus === 'all'
        ? '/api/admin/v1/enquiries'
        : `/api/admin/v1/enquiries?status=${selectedStatus}`;
      const res = await api.get(url);
      if (res.success) {
        setEnquiries(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load VIP enquiries');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEnquiries();
  }, [selectedStatus]);

  async function handleStatusTransition(toStatus: string) {
    if (!activeEnquiry) return;
    setUpdating(true);
    try {
      const res = await api.post(`/api/admin/v1/enquiries/${activeEnquiry.id}/transition`, {
        to_status: toStatus,
      });
      if (res.success) {
        setActiveEnquiry(null);
        await loadEnquiries();
      }
    } catch (err: any) {
      alert(`Transition failed: ${err?.message || 'Invalid state change'}`);
    } finally {
      setUpdating(false);
    }
  }

  function formatPrice(paise: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(paise / 100);
  }

  function getStatusChip(status: string) {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-semibold text-sky-800 bg-sky-100/80 px-2 py-0.5 rounded-sm">
            <Clock className="w-2.5 h-2.5" />
            <span>New VIP Lead</span>
          </span>
        );
      case 'supplier_check':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-sm">
            <Truck className="w-2.5 h-2.5" />
            <span>Supplier Check</span>
          </span>
        );
      case 'availability_confirmed':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-sm">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>Stock Ready</span>
          </span>
        );
      case 'customer_confirmed':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-semibold text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded-sm">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>Order Confirmed</span>
          </span>
        );
      case 'unavailable':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-semibold text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded-sm">
            <XCircle className="w-2.5 h-2.5" />
            <span>Unavailable</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-sm">
            <span>{status}</span>
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
            Concierge Operations
          </span>
          <h1 className="font-serif text-3xl text-sera-espresso font-normal mt-1">
            VIP Enquiries Queue
          </h1>
          <p className="text-xs text-sera-espresso/70 mt-1">
            Bespoke requests, customer styling consultations, and stock verification pipeline.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => loadEnquiries()}
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

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-sera-taupe/20">
        {[
          { id: 'all', label: 'All Enquiries' },
          { id: 'new', label: 'New' },
          { id: 'supplier_check', label: 'Supplier Check' },
          { id: 'availability_confirmed', label: 'Confirmed Stock' },
          { id: 'customer_confirmed', label: 'Customer Confirmed' },
          { id: 'unavailable', label: 'Unavailable' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedStatus(tab.id)}
            className={`px-3.5 py-1.5 rounded-sm text-xs uppercase tracking-wider font-semibold transition-colors flex-shrink-0 ${
              selectedStatus === tab.id
                ? 'bg-sera-espresso text-sera-ivory'
                : 'bg-white/70 border border-sera-taupe/30 text-sera-espresso hover:bg-sera-beige/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/80 border border-sera-taupe/30 rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-sera-taupe space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-sera-espresso" />
            <span className="text-xs">Loading concierge queue...</span>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="p-16 text-center text-sera-taupe">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30 text-sera-espresso" />
            <p className="text-sm font-medium">No enquiries in this status queue</p>
            <p className="text-xs mt-1">Customer tray requests will appear here in real-time.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sera-taupe/20 bg-sera-beige/20 text-[10px] uppercase tracking-wider text-sera-taupe font-semibold">
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">WhatsApp / Contact</th>
                <th className="py-3 px-4">Pieces</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sera-taupe/15 text-xs text-sera-espresso">
              {enquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-sera-beige/20 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-sera-espresso text-[11px]">
                    {enq.reference}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-sera-espresso">
                      {enq.customers?.full_name || 'Anonymous Client'}
                    </div>
                    {enq.occasion && (
                      <div className="text-[10px] text-sera-taupe italic mt-0.5">
                        Occasion: {enq.occasion}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <a
                      href={`https://wa.me/${enq.customers?.phone_e164?.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                        enq.customers?.full_name || 'Client'
                      )},%20this%20is%20SÉRA%20Concierge%20regarding%20your%20enquiry%20${enq.reference}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 text-emerald-800 hover:text-emerald-950 font-mono text-[11px]"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{enq.customers?.phone_e164}</span>
                    </a>
                  </td>
                  <td className="py-3 px-4 font-mono text-sera-taupe">
                    {enq.enquiry_items?.length || 0} item(s)
                  </td>
                  <td className="py-3 px-4">{getStatusChip(enq.status)}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setActiveEnquiry(enq)}
                      className="inline-flex items-center space-x-1 text-[11px] px-2.5 py-1 border border-sera-taupe/40 bg-white rounded-sm hover:bg-sera-beige/30 transition-colors"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3 h-3 text-sera-taupe" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Review Modal */}
      {activeEnquiry && (
        <div className="fixed inset-0 bg-sera-espresso/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sera-ivory border border-sera-taupe/30 rounded-sm shadow-xl max-w-lg w-full p-6 animate-in fade-in duration-150 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-sera-taupe/20 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold">
                  Enquiry Details
                </span>
                <h3 className="font-serif text-xl text-sera-espresso">
                  {activeEnquiry.reference}
                </h3>
              </div>
              <button
                onClick={() => setActiveEnquiry(null)}
                className="text-sera-taupe hover:text-sera-espresso text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {/* Client Info */}
            <div className="p-3 bg-white/70 border border-sera-taupe/20 rounded-sm space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-sera-taupe font-semibold uppercase text-[10px]">Client</span>
                <span className="font-semibold">{activeEnquiry.customers?.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sera-taupe font-semibold uppercase text-[10px]">Phone</span>
                <span className="font-mono">{activeEnquiry.customers?.phone_e164}</span>
              </div>
              {activeEnquiry.message && (
                <div className="pt-2 border-t border-sera-taupe/15">
                  <span className="text-[10px] text-sera-taupe uppercase block">Note from client:</span>
                  <p className="italic text-sera-espresso/80 mt-0.5">{activeEnquiry.message}</p>
                </div>
              )}
            </div>

            {/* Requested Items */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold block mb-2">
                Enquired Jewellery Pieces
              </span>
              <div className="space-y-2">
                {activeEnquiry.enquiry_items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white border border-sera-taupe/20 rounded-sm flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-semibold text-sera-espresso">{item.name_snapshot}</h4>
                      <span className="text-[10px] text-sera-taupe font-mono">{item.sku_snapshot}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-medium">{formatPrice(item.price_paise_snapshot)}</span>
                      <span className="text-[10px] text-sera-taupe block">Qty: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Actions */}
            <div className="pt-3 border-t border-sera-taupe/20 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold block">
                Workflow Actions (State Machine)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {activeEnquiry.status === 'new' && (
                  <button
                    onClick={() => handleStatusTransition('supplier_check')}
                    disabled={updating}
                    className="p-2 bg-amber-700 text-white rounded-sm text-xs uppercase tracking-wider font-semibold hover:bg-amber-800 disabled:opacity-50"
                  >
                    Initiate Supplier Check
                  </button>
                )}
                {activeEnquiry.status === 'supplier_check' && (
                  <button
                    onClick={() => handleStatusTransition('availability_confirmed')}
                    disabled={updating}
                    className="p-2 bg-emerald-700 text-white rounded-sm text-xs uppercase tracking-wider font-semibold hover:bg-emerald-800 disabled:opacity-50"
                  >
                    Confirm Stock Available
                  </button>
                )}
                {activeEnquiry.status === 'availability_confirmed' && (
                  <button
                    onClick={() => handleStatusTransition('customer_confirmed')}
                    disabled={updating}
                    className="p-2 bg-purple-700 text-white rounded-sm text-xs uppercase tracking-wider font-semibold hover:bg-purple-800 disabled:opacity-50"
                  >
                    Mark Customer Confirmed
                  </button>
                )}
                <button
                  onClick={() => handleStatusTransition('cancelled')}
                  disabled={updating}
                  className="p-2 border border-rose-300 text-rose-700 rounded-sm text-xs uppercase tracking-wider font-semibold hover:bg-rose-50 disabled:opacity-50"
                >
                  Cancel Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
