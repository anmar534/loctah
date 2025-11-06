import DataTable from '@/components/admin/DataTable';

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-slate-600">Monitor user activity and permissions.</p>
      </header>
      <DataTable title="All users" />
    </div>
  );
}
