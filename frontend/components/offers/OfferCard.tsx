import Link from 'next/link';
import OfferBadge from './OfferBadge';

export type OfferCardProps = {
  id: string;
  title: string;
  description: string;
  discount: number;
  href?: string;
};

export default function OfferCard({ id, title, description, discount, href = `/offers/${id}` }: OfferCardProps) {
  return (
    <Link className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm" href={href}>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <OfferBadge label={`-${discount}%`} />
    </Link>
  );
}
