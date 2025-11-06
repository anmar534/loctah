import Link from 'next/link';

export default function VendorHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Vendor area</h1>
        <p className="text-xs text-slate-500">Manage offers and store presence.</p>
      </div>
      <Link className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white" href="/vendor/offers/create">
        New offer
      </Link>
    </header>
  );
}
