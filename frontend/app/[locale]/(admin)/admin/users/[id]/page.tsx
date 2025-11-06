import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { getUser } from '@/lib/api/admin';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserDetailsPage({ params }: PageProps) {
  const { id } = await params;

  let user;
  try {
    user = await getUser(id);
  } catch (error) {
    // Only call notFound() for actual 404 errors
    if (error instanceof Error && error.message.includes('404')) {
      notFound();
    }
    // Log and rethrow other errors for proper error handling
    console.error('Failed to fetch user:', error);
    throw error;
  }

  // Ensure user exists (getUser may return undefined)
  if (!user) {
    notFound();
  }

  const status = user.status ?? 'active';

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">User #{id}</h1>
          <p className="text-sm text-slate-600">Account activity overview.</p>
        </div>
        <StatusBadge status={status} />
      </header>
      <DataTable title="Recent actions" />
    </div>
  );
}
