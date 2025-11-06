'use client';

import OfferForm from '@/components/forms/OfferForm';
import { useTranslations } from 'next-intl';
import { use } from 'react';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function VendorEditOfferPage({ params }: PageProps) {
  const { id } = use(params);
  const t = useTranslations('vendorOffers');

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t('editTitle')}</h1>
        <p className="text-sm text-slate-600">{t('editSubtitle', { id })}</p>
      </header>
      <OfferForm variant="edit" />
    </div>
  );
}
