/**
 * CategoryList Component
 * 
 * Pure UI component for displaying categories in tree view.
 * Uses useTableActions hook for actions.
 */

'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { useTableActions } from '@/lib/hooks/useTableActions';
import type { Category } from '@/types';

import CategoryTreeItem from '@/components/admin/CategoryTreeItem';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import EmptyState from '@/components/admin/EmptyState';
import { FolderTree } from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
}

/**
 * Category list component with tree view
 * 
 * @example
 * <CategoryList
 *   categories={categories}
 *   onDelete={handleDelete}
 *   onRefresh={refetch}
 * />
 */
export default function CategoryList({
  categories,
  onDelete,
  onRefresh,
}: CategoryListProps) {
  const t = useTranslations('admin.categories');
  const tCommon = useTranslations('common');
  const router = useRouter();

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

  // Handle edit
  const handleEdit = (categoryId: string) => {
    router.push(`/admin/categories/${categoryId}/edit`);
  };

  // Handle add subcategory
  const handleAddSubcategory = (parentId: string) => {
    router.push(`/admin/categories/create?parentId=${parentId}`);
  };

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={FolderTree}
        title={t('empty.title')}
        description={t('empty.description')}
        actionLabel={t('empty.action')}
        actionHref="/admin/categories/create"
      />
    );
  }

  return (
    <>
      <div className="space-y-2">
        {categories.map((category) => (
          <CategoryTreeItem
            key={category.id}
            category={category}
            onEdit={handleEdit}
            onDelete={(id, name) => handleDelete(id, name)}
            onAddSubcategory={handleAddSubcategory}
            isDeleting={isLoading}
          />
        ))}
      </div>

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

