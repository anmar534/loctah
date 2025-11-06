'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

const DEFAULT_LOCALE = 'en';

export default function LocaleNotFound() {
  const t = useTranslations('notFound');
  const params = useParams();
  const locale = (params.locale as string) || DEFAULT_LOCALE;

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
      <p className="text-base text-slate-600">{t('description')}</p>
      <Link className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white" href={`/${locale}`}>
        {t('goHome')}
      </Link>
    </div>
  );
}
