/**
 * CategoryForm Component
 * 
 * Pure UI component for category create/edit form.
 * Uses useCategoryForm hook with circular reference prevention.
 */

'use client';

import { useTranslations } from 'next-intl';
import { useCategoryForm } from '@/lib/hooks/useCategoryForm';
import { slugify } from '@/lib/utils/slugify';
import type { Category } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ImageUpload from '@/components/admin/ImageUpload';
import SearchableSelect from '@/components/admin/SearchableSelect';
import { Sparkles } from 'lucide-react';

interface CategoryFormProps {
  mode: 'create' | 'edit';
  categoryId?: string;
  initialCategory?: Category;
  parentId?: string;
  onSuccess?: (category: Category) => void;
}

export default function CategoryForm({
  mode,
  categoryId,
  initialCategory,
  parentId,
  onSuccess,
}: CategoryFormProps) {
  const t = useTranslations('admin.categories');
  const tCommon = useTranslations('common');

  const {
    form,
    imageUrl,
    setImageUrl,
    parentCategories,
    isLoadingCategories,
    isSubmitting,
    handleSubmit,
  } = useCategoryForm({
    mode,
    categoryId,
    initialCategory,
    parentId,
    onSuccess,
  });

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const name = watch('name');

  // Auto-generate slug from name
  const handleGenerateSlug = () => {
    if (name) {
      setValue('slug', slugify(name));
    }
  };

  // Parent category options
  const parentOptions = [
    { value: '', label: t('form.noParent') },
    ...parentCategories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name & Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">{t('form.name')}</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder={t('form.namePlaceholder')}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">{t('form.slug')}</Label>
          <div className="flex gap-2">
            <Input
              id="slug"
              {...register('slug')}
              placeholder={t('form.slugPlaceholder')}
              disabled={isSubmitting}
              dir="ltr"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleGenerateSlug}
              disabled={isSubmitting || !name}
              title={t('form.generateSlug')}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
          {errors.slug && (
            <p className="text-sm text-red-500">{errors.slug.message}</p>
          )}
        </div>
      </div>

      {/* Parent Category */}
      <div className="space-y-2">
        <Label>{t('form.parentCategory')}</Label>
        <SearchableSelect
          options={parentOptions}
          value={watch('parentId') || ''}
          onChange={(value) => setValue('parentId', value || '')}
          placeholder={t('form.parentCategoryPlaceholder')}
          disabled={isSubmitting || isLoadingCategories}
        />
        {errors.parentId && (
          <p className="text-sm text-red-500">{errors.parentId.message}</p>
        )}
      </div>

      {/* Image */}
      <div className="space-y-2">
        <Label>{t('form.image')}</Label>
        <ImageUpload
          value={imageUrl ? [imageUrl] : []}
          onChange={(urls) => setImageUrl(urls[0] || '')}
          multiple={false}
          maxFiles={1}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">{t('form.description')}</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder={t('form.descriptionPlaceholder')}
          disabled={isSubmitting}
          rows={4}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? tCommon('saving')
            : mode === 'create'
            ? t('create')
            : t('update')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          {tCommon('cancel')}
        </Button>
      </div>
    </form>
  );
}

