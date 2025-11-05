import { describe, it, expect } from 'vitest';
import { formatNumber, sanitizeNumericInput } from '@/lib/format';

describe('formatNumber', () => {
  it('should format with en-US locale', () => {
    expect(formatNumber(1234567, 'en-US')).toBe('1,234,567');
    expect(formatNumber(1000000, 'en-US')).toBe('1,000,000');
    expect(formatNumber(100, 'en-US')).toBe('100');
  });

  it('should format with vi-VN locale', () => {
    expect(formatNumber(1234567, 'vi-VN')).toBe('1.234.567');
    expect(formatNumber(1000000, 'vi-VN')).toBe('1.000.000');
    expect(formatNumber(100, 'vi-VN')).toBe('100');
  });

  it('should handle large numbers', () => {
    expect(formatNumber(185_000_000, 'en-US')).toBe('185,000,000');
    expect(formatNumber(185_000_000, 'vi-VN')).toBe('185.000.000');
  });

  it('should handle zero', () => {
    expect(formatNumber(0, 'en-US')).toBe('0');
    expect(formatNumber(0, 'vi-VN')).toBe('0');
  });

  it('should format without decimals', () => {
    expect(formatNumber(1234.56, 'en-US')).toBe('1,235'); // Rounded
    expect(formatNumber(9999.99, 'vi-VN')).toBe('10.000'); // Rounded
  });
});

describe('sanitizeNumericInput', () => {
  it('should handle comma-separated numbers', () => {
    expect(sanitizeNumericInput('1,234,567')).toBe(1234567);
    expect(sanitizeNumericInput('30,000,000')).toBe(30000000);
  });

  it('should handle dot-separated numbers', () => {
    expect(sanitizeNumericInput('1.234.567')).toBe(1234567);
    expect(sanitizeNumericInput('30.000.000')).toBe(30000000);
  });

  it('should handle underscore-separated numbers', () => {
    expect(sanitizeNumericInput('1_234_567')).toBe(1234567);
    expect(sanitizeNumericInput('30_000_000')).toBe(30000000);
  });

  it('should handle space-separated numbers', () => {
    expect(sanitizeNumericInput('1 234 567')).toBe(1234567);
    expect(sanitizeNumericInput('30 000 000')).toBe(30000000);
  });

  it('should handle plain numeric strings', () => {
    expect(sanitizeNumericInput('1234567')).toBe(1234567);
    expect(sanitizeNumericInput('30000000')).toBe(30000000);
  });

  it('should handle empty string', () => {
    expect(sanitizeNumericInput('')).toBe(0);
    expect(sanitizeNumericInput('   ')).toBe(0);
  });

  it('should handle non-numeric strings', () => {
    expect(sanitizeNumericInput('abc')).toBe(0);
    expect(sanitizeNumericInput('12abc34')).toBe(1234); // Extracts digits only
  });

  it('should handle mixed separators', () => {
    expect(sanitizeNumericInput('1,234.567')).toBe(1234567);
    expect(sanitizeNumericInput('30 000,000')).toBe(30000000);
  });
});
