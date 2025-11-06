import type { FormHTMLAttributes, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Form({ className, ...props }: FormHTMLAttributes<HTMLFormElement>) {
  return <form className={cn('flex flex-col gap-4', className)} {...props} />;
}

export function FormField({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1', className)} {...props} />;
}

export function FormLabel({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('text-sm font-medium text-slate-700', className)} {...props} />;
}

export function FormMessage({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-xs text-red-600', className)} {...props} />;
}
