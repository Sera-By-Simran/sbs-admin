'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Loader2 } from 'lucide-react';

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, staff, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-sera-ivory flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 text-sera-espresso animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-sera-taupe font-semibold">
          Authenticating Staff Session...
        </p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via AuthContext
  }

  return (
    <div className="min-h-screen bg-sera-ivory flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader userEmail={staff?.email || user?.email} />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
