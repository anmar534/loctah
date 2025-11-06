import type { ReactNode } from 'react';
import Link from 'next/link';
import Logo from '@/components/shared/Logo';
import { useTranslations } from 'next-intl';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const t = useTranslations('auth');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <Logo />
        <p className="text-sm text-slate-600">
          {t('description')}
        </p>
      </div>
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        {children}
      </div>
      <Link className="mt-10 text-sm font-medium text-slate-600" href="/">
        {t('backToHome')}
      </Link>
    </div>
  );
}
