import OffersList from '@/components/offers/OffersList';
import { useTranslations } from 'next-intl';

export default function AdminOffersPage() {
  const t = useTranslations('admin.offers');

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-slate-600">{t('description')}</p>
      </header>
      <OffersList />
    </div>
  );
}
