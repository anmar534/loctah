'use client';

import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useTranslations } from 'next-intl';

export default function LocaleLoading() {
  const t = useTranslations('common');

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner label={t('loadingContent')} />
    </div>
  );
}
