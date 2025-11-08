/**
 * Price Formatter
 * 
 * Functions for formatting prices and currency.
 */

/**
 * Format price with currency
 * 
 * @param value - Price value
 * @param currency - Currency code (default: SAR)
 * @param locale - Locale for formatting (default: ar-SA)
 * @returns Formatted price string
 * 
 * @example
 * formatPrice(299.99, 'SAR', 'ar-SA') // "٢٩٩٫٩٩ ر.س"
 * formatPrice(299.99, 'SAR', 'en-US') // "SAR 299.99"
 */
export function formatPrice(
  value: number,
  currency: string = 'SAR',
  locale: string = 'ar-SA'
): string {
  if (currency === 'SAR') {
    // Custom formatting for SAR
    return `${value.toFixed(2)} ر.س`;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Format price range
 * 
 * @param min - Minimum price
 * @param max - Maximum price
 * @param currency - Currency code
 * @returns Formatted price range
 * 
 * @example
 * formatPriceRange(100, 500, 'SAR') // "100.00 - 500.00 ر.س"
 */
export function formatPriceRange(
  min: number,
  max: number,
  currency: string = 'SAR'
): string {
  const minFormatted = formatPrice(min, currency);
  const maxFormatted = formatPrice(max, currency);

  return `${minFormatted} - ${maxFormatted}`;
}

/**
 * Format price compact (K, M notation)
 * 
 * @param value - Price value
 * @param currency - Currency code
 * @returns Compact formatted price
 * 
 * @example
 * formatPriceCompact(1500, 'SAR') // "1.5K ر.س"
 * formatPriceCompact(1500000, 'SAR') // "1.5M ر.س"
 */
export function formatPriceCompact(
  value: number,
  currency: string = 'SAR'
): string {
  const currencySymbol = currency === 'SAR' ? 'ر.س' : currency;

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M ${currencySymbol}`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K ${currencySymbol}`;
  }

  return `${value.toFixed(2)} ${currencySymbol}`;
}

/**
 * Parse price string to number
 * 
 * @param priceString - Price string
 * @returns Parsed number
 * 
 * @example
 * parsePrice("299.99 ر.س") // 299.99
 * parsePrice("SAR 299.99") // 299.99
 */
export function parsePrice(priceString: string): number {
  const cleaned = priceString.replace(/[^\d.]/g, '');
  return parseFloat(cleaned) || 0;
}

