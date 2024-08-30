import * as React from 'react';

import {cn} from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[130px] w-full rounded-xl border border-neutral-100 bg-white p-2.5 text-sm placeholder:text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:border-purple-400 focus-visible:ring-purple-25 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export {Textarea};
