'use client';

import CategoryForm from '@/components/forms/CategoryForm';
import { useTranslations } from 'next-intl';

export default function AdminCreateCategoryPage() {
  const t = useTranslations('admin.categories.create');

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-slate-600">{t('subtitle')}</p>
      </header>
      <CategoryForm />
    </div>
  );
}
