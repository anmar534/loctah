'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StatusBadge from '@/components/admin/StatusBadge';
import StoreInfo from '@/components/stores/StoreInfo';
import { Button } from '@/components/ui/button';
import { rejectStoreVerification, verifyStore } from '@/lib/api/stores';
import type { Store } from '@/types';

type VerifyStoreClientProps = {
  locale: string;
  id: string;
  store: Store | undefined;
  initialError: string | null;
};

export default function VerifyStoreClient({ locale, id, store, initialError }: VerifyStoreClientProps) {
  const router = useRouter();
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(initialError);

  const status = store?.status ?? 'pending';
  const disableActions = approving || rejecting;
  const documents = store?.documents ?? [];

  const statusLabels: Record<string, string> = {
    verified: 'Store verified',
    suspended: 'Store suspended',
    pending: 'Awaiting review',
  };
  const statusLabel = statusLabels[status] ?? 'Unknown status';

  const handleApprove = async () => {
    setActionError(null);
    setApproving(true);

    try {
      await verifyStore(id);
      router.push(`/${locale}/admin/stores/${id}`);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to approve store verification.';
      setActionError(message || 'Failed to approve store verification.');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    setActionError(null);
    setRejecting(true);

    try {
      await rejectStoreVerification(id);
      router.push(`/${locale}/admin/stores`);
      router.refresh();
    } catch (err) {
      const errorInstance = err instanceof Error ? err : new Error('Failed to reject store verification.');
      setActionError(errorInstance.message || 'Failed to reject store verification.');
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Verify store</h1>
          <p className="text-sm text-slate-600">Approve or reject documentation for store #{id}.</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          <span className="text-sm text-slate-600">{statusLabel}</span>
        </div>
      </header>

      {actionError ? <p className="text-sm text-red-600">{actionError}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={disableActions} onClick={handleApprove}>
          {approving ? 'Approving…' : 'Approve Store'}
        </Button>
        <Button variant="destructive" disabled={disableActions} onClick={handleReject}>
          {rejecting ? 'Rejecting…' : 'Reject Store'}
        </Button>
      </div>

      <section className="flex flex-col gap-4">
        <StoreInfo storeId={id} store={store} />
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Submitted documents</h2>
          <p className="text-sm text-slate-600">Review the files provided by the vendor before approval.</p>
          {documents.length ? (
            <ul className="mt-4 space-y-3">
              {documents.map((document) => (
                <li
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 px-4 py-3"
                  key={document.id}
                >
                  <span className="text-sm font-medium text-slate-700">{document.name}</span>
                  {document.url ? (
                    <a
                      className="text-sm font-medium text-slate-900 underline"
                      href={document.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500">No preview available</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate-500">No documents submitted yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
