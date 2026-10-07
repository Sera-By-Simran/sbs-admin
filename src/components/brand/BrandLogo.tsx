import React from 'react';
import Image from 'next/image';

export type BrandLogoVariant = 'header' | 'footer' | 'stacked' | 'monogram';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  className?: string;
  priority?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  className = '',
  priority = false,
}) => {
  switch (variant) {
    case 'header':
      return (
        <div className={`relative flex items-center ${className}`}>
          <Image
            src="/brand/logo-header.png"
            alt="SÉRA BY SIMRAN"
            width={240}
            height={80}
            priority={priority}
            className="h-10 w-auto object-contain"
          />
        </div>
      );

    case 'footer':
      return (
        <div className={`flex items-center space-x-3 ${className}`}>
          <div className="w-8 h-8 relative flex-shrink-0">
            <Image
              src="/brand/monogram-white.svg"
              alt="SÉRA"
              fill
              priority={priority}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-2xl tracking-[0.22em] text-sera-ivory font-light">
              SÉRA
            </span>
            <span className="text-[8.5px] uppercase tracking-[0.35em] text-sera-champagne font-medium mt-1">
              BY SIMRAN
            </span>
          </div>
        </div>
      );

    case 'stacked':
      return (
        <div className={`flex flex-col items-center text-center space-y-1.5 ${className}`}>
          <div className="w-10 h-10 relative">
            <Image
              src="/brand/monogram.png"
              alt="SÉRA"
              fill
              priority={priority}
              className="object-contain"
            />
          </div>
          <span className="font-serif text-2xl tracking-[0.25em] text-sera-espresso font-normal">
            SÉRA
          </span>
          <span className="text-[9px] uppercase tracking-[0.35em] text-sera-taupe font-semibold">
            BY SIMRAN
          </span>
        </div>
      );

    case 'monogram':
      return (
        <div className={`w-8 h-8 relative flex-shrink-0 ${className}`}>
          <Image
            src="/brand/monogram.png"
            alt="SÉRA Monogram"
            fill
            priority={priority}
            className="object-contain"
          />
        </div>
      );

    default:
      return null;
  }
};
