import type { Store } from '@/types';

type StoreInfoProps = {
  storeId: string;
  store?: Store | null;
};

export default function StoreInfo({ storeId, store }: StoreInfoProps) {
  const title = store?.name ?? `Store #${storeId}`;
  const address = store?.address ?? 'Address not provided';
  const locality = [store?.city, store?.country].filter(Boolean).join(', ');
  const phone = store?.phone ?? 'Not provided';
  const email = store?.email ?? 'Not provided';
  const website = store?.website ?? null;
  const status = store?.status ?? 'pending';

  return (
    <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600">{address}</p>
        {locality ? <p className="text-sm text-slate-500">{locality}</p> : null}
      </div>
      <dl className="grid gap-2 text-sm text-slate-600">
        <div>
          <dt className="font-medium text-slate-700">Status</dt>
          <dd className="capitalize">{status}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">Email</dt>
          <dd>{email}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">Phone</dt>
          <dd>{phone}</dd>
        </div>
        {website ? (
          <div>
            <dt className="font-medium text-slate-700">Website</dt>
            <dd>
              <a className="text-slate-900 underline" href={website} rel="noreferrer" target="_blank">
                {website}
              </a>
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
