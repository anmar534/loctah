/**
 * Number Formatter
 * 
 * Functions for formatting numbers.
 */

/**
 * Format number with thousands separator
 * 
 * @param value - Number to format
 * @param locale - Locale (default: ar-SA)
 * @returns Formatted number string
 * 
 * @example
 * formatNumber(1000) // "1,000"
 * formatNumber(1000000) // "1,000,000"
 */
export function formatNumber(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Format number in compact notation (K, M, B)
 * 
 * @param value - Number to format
 * @returns Compact formatted string
 * 
 * @example
 * formatCompact(1500) // "1.5K"
 * formatCompact(1500000) // "1.5M"
 * formatCompact(1500000000) // "1.5B"
 */
export function formatCompact(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value.toString();
}

/**
 * Format percentage
 * 
 * @param value - Percentage value (0-100)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 * 
 * @example
 * formatPercentage(25) // "25%"
 * formatPercentage(25.5, 1) // "25.5%"
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format file size
 * 
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 * 
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1048576) // "1 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Round to decimal places
 * 
 * @param value - Number to round
 * @param decimals - Number of decimal places
 * @returns Rounded number
 * 
 * @example
 * roundToDecimals(3.14159, 2) // 3.14
 */
export function roundToDecimals(value: number, decimals: number): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

