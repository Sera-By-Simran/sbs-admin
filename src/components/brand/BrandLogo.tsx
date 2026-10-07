import React from 'react';
import Image from 'next/image';

export type BrandLogoVariant = 'header' | 'monogram';

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
            alt="SÉRA BY SIMRAN Admin"
            width={200}
            height={66}
            priority={priority}
            className="h-8 w-auto object-contain"
          />
        </div>
      );

    case 'monogram':
      return (
        <div className={`relative flex items-center ${className}`}>
          <Image
            src="/brand/monogram.png"
            alt="SÉRA Monogram"
            width={40}
            height={40}
            priority={priority}
            className="h-7 w-7 object-contain"
          />
        </div>
      );

    default:
      return null;
  }
};
