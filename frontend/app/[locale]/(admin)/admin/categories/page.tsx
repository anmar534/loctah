import CategoryForm from '@/components/forms/CategoryForm';
import DataTable from '@/components/admin/DataTable';

export default function AdminCategoriesPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="text-sm text-slate-600">Organize the catalog into meaningful groups.</p>
        </header>
        <DataTable title="All categories" />
      </div>
      <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Create category</h2>
        <CategoryForm />
      </aside>
    </div>
  );
}
