import { describe, it, expect } from 'vitest';
import { compareRegimes } from '@/lib/tax';
import { REGIME_2025, REGIME_2026 } from '@/config/constants';
import type { CalculatorInputs } from '@/types';

describe('compareRegimes', () => {
  describe('delta calculations', () => {
    it('should calculate deltas correctly for 30M gross, 2 deps, Region I', () => {
      const inputs: Omit<CalculatorInputs, 'regime'> = {
        gross: 30_000_000,
        dependents: 2,
        region: 'I',
      };

      const result = compareRegimes(inputs);

      // 2026 has higher personal deduction (15.5M vs 11M) = +4.5M delta
      expect(result.deltas.personalDeduction).toBe(4_500_000);

      // 2026 has higher dependent deduction (6.2M vs 4.4M per dep) = +1.8M per dep * 2 = +3.6M delta
      expect(result.deltas.dependentDeduction).toBe(3_600_000);

      // 2026 has higher total deductions
      expect(result.deltas.totalDeductions).toBe(8_100_000);

      // Insurance should be identical (same gross, same formulas)
      expect(result.deltas.insurance).toBe(0);

      // 2026 has lower taxable income (higher deductions)
      expect(result.deltas.taxableIncome).toBeLessThan(0);

      // 2026 should have lower PIT (less taxable income)
      expect(result.deltas.pit).toBeLessThan(0);

      // 2026 should have higher NET salary (less tax)
      expect(result.deltas.netSalary).toBeGreaterThan(0);
    });

    it('should calculate deltas for 10M gross (low income)', () => {
      const inputs: Omit<CalculatorInputs, 'regime'> = {
        gross: 10_000_000,
        dependents: 0,
        region: 'I',
      };

      const result = compareRegimes(inputs);

      // Personal deduction delta
      expect(result.deltas.personalDeduction).toBe(4_500_000);

      // No dependents
      expect(result.deltas.dependentDeduction).toBe(0);

      // At low income, 2026 may result in no tax at all
      expect(result.deltas.pit).toBeLessThanOrEqual(0);
      expect(result.deltas.netSalary).toBeGreaterThanOrEqual(0);
    });

    it('should calculate deltas for 100M gross (high income)', () => {
      const inputs: Omit<CalculatorInputs, 'regime'> = {
        gross: 100_000_000,
        dependents: 5,
        region: 'I',
      };

      const result = compareRegimes(inputs);

      // Higher deductions in 2026
      expect(result.deltas.personalDeduction).toBe(4_500_000);
      expect(result.deltas.dependentDeduction).toBe(9_000_000); // 1.8M * 5

      // At high income, 2026 saves significant tax
      expect(result.deltas.pit).toBeLessThan(0);
      expect(result.deltas.netSalary).toBeGreaterThan(0);
    });

    it('should calculate deltas for 185M gross (very high income)', () => {
      const inputs: Omit<CalculatorInputs, 'regime'> = {
        gross: 185_000_000,
        dependents: 2,
        region: 'IV',
      };

      const result = compareRegimes(inputs);

      // Even at very high income, deductions still help
      expect(result.deltas.personalDeduction).toBe(4_500_000);
      expect(result.deltas.dependentDeduction).toBe(3_600_000);

      // PIT reduction
      expect(result.deltas.pit).toBeLessThan(0);
      expect(result.deltas.netSalary).toBeGreaterThan(0);
    });

    it('should handle positive NET delta (2026 is better)', () => {
      const inputs: Omit<CalculatorInputs, 'regime'> = {
        gross: 60_000_000,
        dependents: 3,
        region: 'II',
      };

      const result = compareRegimes(inputs);

      // 2026 should be better (positive delta)
      expect(result.deltas.netSalary).toBeGreaterThan(0);

      // Both results should be valid
      expect(result.regime2025.net).toBeGreaterThan(0);
      expect(result.regime2026.net).toBeGreaterThan(0);

      // Delta should match difference
      const calculatedDelta = result.regime2026.net - result.regime2025.net;
      expect(result.deltas.netSalary).toBe(calculatedDelta);
    });

    it('should have identical insurance amounts (no delta)', () => {
      const inputs: Omit<CalculatorInputs, 'regime'> = {
        gross: 45_000_000,
        dependents: 1,
        region: 'III',
      };

      const result = compareRegimes(inputs);

      // Insurance formulas are identical between regimes
      expect(result.regime2025.insurance.total).toBe(
        result.regime2026.insurance.total
      );
      expect(result.deltas.insurance).toBe(0);
    });

    it('should work with custom insurance base', () => {
      const inputs: Omit<CalculatorInputs, 'regime'> = {
        gross: 50_000_000,
        dependents: 2,
        region: 'I',
        insuranceBase: 30_000_000,
      };

      const result = compareRegimes(inputs);

      // Custom base should be used in both regimes
      expect(result.regime2025.insurance.bases.baseSIHI).toBeLessThanOrEqual(
        46_800_000
      );
      expect(result.regime2026.insurance.bases.baseSIHI).toBe(
        result.regime2025.insurance.bases.baseSIHI
      );

      // Insurance should still be identical
      expect(result.deltas.insurance).toBe(0);

      // But NET delta should still exist due to tax differences
      expect(result.deltas.netSalary).not.toBe(0);
    });

    it('should calculate all deltas with correct signs', () => {
      const inputs: Omit<CalculatorInputs, 'regime'> = {
        gross: 75_000_000,
        dependents: 4,
        region: 'I',
      };

      const result = compareRegimes(inputs);

      // Positive deltas (2026 > 2025)
      expect(result.deltas.personalDeduction).toBeGreaterThan(0);
      expect(result.deltas.dependentDeduction).toBeGreaterThan(0);
      expect(result.deltas.totalDeductions).toBeGreaterThan(0);
      expect(result.deltas.netSalary).toBeGreaterThan(0);

      // Zero delta (insurance identical)
      expect(result.deltas.insurance).toBe(0);

      // Negative deltas (2026 < 2025, i.e., lower tax)
      expect(result.deltas.taxableIncome).toBeLessThan(0); // Lower taxable = negative delta
      expect(result.deltas.pit).toBeLessThan(0); // Lower PIT = negative delta
    });
  });

  describe('regime results', () => {
    it('should return complete calculation for both regimes', () => {
      const inputs: Omit<CalculatorInputs, 'regime'> = {
        gross: 40_000_000,
        dependents: 1,
        region: 'II',
      };

      const result = compareRegimes(inputs);

      // Both regimes should have complete results
      expect(result.regime2025).toHaveProperty('inputs');
      expect(result.regime2025).toHaveProperty('insurance');
      expect(result.regime2025).toHaveProperty('deductions');
      expect(result.regime2025).toHaveProperty('pit');
      expect(result.regime2025).toHaveProperty('net');

      expect(result.regime2026).toHaveProperty('inputs');
      expect(result.regime2026).toHaveProperty('insurance');
      expect(result.regime2026).toHaveProperty('deductions');
      expect(result.regime2026).toHaveProperty('pit');
      expect(result.regime2026).toHaveProperty('net');

      // Gross should be identical
      expect(result.regime2025.inputs.gross).toBe(inputs.gross);
      expect(result.regime2026.inputs.gross).toBe(inputs.gross);
    });

    it('should use REGIME_2025 constants for 2025 calculation', () => {
      const inputs: Omit<CalculatorInputs, 'regime'> = {
        gross: 30_000_000,
        dependents: 2,
        region: 'I',
      };

      const result = compareRegimes(inputs);

      // 2025 should use 11M personal deduction
      expect(result.regime2025.deductions.personal).toBe(
        REGIME_2025.personalDeduction
      );

      // 2025 should use 4.4M per dependent
      expect(result.regime2025.deductions.dependents).toBe(
        REGIME_2025.dependentDeduction * 2
      );
    });

    it('should use REGIME_2026 constants for 2026 calculation', () => {
      const inputs: Omit<CalculatorInputs, 'regime'> = {
        gross: 30_000_000,
        dependents: 2,
        region: 'I',
      };

      const result = compareRegimes(inputs);

      // 2026 should use 15.5M personal deduction
      expect(result.regime2026.deductions.personal).toBe(
        REGIME_2026.personalDeduction
      );

      // 2026 should use 6.2M per dependent
      expect(result.regime2026.deductions.dependents).toBe(
        REGIME_2026.dependentDeduction * 2
      );
    });
  });

  describe('edge cases', () => {
    it('should handle zero gross', () => {
      const inputs: Omit<CalculatorInputs, 'regime'> = {
        gross: 0,
        dependents: 0,
        region: 'I',
      };

      const result = compareRegimes(inputs);

      // With gross=0, insurance is still calculated on regional minimum floor
      // NET will be negative (0 - insurance)
      expect(result.regime2025.net).toBeLessThan(0);
      expect(result.regime2026.net).toBeLessThan(0);

      // Insurance deltas should be zero (same formula both regimes)
      expect(result.deltas.insurance).toBe(0);
      
      // PIT should be zero (no taxable income)
      expect(result.deltas.pit).toBe(0);
      
      // NET delta should be zero (both negative by same amount)
      expect(result.deltas.netSalary).toBe(0);
    });

    it('should handle all regions consistently', () => {
      const baseInputs: Omit<CalculatorInputs, 'region'> = {
        gross: 50_000_000,
        dependents: 2,
      };

      const regions: Array<'I' | 'II' | 'III' | 'IV'> = ['I', 'II', 'III', 'IV'];

      regions.forEach((region) => {
        const result = compareRegimes({ ...baseInputs, region });

        // Tax deltas should be consistent regardless of region
        expect(result.deltas.personalDeduction).toBe(4_500_000);
        expect(result.deltas.dependentDeduction).toBe(3_600_000);

        // NET delta should always be positive (2026 better)
        expect(result.deltas.netSalary).toBeGreaterThan(0);
      });
    });
  });
});
