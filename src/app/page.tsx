'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { SetupIncomplete } from '@/components/common/SetupIncomplete';
import { getAdminBrowserSupabase } from '@/lib/auth/supabase';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const missingKeys: string[] = [];
  if (!supabaseUrl) missingKeys.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingKeys.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (missingKeys.length > 0) {
    return <SetupIncomplete missingKeys={missingKeys} />;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = getAdminBrowserSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data?.session) {
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify your staff credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-sera-ivory text-sera-espresso flex flex-col justify-between p-6 md:p-12 font-sans">
      <header className="border-b border-sera-taupe/30 pb-4 flex justify-between items-center">
        <BrandLogo variant="header" priority />
        <div className="text-xs uppercase tracking-widest text-sera-taupe font-semibold">
          Operations Gateway
        </div>
      </header>

      <main className="max-w-md mx-auto my-12 w-full">
        <div className="bg-white/80 border border-sera-taupe/30 rounded-sm p-8 shadow-sm">
          <div className="text-center mb-6">
            <span className="text-[10px] uppercase tracking-[0.2em] text-sera-taupe font-semibold">
              Restricted Area
            </span>
            <h1 className="font-serif text-2xl text-sera-espresso font-normal mt-1">
              Staff Authentication
            </h1>
            <p className="text-xs text-sera-espresso/70 mt-1">
              Sign in with your verified staff credentials and TOTP MFA
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm flex items-start space-x-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@serabysimran.in"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-sera-ivory/60 border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso font-sans"
                />
                <Mail className="w-4 h-4 text-sera-taupe absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-sera-ivory/60 border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso font-sans"
                />
                <Lock className="w-4 h-4 text-sera-taupe absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sera-espresso text-sera-ivory py-2.5 rounded-sm text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity mt-2 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-sera-taupe/20 text-center">
            <p className="text-[11px] text-sera-taupe">
              Authorized access only. All authentication attempts are monitored.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-sera-taupe/30 pt-4 text-center text-xs text-sera-taupe">
        SÉRA Commerce Admin • Secure Staff Environment • Version 1.0.0
      </footer>
    </div>
  );
}
