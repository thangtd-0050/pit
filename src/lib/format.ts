/**
 * Format a number with locale-specific thousand separators.
 * @param amount - The number to format
 * @param locale - Locale for formatting ('en-US' or 'vi-VN')
 * @returns Formatted string with thousand separators, no decimals
 *
 * @example
 * formatNumber(1234567, 'en-US') // → "1,234,567"
 * formatNumber(1234567, 'vi-VN') // → "1.234.567"
 */
export function formatNumber(amount: number, locale: 'en-US' | 'vi-VN'): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Sanitize numeric input by removing non-digits and parsing to integer.
 * Handles various separator formats: commas, dots, underscores, spaces.
 * @param input - User input string
 * @returns Parsed integer, or 0 if invalid
 *
 * @example
 * sanitizeNumericInput('1,234,567') // → 1234567
 * sanitizeNumericInput('1.234.567') // → 1234567
 * sanitizeNumericInput('1_234_567') // → 1234567
 * sanitizeNumericInput('1 234 567') // → 1234567
 * sanitizeNumericInput('abc') // → 0
 */
export function sanitizeNumericInput(input: string): number {
  // Remove all non-digit characters
  const digitsOnly = input.replace(/\D/g, '');

  // Parse to integer, return 0 if empty or invalid
  const parsed = parseInt(digitsOnly, 10);
  return isNaN(parsed) ? 0 : parsed;
}
