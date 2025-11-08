/**
 * StoreForm Component
 * 
 * Pure UI component for store create/edit form.
 * Uses useStoreForm hook for state management.
 */

'use client';

import { useTranslations } from 'next-intl';
import { useStoreForm } from '@/lib/hooks/useStoreForm';
import { slugify } from '@/lib/utils/slugify';
import { SAUDI_CITIES } from '@/lib/constants/cities';
import type { Store } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import ImageUpload from '@/components/admin/ImageUpload';
import SearchableSelect from '@/components/admin/SearchableSelect';
import { Sparkles } from 'lucide-react';

interface StoreFormProps {
  mode: 'create' | 'edit';
  storeId?: string;
  initialStore?: Store;
  onSuccess?: (store: Store) => void;
}

/**
 * Store form component
 * 
 * @example
 * <StoreForm mode="create" />
 * <StoreForm mode="edit" storeId="123" initialStore={store} />
 */
export default function StoreForm({
  mode,
  storeId,
  initialStore,
  onSuccess,
}: StoreFormProps) {
  const t = useTranslations('admin.stores');
  const tCommon = useTranslations('common');

  // Use form hook for state management
  const {
    form,
    logoUrl,
    setLogoUrl,
    isSubmitting,
    handleSubmit,
  } = useStoreForm({
    mode,
    storeId,
    initialStore,
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

  // City options for select
  const cityOptions = SAUDI_CITIES.map((city) => ({
    value: city.value,
    label: city.labelAr,
  }));

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

      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">{t('form.email')}</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder={t('form.emailPlaceholder')}
            disabled={isSubmitting}
            dir="ltr"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t('form.phone')}</Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder={t('form.phonePlaceholder')}
            disabled={isSubmitting}
            dir="ltr"
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Website & City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="website">{t('form.website')}</Label>
          <Input
            id="website"
            {...register('website')}
            placeholder={t('form.websitePlaceholder')}
            disabled={isSubmitting}
            dir="ltr"
          />
          {errors.website && (
            <p className="text-sm text-red-500">{errors.website.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">{t('form.city')}</Label>
          <SearchableSelect
            options={cityOptions}
            value={watch('city')}
            onChange={(value) => setValue('city', value)}
            placeholder={t('form.cityPlaceholder')}
            disabled={isSubmitting}
          />
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">{t('form.address')}</Label>
        <Input
          id="address"
          {...register('address')}
          placeholder={t('form.addressPlaceholder')}
          disabled={isSubmitting}
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>

      {/* Logo */}
      <div className="space-y-2">
        <Label>{t('form.logo')}</Label>
        <ImageUpload
          value={logoUrl ? [logoUrl] : []}
          onChange={(urls) => setLogoUrl(urls[0] || '')}
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

