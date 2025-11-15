import { describe, it, expect, vi } from 'vitest';
import { formatRelativeTime, formatDate, formatNumber } from '../format';

describe('format utilities', () => {
  describe('formatRelativeTime', () => {
    it('formats time relative to now', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const result = formatRelativeTime(oneHourAgo.toISOString());
      expect(result).toContain('hour');
    });

    it('handles invalid date strings', () => {
      const result = formatRelativeTime('invalid-date');
      expect(result).toBe('unknown time');
    });

    it('handles null input', () => {
      const result = formatRelativeTime(null);
      // null gets converted to invalid date, should return 'unknown time'
      expect(result).toBe('unknown time');
    });
  });

  describe('formatDate', () => {
    it('formats date with default format', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDate(date.toISOString());

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('formats date with custom format', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDate(date.toISOString(), 'yyyy-MM-dd');

      expect(result).toContain('2024');
      expect(result).toContain('01');
      expect(result).toContain('15');
    });

    it('handles invalid date strings', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('unknown date');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers less than 1000 as-is', () => {
      expect(formatNumber(42)).toBe('42');
      expect(formatNumber(999)).toBe('999');
    });

    it('formats numbers >= 1000 with K suffix', () => {
      expect(formatNumber(1000)).toBe('1.0K');
      expect(formatNumber(1500)).toBe('1.5K');
      expect(formatNumber(9999)).toBe('10.0K');
    });

    it('formats numbers >= 1000000 with M suffix', () => {
      expect(formatNumber(1000000)).toBe('1.0M');
      expect(formatNumber(1500000)).toBe('1.5M');
      expect(formatNumber(2500000)).toBe('2.5M');
    });

    it('handles zero', () => {
      expect(formatNumber(0)).toBe('0');
    });

    it('handles negative numbers', () => {
      // formatNumber doesn't handle negatives with K/M suffixes - this is expected behavior
      expect(formatNumber(-1000)).toBe('-1000');
      expect(formatNumber(-1000000)).toBe('-1000000');
    });
  });
});

