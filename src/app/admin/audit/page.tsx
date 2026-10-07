'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import {
  History,
  Loader2,
  AlertCircle,
  RefreshCw,
  Shield,
  Clock,
  Terminal,
} from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadLogs() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/admin/v1/audit?limit=100');
      if (res.success) {
        setLogs(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load security audit trail');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sera-taupe/20 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-sera-taupe font-semibold">
            Security & Compliance
          </span>
          <h1 className="font-serif text-3xl text-sera-espresso font-normal mt-1">
            Audit Activity Trail
          </h1>
          <p className="text-xs text-sera-espresso/70 mt-1">
            Immutable log of administrative operations, catalog changes, and staff access events.
          </p>
        </div>

        <button
          onClick={() => loadLogs()}
          className="p-2 border border-sera-taupe/40 bg-white/70 text-sera-espresso rounded-sm hover:bg-sera-beige/40 transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-sera-taupe ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-sm flex items-start space-x-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white/80 border border-sera-taupe/30 rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-sera-taupe space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-sera-espresso" />
            <span className="text-xs">Loading audit vault...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center text-sera-taupe">
            <Shield className="w-8 h-8 mx-auto mb-2 opacity-30 text-sera-espresso" />
            <p className="text-sm font-medium">No recorded audit events yet</p>
            <p className="text-xs mt-1">All administrative state mutations are automatically logged here.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sera-taupe/20 bg-sera-beige/20 text-[10px] uppercase tracking-wider text-sera-taupe font-semibold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Type</th>
                <th className="py-3 px-4">Actor ID</th>
                <th className="py-3 px-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sera-taupe/15 text-xs text-sera-espresso">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-sera-beige/20 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-sera-taupe">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-sera-espresso">
                    <span className="bg-sera-beige/60 px-1.5 py-0.5 rounded-sm font-mono text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sera-espresso/80">
                    {log.target_type || '—'}
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-sera-taupe">
                    {log.actor_id?.slice(0, 8)}...
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-sera-espresso/70 max-w-xs truncate">
                    {JSON.stringify(log.details || {})}
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
