/**
 * Date Validator
 * 
 * Validation functions for dates.
 */

/**
 * Check if date range is valid
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Validation result
 */
export function isValidDateRange(
  startDate: Date | string,
  endDate: Date | string
): {
  isValid: boolean;
  error?: string;
} {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime())) {
    return {
      isValid: false,
      error: 'تاريخ البداية غير صحيح',
    };
  }

  if (isNaN(end.getTime())) {
    return {
      isValid: false,
      error: 'تاريخ النهاية غير صحيح',
    };
  }

  if (end <= start) {
    return {
      isValid: false,
      error: 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية',
    };
  }

  return { isValid: true };
}

/**
 * Check if date is in the future
 * 
 * @param date - Date to check
 * @returns true if future date
 */
export function isFutureDate(date: Date | string): boolean {
  const dateObj = new Date(date);
  const now = new Date();

  return dateObj > now;
}

/**
 * Check if date is in the past
 * 
 * @param date - Date to check
 * @returns true if past date
 */
export function isPastDate(date: Date | string): boolean {
  const dateObj = new Date(date);
  const now = new Date();

  return dateObj < now;
}

/**
 * Check if date is today
 * 
 * @param date - Date to check
 * @returns true if today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = new Date(date);
  const now = new Date();

  return (
    dateObj.getDate() === now.getDate() &&
    dateObj.getMonth() === now.getMonth() &&
    dateObj.getFullYear() === now.getFullYear()
  );
}

/**
 * Validate date is within range
 * 
 * @param date - Date to validate
 * @param minDate - Minimum allowed date
 * @param maxDate - Maximum allowed date
 * @returns Validation result
 */
export function isDateInRange(
  date: Date | string,
  minDate?: Date | string,
  maxDate?: Date | string
): {
  isValid: boolean;
  error?: string;
} {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return {
      isValid: false,
      error: 'التاريخ غير صحيح',
    };
  }

  if (minDate) {
    const min = new Date(minDate);
    if (dateObj < min) {
      return {
        isValid: false,
        error: `التاريخ يجب أن يكون بعد ${min.toLocaleDateString('ar-SA')}`,
      };
    }
  }

  if (maxDate) {
    const max = new Date(maxDate);
    if (dateObj > max) {
      return {
        isValid: false,
        error: `التاريخ يجب أن يكون قبل ${max.toLocaleDateString('ar-SA')}`,
      };
    }
  }

  return { isValid: true };
}

/**
 * Calculate days between two dates
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of days
 */
export function daysBetween(
  startDate: Date | string,
  endDate: Date | string
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Validate minimum duration between dates
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @param minDays - Minimum number of days
 * @returns Validation result
 */
export function validateMinDuration(
  startDate: Date | string,
  endDate: Date | string,
  minDays: number
): {
  isValid: boolean;
  error?: string;
} {
  const days = daysBetween(startDate, endDate);

  if (days < minDays) {
    return {
      isValid: false,
      error: `المدة يجب أن تكون على الأقل ${minDays} يوم`,
    };
  }

  return { isValid: true };
}

/**
 * Validate maximum duration between dates
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @param maxDays - Maximum number of days
 * @returns Validation result
 */
export function validateMaxDuration(
  startDate: Date | string,
  endDate: Date | string,
  maxDays: number
): {
  isValid: boolean;
  error?: string;
} {
  const days = daysBetween(startDate, endDate);

  if (days > maxDays) {
    return {
      isValid: false,
      error: `المدة يجب أن لا تتجاوز ${maxDays} يوم`,
    };
  }

  return { isValid: true };
}

