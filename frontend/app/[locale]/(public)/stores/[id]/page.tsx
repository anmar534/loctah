import StoreInfo from '@/components/stores/StoreInfo';
import StoreMarker from '@/components/stores/StoreMarker';
import { getStore } from '@/lib/api/stores';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function StoreDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const t = useTranslations('stores');

  let store;
  try {
    store = await getStore(id);
  } catch (error) {
    notFound();
  }

  const isVerified = store?.status === 'verified';

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-10">
      <header className="flex items-center justify-between gap-4">
        <StoreMarker storeId={id} />
        {isVerified && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
            {t('verified')}
          </span>
        )}
      </header>
      <StoreInfo storeId={id} />
    </section>
  );
}
