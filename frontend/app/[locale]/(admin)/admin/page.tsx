import DataTable from '@/components/admin/DataTable';
import StatsCard from '@/components/admin/StatsCard';

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Revenue" value="$48K" trend="up" />
        <StatsCard title="Orders" value="1.2K" trend="up" />
        <StatsCard title="Customers" value="8.6K" trend="neutral" />
        <StatsCard title="Refunds" value="12" trend="down" />
      </div>
      <DataTable title="Recent activity" />
    </div>
  );
}
