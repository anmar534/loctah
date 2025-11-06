export function Separator({ orientation = 'horizontal' }: { orientation?: 'horizontal' | 'vertical' }) {
  if (orientation === 'vertical') {
    return <span className="mx-2 block h-6 w-px bg-slate-200" role="presentation" />;
  }

  return <span className="my-4 block h-px w-full bg-slate-200" role="presentation" />;
}
