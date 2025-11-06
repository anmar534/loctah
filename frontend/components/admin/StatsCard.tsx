import { formatNumber } from '@/lib/utils';

type StatsCardProps = {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
};

const trendIcon: Record<NonNullable<StatsCardProps['trend']>, string> = {
  up: '▲',
  down: '▼',
  neutral: '■',
};

const trendLabel: Record<NonNullable<StatsCardProps['trend']>, string> = {
  up: 'increasing',
  down: 'decreasing',
  neutral: 'no change',
};

export default function StatsCard({ title, value, trend = 'neutral' }: StatsCardProps) {
  const displayValue = typeof value === 'number' ? formatNumber(value) : value;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="text-sm font-medium text-slate-500">{title}</span>
      <span className="text-2xl font-semibold text-slate-900">{displayValue}</span>
      <span className="text-xs text-slate-500">
        Trend <span aria-hidden="true">{trendIcon[trend]}</span>
        <span className="sr-only">{trendLabel[trend]}</span>
      </span>
    </div>
  );
}
