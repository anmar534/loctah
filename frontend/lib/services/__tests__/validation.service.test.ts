/**
 * Tests for Validation Service
 *
 * Tests custom validation logic
 */

import {
  validateUrl,
  validateEmail,
  validateSaudiPhone,
  validateDateRange
} from '../validation.service';

describe('Validation Service', () => {
  describe('validateUrl', () => {
    it('should accept valid URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://example.com')).toBe(true);
      expect(validateUrl('https://example.com/path')).toBe(true);
    });

    it('should accept URLs with query parameters', () => {
      expect(validateUrl('https://example.com?param=value')).toBe(true);
    });

    it('should accept URLs with hash', () => {
      expect(validateUrl('https://example.com#section')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false);
      expect(validateUrl('')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should accept valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@example.com')).toBe(true);
      expect(validateEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validateSaudiPhone', () => {
    it('should accept valid Saudi phone numbers', () => {
      expect(validateSaudiPhone('0512345678')).toBe(true);
      expect(validateSaudiPhone('512345678')).toBe(true);
      expect(validateSaudiPhone('+966512345678')).toBe(true);
      expect(validateSaudiPhone('966512345678')).toBe(true);
    });

    it('should accept phone numbers with spaces', () => {
      expect(validateSaudiPhone('05 1234 5678')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validateSaudiPhone('1234567890')).toBe(false);
      expect(validateSaudiPhone('05123456')).toBe(false);
      expect(validateSaudiPhone('')).toBe(false);
    });
  });

  describe('validateDateRange', () => {
    it('should accept valid date ranges', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-12-31');
      const result = validateDateRange(start, end);
      expect(result.isValid).toBe(true);
    });

    it('should reject same start and end dates', () => {
      const date = new Date('2024-01-01');
      const result = validateDateRange(date, date);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('End date must be after start date');
    });

    it('should reject end date before start date', () => {
      const start = new Date('2024-12-31');
      const end = new Date('2024-01-01');
      const result = validateDateRange(start, end);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('End date must be after start date');
    });

    it('should reject invalid start date', () => {
      const validDate = new Date('2024-01-01');
      const invalidDate = new Date('invalid');
      const result = validateDateRange(invalidDate, validDate);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid start date');
    });

    it('should reject invalid end date', () => {
      const validDate = new Date('2024-01-01');
      const invalidDate = new Date('invalid');
      const result = validateDateRange(validDate, invalidDate);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid end date');
    });
  });
});

