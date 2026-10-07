'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '../brand/BrandLogo';
import {
  LayoutDashboard,
  Gem,
  FolderTree,
  Truck,
  Image as ImageIcon,
  MessageSquare,
  ShoppingBag,
  Sliders,
  History,
  ExternalLink,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Gem },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Suppliers', href: '/admin/suppliers', icon: Truck },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { label: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Settings', href: '/admin/settings', icon: Sliders },
  { label: 'Audit Logs', href: '/admin/audit', icon: History },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-sera-ivory border-r border-sera-taupe/30 flex flex-col justify-between h-screen sticky top-0 font-sans">
      <div>
        <div className="p-6 border-b border-sera-taupe/20">
          <BrandLogo variant="header" priority />
          <span className="text-[10px] uppercase tracking-widest text-sera-taupe font-semibold block mt-2">
            Commerce Operations
          </span>
        </div>

        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-sm text-xs uppercase tracking-wider font-medium transition-colors ${
                  isActive
                    ? 'bg-sera-espresso text-sera-ivory font-semibold'
                    : 'text-sera-espresso/80 hover:bg-sera-beige/60 hover:text-sera-espresso'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sera-champagne' : 'text-sera-taupe'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-sera-taupe/20 bg-sera-beige/30">
        <a
          href={process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between text-xs text-sera-espresso/80 hover:text-sera-espresso px-2 py-1.5 transition-colors"
        >
          <span className="font-medium">View Boutique</span>
          <ExternalLink className="w-3.5 h-3.5 text-sera-taupe" />
        </a>
      </div>
    </aside>
  );
};
