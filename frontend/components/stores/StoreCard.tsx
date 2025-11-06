import Link from 'next/link';

export type StoreCardProps = {
  id: string;
  name: string;
  address: string;
  status?: 'verified' | 'pending';
};

export default function StoreCard({ id, name, address, status = 'verified' }: StoreCardProps) {
  return (
    <Link
      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
      href={`/stores/${id}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}
        >
          {status}
        </span>
      </div>
      <p className="text-sm text-slate-600">{address}</p>
    </Link>
  );
}
