/**
 * Offers List Page
 *
 * Simple routing wrapper for offers list.
 * All logic is handled by OfferList component.
 */

'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

import { listOffers, deleteOffer } from '@/lib/api/admin';
import { showToast } from '@/components/ui/toast';
import type { Offer } from '@/types';

import { OfferList } from '@/components/admin/offers';
import PageHeader from '@/components/admin/PageHeader';
import LoadingTable from '@/components/admin/LoadingTable';

export default function OffersPage() {
  const t = useTranslations('admin.offers');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch offers
  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const response = await listOffers({ page: 1, limit: 100 });
      if (response) {
        setOffers(response.offers);
      }
    } catch (error) {
      console.error('Failed to fetch offers:', error);
      showToast({
        title: tCommon('error'),
        description: t('fetchError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteOffer(id);
      showToast({
        title: tCommon('success'),
        description: t('deleteSuccess'),
      });
    } catch (error) {
      console.error('Failed to delete offer:', error);
      showToast({
        title: tCommon('error'),
        description: t('deleteError'),
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader
          title={t('title')}
          description={t('description')}
          actionLabel={t('addNew')}
          actionHref={`/${locale}/admin/offers/create`}
        />
        <LoadingTable />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title={t('title')}
        description={t('description')}
        actionLabel={t('addNew')}
        actionHref={`/${locale}/admin/offers/create`}
      />

      <OfferList
        offers={offers}
        onDelete={handleDelete}
        onRefresh={fetchOffers}
      />
    </div>
  );
}
