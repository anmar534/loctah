type Status = 'active' | 'pending' | 'disabled' | 'verified' | 'suspended' | 'rejected';

type StatusBadgeProps = {
  status: Status;
};

const styleMap: Record<Status, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  disabled: 'bg-slate-200 text-slate-600',
  verified: 'bg-emerald-100 text-emerald-700',
  suspended: 'bg-rose-100 text-rose-700',
  rejected: 'bg-rose-100 text-rose-700',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styleMap[status]}`}>
      {status}
    </span>
  );
}
