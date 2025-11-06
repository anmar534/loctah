'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

type AdminHeaderProps = {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
};

export default function AdminHeader({ onMenuClick, isSidebarOpen }: AdminHeaderProps) {
  const t = useTranslations('admin.dashboard');
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 md:hidden"
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isSidebarOpen ? 'true' : 'false'}
          type="button"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">{t('title')}</h1>
          <p className="text-xs text-slate-500">{t('subtitle')}</p>
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
