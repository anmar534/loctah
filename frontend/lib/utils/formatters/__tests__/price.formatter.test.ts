/**
 * Tests for Price Formatter
 *
 * Tests price formatting logic
 */

import { formatPrice, formatPriceCompact, parsePrice } from '../price.formatter';

describe('Price Formatter', () => {
  describe('formatPrice', () => {
    it('should format price with SAR currency', () => {
      expect(formatPrice(100, 'SAR')).toBe('100.00 ر.س');
      expect(formatPrice(99.99, 'SAR')).toBe('99.99 ر.س');
    });

    it('should format price with USD currency (uses Intl)', () => {
      const result = formatPrice(100, 'USD');
      // Arabic locale formats numbers with Arabic numerals
      expect(result).toContain('US');
    });

    it('should default to SAR when no currency provided', () => {
      expect(formatPrice(100)).toBe('100.00 ر.س');
    });

    it('should handle zero price', () => {
      expect(formatPrice(0, 'SAR')).toBe('0.00 ر.س');
    });

    it('should handle large prices', () => {
      expect(formatPrice(999999.99, 'SAR')).toBe('999999.99 ر.س');
    });

    it('should handle small prices', () => {
      expect(formatPrice(0.99, 'SAR')).toBe('0.99 ر.س');
    });

    it('should round to 2 decimal places', () => {
      expect(formatPrice(99.999, 'SAR')).toBe('100.00 ر.س');
      expect(formatPrice(99.991, 'SAR')).toBe('99.99 ر.س');
    });
  });

  describe('formatPriceCompact', () => {
    it('should format large prices with M notation', () => {
      expect(formatPriceCompact(1500000, 'SAR')).toBe('1.5M ر.س');
    });

    it('should format medium prices with K notation', () => {
      expect(formatPriceCompact(1500, 'SAR')).toBe('1.5K ر.س');
    });

    it('should format small prices normally', () => {
      expect(formatPriceCompact(99.99, 'SAR')).toBe('99.99 ر.س');
    });
  });

  describe('parsePrice', () => {
    it('should parse SAR price string', () => {
      expect(parsePrice('299.99 ر.س')).toBe(299.99);
    });

    it('should parse USD price string', () => {
      expect(parsePrice('$299.99')).toBe(299.99);
    });

    it('should handle invalid strings', () => {
      expect(parsePrice('invalid')).toBe(0);
    });

    it('should handle empty strings', () => {
      expect(parsePrice('')).toBe(0);
    });
  });
});

