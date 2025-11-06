import type { ReactNode } from 'react';
import VendorHeader from '@/components/layout/VendorHeader';
import VendorSidebar from '@/components/layout/VendorSidebar';

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <VendorSidebar />
      <div className="flex flex-1 flex-col">
        <VendorHeader />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
