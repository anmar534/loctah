import { cn } from '@/lib/utils';

export function LoadingCard({ className }: { className?: string }) {
  return <div className={cn('h-40 w-full animate-pulse rounded-lg bg-slate-200', className)} />;
}

export function LoadingGrid({ items = 6 }: { items?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: items }).map((_, index) => (
        <LoadingCard key={index} />
      ))}
    </div>
  );
}
