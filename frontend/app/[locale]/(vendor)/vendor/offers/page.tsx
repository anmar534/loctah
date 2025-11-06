import OfferBadge from '@/components/offers/OfferBadge';
import OffersList from '@/components/offers/OffersList';
import Link from 'next/link';

export default function VendorOffersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My offers</h1>
          <p className="text-sm text-slate-600">Manage discounts and promotions across your catalog.</p>
        </div>
        <Link
          className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
          href="offers/create"
        >
          Create offer
        </Link>
      </div>
      <OfferBadge label="Active" />
      <OffersList />
    </div>
  );
}
