/**
 * OfferForm Component
 * 
 * Pure UI component for offer create/edit form.
 * Uses useOfferForm hook with integrated discount calculator.
 */

'use client';

import { useTranslations } from 'next-intl';
import { useOfferForm } from '@/lib/hooks/useOfferForm';
import { useFetch } from '@/lib/hooks/useFetch';
import { listProducts, listStores } from '@/lib/api/admin';
import type { Offer } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import SearchableSelect from '@/components/admin/SearchableSelect';
import { Calculator } from 'lucide-react';

interface OfferFormProps {
  mode: 'create' | 'edit';
  offerId?: string;
  initialOffer?: Offer;
  onSuccess?: (offer: Offer) => void;
}

export default function OfferForm({
  mode,
  offerId,
  initialOffer,
  onSuccess,
}: OfferFormProps) {
  const t = useTranslations('admin.offers');
  const tCommon = useTranslations('common');

  const {
    form,
    calculatedDiscount,
    isSubmitting,
    handleSubmit,
  } = useOfferForm({
    mode,
    offerId,
    initialOffer,
    onSuccess,
  });

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  // Load products and stores
  const { data: products } = useFetch(() => listProducts(), { initialData: [] });
  const { data: stores } = useFetch(() => listStores(), { initialData: [] });

  const productOptions = products?.map((p) => ({ value: p.id, label: p.title })) || [];
  const storeOptions = stores?.map((s) => ({ value: s.id, label: s.name })) || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
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

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">{t('form.description')}</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder={t('form.descriptionPlaceholder')}
          disabled={isSubmitting}
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Product & Store */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>{t('form.product')}</Label>
          <SearchableSelect
            options={productOptions}
            value={watch('productId')}
            onChange={(value) => setValue('productId', value)}
            placeholder={t('form.productPlaceholder')}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('form.store')}</Label>
          <SearchableSelect
            options={storeOptions}
            value={watch('storeId')}
            onChange={(value) => setValue('storeId', value)}
            placeholder={t('form.storePlaceholder')}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Prices & Discount */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="originalPrice">{t('form.originalPrice')}</Label>
          <div className="flex gap-2">
            <Input
              id="originalPrice"
              type="number"
              step="0.01"
              {...register('originalPrice', { valueAsNumber: true })}
              placeholder="0.00"
              disabled={isSubmitting}
              dir="ltr"
            />
            <div className="flex items-center px-3 bg-gray-100 rounded-md text-sm">
              ر.س
            </div>
          </div>
          {errors.originalPrice && (
            <p className="text-sm text-red-500">{errors.originalPrice.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountedPrice">{t('form.discountedPrice')}</Label>
          <div className="flex gap-2">
            <Input
              id="discountedPrice"
              type="number"
              step="0.01"
              {...register('discountedPrice', { valueAsNumber: true })}
              placeholder="0.00"
              disabled={isSubmitting}
              dir="ltr"
            />
            <div className="flex items-center px-3 bg-gray-100 rounded-md text-sm">
              ر.س
            </div>
          </div>
          {errors.discountedPrice && (
            <p className="text-sm text-red-500">{errors.discountedPrice.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountPercentage">
            {t('form.discountPercentage')}
          </Label>
          <div className="flex gap-2">
            <Input
              id="discountPercentage"
              type="number"
              {...register('discountPercentage', { valueAsNumber: true })}
              value={calculatedDiscount || watch('discountPercentage') || ''}
              disabled={isSubmitting}
              dir="ltr"
              readOnly
            />
            <div className="flex items-center px-3 bg-green-100 rounded-md text-sm">
              <Calculator className="h-4 w-4 text-green-600" />
            </div>
          </div>
          {calculatedDiscount !== null && (
            <p className="text-sm text-green-600">
              {t('form.autoCalculated')}: {calculatedDiscount}%
            </p>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate">{t('form.startDate')}</Label>
          <Input
            id="startDate"
            type="datetime-local"
            {...register('startDate')}
            disabled={isSubmitting}
            dir="ltr"
          />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">{t('form.endDate')}</Label>
          <Input
            id="endDate"
            type="datetime-local"
            {...register('endDate')}
            disabled={isSubmitting}
            dir="ltr"
          />
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="link">{t('form.link')}</Label>
          <Input
            id="link"
            {...register('link')}
            placeholder={t('form.linkPlaceholder')}
            disabled={isSubmitting}
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="affiliateUrl">{t('form.affiliateUrl')}</Label>
          <Input
            id="affiliateUrl"
            {...register('affiliateUrl')}
            placeholder={t('form.affiliateUrlPlaceholder')}
            disabled={isSubmitting}
            dir="ltr"
          />
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center space-x-2 space-x-reverse">
        <Checkbox
          id="isActive"
          checked={watch('isActive')}
          onCheckedChange={(checked) => setValue('isActive', !!checked)}
          disabled={isSubmitting}
        />
        <Label htmlFor="isActive" className="cursor-pointer">
          {t('form.isActive')}
        </Label>
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

