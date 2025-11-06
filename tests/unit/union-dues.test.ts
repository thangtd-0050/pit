import { describe, it, expect } from 'vitest';
import { calculateUnionDues, calculateFinalNet } from '@/lib/union-dues';
import { UNION_DUES_RATE, UNION_DUES_MAX } from '@/config/constants';
import type { CalculationResult } from '@/types';

describe('union-dues', () => {
  describe('calculateUnionDues', () => {
    // T008: calculates 0.5% of insurance base (no cap)
    it('should calculate 0.5% of insurance base (no cap)', () => {
      const insuranceBase = 30_000_000; // 30M VND
      const result = calculateUnionDues(insuranceBase);

      expect(result.amount).toBe(150_000); // 30M × 0.5% = 150K
      expect(result.calculationBase).toBe(30_000_000);
      expect(result.cappedAtMax).toBe(false);
      expect(result.rate).toBe(UNION_DUES_RATE);
      expect(result.maxAmount).toBe(UNION_DUES_MAX);
    });

    // T009: caps at 234,000 VND for high salaries
    it('should cap at 234,000 VND for high salaries', () => {
      const insuranceBase = 58_500_000; // 58.5M VND
      const result = calculateUnionDues(insuranceBase);

      // 58.5M × 0.5% = 292.5K, but capped at 234K
      expect(result.amount).toBe(234_000);
      expect(result.calculationBase).toBe(58_500_000);
      expect(result.cappedAtMax).toBe(true);
      expect(result.rate).toBe(UNION_DUES_RATE);
      expect(result.maxAmount).toBe(UNION_DUES_MAX);
    });

    // T010: returns 0 for zero insurance base
    it('should return 0 for zero insurance base', () => {
      const insuranceBase = 0;
      const result = calculateUnionDues(insuranceBase);

      expect(result.amount).toBe(0);
      expect(result.calculationBase).toBe(0);
      expect(result.cappedAtMax).toBe(false);
    });

    // T011: throws error on negative insurance base
    it('should throw error on negative insurance base', () => {
      const insuranceBase = -1000;

      expect(() => calculateUnionDues(insuranceBase)).toThrow();
      expect(() => calculateUnionDues(insuranceBase)).toThrow(
        /insurance base.*negative/i
      );
    });

    // T012: includes all required fields in return object
    it('should include all required fields in return object', () => {
      const result = calculateUnionDues(20_000_000);

      expect(result).toHaveProperty('amount');
      expect(result).toHaveProperty('calculationBase');
      expect(result).toHaveProperty('cappedAtMax');
      expect(result).toHaveProperty('rate');
      expect(result).toHaveProperty('maxAmount');

      // Verify types
      expect(typeof result.amount).toBe('number');
      expect(typeof result.calculationBase).toBe('number');
      expect(typeof result.cappedAtMax).toBe('boolean');
      expect(typeof result.rate).toBe('number');
      expect(typeof result.maxAmount).toBe('number');
    });
  });

  describe('calculateFinalNet', () => {
    // T013: returns NET unchanged if no union dues
    it('should return NET unchanged if no union dues', () => {
      const result = {
        net: 24_000_000,
        unionDues: undefined,
      } as CalculationResult;

      const finalNet = calculateFinalNet(result);

      expect(finalNet).toBe(24_000_000);
    });

    // T014: subtracts union dues from NET
    it('should subtract union dues from NET', () => {
      const result = {
        net: 24_000_000,
        unionDues: {
          amount: 150_000,
          calculationBase: 30_000_000,
          cappedAtMax: false,
          rate: UNION_DUES_RATE,
          maxAmount: UNION_DUES_MAX,
        },
      } as CalculationResult;

      const finalNet = calculateFinalNet(result);

      expect(finalNet).toBe(23_850_000); // 24M - 150K
    });
  });
});

