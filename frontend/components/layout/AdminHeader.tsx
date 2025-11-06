import Link from 'next/link';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

type AdminHeaderProps = {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
};

export default function AdminHeader({ onMenuClick, isSidebarOpen }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 md:hidden"
          aria-label="Open menu"
          aria-expanded={isSidebarOpen}
          type="button"
        >
          ☰
        </button>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Admin dashboard</h1>
          <p className="text-xs text-slate-500">Monitor activity and manage the platform.</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <Link className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600" href="/">
          View site
        </Link>
      </div>
    </header>
  );
}
