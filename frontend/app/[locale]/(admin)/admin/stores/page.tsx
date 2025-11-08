/**
 * Stores List Page
 *
 * Simple routing wrapper for stores list.
 * All logic is handled by StoreList component.
 */

'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

import { listStores, deleteStore, toggleStoreStatus } from '@/lib/api/admin';
import { showToast } from '@/components/ui/toast';
import type { Store } from '@/types';

import { StoreList } from '@/components/admin/stores';
import PageHeader from '@/components/admin/PageHeader';
import LoadingTable from '@/components/admin/LoadingTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function StoresPage() {
  const t = useTranslations('admin.stores');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch stores
  const fetchStores = async () => {
    try {
      setIsLoading(true);
      const response = await listStores({ page: 1, limit: 100 });
      if (response) {
        setStores(response.stores);
      }
    } catch (error) {
      console.error('Failed to fetch stores:', error);
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
      await deleteStore(id);
      showToast({
        title: tCommon('success'),
        description: t('deleteSuccess'),
      });
    } catch (error) {
      console.error('Failed to delete store:', error);
      showToast({
        title: tCommon('error'),
        description: t('deleteError'),
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStoreStatus(id);
      showToast({
        title: tCommon('success'),
        description: t('statusUpdateSuccess'),
      });
    } catch (error) {
      console.error('Failed to toggle store status:', error);
      showToast({
        title: tCommon('error'),
        description: t('statusUpdateError'),
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader
          title={t('title')}
          description={t('description')}
          actionLabel={t('addNew')}
          actionHref={`/${locale}/admin/stores/new`}
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
        actionHref={`/${locale}/admin/stores/new`}
      />

      <StoreList
        stores={stores}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onRefresh={fetchStores}
      />
    </div>
  );
}
