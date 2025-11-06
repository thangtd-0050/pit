import { describe, it, expect } from 'vitest';
import { calculateUnionDues, calculateFinalNet } from '@/lib/union-dues';
import type { CalculationResult } from '@/types';

describe('union-dues contract tests', () => {
  describe('calculateUnionDues', () => {
    it('should exist and be a function', () => {
      expect(calculateUnionDues).toBeDefined();
      expect(typeof calculateUnionDues).toBe('function');
    });

    it('should accept number parameter and return UnionDues type', () => {
      const result = calculateUnionDues(30_000_000);

      // Verify return type structure
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('amount');
      expect(result).toHaveProperty('calculationBase');
      expect(result).toHaveProperty('cappedAtMax');
      expect(result).toHaveProperty('rate');
      expect(result).toHaveProperty('maxAmount');

      // Verify field types
      expect(typeof result.amount).toBe('number');
      expect(typeof result.calculationBase).toBe('number');
      expect(typeof result.cappedAtMax).toBe('boolean');
      expect(typeof result.rate).toBe('number');
      expect(typeof result.maxAmount).toBe('number');
    });
  });

  describe('calculateFinalNet', () => {
    it('should exist and be a function', () => {
      expect(calculateFinalNet).toBeDefined();
      expect(typeof calculateFinalNet).toBe('function');
    });

    it('should accept CalculationResult parameter and return number', () => {
      const mockResult = {
        net: 24_000_000,
      } as CalculationResult;

      const result = calculateFinalNet(mockResult);

      expect(typeof result).toBe('number');
    });
  });
});
