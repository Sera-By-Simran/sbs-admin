import type { Metadata } from 'next';
import { playfair, montserrat } from './fonts';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'SÉRA Commerce Admin | Boutique Management',
  description: 'Internal operations, catalogue, and enquiry management for SÉRA BY SIMRAN.',
  icons: {
    icon: '/brand/monogram.png',
  },
};

import { AuthProvider } from '@/lib/auth/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-sera-ivory text-sera-espresso font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
