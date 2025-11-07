import { describe, expect, it } from 'vitest';
import { calcAll } from '@/lib/tax';
import { REGIME_2025, DEFAULT_LUNCH_ALLOWANCE } from '@/config/constants';
import type { CalculatorInputs } from '@/types';

describe('Lunch Allowance Calculation', () => {
  const mockInputs: CalculatorInputs = {
    gross: 30_000_000,
    dependents: 0,
    region: 'I',
    regime: REGIME_2025,
  };

  it('should return undefined when lunch allowance is disabled', () => {
    const result = calcAll(mockInputs);

    expect(result.lunchAllowance).toBeUndefined();
  });

  it('should add default lunch allowance (730K) to final NET when enabled', () => {
    const result = calcAll(mockInputs, DEFAULT_LUNCH_ALLOWANCE);

    expect(result.lunchAllowance).toBe(DEFAULT_LUNCH_ALLOWANCE);
    expect(result.finalNet).toBe(result.net + DEFAULT_LUNCH_ALLOWANCE);
  });

  it('should handle zero lunch allowance', () => {
    const result = calcAll(mockInputs, 0);

    expect(result.lunchAllowance).toBe(0);
    expect(result.finalNet).toBe(result.net);
  });

  it('should work with union dues and lunch allowance together', () => {
    const unionMemberInputs = { ...mockInputs, isUnionMember: true };
    const result = calcAll(unionMemberInputs, DEFAULT_LUNCH_ALLOWANCE);

    expect(result.unionDues).toBeDefined();
    expect(result.lunchAllowance).toBe(DEFAULT_LUNCH_ALLOWANCE);

    // finalNet should be: net - unionDues + lunchAllowance
    const expectedFinalNet = result.net - (result.unionDues?.amount ?? 0) + DEFAULT_LUNCH_ALLOWANCE;
    expect(result.finalNet).toBe(expectedFinalNet);
  });

  it('should handle very large lunch allowance amounts', () => {
    const largeAmount = 10_000_000;
    const result = calcAll(mockInputs, largeAmount);

    expect(result.lunchAllowance).toBe(largeAmount);
    expect(result.finalNet).toBe(result.net + largeAmount);
  });

  it('should verify lunch allowance does NOT affect gross taxable income', () => {
    const resultWithoutAllowance = calcAll(mockInputs);
    const resultWithAllowance = calcAll(mockInputs, DEFAULT_LUNCH_ALLOWANCE);

    // Taxable income should be identical
    expect(resultWithAllowance.pit.taxable).toBe(resultWithoutAllowance.pit.taxable);

    // Tax should be identical
    expect(resultWithAllowance.pit.total).toBe(resultWithoutAllowance.pit.total);

    // NET before lunch allowance should be identical
    expect(resultWithAllowance.net).toBe(resultWithoutAllowance.net);

    // Only finalNet should differ
    expect(resultWithAllowance.finalNet).toBe(resultWithoutAllowance.net + DEFAULT_LUNCH_ALLOWANCE);
  });
});
