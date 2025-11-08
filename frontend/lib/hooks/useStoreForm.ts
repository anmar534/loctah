/**
 * useStoreForm Hook
 * 
 * Manage store form state (create/edit).
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { storeSchema } from '@/lib/validations/store';
import { transformStoreFormData, transformStoreToForm } from '@/lib/utils/transformers/store.transformer';
import { prepareStoreForSubmit } from '@/lib/services/stores.service';
import { createStore, updateStore } from '@/lib/api/admin';
import type { Store } from '@/types';

interface UseStoreFormProps {
  mode: 'create' | 'edit';
  storeId?: string;
  initialStore?: Store;
  onSuccess?: (store: Store) => void;
}

interface UseStoreFormReturn {
  form: ReturnType<typeof useForm>;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  isSubmitting: boolean;
  handleSubmit: (data: any) => Promise<void>;
}

/**
 * Hook for store form management
 * 
 * @param props - Form configuration
 * @returns Form state and handlers
 * 
 * @example
 * const { form, logoUrl, setLogoUrl, isSubmitting, handleSubmit } = useStoreForm({
 *   mode: 'create'
 * });
 */
export function useStoreForm({
  mode,
  storeId,
  initialStore,
  onSuccess,
}: UseStoreFormProps): UseStoreFormReturn {
  const router = useRouter();
  const t = useTranslations('admin.stores');
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with validation
  const form = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: '',
      slug: '',
      email: '',
      phone: '',
      website: '',
      city: '',
      address: '',
      description: '',
      isActive: true,
    },
  });

  // Load initial data for edit mode
  useEffect(() => {
    if (mode === 'edit' && initialStore) {
      const { formData, logoUrl: logo } = transformStoreToForm(initialStore);
      
      form.reset(formData);
      
      if (logo) {
        setLogoUrl(logo);
      }
    }
  }, [mode, initialStore, form]);

  // Handle form submission
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      // Prepare data using service
      const preparedData = prepareStoreForSubmit(data, logoUrl);

      let result: Store;

      if (mode === 'create') {
        result = await createStore(preparedData);
        toast.success(t('createSuccess'));
      } else {
        if (!storeId) throw new Error('Store ID is required for update');
        result = await updateStore(storeId, preparedData);
        toast.success(t('updateSuccess'));
      }

      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      } else {
        // Default: redirect to stores list
        router.push('/admin/stores');
      }
    } catch (error) {
      console.error('Store form error:', error);
      toast.error(
        mode === 'create' ? t('createError') : t('updateError')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    logoUrl,
    setLogoUrl,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}

