/**
 * Validation Service
 * 
 * Custom validation functions beyond Zod schemas.
 */

/**
 * Validate slug uniqueness (would call API in real implementation)
 * 
 * @param slug - Slug to validate
 * @param entityType - Type of entity (store, product, category)
 * @param excludeId - ID to exclude from check (for updates)
 * @returns Promise<boolean> - true if unique
 */
export async function validateSlugUniqueness(
  slug: string,
  entityType: 'store' | 'product' | 'category',
  excludeId?: string
): Promise<boolean> {
  // TODO: Implement API call to check slug uniqueness
  // For now, return true (assume unique)
  return true;
}

/**
 * Validate image format
 * 
 * @param file - File to validate
 * @returns Validation result
 */
export function validateImageFormat(file: File): {
  isValid: boolean;
  error?: string;
} {
  const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedFormats.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid image format. Allowed: JPEG, PNG, WebP',
    };
  }

  return { isValid: true };
}

/**
 * Validate image size
 * 
 * @param file - File to validate
 * @param maxSizeMB - Maximum size in MB (default: 5)
 * @returns Validation result
 */
export function validateImageSize(
  file: File,
  maxSizeMB: number = 5
): {
  isValid: boolean;
  error?: string;
} {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Image size must be less than ${maxSizeMB}MB`,
    };
  }

  return { isValid: true };
}

/**
 * Validate date range
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Validation result
 */
export function validateDateRange(
  startDate: Date | string,
  endDate: Date | string
): {
  isValid: boolean;
  error?: string;
} {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime())) {
    return { isValid: false, error: 'Invalid start date' };
  }

  if (isNaN(end.getTime())) {
    return { isValid: false, error: 'Invalid end date' };
  }

  if (end <= start) {
    return { isValid: false, error: 'End date must be after start date' };
  }

  return { isValid: true };
}

/**
 * Validate URL format
 * 
 * @param url - URL to validate
 * @returns true if valid
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate email format
 * 
 * @param email - Email to validate
 * @returns true if valid
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Saudi format)
 * 
 * @param phone - Phone number to validate
 * @returns true if valid
 */
export function validateSaudiPhone(phone: string): boolean {
  const phoneRegex = /^(05|5|\+9665|9665)\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Sanitize HTML input
 * 
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML
 */
export function sanitizeHtml(html: string): string {
  // Basic sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '');
}

