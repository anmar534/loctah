'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-semibold">{t('title')}</h2>
      <p className="text-slate-600">{t('message')}</p>
      <button
        type="button"
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        onClick={() => reset()}
      >
        {t('retry')}
      </button>
    </div>
  );
}
