'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getAdminBrowserSupabase } from '@/lib/auth/supabase';
import { LogOut, User } from 'lucide-react';

interface AdminHeaderProps {
  userEmail?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ userEmail = 'owner@serabysimran.in' }) => {
  const router = useRouter();

  async function handleLogout() {
    const supabase = getAdminBrowserSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/');
  }

  return (
    <header className="h-16 border-b border-sera-taupe/30 bg-sera-ivory/80 backdrop-blur-sm px-8 flex items-center justify-between sticky top-0 z-30 font-sans">
      <div className="flex items-center space-x-4">
        <span className="text-xs uppercase tracking-widest text-sera-taupe font-semibold">
          SÉRA Commerce Admin
        </span>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-xs text-sera-espresso font-medium">
          <User className="w-3.5 h-3.5 text-sera-taupe" />
          <span>{userEmail}</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-1.5 text-xs text-sera-espresso/70 hover:text-sera-error transition-colors"
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit</span>
        </button>
      </div>
    </header>
  );
};
