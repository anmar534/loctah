import slugify from 'slugify';

type ClassValue = string | number | false | null | undefined;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ');
}

export function formatCurrency(value: number | null, locale = 'en', currency = 'USD'): string {
  if (value === null) {
    return 'Price unavailable';
  }
  if (value === 0) {
    return 'Free';
  }
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

export function formatNumber(value: number, locale = 'en'): string {
  return new Intl.NumberFormat(locale, { notation: 'compact' }).format(value);
}

/**
 * Generate a URL-safe slug from a string, with Arabic transliteration support
 * @param text - The input text (can be Arabic or Latin)
 * @param fallbackPrefix - Prefix to use if slug is empty (default: 'item')
 * @returns URL-safe slug string
 */
export function generateSlug(text: string, fallbackPrefix: string = 'item'): string {
  let slug = slugify(text, {
    lower: true,      // Convert to lowercase
    strict: true,     // Strip special characters
    trim: true,       // Trim leading/trailing whitespace
    locale: 'ar',     // Support Arabic transliteration
  });

  // Fallback: if slug is empty, use prefix + timestamp
  if (!slug || slug.length === 0) {
    slug = `${fallbackPrefix}-${Date.now()}`;
  }

  return slug;
}
