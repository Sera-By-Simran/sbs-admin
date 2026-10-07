'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import { Supplier } from '@/types/database';
import {
  Truck,
  Plus,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
  Lock,
} from 'lucide-react';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadSuppliers() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/admin/v1/suppliers');
      if (res.success) {
        setSuppliers(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load suppliers. Ensure you have owner/inventory access.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function handleCreateSupplier(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.post('/api/admin/v1/suppliers', {
        name: name.trim(),
        code: code.trim() || undefined,
        contact_person: contactPerson.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        payment_terms: paymentTerms.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      setIsModalOpen(false);
      setName('');
      setCode('');
      setContactPerson('');
      setEmail('');
      setPhone('');
      setPaymentTerms('');
      setNotes('');
      await loadSuppliers();
    } catch (err: any) {
      setError(err?.message || 'Failed to register supplier');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sera-taupe/20 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-sera-taupe font-semibold">
              Restricted Operations
            </span>
            <span className="inline-flex items-center space-x-1 text-[9px] uppercase font-semibold text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded-sm">
              <Lock className="w-2.5 h-2.5" />
              <span>Private • RLS Isolated</span>
            </span>
          </div>
          <h1 className="font-serif text-3xl text-sera-espresso font-normal mt-1">
            Supplier Registry
          </h1>
          <p className="text-xs text-sera-espresso/70 mt-1">
            Private manufacturer details, procurement contacts, and vendor terms. Never exposed to customer apps.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => loadSuppliers()}
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
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-sm flex items-start space-x-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Suppliers Table */}
      <div className="bg-white/80 border border-sera-taupe/30 rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-sera-taupe space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-sera-espresso" />
            <span className="text-xs">Loading suppliers registry...</span>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="p-12 text-center text-sera-taupe">
            <Truck className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No suppliers registered yet.</p>
            <p className="text-xs mt-1">Add your private jewelry manufacturing workshops to link product sourcing costs.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sera-taupe/20 bg-sera-beige/20 text-[10px] uppercase tracking-wider text-sera-taupe font-semibold">
                <th className="py-3 px-4">Supplier Name</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Payment Terms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sera-taupe/15 text-xs text-sera-espresso">
              {suppliers.map((supp) => (
                <tr key={supp.id} className="hover:bg-sera-beige/20 transition-colors">
                  <td className="py-3 px-4 font-semibold text-sera-espresso">
                    {supp.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-sera-taupe">
                    {supp.code || '—'}
                  </td>
                  <td className="py-3 px-4 text-sera-espresso/80">
                    {supp.contact_person || '—'}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-sera-espresso/70">
                    {supp.email || '—'}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-sera-espresso/70">
                    {supp.phone || '—'}
                  </td>
                  <td className="py-3 px-4 text-sera-espresso/70">
                    {supp.payment_terms || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-sera-espresso/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sera-ivory border border-sera-taupe/30 rounded-sm shadow-xl max-w-lg w-full p-6 animate-in fade-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sera-taupe/20 pb-4 mb-4">
              <h2 className="font-serif text-xl text-sera-espresso">Register Private Supplier</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-sera-taupe hover:text-sera-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Surat Gems & Craft"
                    className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                    Supplier Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. SUP-SGC-01"
                    className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                    Payment Terms
                  </label>
                  <input
                    type="text"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    placeholder="e.g. Net 30, Advance 50%"
                    className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="orders@supplier.com"
                    className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-sm bg-white border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                  Private Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal notes regarding quality, lead times, MOQ..."
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
                  <span>Save Supplier</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
