import type { RegionConfig, RegionId, Regime } from '@/types';

// ============================================================================
// Insurance Constants
// ============================================================================

/**
 * Base salary for Social Insurance (BHXH) and Health Insurance (BHYT) cap calculation.
 * Cap = 20 × BASE_SALARY = 46,800,000 VND
 */
export const BASE_SALARY = 2_340_000; // VND/month

/**
 * Social Insurance (BHXH) rate - Employee portion
 */
export const RATE_SI = 0.08; // 8%

/**
 * Health Insurance (BHYT) rate - Employee portion
 */
export const RATE_HI = 0.015; // 1.5%

/**
 * Unemployment Insurance (BHTN) rate - Employee portion
 */
export const RATE_UI = 0.01; // 1%

/**
 * Union dues rate - Trade union member contribution
 */
export const UNION_DUES_RATE = 0.005; // 0.5%

/**
 * Maximum union dues as ratio of base salary (10% of 2,340,000 VND)
 */
export const UNION_DUES_MAX_RATIO = 0.1;

/**
 * Maximum union dues amount (10% × BASE_SALARY = 234,000 VND)
 */
export const UNION_DUES_MAX = 234_000; // VND/month

/**
 * Default tax-exempt lunch allowance amount
 * Common value for Vietnamese companies (730,000 VND/month)
 *
 * @remarks
 * - Entire amount is tax-exempt (no threshold cap)
 * - Foreign companies may offer higher amounts (e.g., 1,500,000 VND)
 * - This is a default value only, users can customize the amount
 */
export const DEFAULT_LUNCH_ALLOWANCE = 730_000; // VND/month

// ============================================================================
// Regional Minimum Wages
// ============================================================================

/**
 * Regional minimum wages by region (VND/month).
 * Updated annually per government decree.
 */
export const REGIONAL_MINIMUMS: Record<RegionId, RegionConfig> = {
  I: { minWage: 4_960_000 }, // Region I: Hanoi, Ho Chi Minh City, major urban areas
  II: { minWage: 4_410_000 }, // Region II: Secondary cities, provincial capitals
  III: { minWage: 3_860_000 }, // Region III: Smaller cities and towns
  IV: { minWage: 3_450_000 }, // Region IV: Rural areas
};

// ============================================================================
// Tax Regimes
// ============================================================================

/**
 * Tax regime for 2024-2025 (current regime).
 * - Personal deduction: 11,000,000 VND
 * - Dependent deduction: 4,400,000 VND per dependent
 * - 7 progressive tax brackets from 5% to 35%
 */
export const REGIME_2025: Regime = {
  id: '2025',
  personalDeduction: 11_000_000,
  dependentDeduction: 4_400_000,
  brackets: [
    { threshold: 5_000_000, rate: 0.05 }, // 0-5M @ 5%
    { threshold: 10_000_000, rate: 0.1 }, // 5-10M @ 10%
    { threshold: 18_000_000, rate: 0.15 }, // 10-18M @ 15%
    { threshold: 32_000_000, rate: 0.2 }, // 18-32M @ 20%
    { threshold: 52_000_000, rate: 0.25 }, // 32-52M @ 25%
    { threshold: 80_000_000, rate: 0.3 }, // 52-80M @ 30%
    { threshold: 'inf', rate: 0.35 }, // >80M @ 35%
  ],
};

/**
 * Tax regime for 2026+ (proposed regime with higher deductions).
 * - Personal deduction: 15,500,000 VND
 * - Dependent deduction: 6,200,000 VND per dependent
 * - 5 progressive tax brackets: 5%, 15%, 25%, 30%, 35%
 *   - 0-10M: 5%
 *   - 10M-30M: 15%
 *   - 30M-60M: 25%
 *   - 60M-100M: 30%
 *   - >100M: 35%
 */
export const REGIME_2026: Regime = {
  id: '2026',
  personalDeduction: 15_500_000,
  dependentDeduction: 6_200_000,
  brackets: [
    { threshold: 10_000_000, rate: 0.05 }, // 0-10M @ 5%
    { threshold: 30_000_000, rate: 0.15 }, // 10-30M @ 15%
    { threshold: 60_000_000, rate: 0.25 }, // 30-60M @ 25%
    { threshold: 100_000_000, rate: 0.3 }, // 60-100M @ 30%
    { threshold: 'inf', rate: 0.35 }, // >100M @ 35%
  ],
};

// ============================================================================
// Cap Calculations (Derived Constants)
// ============================================================================

/**
 * Social Insurance and Health Insurance cap (20 × base salary).
 */
export const CAP_SI_HI = 20 * BASE_SALARY; // 46,800,000 VND

/**
 * Unemployment Insurance caps by region (20 × regional minimum wage).
 */
export const CAP_UI_BY_REGION: Record<RegionId, number> = {
  I: 20 * REGIONAL_MINIMUMS.I.minWage, // 99,200,000 VND
  II: 20 * REGIONAL_MINIMUMS.II.minWage, // 88,200,000 VND
  III: 20 * REGIONAL_MINIMUMS.III.minWage, // 77,200,000 VND
  IV: 20 * REGIONAL_MINIMUMS.IV.minWage, // 69,000,000 VND
};
