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

export default async function AdminStoresPage() {
  let stores: Store[] = [];
  
  try {
    const response = await listStores();
    stores = response.data;
  } catch (error) {
    console.error('Failed to fetch stores:', error);
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Stores</h1>
        <p className="text-sm text-slate-600">Review partner stores and verification status.</p>
      </header>
      <DataTable title="All stores" data={stores} columns={columns} />
    </div>
  );
}
