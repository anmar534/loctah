'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DeleteDialog from '@/components/admin/DeleteDialog';
import StatusBadge from '@/components/admin/StatusBadge';
import StoreInfo from '@/components/stores/StoreInfo';
import { Button } from '@/components/ui/button';
import { rejectStoreVerification, verifyStore } from '@/lib/api/stores';
import { useStore } from '@/lib/hooks/useStore';

export default function AdminVerifyStorePage({ params }: { params: { locale: string; id: string } }) {
  const router = useRouter();
  const { data: store, loading: storeLoading, error: storeError } = useStore(params.id);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const status = store?.status ?? 'pending';
  const disableActions = approving || rejecting || storeLoading;
  const documents = store?.documents ?? [];
  const statusLabel = status === 'verified' ? 'Store verified' : status === 'suspended' ? 'Store suspended' : 'Awaiting review';

  const handleApprove = async () => {
    setActionError(null);
    setApproving(true);

    try {
      await verifyStore(params.id);
      router.push(`/${params.locale}/admin/stores/${params.id}`);
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
      await rejectStoreVerification(params.id);
      router.push(`/${params.locale}/admin/stores`);
      router.refresh();
    } catch (err) {
      const errorInstance = err instanceof Error ? err : new Error('Failed to reject store verification.');
      setActionError(errorInstance.message || 'Failed to reject store verification.');
      throw errorInstance;
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Verify store</h1>
          <p className="text-sm text-slate-600">Approve or reject documentation for store #{params.id}.</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          <span className="text-sm text-slate-600">{storeLoading ? 'Loading status…' : statusLabel}</span>
        </div>
      </header>

      {storeError ? <p className="text-sm text-red-600">{storeError}</p> : null}
      {actionError ? <p className="text-sm text-red-600">{actionError}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={disableActions} onClick={handleApprove}>
          {approving ? 'Approving…' : 'Approve Store'}
        </Button>
        <DeleteDialog
          title="Reject verification"
          description="Are you sure you want to reject this store verification?"
          confirmLabel="Reject"
          submitting={rejecting}
          trigger={
            <Button variant="destructive" disabled={disableActions}>
              {rejecting ? 'Rejecting…' : 'Reject Store'}
            </Button>
          }
          onConfirm={handleReject}
        />
      </div>

      <section className="flex flex-col gap-4">
        {storeLoading ? (
          <p className="text-sm text-slate-500">Loading store details…</p>
        ) : (
          <StoreInfo storeId={params.id} store={store ?? undefined} />
        )}
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
