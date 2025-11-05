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

/**
 * Format calculation result as Vietnamese text for clipboard.
 * Creates a human-readable summary of the calculation with all details.
 *
 * @param result - Complete calculation result
 * @param inputs - Calculator inputs used for the calculation
 * @returns Formatted Vietnamese text ready for clipboard
 *
 * @example
 * const text = copyDetailsToClipboard(result, { gross: 30_000_000, dependents: 2, region: 'I', regime: REGIME_2025 });
 * // Returns multi-line formatted text
 */
export async function copyDetailsToClipboard(
  result: import('@/types').CalculationResult,
  inputs: {
    gross: number;
    dependents: number;
    region: string;
    regime: import('@/types').Regime;
  }
): Promise<void> {
  const locale = 'vi-VN'; // Always use Vietnamese format for clipboard

  const text = `
TÍNH LƯƠNG NET TỪ GROSS
======================

THÔNG TIN ĐẦU VÀO
------------------
Lương Gross: ${formatNumber(inputs.gross, locale)} VND
Số người phụ thuộc: ${inputs.dependents}
Vùng: ${inputs.region}
Chế độ: ${inputs.regime.id}

BẢO HIỂM BẮT BUỘC
------------------
Cơ sở đóng BHXH, BHYT: ${formatNumber(result.insurance.bases.baseSIHI, locale)} VND
Cơ sở đóng BHTN: ${formatNumber(result.insurance.bases.baseUI, locale)} VND

BHXH (8%): ${formatNumber(result.insurance.si, locale)} VND
BHYT (1.5%): ${formatNumber(result.insurance.hi, locale)} VND
BHTN (1%): ${formatNumber(result.insurance.ui, locale)} VND
Tổng bảo hiểm: ${formatNumber(result.insurance.total, locale)} VND

CÁC KHOẢN GIẢM TRỪ
------------------
Giảm trừ bản thân: ${formatNumber(result.deductions.personal, locale)} VND
Giảm trừ người phụ thuộc: ${formatNumber(result.deductions.dependents, locale)} VND (${formatNumber(inputs.regime.dependentDeduction, locale)} VND × ${inputs.dependents})
Tổng giảm trừ: ${formatNumber(result.deductions.total, locale)} VND

THUẾ THU NHẬP CÁ NHÂN
---------------------
Thu nhập tính thuế: ${formatNumber(result.pit.taxable, locale)} VND
Thuế TNCN: ${formatNumber(result.pit.total, locale)} VND

KẾT QUẢ CUỐI CÙNG
-----------------
💰 LƯƠNG NET: ${formatNumber(result.net, locale)} VND

---
Được tính bởi: Công cụ Tính Lương NET từ Gross
`.trim();

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback for browsers that don't support clipboard API
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    // Re-throw if both methods fail
    if (!document.queryCommandSupported('copy')) {
      throw new Error('Clipboard API not supported');
    }
  }
}
