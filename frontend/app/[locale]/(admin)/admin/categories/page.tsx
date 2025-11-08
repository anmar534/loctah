/**
 * Categories List Page
 *
 * Simple routing wrapper for categories list.
 * All logic is handled by CategoryList component.
 */

'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

import { getCategoriesTree, deleteCategory } from '@/lib/api/admin';
import { showToast } from '@/components/ui/toast';
import type { Category } from '@/types';

import { CategoryList } from '@/components/admin/categories';
import PageHeader from '@/components/admin/PageHeader';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesPage() {
  const t = useTranslations('admin.categories');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getCategoriesTree();
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
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
      await deleteCategory(id);
      showToast({
        title: tCommon('success'),
        description: t('deleteSuccess'),
      });
    } catch (error) {
      console.error('Failed to delete category:', error);
      showToast({
        title: tCommon('error'),
        description: t('deleteError'),
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader
          title={t('title')}
          description={t('description')}
          actionLabel={t('addNew')}
          actionHref={`/${locale}/admin/categories/create`}
        />
        <Card className="p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title={t('title')}
        description={t('description')}
        actionLabel={t('addNew')}
        actionHref={`/${locale}/admin/categories/create`}
      />

      <Card className="p-6">
        <CategoryList
          categories={categories}
          onDelete={handleDelete}
          onRefresh={fetchCategories}
        />
      </Card>
    </div>
  );
}
