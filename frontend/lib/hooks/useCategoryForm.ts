/**
 * useCategoryForm Hook
 * 
 * Manage category form state (create/edit).
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { categorySchema } from '@/lib/validations/category';
import { transformCategoryFormData, transformCategoryToForm } from '@/lib/utils/transformers/category.transformer';
import { hasCircularReference } from '@/lib/services/categories.service';
import { createCategory, updateCategory, listCategories } from '@/lib/api/admin';
import type { Category } from '@/types';

interface UseCategoryFormProps {
  mode: 'create' | 'edit';
  categoryId?: string;
  initialCategory?: Category;
  parentId?: string;
  onSuccess?: (category: Category) => void;
}

interface UseCategoryFormReturn {
  form: ReturnType<typeof useForm>;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  parentCategories: Category[];
  isLoadingCategories: boolean;
  isSubmitting: boolean;
  handleSubmit: (data: any) => Promise<void>;
}

/**
 * Hook for category form management
 * 
 * @param props - Form configuration
 * @returns Form state and handlers
 * 
 * @example
 * const { form, imageUrl, setImageUrl, parentCategories, handleSubmit } = useCategoryForm({
 *   mode: 'create'
 * });
 */
export function useCategoryForm({
  mode,
  categoryId,
  initialCategory,
  parentId,
  onSuccess,
}: UseCategoryFormProps): UseCategoryFormReturn {
  const router = useRouter();
  const t = useTranslations('admin.categories');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Initialize form with validation
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      parentId: parentId || '',
    },
  });

  // Load all categories for parent selection
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await listCategories();
        setAllCategories(categories);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Filter parent categories (exclude current category and its descendants in edit mode)
  const parentCategories = useMemo(() => {
    if (mode === 'create') {
      return allCategories;
    }

    // In edit mode, exclude current category and its descendants
    return allCategories.filter((cat) => {
      if (cat.id === categoryId) return false;
      
      // Check for circular reference
      if (categoryId && hasCircularReference(categoryId, cat.id, allCategories)) {
        return false;
      }

      return true;
    });
  }, [mode, categoryId, allCategories]);

  // Load initial data for edit mode
  useEffect(() => {
    if (mode === 'edit' && initialCategory) {
      const { formData, imageUrl: catImage } = transformCategoryToForm(initialCategory);
      
      form.reset(formData);
      
      if (catImage) {
        setImageUrl(catImage);
      }
    }
  }, [mode, initialCategory, form]);

  // Handle form submission
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      // Transform data using transformer
      const preparedData = transformCategoryFormData(data, imageUrl);

      let result: Category;

      if (mode === 'create') {
        result = await createCategory(preparedData);
        toast.success(t('createSuccess'));
      } else {
        if (!categoryId) throw new Error('Category ID is required for update');
        result = await updateCategory(categoryId, preparedData);
        toast.success(t('updateSuccess'));
      }

      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      } else {
        // Default: redirect to categories list
        router.push('/admin/categories');
      }
    } catch (error) {
      console.error('Category form error:', error);
      toast.error(
        mode === 'create' ? t('createError') : t('updateError')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    imageUrl,
    setImageUrl,
    parentCategories,
    isLoadingCategories,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}

