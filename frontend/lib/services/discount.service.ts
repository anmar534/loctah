/**
 * Discount Service
 * 
 * Business logic for discount calculations.
 * Pure functions - no side effects, no API calls.
 */

/**
 * Calculate discount percentage from original and discounted prices
 * 
 * @param originalPrice - Original price before discount
 * @param discountedPrice - Price after discount
 * @returns Discount percentage (0-100) or null if invalid
 * 
 * @example
 * calculateDiscount(100, 80) // Returns 20
 * calculateDiscount(100, 100) // Returns null (no discount)
 * calculateDiscount(100, 120) // Returns null (invalid)
 */
export function calculateDiscount(
  originalPrice: number,
  discountedPrice: number
): number | null {
  // Validate inputs
  if (!originalPrice || !discountedPrice) return null;
  if (originalPrice <= 0 || discountedPrice <= 0) return null;
  if (discountedPrice >= originalPrice) return null;

  // Calculate discount percentage
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  
  // Round to nearest integer
  return Math.round(discount);
}

/**
 * Calculate discounted price from original price and discount percentage
 * 
 * @param originalPrice - Original price
 * @param discountPercent - Discount percentage (0-100)
 * @returns Discounted price or null if invalid
 * 
 * @example
 * calculateDiscountedPrice(100, 20) // Returns 80
 * calculateDiscountedPrice(100, 0) // Returns 100
 * calculateDiscountedPrice(100, 150) // Returns null (invalid)
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercent: number
): number | null {
  // Validate inputs
  if (!originalPrice || originalPrice <= 0) return null;
  if (discountPercent < 0 || discountPercent > 100) return null;

  // Calculate discounted price
  const discountAmount = (originalPrice * discountPercent) / 100;
  const discountedPrice = originalPrice - discountAmount;

  // Round to 2 decimal places
  return Math.round(discountedPrice * 100) / 100;
}

/**
 * Validate discount percentage
 * 
 * @param discount - Discount percentage to validate
 * @returns true if valid, false otherwise
 */
export function validateDiscount(discount: number): boolean {
  return discount >= 0 && discount <= 100;
}

/**
 * Format discount for display
 * 
 * @param discount - Discount percentage
 * @returns Formatted string (e.g., "20%")
 */
export function formatDiscountDisplay(discount: number | null): string {
  if (discount === null || discount === 0) return '-';
  return `${discount}%`;
}

/**
 * Calculate savings amount
 * 
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Savings amount or null if invalid
 */
export function calculateSavings(
  originalPrice: number,
  discountedPrice: number
): number | null {
  if (!originalPrice || !discountedPrice) return null;
  if (discountedPrice >= originalPrice) return null;

  const savings = originalPrice - discountedPrice;
  return Math.round(savings * 100) / 100;
}

