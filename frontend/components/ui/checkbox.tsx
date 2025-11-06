'use client';

import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'h-4 w-4 rounded border border-slate-300 text-slate-900 accent-slate-900 focus:ring-slate-400 checked:bg-slate-900 checked:border-slate-900',
      className
    )}
    type="checkbox"
    {...props}
  />
));

Checkbox.displayName = 'Checkbox';

export { Checkbox };
