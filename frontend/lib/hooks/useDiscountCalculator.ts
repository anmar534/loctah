/**
 * useDiscountCalculator Hook
 * 
 * Calculate discount percentage automatically from prices.
 * This hook wraps the discount service with React state.
 */

'use client';

import { useState, useEffect } from 'react';
import { calculateDiscount } from '@/lib/services/discount.service';

interface UseDiscountCalculatorReturn {
  discount: number | null;
  isValid: boolean;
  error: string | null;
}

/**
 * Hook to calculate discount percentage
 * 
 * @param originalPrice - Original price before discount
 * @param discountedPrice - Price after discount
 * @returns Discount percentage and validation state
 * 
 * @example
 * const { discount, isValid } = useDiscountCalculator(100, 80);
 * // discount = 20, isValid = true
 */
export function useDiscountCalculator(
  originalPrice: number | string,
  discountedPrice: number | string
): UseDiscountCalculatorReturn {
  const [discount, setDiscount] = useState<number | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Convert to numbers
    const original = typeof originalPrice === 'string' 
      ? parseFloat(originalPrice) 
      : originalPrice;
    const discounted = typeof discountedPrice === 'string'
      ? parseFloat(discountedPrice)
      : discountedPrice;

    // Reset state if inputs are invalid
    if (!original || !discounted || isNaN(original) || isNaN(discounted)) {
      setDiscount(null);
      setIsValid(false);
      setError(null);
      return;
    }

    // Calculate discount using service
    const result = calculateDiscount(original, discounted);

    if (result === null) {
      setDiscount(null);
      setIsValid(false);
      
      if (discounted >= original) {
        setError('السعر بعد الخصم يجب أن يكون أقل من السعر الأصلي');
      } else {
        setError('قيم الأسعار غير صحيحة');
      }
    } else {
      setDiscount(result);
      setIsValid(true);
      setError(null);
    }
  }, [originalPrice, discountedPrice]);

  return { discount, isValid, error };
}

