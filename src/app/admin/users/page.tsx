'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import { ShieldCheck, UserCheck, Loader2, AlertCircle, RefreshCw, Lock, Key } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/admin/v1/users');
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load staff profiles');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleRoleChange(userId: string, newRole: string) {
    setUpdating(userId);
    try {
      const res = await api.put(`/api/admin/v1/users/${userId}`, { role: newRole });
      if (res.success) {
        await loadUsers();
      }
    } catch (err: any) {
      alert(`Role change failed: ${err?.message}`);
    } finally {
      setUpdating(null);
    }
  }

  async function handleToggleActive(userId: string, currentStatus: boolean) {
    setUpdating(userId);
    try {
      const res = await api.put(`/api/admin/v1/users/${userId}`, { is_active: !currentStatus });
      if (res.success) {
        await loadUsers();
      }
    } catch (err: any) {
      alert(`Status update failed: ${err?.message}`);
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sera-taupe/20 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-sera-taupe font-semibold">
            Security & Governance
          </span>
          <h1 className="font-serif text-2xl text-sera-espresso font-normal">
            Staff Accounts & Role-Based Access
          </h1>
        </div>

        <button
          onClick={loadUsers}
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
          <span>Loading staff directory...</span>
        </div>
      ) : (
        <div className="bg-white border border-sera-taupe/20 rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-sera-ivory border-b border-sera-taupe/20 text-sera-taupe uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Primary Role</th>
                <th className="py-3 px-4">MFA Status</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sera-taupe/15">
              {users.map((user) => {
                const currentRole = user.roles?.[0] || 'support_agent';
                return (
                  <tr key={user.id} className="hover:bg-sera-ivory/30">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-sera-espresso block">
                        {user.full_name || 'Staff Member'}
                      </span>
                      <span className="text-[10px] text-sera-taupe font-mono">
                        ID: {user.id.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-sera-espresso/90">
                      {user.email}
                    </td>
                    <td className="py-3 px-4">
                      {currentRole === 'owner' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-100 text-amber-900 rounded-sm text-[10px] uppercase font-bold tracking-wider">
                          <ShieldCheck className="w-3 h-3 text-amber-700" />
                          <span>Owner</span>
                        </span>
                      ) : (
                        <select
                          disabled={updating === user.id}
                          value={currentRole}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-sera-ivory/60 border border-sera-taupe/30 text-[11px] px-2 py-1 rounded-sm focus:outline-none"
                        >
                          <option value="admin">Admin</option>
                          <option value="content_editor">Content Editor</option>
                          <option value="sourcing_manager">Sourcing Manager</option>
                          <option value="fulfilment_manager">Fulfilment Manager</option>
                          <option value="support_agent">Support Agent</option>
                          <option value="analyst">Analyst</option>
                        </select>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {user.mfa_enrolled ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold text-[10px] uppercase">
                          <Lock className="w-3 h-3" />
                          <span>Enforced (TOTP)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-amber-700 font-semibold text-[10px] uppercase">
                          <Key className="w-3 h-3" />
                          <span>Pending Setup</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] uppercase font-semibold ${
                        user.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {currentRole !== 'owner' && (
                        <button
                          disabled={updating === user.id}
                          onClick={() => handleToggleActive(user.id, user.is_active)}
                          className="text-[11px] font-semibold text-sera-espresso hover:underline disabled:opacity-50"
                        >
                          {user.is_active ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
