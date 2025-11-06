'use client';

import { useEffect, useState } from 'react';
import DataTable, { type DataTableColumn } from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import Link from 'next/link';
import { listStores } from '@/lib/api/stores';
import type { Store } from '@/types';

const columns: DataTableColumn<Store>[] = [
  {
    key: 'name',
    label: 'Name',
    render: (store) => (
      <Link href={`/admin/stores/${store.id}`} className="font-medium text-slate-900 hover:text-slate-700">
        {store.name}
      </Link>
    ),
  },
  {
    key: 'city',
    label: 'City',
    render: (store) => <span className="text-slate-600">{store.city || '—'}</span>,
  },
  {
    key: 'status',
    label: 'Status',
    render: (store) => <StatusBadge status={store.status} />,
  },
  {
    key: 'createdAt',
    label: 'Created',
    render: (store) => (
      <span className="text-slate-500">
        {new Date(store.createdAt).toLocaleDateString()}
      </span>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (store) => (
      <Link
        href={`/admin/stores/${store.id}/verify`}
        className="text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        Verify
      </Link>
    ),
  },
];

export default function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await listStores();
      if (response) {
        setStores(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch stores:', err);
      setError('Failed to load stores. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Stores</h1>
        <p className="text-sm text-slate-600">Review partner stores and verification status.</p>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4" role="alert">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-red-900">Error loading stores</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={fetchStores}
              className="rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-900 hover:bg-red-200"
              type="button"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {loading && !error && (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Loading stores...</p>
        </div>
      )}

      {!loading && !error && <DataTable title="All stores" data={stores} columns={columns} />}
    </div>
  );
}
