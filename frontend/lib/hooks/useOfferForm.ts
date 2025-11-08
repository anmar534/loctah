/**
 * useOfferForm Hook
 * 
 * Manage offer form state (create/edit) with discount calculator.
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { offerSchema } from '@/lib/validations/offer';
import { transformOfferFormData, transformOfferToForm } from '@/lib/utils/transformers/offer.transformer';
import { useDiscountCalculator } from './useDiscountCalculator';
import { createOffer, updateOffer } from '@/lib/api/admin';
import type { Offer } from '@/types';

interface UseOfferFormProps {
  mode: 'create' | 'edit';
  offerId?: string;
  initialOffer?: Offer;
  onSuccess?: (offer: Offer) => void;
}

interface UseOfferFormReturn {
  form: ReturnType<typeof useForm>;
  calculatedDiscount: number | null;
  isSubmitting: boolean;
  handleSubmit: (data: any) => Promise<void>;
}

/**
 * Hook for offer form management
 * 
 * @param props - Form configuration
 * @returns Form state and handlers
 * 
 * @example
 * const { form, calculatedDiscount, handleSubmit } = useOfferForm({
 *   mode: 'create'
 * });
 */
export function useOfferForm({
  mode,
  offerId,
  initialOffer,
  onSuccess,
}: UseOfferFormProps): UseOfferFormReturn {
  const router = useRouter();
  const t = useTranslations('admin.offers');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with validation
  const form = useForm({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: '',
      description: '',
      productId: '',
      storeId: '',
      originalPrice: 0,
      discountedPrice: 0,
      discountPercentage: 0,
      startDate: '',
      endDate: '',
      link: '',
      affiliateUrl: '',
      isActive: true,
    },
  });

  // Watch price fields for discount calculation
  const originalPrice = form.watch('originalPrice');
  const discountedPrice = form.watch('discountedPrice');

  // Auto-calculate discount
  const { discount: calculatedDiscount } = useDiscountCalculator(
    originalPrice,
    discountedPrice
  );

  // Update discount percentage field when calculated
  useEffect(() => {
    if (calculatedDiscount !== null) {
      form.setValue('discountPercentage', calculatedDiscount);
    }
  }, [calculatedDiscount, form]);

  // Load initial data for edit mode
  useEffect(() => {
    if (mode === 'edit' && initialOffer) {
      const formData = transformOfferToForm(initialOffer);
      form.reset(formData);
    }
  }, [mode, initialOffer, form]);

  // Handle form submission
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      // Transform data using transformer
      const preparedData = transformOfferFormData(data);

      let result: Offer;

      if (mode === 'create') {
        result = await createOffer(preparedData);
        toast.success(t('createSuccess'));
      } else {
        if (!offerId) throw new Error('Offer ID is required for update');
        result = await updateOffer(offerId, preparedData);
        toast.success(t('updateSuccess'));
      }

      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      } else {
        // Default: redirect to offers list
        router.push('/admin/offers');
      }
    } catch (error) {
      console.error('Offer form error:', error);
      toast.error(
        mode === 'create' ? t('createError') : t('updateError')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    calculatedDiscount,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}

