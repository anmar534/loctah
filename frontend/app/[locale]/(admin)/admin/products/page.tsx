import DataTable from '@/components/admin/DataTable';
import Link from 'next/link';

export default function AdminProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-slate-600">Manage catalog items and availability.</p>
        </div>
        <Link
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
          href="./create"
        >
          Create product
        </Link>
      </div>
      <DataTable title="All products" />
    </div>
  );
}
