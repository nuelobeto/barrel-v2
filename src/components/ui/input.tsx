import * as React from 'react';
import {cn} from '@/lib/utils';
import {FieldError} from 'react-hook-form';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  iconPosition?: 'left' | 'right' | 'both';
  error?: FieldError | undefined;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({className, type, iconPosition, error, ...props}, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-xl border border-neutral-100 bg-white p-2.5 font-normal text-sm text-neutral-600 placeholder:text-neutral-200 placeholder:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:border-purple-400 focus-visible:ring-purple-25 disabled:cursor-not-allowed disabled:opacity-50',
          iconPosition === 'left'
            ? 'pl-9'
            : iconPosition === 'right'
            ? 'pr-9'
            : iconPosition === 'both'
            ? 'px-9'
            : 'p-2.5',
          className,
          error &&
            'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-25',
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

const InputWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('flex items-center relative', className)}>
      {children}
    </div>
  );
};

const InputIconLeft = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLElement>) => {
  return (
    <div className="absolute left-2.5 cursor-pointer" {...props}>
      {children}
    </div>
  );
};

const InputIconRight = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLElement>) => {
  return (
    <div className="absolute right-2.5 cursor-pointer" {...props}>
      {children}
    </div>
  );
};

export {Input, InputWrapper, InputIconLeft, InputIconRight};
