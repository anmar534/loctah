/**
 * Tests for Date Formatter
 *
 * Tests date formatting logic
 */

import { formatDate, formatRelativeTime, formatTime, formatDatetimeLocal } from '../date.formatter';

describe('Date Formatter', () => {
  describe('formatDate', () => {
    it('should format date in default format (dd/MM/yyyy)', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('15/01/2024');
    });

    it('should format date in custom format', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date, 'yyyy-MM-dd')).toBe('2024-01-15');
    });

    it('should handle string dates', () => {
      expect(formatDate('2024-01-15')).toBe('15/01/2024');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format recent dates as relative time (Arabic)', () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const result = formatRelativeTime(fiveMinutesAgo);
      // Arabic output contains "دقائق" (minutes)
      expect(result).toContain('دقائق');
    });

    it('should format dates from hours ago (Arabic)', () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      const result = formatRelativeTime(twoHoursAgo);
      // Arabic output contains "ساعتين" (hours)
      expect(result).toContain('ساعتين');
    });

    it('should format dates from days ago (Arabic)', () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(threeDaysAgo);
      // Arabic output contains "أيام" (days)
      expect(result).toContain('أيام');
    });

    it('should handle string dates', () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
      const result = formatRelativeTime(fiveMinutesAgo);
      expect(result).toContain('دقائق');
    });
  });

  describe('formatTime', () => {
    it('should format time in 24-hour format', () => {
      const date = new Date('2024-01-15T14:30:00');
      expect(formatTime(date)).toBe('14:30');
    });

    it('should format time in 12-hour format', () => {
      const date = new Date('2024-01-15T14:30:00');
      const result = formatTime(date, false);
      expect(result).toContain('2:30');
      expect(result).toContain('PM');
    });
  });

  describe('formatDatetimeLocal', () => {
    it('should format datetime for input field', () => {
      const date = new Date('2024-01-15T14:30:00');
      expect(formatDatetimeLocal(date)).toBe('2024-01-15T14:30');
    });

    it('should handle string dates', () => {
      const result = formatDatetimeLocal('2024-01-15T14:30:00');
      expect(result).toBe('2024-01-15T14:30');
    });
  });
});

