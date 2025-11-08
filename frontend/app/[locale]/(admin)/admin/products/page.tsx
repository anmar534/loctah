/**
 * Products List Page
 *
 * Simple routing wrapper for products list.
 * All logic is handled by ProductList component.
 */

'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

import { listProducts, deleteProduct, listCategories } from '@/lib/api/admin';
import { showToast } from '@/components/ui/toast';
import type { Product, Category } from '@/types';

import { ProductList } from '@/components/admin/products';
import PageHeader from '@/components/admin/PageHeader';
import LoadingTable from '@/components/admin/LoadingTable';

export default function ProductsPage() {
  const t = useTranslations('admin.products');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products and categories
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        listProducts({ page: 1, limit: 100 }),
        listCategories(),
      ]);

      if (productsResponse) {
        setProducts(productsResponse.products);
      }
      if (categoriesResponse) {
        setCategories(categoriesResponse.categories);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
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
      await deleteProduct(id);
      showToast({
        title: tCommon('success'),
        description: t('deleteSuccess'),
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
      showToast({
        title: tCommon('error'),
        description: t('deleteError'),
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader
          title={t('title')}
          description={t('description')}
          actionLabel={t('addNew')}
          actionHref={`/${locale}/admin/products/create`}
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
        actionHref={`/${locale}/admin/products/create`}
      />

      <ProductList
        products={products}
        categories={categories}
        onDelete={handleDelete}
        onRefresh={fetchData}
      />
    </div>
  );
}
