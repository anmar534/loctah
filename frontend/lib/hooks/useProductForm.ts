/**
 * useProductForm Hook
 * 
 * Manage product form state (create/edit).
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { productSchema } from '@/lib/validations/product';
import { transformProductFormData, transformProductToForm } from '@/lib/utils/transformers/product.transformer';
import type { Specification } from '@/lib/utils/transformers/product.transformer';
import { createProduct, updateProduct } from '@/lib/api/admin';
import type { Product } from '@/types';

interface UseProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
  initialProduct?: Product;
  onSuccess?: (product: Product) => void;
}

interface UseProductFormReturn {
  form: ReturnType<typeof useForm>;
  images: string[];
  setImages: (images: string[]) => void;
  specifications: Specification[];
  setSpecifications: (specs: Specification[]) => void;
  isSubmitting: boolean;
  handleSubmit: (data: any) => Promise<void>;
}

/**
 * Hook for product form management
 * 
 * @param props - Form configuration
 * @returns Form state and handlers
 * 
 * @example
 * const { form, images, setImages, specifications, setSpecifications, handleSubmit } = useProductForm({
 *   mode: 'create'
 * });
 */
export function useProductForm({
  mode,
  productId,
  initialProduct,
  onSuccess,
}: UseProductFormProps): UseProductFormReturn {
  const router = useRouter();
  const t = useTranslations('admin.products');
  const [images, setImages] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<Specification[]>([
    { key: '', value: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with validation
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      categoryId: '',
      brand: '',
      sku: '',
      price: 0,
      currency: 'SAR',
      stock: 0,
    },
  });

  // Load initial data for edit mode
  useEffect(() => {
    if (mode === 'edit' && initialProduct) {
      const {
        formData,
        images: productImages,
        specifications: productSpecs,
      } = transformProductToForm(initialProduct);

      form.reset(formData);
      setImages(productImages);
      setSpecifications(
        productSpecs.length > 0 ? productSpecs : [{ key: '', value: '' }]
      );
    }
  }, [mode, initialProduct, form]);

  // Handle form submission
  const handleSubmit = async (data: any) => {
    // Validate images
    if (images.length === 0) {
      toast.error(t('errors.noImages'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform data using transformer
      const preparedData = transformProductFormData(
        data,
        images,
        specifications
      );

      let result: Product;

      if (mode === 'create') {
        result = await createProduct(preparedData);
        toast.success(t('createSuccess'));
      } else {
        if (!productId) throw new Error('Product ID is required for update');
        result = await updateProduct(productId, preparedData);
        toast.success(t('updateSuccess'));
      }

      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      } else {
        // Default: redirect to products list
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Product form error:', error);
      toast.error(
        mode === 'create' ? t('createError') : t('updateError')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    images,
    setImages,
    specifications,
    setSpecifications,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}

