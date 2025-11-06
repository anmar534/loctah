'use client';

import OfferForm from '@/components/forms/OfferForm';
import { useTranslations } from 'next-intl';

export default function VendorCreateOfferPage() {
  const t = useTranslations('vendorOffers');

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t('createTitle')}</h1>
        <p className="text-sm text-slate-600">{t('createSubtitle')}</p>
      </header>
      <OfferForm />
    </div>
  );
}
