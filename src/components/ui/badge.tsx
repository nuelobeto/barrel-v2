import * as React from 'react';
import {cva, type VariantProps} from 'class-variance-authority';

import {cn} from '@/lib/utils';

export type BadgeVariant =
  | 'active'
  | 'on leave'
  | 'pending'
  | 'resigned'
  | 'off boarding'
  | 'dismissed'
  | 'allocated'
  | 'deprecated'
  | 'unallocated'
  | 'perfect'
  | 'compliant'
  | 'installed'
  | 'integrated'
  | 'updated to latest version'
  | 'downloading'
  | 'uninstalled';

const badgeVariants = cva(
  'h-6 inline-flex items-center gap-2 rounded-full border border-neutral-500 p-2.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:border-gray-800 dark:focus:ring-gray-300',
  {
    variants: {
      variant: {
        active: 'border-[#0B7A6833] bg-[#D0FDF680] text-torquoise-700',
        'on leave': 'border-lilac-300 bg-[#F2E7F380] text-lilac-600',
        pending: 'border-[#7D6E2E33] bg-[#FEF8DE80] text-yellow-700',
        resigned: 'border-periwinkle-300 bg-periwinkle-25 text-periwinkle-700',
        'off boarding': 'border-[#F9580033] bg-[#FEDECC80] text-orange-500',
        dismissed: 'border-[#9E193433] bg-[#FBD3DC80] text-red-600',
        allocated: 'border-[#0B7A6833] bg-[#D0FDF680] text-torquoise-700',
        deprecated: 'border-[#7D6E2E33] bg-[#FEF8DE80] text-yellow-700',
        unallocated: 'border-[#F9580033] bg-[#FEDECC80] text-orange-500',
        perfect: 'border-[#0B7A6833] bg-[#D0FDF680] text-torquoise-700',
        compliant: 'border-[#0B7A6833] bg-[#D0FDF680] text-torquoise-700',
        installed: 'border-[#0B7A6833] bg-[#D0FDF680] text-torquoise-700',
        integrated: 'border-[#0B7A6833] bg-[#D0FDF680] text-torquoise-700',
        'updated to latest version':
          'border-[#7D6E2E33] bg-[#FEF8DE80] text-yellow-700',
        downloading: 'border-[#7D6E2E33] bg-[#FEF8DE80] text-yellow-700',
        uninstalled: 'border-[#9E193433] bg-[#FBD3DC80] text-red-600',
      },
    },
    defaultVariants: {
      variant: 'active',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({children, className, variant, ...props}: BadgeProps) {
  return (
    <div
      className={cn('w-fit', badgeVariants({variant}), className)}
      {...props}
    >
      <div
        className={cn(
          'w-2 h-2 rounded-full bg-black',
          variant === 'active' && 'bg-torquoise-700',
          variant === 'on leave' && 'bg-lilac-600',
          variant === 'pending' && 'bg-yellow-700',
          variant === 'resigned' && 'bg-periwinkle-700',
          variant === 'off boarding' && 'bg-orange-500',
          variant === 'dismissed' && 'bg-red-600',
          variant === 'allocated' && 'bg-torquoise-700',
          variant === 'deprecated' && 'bg-yellow-700',
          variant === 'unallocated' && 'bg-orange-500',
          variant === 'perfect' && 'bg-torquoise-700',
          variant === 'compliant' && 'bg-torquoise-700',
          variant === 'installed' && 'bg-torquoise-700',
          variant === 'integrated' && 'bg-torquoise-700',
          variant === 'updated to latest version' && 'bg-yellow-700',
          variant === 'downloading' && 'bg-yellow-700',
          variant === 'uninstalled' && 'bg-red-600',
        )}
      ></div>
      {children}
    </div>
  );
}

export {Badge};
