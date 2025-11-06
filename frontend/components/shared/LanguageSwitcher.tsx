'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type LanguageSwitcherProps = {
  locales?: string[];
};

export default function LanguageSwitcher({ locales = ['en', 'ar'] }: LanguageSwitcherProps) {
  const pathname = usePathname();

  const [, , ...rest] = pathname.split('/');

  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 text-xs">
      {locales.map((locale) => (
        <Link
          key={locale}
          className={cn(
            'rounded-full px-3 py-1 font-semibold uppercase transition',
            pathname.includes(`/${locale}`)
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900'
          )}
          href={`/${[locale, ...rest].join('/')}`.replace(/\/$/, '') || `/${locale}`}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
}
