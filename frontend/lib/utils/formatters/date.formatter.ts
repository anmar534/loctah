/**
 * Date Formatter
 * 
 * Functions for formatting dates and times.
 */

import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';

/**
 * Format date to string
 * 
 * @param date - Date to format
 * @param formatString - Format string (default: dd/MM/yyyy)
 * @param locale - Locale (default: ar)
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date(), 'dd/MM/yyyy') // "08/11/2025"
 * formatDate(new Date(), 'PPP', 'ar') // "٨ نوفمبر ٢٠٢٥"
 */
export function formatDate(
  date: Date | string,
  formatString: string = 'dd/MM/yyyy',
  locale: string = 'ar'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const localeObj = locale === 'ar' ? ar : undefined;

  return format(dateObj, formatString, { locale: localeObj });
}

/**
 * Format relative time (e.g., "منذ ساعتين")
 * 
 * @param date - Date to format
 * @param locale - Locale (default: ar)
 * @returns Relative time string
 * 
 * @example
 * formatRelativeTime(new Date(Date.now() - 2 * 60 * 60 * 1000)) // "منذ ساعتين"
 */
export function formatRelativeTime(
  date: Date | string,
  locale: string = 'ar'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const localeObj = locale === 'ar' ? ar : undefined;

  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: localeObj,
  });
}

/**
 * Format date range
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @param formatString - Format string
 * @returns Formatted date range
 * 
 * @example
 * formatDateRange(start, end) // "01/11/2025 - 08/11/2025"
 */
export function formatDateRange(
  startDate: Date | string,
  endDate: Date | string,
  formatString: string = 'dd/MM/yyyy'
): string {
  const start = formatDate(startDate, formatString);
  const end = formatDate(endDate, formatString);

  return `${start} - ${end}`;
}

/**
 * Format datetime for input field
 * 
 * @param date - Date to format
 * @returns Formatted datetime string (YYYY-MM-DDTHH:mm)
 * 
 * @example
 * formatDatetimeLocal(new Date()) // "2025-11-08T14:30"
 */
export function formatDatetimeLocal(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "yyyy-MM-dd'T'HH:mm");
}

/**
 * Parse datetime-local input to ISO string
 * 
 * @param datetimeLocal - Datetime local string
 * @returns ISO 8601 string
 * 
 * @example
 * parseDatetimeLocal("2025-11-08T14:30") // "2025-11-08T14:30:00.000Z"
 */
export function parseDatetimeLocal(datetimeLocal: string): string {
  return new Date(datetimeLocal).toISOString();
}

/**
 * Format time only
 * 
 * @param date - Date to format
 * @param format24h - Use 24-hour format (default: true)
 * @returns Formatted time string
 * 
 * @example
 * formatTime(new Date()) // "14:30"
 * formatTime(new Date(), false) // "2:30 PM"
 */
export function formatTime(date: Date | string, format24h: boolean = true): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const formatString = format24h ? 'HH:mm' : 'h:mm a';

  return format(dateObj, formatString);
}

