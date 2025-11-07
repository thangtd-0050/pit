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

  it('should reduce taxable income when lunch allowance is enabled', () => {
    const resultWithout = calcAll(mockInputs);
    const resultWith = calcAll(mockInputs, DEFAULT_LUNCH_ALLOWANCE);

    // Lunch allowance should be recorded
    expect(resultWith.lunchAllowance).toBe(DEFAULT_LUNCH_ALLOWANCE);

    // Taxable income should be LOWER (lunch allowance is tax-exempt)
    expect(resultWith.pit.taxable).toBe(resultWithout.pit.taxable - DEFAULT_LUNCH_ALLOWANCE);

    // Tax should be LOWER (less taxable income = less tax)
    expect(resultWith.pit.total).toBeLessThan(resultWithout.pit.total);

    // NET should be HIGHER (less tax paid)
    expect(resultWith.net).toBeGreaterThan(resultWithout.net);
    
    // finalNet should equal net (lunch allowance already accounted for)
    expect(resultWith.finalNet).toBe(resultWith.net);
  });

  it('should handle zero lunch allowance', () => {
    const resultWithout = calcAll(mockInputs);
    const resultWithZero = calcAll(mockInputs, 0);

    expect(resultWithZero.lunchAllowance).toBe(0);
    
    // Zero lunch allowance should have same effect as no lunch allowance
    expect(resultWithZero.pit.taxable).toBe(resultWithout.pit.taxable);
    expect(resultWithZero.pit.total).toBe(resultWithout.pit.total);
    expect(resultWithZero.net).toBe(resultWithout.net);
    expect(resultWithZero.finalNet).toBe(resultWithout.finalNet);
  });

  it('should work with union dues and lunch allowance together', () => {
    const unionMemberInputs = { ...mockInputs, isUnionMember: true };
    const resultWithout = calcAll(unionMemberInputs); // No lunch allowance
    const resultWith = calcAll(unionMemberInputs, DEFAULT_LUNCH_ALLOWANCE);

    expect(resultWith.unionDues).toBeDefined();
    expect(resultWith.lunchAllowance).toBe(DEFAULT_LUNCH_ALLOWANCE);

    // Lunch allowance should reduce taxable income
    expect(resultWith.pit.taxable).toBe(resultWithout.pit.taxable - DEFAULT_LUNCH_ALLOWANCE);
    
    // NET should be higher (less tax)
    expect(resultWith.net).toBeGreaterThan(resultWithout.net);

    // finalNet = net - unionDues (lunch allowance already in net via tax savings)
    const expectedFinalNet = resultWith.net - (resultWith.unionDues?.amount ?? 0);
    expect(resultWith.finalNet).toBe(expectedFinalNet);
  });

  it('should handle very large lunch allowance amounts', () => {
    const largeAmount = 10_000_000;
    const resultWithout = calcAll(mockInputs);
    const resultWith = calcAll(mockInputs, largeAmount);

    expect(resultWith.lunchAllowance).toBe(largeAmount);
    
    // Large lunch allowance significantly reduces taxable income
    expect(resultWith.pit.taxable).toBe(
      Math.max(0, resultWithout.pit.taxable - largeAmount)
    );
    
    // Tax should be much lower
    expect(resultWith.pit.total).toBeLessThan(resultWithout.pit.total);
    
    // NET should be higher
    expect(resultWith.net).toBeGreaterThan(resultWithout.net);
  });

  it('should verify lunch allowance REDUCES taxable income (tax-exempt income)', () => {
    const resultWithoutAllowance = calcAll(mockInputs);
    const resultWithAllowance = calcAll(mockInputs, DEFAULT_LUNCH_ALLOWANCE);

    // Taxable income should be LOWER by lunch allowance amount
    expect(resultWithAllowance.pit.taxable).toBe(
      resultWithoutAllowance.pit.taxable - DEFAULT_LUNCH_ALLOWANCE
    );

    // Tax should be LOWER (progressive tax on lower taxable income)
    expect(resultWithAllowance.pit.total).toBeLessThan(resultWithoutAllowance.pit.total);

    // NET should be HIGHER (tax savings)
    expect(resultWithAllowance.net).toBeGreaterThan(resultWithoutAllowance.net);

    // The tax savings should approximately equal lunch allowance × tax rate
    const taxSavings = resultWithoutAllowance.pit.total - resultWithAllowance.pit.total;
    const netIncrease = resultWithAllowance.net - resultWithoutAllowance.net;
    
    // Net increase should equal tax savings
    expect(netIncrease).toBe(taxSavings);
  });
});
