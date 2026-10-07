import React from 'react';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { SetupIncomplete } from '@/components/common/SetupIncomplete';

export default function AdminPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const missingKeys: string[] = [];
  if (!supabaseUrl) missingKeys.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingKeys.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (missingKeys.length > 0) {
    return <SetupIncomplete missingKeys={missingKeys} />;
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

          <form className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="staff@serabysimran.in"
                className="w-full px-3 py-2 text-sm bg-sera-ivory/60 border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso font-sans"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-sera-espresso/80 font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-sm bg-sera-ivory/60 border border-sera-taupe/40 rounded-sm focus:outline-none focus:border-sera-espresso font-sans"
              />
            </div>

            <button
              type="button"
              className="w-full bg-sera-espresso text-sera-ivory py-2.5 rounded-sm text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity mt-2"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-sera-taupe/20 text-center">
            <p className="text-[11px] text-sera-taupe">
              Multi-Factor Authentication (TOTP) enforced for all administrative roles.
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
