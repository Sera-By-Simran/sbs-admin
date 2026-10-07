'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import { Users, Search, Loader2, AlertCircle, RefreshCw, MessageCircle, Mail, MapPin } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCustomer, setActiveCustomer] = useState<any | null>(null);

  async function loadCustomers() {
    setLoading(true);
    setError(null);
    try {
      const url = search.trim()
        ? `/api/admin/v1/customers?q=${encodeURIComponent(search.trim())}`
        : '/api/admin/v1/customers';
      const res = await api.get(url);
      if (res.success) {
        setCustomers(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sera-taupe/20 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold">
            Client Directory
          </span>
          <h1 className="font-serif text-2xl text-sera-espresso font-normal">
            Private Clients & Patrons
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-sera-taupe" />
            <input
              type="text"
              placeholder="Search patron name, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadCustomers()}
              className="bg-white border border-sera-taupe/30 pl-8 pr-3 py-1.5 text-xs rounded-sm focus:outline-none w-64"
            />
          </div>
          <button
            onClick={loadCustomers}
            className="p-2 border border-sera-taupe/30 rounded-sm text-sera-espresso hover:bg-white text-xs font-semibold"
            title="Search"
          >
            <RefreshCw className="w-3.5 h-3.5" />
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
          <span>Loading client directory...</span>
        </div>
      ) : customers.length === 0 ? (
        <div className="py-16 text-center bg-white border border-sera-taupe/20 rounded-sm p-8">
          <Users className="w-8 h-8 text-sera-taupe/40 mx-auto mb-2" />
          <h3 className="font-serif text-lg text-sera-espresso mb-1">No Patrons Found</h3>
          <p className="text-xs text-sera-taupe max-w-sm mx-auto">
            Client profiles are automatically registered when customers submit VIP enquiries or confirm orders.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-sera-taupe/20 rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-sera-ivory border-b border-sera-taupe/20 text-sera-taupe uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Patron Name</th>
                <th className="py-3 px-4">Phone / Channel</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Enquiries</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sera-taupe/15">
              {customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-sera-ivory/30">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-sera-espresso block">{cust.full_name}</span>
                    <span className="text-[10px] text-sera-taupe">
                      Joined {new Date(cust.created_at).toLocaleDateString('en-GB')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <a
                      href={`https://wa.me/${cust.phone_e164.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 text-emerald-800 hover:text-emerald-950 font-mono text-[11px]"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>{cust.phone_e164}</span>
                    </a>
                  </td>
                  <td className="py-3 px-4 text-sera-taupe font-mono text-[11px]">
                    {cust.email || '—'}
                  </td>
                  <td className="py-3 px-4 text-sera-espresso/80">
                    {cust.city ? `${cust.city}, ${cust.state || ''}` : '—'}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">
                    {cust.enquiries?.[0]?.count || 0}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">
                    {cust.orders?.[0]?.count || 0}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setActiveCustomer(cust)}
                      className="text-[11px] font-semibold text-sera-espresso hover:text-amber-900 border border-sera-taupe/30 px-2 py-0.5 rounded-sm"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Detail Modal */}
      {activeCustomer && (
        <div className="fixed inset-0 bg-sera-espresso/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sera-ivory border border-sera-taupe/30 rounded-sm shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-sera-taupe/20 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold">
                  Patron Dossier
                </span>
                <h3 className="font-serif text-xl text-sera-espresso">
                  {activeCustomer.full_name}
                </h3>
              </div>
              <button
                onClick={() => setActiveCustomer(null)}
                className="text-sera-taupe hover:text-sera-espresso text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-sera-taupe/15">
                <span className="text-sera-taupe">Phone (WhatsApp)</span>
                <span className="font-mono font-medium">{activeCustomer.phone_e164}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sera-taupe/15">
                <span className="text-sera-taupe">Email</span>
                <span className="font-mono">{activeCustomer.email || 'None'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sera-taupe/15">
                <span className="text-sera-taupe">Preferred Channel</span>
                <span className="uppercase text-[10px] font-semibold">{activeCustomer.preferred_channel}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sera-taupe/15">
                <span className="text-sera-taupe">Marketing Consent</span>
                <span>{activeCustomer.marketing_consent ? 'Opted In' : 'Declined'}</span>
              </div>
            </div>

            {activeCustomer.internal_notes && (
              <div className="p-3 bg-white border border-sera-taupe/20 rounded-sm text-xs">
                <span className="text-[10px] uppercase text-sera-taupe font-semibold block mb-1">
                  Stylist Notes:
                </span>
                <p className="italic">{activeCustomer.internal_notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
