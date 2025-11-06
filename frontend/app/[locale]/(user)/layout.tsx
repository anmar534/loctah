import type { ReactNode } from 'react';
import UserNav from '@/components/layout/UserNav';
import UserSidebar from '@/components/layout/UserSidebar';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <UserSidebar />
      <div className="flex flex-1 flex-col">
        <UserNav />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
