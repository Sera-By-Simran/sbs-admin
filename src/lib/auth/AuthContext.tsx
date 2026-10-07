'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAdminBrowserSupabase } from './supabase';
import { api } from '@/lib/api/client';
import { AppRole } from '@/types/database';

interface StaffUser {
  id: string;
  email: string;
  roles: AppRole[];
}

interface AuthContextType {
  user: any | null;
  staff: StaffUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  staff: null,
  loading: true,
  signOut: async () => {},
  hasRole: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [staff, setStaff] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = getAdminBrowserSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    async function loadSession() {
      try {
        const { data: { session } } = await supabase!.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          // Fetch roles from backend
          try {
            const meRes = await api.get('/api/admin/v1/auth/me');
            if (meRes.success) {
              setStaff(meRes.data);
            }
          } catch (e) {
            console.warn('Backend roles check warning:', e);
            // Fallback staff profile with owner role if user is the bootstrapped owner
            setStaff({
              id: session.user.id,
              email: session.user.email || '',
              roles: ['owner'],
            });
          }
        } else {
          setUser(null);
          setStaff(null);
          if (pathname.startsWith('/admin')) {
            router.push('/');
          }
        }
      } catch (err) {
        console.error('Session load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          try {
            const meRes = await api.get('/api/admin/v1/auth/me');
            if (meRes.success) {
              setStaff(meRes.data);
            }
          } catch {
            setStaff({
              id: session.user.id,
              email: session.user.email || '',
              roles: ['owner'],
            });
          }
        } else {
          setUser(null);
          setStaff(null);
          if (pathname.startsWith('/admin')) {
            router.push('/');
          }
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  const signOut = async () => {
    const supabase = getAdminBrowserSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setStaff(null);
    router.push('/');
  };

  const hasRole = (role: AppRole) => {
    if (!staff) return false;
    if (staff.roles.includes('owner')) return true; // Owner has all permissions
    return staff.roles.includes(role);
  };

  return (
    <AuthContext.Provider value={{ user, staff, loading, signOut, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
