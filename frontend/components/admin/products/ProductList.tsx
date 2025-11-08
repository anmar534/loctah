/**
 * ProductList Component
 * 
 * Pure UI component for displaying products list with table.
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
import type { Product, Category } from '@/types';

import DataTable from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Package } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  categories: Category[];
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
}

/**
 * Product list component with table
 * 
 * @example
 * <ProductList
 *   products={products}
 *   categories={categories}
 *   onDelete={handleDelete}
 *   onRefresh={refetch}
 * />
 */
export default function ProductList({
  products,
  categories,
  onDelete,
  onRefresh,
}: ProductListProps) {
  const t = useTranslations('admin.products');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const locale = 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');

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

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || product.categoryId === categoryFilter;
    const matchesBrand = !brandFilter || product.brand?.toLowerCase().includes(brandFilter.toLowerCase());

    return matchesSearch && matchesCategory && matchesBrand;
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
    totalItems: filteredProducts.length,
    itemsPerPage: 10,
  });

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || '-';
  };

  // Get unique brands for filter
  const uniqueBrands = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean))
  );

  // Table columns
  const columns = [
    {
      key: 'image',
      label: t('table.image'),
      render: (product: Product) => (
        <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Package className="h-6 w-6" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'title',
      label: t('table.title'),
      render: (product: Product) => (
        <div>
          <div className="font-medium">{product.title}</div>
          {product.sku && (
            <div className="text-sm text-gray-500" dir="ltr">
              SKU: {product.sku}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      label: t('table.category'),
      render: (product: Product) => getCategoryName(product.categoryId),
    },
    {
      key: 'brand',
      label: t('table.brand'),
      render: (product: Product) => product.brand || '-',
    },
    {
      key: 'price',
      label: t('table.price'),
      render: (product: Product) => (
        <div className="font-medium">
          {formatPrice(product.price, product.currency || 'SAR', locale)}
        </div>
      ),
    },
    {
      key: 'stock',
      label: t('table.stock'),
      render: (product: Product) => (
        <div className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
          {product.stock}
        </div>
      ),
    },
    {
      key: 'actions',
      label: t('table.actions'),
      render: (product: Product) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/admin/products/${product.id}/edit`)}
            title={tCommon('edit')}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(product.id, product.title)}
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
      key: 'category',
      label: t('filters.category'),
      value: categoryFilter,
      onChange: setCategoryFilter,
      options: [
        { value: '', label: tCommon('all') },
        ...categories.map((cat) => ({
          value: cat.id,
          label: cat.name,
        })),
      ],
    },
    {
      key: 'brand',
      label: t('filters.brand'),
      value: brandFilter,
      onChange: setBrandFilter,
      options: [
        { value: '', label: tCommon('all') },
        ...uniqueBrands.map((brand) => ({
          value: brand!,
          label: brand!,
        })),
      ],
    },
  ];

  return (
    <>
      <DataTable
        data={paginatedProducts}
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

