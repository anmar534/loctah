/**
 * ProductForm Component
 * 
 * Pure UI component for product create/edit form.
 * Uses useProductForm hook for state management.
 */

'use client';

import { useTranslations } from 'next-intl';
import { useProductForm } from '@/lib/hooks/useProductForm';
import { useFetch } from '@/lib/hooks/useFetch';
import { slugify, generateSKU } from '@/lib/utils/slugify';
import { listCategories } from '@/lib/api/admin';
import type { Product } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ImageUpload from '@/components/admin/ImageUpload';
import SearchableSelect from '@/components/admin/SearchableSelect';
import DynamicSpecs from '@/components/admin/DynamicSpecs';
import { Sparkles } from 'lucide-react';

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
  initialProduct?: Product;
  onSuccess?: (product: Product) => void;
}

/**
 * Product form component
 * 
 * @example
 * <ProductForm mode="create" />
 * <ProductForm mode="edit" productId="123" initialProduct={product} />
 */
export default function ProductForm({
  mode,
  productId,
  initialProduct,
  onSuccess,
}: ProductFormProps) {
  const t = useTranslations('admin.products');
  const tCommon = useTranslations('common');

  // Use form hook for state management
  const {
    form,
    images,
    setImages,
    specifications,
    setSpecifications,
    isSubmitting,
    handleSubmit,
  } = useProductForm({
    mode,
    productId,
    initialProduct,
    onSuccess,
  });

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const title = watch('title');

  // Load categories
  const { data: categories, loading: loadingCategories } = useFetch(
    () => listCategories(),
    { initialData: [] }
  );

  // Category options for select
  const categoryOptions = categories?.map((cat) => ({
    value: cat.id,
    label: cat.name,
  })) || [];

  // Auto-generate slug from title
  const handleGenerateSlug = () => {
    if (title) {
      setValue('slug', slugify(title));
    }
  };

  // Auto-generate SKU
  const handleGenerateSKU = () => {
    setValue('sku', generateSKU('PRD'));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title & Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">{t('form.title')}</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder={t('form.titlePlaceholder')}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
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
              disabled={isSubmitting || !title}
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

      {/* Category & Brand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="categoryId">{t('form.category')}</Label>
          <SearchableSelect
            options={categoryOptions}
            value={watch('categoryId')}
            onChange={(value) => setValue('categoryId', value)}
            placeholder={t('form.categoryPlaceholder')}
            disabled={isSubmitting || loadingCategories}
          />
          {errors.categoryId && (
            <p className="text-sm text-red-500">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">{t('form.brand')}</Label>
          <Input
            id="brand"
            {...register('brand')}
            placeholder={t('form.brandPlaceholder')}
            disabled={isSubmitting}
          />
          {errors.brand && (
            <p className="text-sm text-red-500">{errors.brand.message}</p>
          )}
        </div>
      </div>

      {/* SKU, Price, Stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="sku">{t('form.sku')}</Label>
          <div className="flex gap-2">
            <Input
              id="sku"
              {...register('sku')}
              placeholder={t('form.skuPlaceholder')}
              disabled={isSubmitting}
              dir="ltr"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleGenerateSKU}
              disabled={isSubmitting}
              title={t('form.generateSKU')}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
          {errors.sku && (
            <p className="text-sm text-red-500">{errors.sku.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">{t('form.price')}</Label>
          <div className="flex gap-2">
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              placeholder={t('form.pricePlaceholder')}
              disabled={isSubmitting}
              dir="ltr"
            />
            <div className="flex items-center px-3 bg-gray-100 rounded-md text-sm">
              ر.س
            </div>
          </div>
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">{t('form.stock')}</Label>
          <Input
            id="stock"
            type="number"
            {...register('stock', { valueAsNumber: true })}
            placeholder={t('form.stockPlaceholder')}
            disabled={isSubmitting}
            dir="ltr"
          />
          {errors.stock && (
            <p className="text-sm text-red-500">{errors.stock.message}</p>
          )}
        </div>
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label>{t('form.images')}</Label>
        <ImageUpload
          value={images}
          onChange={setImages}
          multiple={true}
          maxFiles={5}
        />
        <p className="text-sm text-gray-500">{t('form.imagesHint')}</p>
      </div>

      {/* Short Description */}
      <div className="space-y-2">
        <Label htmlFor="shortDescription">{t('form.shortDescription')}</Label>
        <Textarea
          id="shortDescription"
          {...register('shortDescription')}
          placeholder={t('form.shortDescriptionPlaceholder')}
          disabled={isSubmitting}
          rows={2}
        />
        {errors.shortDescription && (
          <p className="text-sm text-red-500">{errors.shortDescription.message}</p>
        )}
      </div>

      {/* Full Description */}
      <div className="space-y-2">
        <Label htmlFor="description">{t('form.description')}</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder={t('form.descriptionPlaceholder')}
          disabled={isSubmitting}
          rows={6}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Specifications */}
      <div className="space-y-2">
        <Label>{t('form.specifications')}</Label>
        <DynamicSpecs
          specifications={specifications}
          onChange={setSpecifications}
          disabled={isSubmitting}
        />
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

