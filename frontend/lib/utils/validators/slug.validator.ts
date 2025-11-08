/**
 * Slug Validator
 * 
 * Validation functions for URL slugs.
 */

/**
 * Check if slug format is valid
 * 
 * @param slug - Slug to validate
 * @returns true if valid
 */
export function isValidSlug(slug: string): boolean {
  // Slug should be lowercase, alphanumeric with hyphens
  // Length: 2-100 characters
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  
  if (slug.length < 2 || slug.length > 100) {
    return false;
  }

  return slugRegex.test(slug);
}

/**
 * Check if slug exists (would call API in real implementation)
 * 
 * @param slug - Slug to check
 * @param entityType - Type of entity
 * @param excludeId - ID to exclude from check
 * @returns Promise<boolean> - true if exists
 */
export async function slugExists(
  slug: string,
  entityType: 'store' | 'product' | 'category',
  excludeId?: string
): Promise<boolean> {
  // TODO: Implement API call to check slug existence
  // For now, return false (assume doesn't exist)
  return false;
}

/**
 * Validate slug with detailed error message
 * 
 * @param slug - Slug to validate
 * @returns Validation result
 */
export function validateSlug(slug: string): {
  isValid: boolean;
  error?: string;
} {
  if (!slug || slug.trim().length === 0) {
    return {
      isValid: false,
      error: 'الرابط مطلوب',
    };
  }

  if (slug.length < 2) {
    return {
      isValid: false,
      error: 'الرابط يجب أن يكون على الأقل حرفين',
    };
  }

  if (slug.length > 100) {
    return {
      isValid: false,
      error: 'الرابط يجب أن لا يتجاوز 100 حرف',
    };
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return {
      isValid: false,
      error: 'الرابط يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط',
    };
  }

  if (slug.startsWith('-') || slug.endsWith('-')) {
    return {
      isValid: false,
      error: 'الرابط لا يجب أن يبدأ أو ينتهي بشرطة',
    };
  }

  if (slug.includes('--')) {
    return {
      isValid: false,
      error: 'الرابط لا يجب أن يحتوي على شرطات متتالية',
    };
  }

  return { isValid: true };
}

/**
 * Sanitize slug
 * 
 * @param slug - Slug to sanitize
 * @returns Sanitized slug
 */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove invalid characters
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

