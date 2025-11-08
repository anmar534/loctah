/**
 * Offer Transformer
 * 
 * Transform offer data between form and API formats.
 */

import type { Offer } from '@/types';
import { formatDatetimeLocal, parseDatetimeLocal } from '../formatters/date.formatter';

export interface OfferFormData {
  title: string;
  description?: string;
  productId?: string;
  storeId?: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage?: number;
  startDate: string; // datetime-local format
  endDate: string; // datetime-local format
  link?: string;
  affiliateUrl?: string;
  isActive: boolean;
}

/**
 * Transform offer form data to API format
 * 
 * @param formData - Form data from user input
 * @returns Data ready for API submission
 */
export function transformOfferFormData(formData: OfferFormData): any {
  return {
    title: formData.title.trim(),
    description: formData.description?.trim() || undefined,
    productId: formData.productId || undefined,
    storeId: formData.storeId || undefined,
    originalPrice: parseFloat(formData.originalPrice.toString()),
    discountedPrice: parseFloat(formData.discountedPrice.toString()),
    discountPercentage: formData.discountPercentage
      ? parseInt(formData.discountPercentage.toString())
      : undefined,
    startDate: parseDatetimeLocal(formData.startDate),
    endDate: parseDatetimeLocal(formData.endDate),
    link: formData.link?.trim() || undefined,
    affiliateUrl: formData.affiliateUrl?.trim() || undefined,
    isActive: formData.isActive ?? true,
  };
}

/**
 * Transform API offer data to form format
 * 
 * @param offer - Offer from API
 * @returns Form data
 */
export function transformOfferToForm(offer: Offer): OfferFormData {
  return {
    title: offer.title,
    description: offer.description || '',
    productId: offer.productId || undefined,
    storeId: offer.storeId || undefined,
    originalPrice: offer.originalPrice,
    discountedPrice: offer.discountedPrice,
    discountPercentage: offer.discountPercentage || undefined,
    startDate: formatDatetimeLocal(offer.startDate),
    endDate: formatDatetimeLocal(offer.endDate),
    link: offer.link || '',
    affiliateUrl: offer.affiliateUrl || '',
    isActive: offer.isActive ?? true,
  };
}

/**
 * Transform offer for display
 * 
 * @param offer - Offer from API
 * @returns Display-ready offer
 */
export function transformOfferForDisplay(offer: Offer): Offer {
  return {
    ...offer,
    originalPrice: parseFloat(offer.originalPrice.toString()),
    discountedPrice: parseFloat(offer.discountedPrice.toString()),
    discountPercentage: offer.discountPercentage
      ? parseInt(offer.discountPercentage.toString())
      : undefined,
  };
}

