import React from 'react';
import { BrandLogo } from '../brand/BrandLogo';

interface SetupIncompleteProps {
  missingKeys: string[];
}

export const SetupIncomplete: React.FC<SetupIncompleteProps> = ({ missingKeys }) => {
  return (
    <div className="min-h-screen bg-sera-ivory text-sera-espresso flex flex-col justify-between p-6 md:p-12 font-sans selection:bg-sera-beige">
      <header className="border-b border-sera-taupe/30 pb-6 flex justify-between items-center">
        <BrandLogo variant="header" />
        <span className="text-xs uppercase tracking-widest text-sera-taupe font-medium">
          SÉRA Commerce Admin Shell
        </span>
      </header>

      <main className="max-w-2xl mx-auto my-12 text-center">
        <div className="inline-block px-3 py-1 bg-sera-beige rounded-sm text-xs font-semibold tracking-wider text-sera-espresso uppercase mb-6">
          Admin Setup Notice
        </div>

        <h1 className="font-serif text-3xl md:text-5xl font-normal leading-tight text-sera-espresso mb-4">
          Admin Environment Pending
        </h1>

        <p className="text-sera-espresso/80 text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto">
          The <span className="font-semibold">SÉRA Commerce Admin</span> application requires the following environment variables to authenticate staff:
        </p>

        <div className="bg-white/60 border border-sera-taupe/30 rounded-sm p-6 text-left mb-8 shadow-sm">
          <h2 className="text-xs uppercase tracking-widest text-sera-taupe font-semibold mb-3">
            Missing Configuration in admin/.env.local:
          </h2>
          <ul className="space-y-2">
            {missingKeys.map((key) => (
              <li key={key} className="flex items-center text-sm font-mono text-sera-espresso bg-sera-ivory/80 px-3 py-1.5 rounded-sm border border-sera-taupe/20">
                <span className="w-2 h-2 rounded-full bg-sera-error mr-2.5"></span>
                {key}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-sera-beige/70 p-5 rounded-sm text-left border border-sera-taupe/20">
          <h3 className="font-serif text-base font-medium text-sera-espresso mb-1">
            Setup Guide:
          </h3>
          <p className="text-xs text-sera-espresso/80 leading-relaxed">
            Follow <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-sera-espresso">Website/docs/ENV-SETUP.md</code> to paste your Supabase keys into <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-sera-espresso">admin/.env.local</code>. Note: Admin never receives a service-role key.
          </p>
        </div>
      </main>

      <footer className="border-t border-sera-taupe/30 pt-6 text-center text-xs text-sera-taupe">
        SÉRA BY SIMRAN • Commerce Admin CMS • Phase 0 Guard
      </footer>
    </div>
  );
};
