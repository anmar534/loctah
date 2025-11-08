/**
 * StoreList Component
 * 
 * Pure UI component for displaying stores list with table.
 * Uses useTableActions hook for actions.
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { useTableActions } from '@/lib/hooks/useTableActions';
import { usePagination } from '@/lib/hooks/usePagination';
import { formatDate } from '@/lib/utils/formatters/date.formatter';
import { getCityLabel } from '@/lib/constants/cities';
import type { Store } from '@/types';

import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Power } from 'lucide-react';

interface StoreListProps {
  stores: Store[];
  onDelete: (id: string) => Promise<void>;
  onToggleStatus: (id: string) => Promise<void>;
  onRefresh: () => void;
}

/**
 * Store list component with table
 * 
 * @example
 * <StoreList
 *   stores={stores}
 *   onDelete={handleDelete}
 *   onToggleStatus={handleToggle}
 *   onRefresh={refetch}
 * />
 */
export default function StoreList({
  stores,
  onDelete,
  onToggleStatus,
  onRefresh,
}: StoreListProps) {
  const t = useTranslations('admin.stores');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const locale = 'ar'; // Get from context if needed

  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Use table actions hook
  const {
    isLoading,
    handleDelete,
    handleToggleStatus,
    confirmState,
    closeDialog,
  } = useTableActions({
    onDelete,
    onToggleStatus,
    onSuccess: () => onRefresh(),
  });

  // Filter stores
  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      !searchQuery ||
      store.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !cityFilter || store.city === cityFilter;
    const matchesStatus =
      !statusFilter ||
      (statusFilter === 'active' && store.isActive) ||
      (statusFilter === 'inactive' && !store.isActive);

    return matchesSearch && matchesCity && matchesStatus;
  });

  // Pagination
  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
  } = usePagination({
    totalItems: filteredStores.length,
    itemsPerPage: 10,
  });

  const paginatedStores = filteredStores.slice(startIndex, endIndex);

  // Table columns
  const columns = [
    {
      key: 'logo',
      label: t('table.logo'),
      render: (store: Store) => (
        <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-100">
          {store.logo ? (
            <Image
              src={store.logo}
              alt={store.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              {store.name.charAt(0)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: t('table.name'),
      render: (store: Store) => (
        <div>
          <div className="font-medium">{store.name}</div>
          <div className="text-sm text-gray-500" dir="ltr">
            {store.slug}
          </div>
        </div>
      ),
    },
    {
      key: 'city',
      label: t('table.city'),
      render: (store: Store) => getCityLabel(store.city, locale),
    },
    {
      key: 'contact',
      label: t('table.contact'),
      render: (store: Store) => (
        <div className="text-sm">
          {store.email && <div dir="ltr">{store.email}</div>}
          {store.phone && (
            <div className="text-gray-500" dir="ltr">
              {store.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: t('table.status'),
      render: (store: Store) => (
        <StatusBadge
          status={store.isActive ? 'active' : 'inactive'}
          label={store.isActive ? tCommon('active') : tCommon('inactive')}
        />
      ),
    },
    {
      key: 'createdAt',
      label: t('table.createdAt'),
      render: (store: Store) => formatDate(store.createdAt, 'dd/MM/yyyy', locale),
    },
    {
      key: 'actions',
      label: t('table.actions'),
      render: (store: Store) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/admin/stores/${store.id}`)}
            title={tCommon('view')}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/admin/stores/${store.id}/edit`)}
            title={tCommon('edit')}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleToggleStatus(store.id, store.isActive)}
            disabled={isLoading}
            title={store.isActive ? tCommon('deactivate') : tCommon('activate')}
          >
            <Power className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(store.id, store.name)}
            disabled={isLoading}
            title={tCommon('delete')}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  // Filters
  const filters = [
    {
      key: 'city',
      label: t('filters.city'),
      value: cityFilter,
      onChange: setCityFilter,
      options: [
        { value: '', label: tCommon('all') },
        { value: 'riyadh', label: 'الرياض' },
        { value: 'jeddah', label: 'جدة' },
        { value: 'dammam', label: 'الدمام' },
        // Add more cities as needed
      ],
    },
    {
      key: 'status',
      label: t('filters.status'),
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: '', label: tCommon('all') },
        { value: 'active', label: tCommon('active') },
        { value: 'inactive', label: tCommon('inactive') },
      ],
    },
  ];

  return (
    <>
      <DataTable
        data={paginatedStores}
        columns={columns}
        searchKey="name"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: goToPage,
          onNext: nextPage,
          onPrevious: previousPage,
        }}
      />

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
        onConfirm={confirmState.onConfirm}
        onCancel={confirmState.onCancel}
        isLoading={isLoading}
      />
    </>
  );
}

