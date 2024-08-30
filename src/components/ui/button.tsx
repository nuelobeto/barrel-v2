/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';

import {cn} from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium leading-5 ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-purple-400 text-white disabled:bg-purple-100 disabled:text-white disabled:opacity-100 hover:bg-purple-500 active:bg-purple-600',
        secondary:
          'bg-neutral-25 border border-neutral-50 text-neutral-600 disabled:bg-neutral-25 disabled:text-neutral-200 hover:bg-neutral-50 active:bg-neutral-100 disabled:opacity-100',
        ghost: 'bg-transparent text-neutral-600 disabled:text-neutral-100',
        'ghost-primary':
          'bg-transparent text-purple-400 disabled:text-purple-100 hover:text-purple-500 active:text-purple-600',
        error:
          'bg-red-400 text-white disabled:bg-red-25 disabled:text-red-100 hover:bg-red-500 active:bg-red-600',
        input:
          'flex h-10 w-full items-center gap-2 justify-start rounded-xl border border-neutral-100 bg-white font-normal text-sm text-neutral-600 px-2.5 ring-offset-white placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-25 focus:border-purple-400 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({variant, size, className}))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export {Button, buttonVariants};
