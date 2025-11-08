/**
 * OfferList Component
 * 
 * Pure UI component for displaying offers list with table.
 * Uses useTableActions hook for actions.
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { useTableActions } from '@/lib/hooks/useTableActions';
import { usePagination } from '@/lib/hooks/usePagination';
import { formatPrice } from '@/lib/utils/formatters/price.formatter';
import { formatDate } from '@/lib/utils/formatters/date.formatter';
import { calculateDiscount } from '@/lib/services/discount.service';
import type { Offer } from '@/types';

import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ExternalLink, Tag } from 'lucide-react';

interface OfferListProps {
  offers: Offer[];
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
}

/**
 * Offer list component with table
 * 
 * @example
 * <OfferList
 *   offers={offers}
 *   onDelete={handleDelete}
 *   onRefresh={refetch}
 * />
 */
export default function OfferList({
  offers,
  onDelete,
  onRefresh,
}: OfferListProps) {
  const t = useTranslations('admin.offers');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const locale = 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Use table actions hook
  const {
    isLoading,
    handleDelete,
    confirmState,
    closeDialog,
  } = useTableActions({
    onDelete,
    onSuccess: () => onRefresh(),
  });

  // Get offer status
  const getOfferStatus = (offer: Offer): 'active' | 'inactive' | 'expired' => {
    if (!offer.isActive) return 'inactive';
    const now = new Date();
    const endDate = new Date(offer.endDate);
    if (endDate < now) return 'expired';
    return 'active';
  };

  // Filter offers
  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      !searchQuery ||
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.product?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.store?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const offerStatus = getOfferStatus(offer);
    const matchesStatus = !statusFilter || offerStatus === statusFilter;

    return matchesSearch && matchesStatus;
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
    totalItems: filteredOffers.length,
    itemsPerPage: 10,
  });

  const paginatedOffers = filteredOffers.slice(startIndex, endIndex);

  // Table columns
  const columns = [
    {
      key: 'image',
      label: t('table.image'),
      render: (offer: Offer) => (
        <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-100">
          {offer.product?.images && offer.product.images.length > 0 ? (
            <Image
              src={offer.product.images[0]}
              alt={offer.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Tag className="h-6 w-6" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'title',
      label: t('table.title'),
      render: (offer: Offer) => (
        <div>
          <div className="font-medium">{offer.title}</div>
          {offer.product && (
            <div className="text-sm text-gray-500">
              {offer.product.title}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'store',
      label: t('table.store'),
      render: (offer: Offer) => offer.store?.name || '-',
    },
    {
      key: 'price',
      label: t('table.price'),
      render: (offer: Offer) => (
        <div>
          {offer.originalPrice && (
            <div className="text-sm text-gray-500 line-through">
              {formatPrice(offer.originalPrice, 'SAR', locale)}
            </div>
          )}
          {offer.discountedPrice && (
            <div className="font-medium text-green-600">
              {formatPrice(offer.discountedPrice, 'SAR', locale)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'discount',
      label: t('table.discount'),
      render: (offer: Offer) => {
        if (offer.discountPercentage) {
          return (
            <div className="font-medium text-red-600">
              {offer.discountPercentage}%
            </div>
          );
        }
        if (offer.originalPrice && offer.discountedPrice) {
          const discount = calculateDiscount(offer.originalPrice, offer.discountedPrice);
          return discount ? (
            <div className="font-medium text-red-600">
              {discount}%
            </div>
          ) : '-';
        }
        return '-';
      },
    },
    {
      key: 'dates',
      label: t('table.dates'),
      render: (offer: Offer) => (
        <div className="text-sm">
          <div>{formatDate(offer.startDate, 'dd/MM/yyyy', locale)}</div>
          <div className="text-gray-500">
            {formatDate(offer.endDate, 'dd/MM/yyyy', locale)}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: t('table.status'),
      render: (offer: Offer) => {
        const status = getOfferStatus(offer);
        const labels = {
          active: tCommon('active'),
          inactive: tCommon('inactive'),
          expired: t('status.expired'),
        };
        return <StatusBadge status={status} label={labels[status]} />;
      },
    },
    {
      key: 'actions',
      label: t('table.actions'),
      render: (offer: Offer) => (
        <div className="flex gap-2">
          {offer.link && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(offer.link, '_blank')}
              title={t('actions.visitLink')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/admin/offers/${offer.id}/edit`)}
            title={tCommon('edit')}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(offer.id, offer.title)}
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
      key: 'status',
      label: t('filters.status'),
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: '', label: tCommon('all') },
        { value: 'active', label: tCommon('active') },
        { value: 'inactive', label: tCommon('inactive') },
        { value: 'expired', label: t('status.expired') },
      ],
    },
  ];

  return (
    <>
      <DataTable
        data={paginatedOffers}
        columns={columns}
        searchKey="title"
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

