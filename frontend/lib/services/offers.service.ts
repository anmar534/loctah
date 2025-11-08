/**
 * Offers Service
 * 
 * Business logic for offers management.
 */

import type { Offer } from '@/types';

/**
 * Validate offer dates
 * 
 * @param startDate - Offer start date
 * @param endDate - Offer end date
 * @returns Validation result
 */
export function validateOfferDates(
  startDate: Date | string,
  endDate: Date | string
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  // Check if dates are valid
  if (isNaN(start.getTime())) {
    errors.push('Invalid start date');
  }

  if (isNaN(end.getTime())) {
    errors.push('Invalid end date');
  }

  // End date must be after start date
  if (end <= start) {
    errors.push('End date must be after start date');
  }

  // Offer duration should be at least 1 day
  const durationDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  if (durationDays < 1) {
    errors.push('Offer duration must be at least 1 day');
  }

  // Offer duration should not exceed 1 year
  if (durationDays > 365) {
    errors.push('Offer duration cannot exceed 1 year');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if offer is currently active
 * 
 * @param offer - Offer to check
 * @returns true if active
 */
export function isOfferActive(offer: Offer): boolean {
  if (!offer.isActive) return false;

  const now = new Date();
  const start = new Date(offer.startDate);
  const end = new Date(offer.endDate);

  return now >= start && now <= end;
}

/**
 * Get offer status
 * 
 * @param offer - Offer to check
 * @returns Status object
 */
export function getOfferStatus(offer: Offer): {
  status: 'active' | 'inactive' | 'expired' | 'scheduled';
  label: string;
  color: 'green' | 'gray' | 'red' | 'blue';
} {
  const now = new Date();
  const start = new Date(offer.startDate);
  const end = new Date(offer.endDate);

  if (!offer.isActive) {
    return { status: 'inactive', label: 'معطل', color: 'gray' };
  }

  if (now > end) {
    return { status: 'expired', label: 'منتهي', color: 'red' };
  }

  if (now < start) {
    return { status: 'scheduled', label: 'مجدول', color: 'blue' };
  }

  return { status: 'active', label: 'نشط', color: 'green' };
}

/**
 * Prepare offer data for API submission
 * 
 * @param formData - Form data
 * @returns Prepared offer data
 */
export function prepareOfferForSubmit(formData: any): any {
  return {
    title: formData.title.trim(),
    description: formData.description?.trim() || undefined,
    productId: formData.productId || undefined,
    storeId: formData.storeId || undefined,
    originalPrice: parseFloat(formData.originalPrice),
    discountedPrice: parseFloat(formData.discountedPrice),
    discountPercentage: formData.discountPercentage
      ? parseInt(formData.discountPercentage)
      : undefined,
    startDate: new Date(formData.startDate).toISOString(),
    endDate: new Date(formData.endDate).toISOString(),
    link: formData.link?.trim() || undefined,
    affiliateUrl: formData.affiliateUrl?.trim() || undefined,
    isActive: formData.isActive ?? true,
  };
}

/**
 * Calculate offer remaining time
 * 
 * @param endDate - Offer end date
 * @returns Remaining time object
 */
export function getOfferRemainingTime(endDate: Date | string): {
  days: number;
  hours: number;
  minutes: number;
  isExpired: boolean;
} {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, isExpired: false };
}

/**
 * Validate offer prices
 * 
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Validation result
 */
export function validateOfferPrices(
  originalPrice: number,
  discountedPrice: number
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (originalPrice <= 0) {
    errors.push('Original price must be greater than 0');
  }

  if (discountedPrice <= 0) {
    errors.push('Discounted price must be greater than 0');
  }

  if (discountedPrice >= originalPrice) {
    errors.push('Discounted price must be less than original price');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

