import { describe, expect, it } from 'vitest';
import type { CalculationResult } from '@/types';

describe('Lunch Allowance Type Contracts', () => {
  it('CalculationResult should accept optional lunchAllowance field', () => {
    // Test with lunchAllowance undefined (disabled)
    const result1: CalculationResult = {
      inputs: {
        gross: 30_000_000,
        dependents: 0,
        region: 'I',
        regime: {
          id: '2025',
          personalDeduction: 11_000_000,
          dependentDeduction: 4_400_000,
          brackets: [],
        },
      },
      insurance: {
        bases: { baseSIHI: 30_000_000, baseUI: 30_000_000 },
        si: 2_400_000,
        hi: 450_000,
        ui: 300_000,
        total: 3_150_000,
      },
      deductions: {
        personal: 11_000_000,
        dependents: 0,
        insurance: 3_150_000,
        total: 14_150_000,
      },
      pit: {
        taxable: 15_850_000,
        items: [],
        total: 2_777_500,
      },
      net: 24_072_500,
      lunchAllowance: undefined, // Disabled
      finalNet: 24_072_500,
    };

    // Test with lunchAllowance enabled with default value
    const result2: CalculationResult = {
      inputs: {
        gross: 30_000_000,
        dependents: 0,
        region: 'I',
        regime: {
          id: '2025',
          personalDeduction: 11_000_000,
          dependentDeduction: 4_400_000,
          brackets: [],
        },
      },
      insurance: {
        bases: { baseSIHI: 30_000_000, baseUI: 30_000_000 },
        si: 2_400_000,
        hi: 450_000,
        ui: 300_000,
        total: 3_150_000,
      },
      deductions: {
        personal: 11_000_000,
        dependents: 0,
        insurance: 3_150_000,
        total: 14_150_000,
      },
      pit: {
        taxable: 15_850_000,
        items: [],
        total: 2_777_500,
      },
      net: 24_072_500,
      lunchAllowance: 730_000, // Enabled with default
      finalNet: 24_802_500, // net + lunchAllowance
    };

    expect(result1.lunchAllowance).toBeUndefined();
    expect(result2.lunchAllowance).toBe(730_000);
    expect(result2.finalNet).toBe(result2.net + 730_000);
  });

  it('should allow CalculationResult without lunchAllowance field', () => {
    // Test that lunchAllowance is truly optional - can omit the field entirely
    const result: CalculationResult = {
      inputs: {
        gross: 30_000_000,
        dependents: 0,
        region: 'I',
        regime: {
          id: '2025',
          personalDeduction: 11_000_000,
          dependentDeduction: 4_400_000,
          brackets: [],
        },
      },
      insurance: {
        bases: { baseSIHI: 30_000_000, baseUI: 30_000_000 },
        si: 2_400_000,
        hi: 450_000,
        ui: 300_000,
        total: 3_150_000,
      },
      deductions: {
        personal: 11_000_000,
        dependents: 0,
        insurance: 3_150_000,
        total: 14_150_000,
      },
      pit: {
        taxable: 15_850_000,
        items: [],
        total: 2_777_500,
      },
      net: 24_072_500,
      finalNet: 24_072_500,
      // lunchAllowance intentionally omitted
    };

    expect(result.lunchAllowance).toBeUndefined();
  });
});
