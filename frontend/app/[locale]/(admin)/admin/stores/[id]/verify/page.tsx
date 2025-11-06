import { notFound } from 'next/navigation';
import VerifyStoreClient from './VerifyStoreClient';
import { getStore } from '@/lib/api/stores';
import { ApiError } from '@/lib/api/client';

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function AdminVerifyStorePage({ params }: PageProps) {
  const { locale, id } = await params;

  let store;
  let error: string | null = null;

  try {
    store = await getStore(id);
  } catch (err) {
    // Handle 404 errors by calling Next.js notFound()
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    
    // Handle other errors by setting error message
    error = err instanceof Error ? err.message : 'Failed to load store data';
  }

  if (!store && !error) {
    notFound();
  }

  return <VerifyStoreClient locale={locale} id={id} store={store} initialError={error} />;
}
