/**
 * Stores Service
 * 
 * Business logic for stores management.
 * No API calls - only business rules and data preparation.
 */

import type { Store } from '@/types';

/**
 * Validate store data before submission
 * 
 * @param store - Store data to validate
 * @returns Validation result with errors
 */
export function validateStoreData(store: Partial<Store>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Name validation
  if (!store.name || store.name.trim().length < 2) {
    errors.push('Store name must be at least 2 characters');
  }

  // Email validation (basic)
  if (store.email && !isValidEmail(store.email)) {
    errors.push('Invalid email format');
  }

  // Phone validation (Saudi format)
  if (store.phone && !isValidSaudiPhone(store.phone)) {
    errors.push('Invalid Saudi phone number format');
  }

  // Website validation
  if (store.website && !isValidUrl(store.website)) {
    errors.push('Invalid website URL');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Prepare store data for API submission
 * 
 * @param formData - Form data from user input
 * @param logoUrl - Uploaded logo URL
 * @returns Prepared data for API
 */
export function prepareStoreForSubmit(
  formData: any,
  logoUrl?: string
): Partial<Store> {
  return {
    name: formData.name.trim(),
    slug: formData.slug.trim().toLowerCase(),
    email: formData.email?.trim() || undefined,
    phone: formData.phone?.trim() || undefined,
    website: formData.website?.trim() || undefined,
    city: formData.city,
    address: formData.address?.trim() || undefined,
    logo: logoUrl || formData.logo || undefined,
    description: formData.description?.trim() || undefined,
    isActive: formData.isActive ?? true,
  };
}

/**
 * Check if store can be deleted
 * 
 * @param store - Store to check
 * @returns true if can be deleted, false otherwise
 */
export function canDeleteStore(store: Store): boolean {
  // Cannot delete if store has active offers
  // This is a business rule - actual check would come from API
  return true; // Placeholder - implement based on business rules
}

/**
 * Get store status label
 * 
 * @param isActive - Store active status
 * @returns Status label
 */
export function getStoreStatusLabel(isActive: boolean): string {
  return isActive ? 'نشط' : 'معطل';
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Saudi phone number
 * Accepts: 05XXXXXXXX, +9665XXXXXXXX, 9665XXXXXXXX
 */
function isValidSaudiPhone(phone: string): boolean {
  const phoneRegex = /^(05|5|\+9665|9665)\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Normalize phone number to standard format
 * 
 * @param phone - Phone number in any format
 * @returns Normalized phone number (05XXXXXXXX)
 */
export function normalizePhoneNumber(phone: string): string {
  // Remove spaces and special characters
  let normalized = phone.replace(/[\s\-\(\)]/g, '');

  // Convert to 05XXXXXXXX format
  if (normalized.startsWith('+966')) {
    normalized = '0' + normalized.substring(4);
  } else if (normalized.startsWith('966')) {
    normalized = '0' + normalized.substring(3);
  } else if (normalized.startsWith('5')) {
    normalized = '0' + normalized;
  }

  return normalized;
}

