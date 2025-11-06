import StoreInfo from '@/components/stores/StoreInfo';
import StatusBadge from '@/components/admin/StatusBadge';
import { getStore } from '@/lib/api/stores';
import { notFound } from 'next/navigation';
import type { StoreStatus } from '@/types';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminStoreDetailsPage({ params }: PageProps) {
  const { id } = await params;
  
  let store;
  try {
    store = await getStore(id);
  } catch (error) {
    notFound();
  }

  const status: StoreStatus = store?.status ?? 'pending';
  
  const statusMessages: Record<StoreStatus, string> = {
    pending: 'Awaiting verification',
    verified: 'Verified store',
    suspended: 'Store suspended',
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Store #{id}</h1>
        <p className="text-sm text-slate-600">Review store documents and verification status.</p>
      </header>
      <StoreInfo storeId={id} />
      <div className="flex items-center gap-3">
        <StatusBadge status={status} />
        <span className="text-sm text-slate-600">{statusMessages[status]}</span>
      </div>
    </div>
  );
}
