import type { UnionDues, CalculationResult } from '@/types';
import { UNION_DUES_RATE, UNION_DUES_MAX } from '@/config/constants';

/**
 * Calculate union dues for a trade union member.
 *
 * Union dues = 0.5% of social insurance base, capped at 234,000 VND/month.
 * This is a statutory contribution separate from tax and insurance calculations.
 *
 * @param insuranceBase - Social insurance base in VND (from CalculationResult.insurance.bases.baseSIHI)
 * @returns UnionDues object with calculation details
 * @throws Error if insuranceBase is negative
 *
 * @example
 * ```typescript
 * // Normal case: 30M insurance base → 150K union dues
 * const dues = calculateUnionDues(30_000_000);
 * // { amount: 150000, calculationBase: 30000000, cappedAtMax: false, ... }
 *
 * // Capped case: 58.5M insurance base → 234K union dues (cap applied)
 * const duesHigh = calculateUnionDues(58_500_000);
 * // { amount: 234000, calculationBase: 58500000, cappedAtMax: true, ... }
 * ```
 */
export function calculateUnionDues(insuranceBase: number): UnionDues {
  // Validation: insurance base cannot be negative
  if (insuranceBase < 0) {
    throw new Error('Insurance base cannot be negative');
  }

  // Calculate union dues: 0.5% of insurance base
  const calculated = insuranceBase * UNION_DUES_RATE;

  // Apply cap: maximum 234,000 VND
  const amount = Math.min(calculated, UNION_DUES_MAX);

  // Check if cap was applied
  const cappedAtMax = calculated > UNION_DUES_MAX;

  return {
    amount,
    calculationBase: insuranceBase,
    cappedAtMax,
    rate: UNION_DUES_RATE,
    maxAmount: UNION_DUES_MAX,
  };
}

/**
 * Calculate final take-home pay after union dues deduction.
 *
 * @param result - Original calculation result with NET salary
 * @returns Final NET after union dues deduction (if applicable)
 *
 * @example
 * ```typescript
 * // Non-union member: final NET = NET
 * const result = { net: 24_000_000, unionDues: undefined };
 * const finalNet = calculateFinalNet(result); // 24000000
 *
 * // Union member: final NET = NET - union dues
 * const resultWithDues = {
 *   net: 24_000_000,
 *   unionDues: { amount: 150_000, ... }
 * };
 * const finalNet2 = calculateFinalNet(resultWithDues); // 23850000
 * ```
 */
export function calculateFinalNet(result: CalculationResult): number {
  // If no union dues, return NET as-is
  if (!result.unionDues) {
    return result.net;
  }

  // Subtract union dues from NET
  return result.net - result.unionDues.amount;
}
