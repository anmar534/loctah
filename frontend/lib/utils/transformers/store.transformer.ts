/**
 * Store Transformer
 * 
 * Transform store data between form and API formats.
 */

import type { Store } from '@/types';

export interface StoreFormData {
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  website?: string;
  city: string;
  address?: string;
  description?: string;
  isActive: boolean;
}

/**
 * Transform store form data to API format
 * 
 * @param formData - Form data from user input
 * @param logoUrl - Uploaded logo URL
 * @returns Data ready for API submission
 */
export function transformStoreFormData(
  formData: StoreFormData,
  logoUrl?: string
): any {
  return {
    name: formData.name.trim(),
    slug: formData.slug.trim().toLowerCase(),
    email: formData.email?.trim() || undefined,
    phone: formData.phone?.trim() || undefined,
    website: formData.website?.trim() || undefined,
    city: formData.city,
    address: formData.address?.trim() || undefined,
    logo: logoUrl || undefined,
    description: formData.description?.trim() || undefined,
    isActive: formData.isActive ?? true,
  };
}

/**
 * Transform API store data to form format
 * 
 * @param store - Store from API
 * @returns Form data and logo URL
 */
export function transformStoreToForm(store: Store): {
  formData: StoreFormData;
  logoUrl?: string;
} {
  return {
    formData: {
      name: store.name,
      slug: store.slug,
      email: store.email || '',
      phone: store.phone || '',
      website: store.website || '',
      city: store.city,
      address: store.address || '',
      description: store.description || '',
      isActive: store.isActive ?? true,
    },
    logoUrl: store.logo || undefined,
  };
}

/**
 * Transform store for display
 * 
 * @param store - Store from API
 * @returns Display-ready store
 */
export function transformStoreForDisplay(store: Store): Store {
  return {
    ...store,
    // Add any display-specific transformations here
  };
}

