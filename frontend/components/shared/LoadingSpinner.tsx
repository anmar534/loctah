type LoadingSpinnerProps = {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeMap: Record<Required<LoadingSpinnerProps>['size'], string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-4',
};

export function LoadingSpinner({ label, size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span
        aria-hidden
        className={`inline-block animate-spin rounded-full border-slate-300 border-t-slate-900 ${sizeMap[size]}`}
      />
      {label ? <span className="text-sm text-slate-600">{label}</span> : null}
    </div>
  );
}
