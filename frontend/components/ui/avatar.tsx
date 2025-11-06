import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  src?: string;
  name?: string;
};

export function Avatar({ className, src, name, ...props }: AvatarProps) {
  const initials = name?.split(' ').filter(Boolean).map((part) => part.charAt(0).toUpperCase()).join('').slice(0, 2) || 'U';

  return (
    <div
      className={cn('flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700', className)}
      {...props}
    >
      {src ? <img alt={name ?? 'Avatar'} className="h-full w-full rounded-full object-cover" src={src} /> : initials}
    </div>
  );
}
