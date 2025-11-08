/**
 * Tests for Discount Service
 *
 * Tests discount calculation logic
 */

import { calculateDiscount, calculateDiscountedPrice } from '../discount.service';

describe('Discount Service', () => {
  describe('calculateDiscount', () => {
    it('should calculate correct discount percentage', () => {
      expect(calculateDiscount(100, 80)).toBe(20);
      expect(calculateDiscount(500, 350)).toBe(30);
      expect(calculateDiscount(1000, 750)).toBe(25);
    });

    it('should return null when prices are equal', () => {
      expect(calculateDiscount(100, 100)).toBeNull();
    });

    it('should return null when discounted price is higher', () => {
      expect(calculateDiscount(100, 150)).toBeNull();
    });

    it('should return null when original price is 0', () => {
      expect(calculateDiscount(0, 50)).toBeNull();
    });

    it('should return null when original price is negative', () => {
      expect(calculateDiscount(-100, 50)).toBeNull();
    });

    it('should round to nearest integer', () => {
      expect(calculateDiscount(100, 66.666)).toBe(33);
      expect(calculateDiscount(100, 33.333)).toBe(67);
    });

    it('should handle very small discounts', () => {
      expect(calculateDiscount(1000, 999)).toBe(0);
    });

    it('should return null for 100% discount (price = 0)', () => {
      expect(calculateDiscount(100, 0)).toBeNull();
    });
  });

  describe('calculateDiscountedPrice', () => {
    it('should calculate correct discounted price', () => {
      expect(calculateDiscountedPrice(100, 20)).toBe(80);
      expect(calculateDiscountedPrice(500, 30)).toBe(350);
      expect(calculateDiscountedPrice(1000, 25)).toBe(750);
    });

    it('should return original price when discount is 0', () => {
      expect(calculateDiscountedPrice(100, 0)).toBe(100);
    });

    it('should return 0 when discount is 100', () => {
      expect(calculateDiscountedPrice(100, 100)).toBe(0);
    });

    it('should return null when discount is negative', () => {
      expect(calculateDiscountedPrice(100, -10)).toBeNull();
    });

    it('should return null when discount is over 100', () => {
      expect(calculateDiscountedPrice(100, 150)).toBeNull();
    });

    it('should round to 2 decimal places', () => {
      expect(calculateDiscountedPrice(100, 33.333)).toBe(66.67);
      expect(calculateDiscountedPrice(99.99, 15)).toBe(84.99);
    });

    it('should handle very small prices', () => {
      expect(calculateDiscountedPrice(0.99, 10)).toBe(0.89);
    });

    it('should handle large prices', () => {
      expect(calculateDiscountedPrice(999999, 50)).toBe(499999.5);
    });
  });
});

