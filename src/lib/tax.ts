import type {
  InsuranceBases,
  Insurance,
  PIT,
  PITItem,
  CalculatorInputs,
  CalculationResult,
  ComparisonResult,
  Deductions,
  Regime,
} from '@/types';
import {
  REGIONAL_MINIMUMS,
  BASE_SALARY,
  RATE_SI,
  RATE_HI,
  RATE_UI,
  REGIME_2025,
  REGIME_2026,
} from '@/config/constants';
import { calculateUnionDues, calculateFinalNet } from '@/lib/union-dues';

/**
 * Clamp a value between a minimum and maximum.
 * @param value - The number to clamp
 * @param min - Minimum bound (inclusive)
 * @param max - Maximum bound (inclusive)
 * @returns The clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

/**
 * Round a number to the nearest integer VND (no decimals).
 * @param amount - The monetary amount to round
 * @returns Rounded integer using standard rounding
 */
export function roundVnd(amount: number): number {
  return Math.round(amount);
}

/**
 * Calculate clamped insurance contribution bases for SI/HI and UI.
 *
 * Vietnamese social insurance law requires contribution bases to be clamped:
 * - FLOOR: Must be at least the regional minimum wage
 * - CAP: Cannot exceed legal maximum (20x base salary for SI/HI, 20x regional min for UI)
 *
 * This prevents very low salaries from underpaying and very high salaries from overpaying.
 *
 * Example (Region I, regionalMin = 4,960,000):
 *   - Gross = 3M → baseSIHI = 4,960,000 (clamped to floor)
 *   - Gross = 30M → baseSIHI = 30,000,000 (within range)
 *   - Gross = 100M → baseSIHI = 46,800,000 (clamped to cap)
 *
 * @param gross - Gross monthly salary (VND)
 * @param regionalMin - Regional minimum wage (VND)
 * @param baseSalary - Base salary constant for SI/HI cap (2,340,000 VND)
 * @param insuranceBase - Optional custom insurance base (VND). Defaults to gross if undefined.
 * @returns InsuranceBases object with baseSIHI and baseUI
 */
export function calcInsuranceBases(
  gross: number,
  regionalMin: number,
  baseSalary: number,
  insuranceBase?: number
): InsuranceBases {
  // Use custom base if provided, otherwise default to gross salary
  const base = insuranceBase ?? gross;

  // Calculate caps according to Vietnamese law
  const capSIHI = 20 * baseSalary; // 20 × 2,340,000 = 46,800,000 VND
  const capUI = 20 * regionalMin; // 20 × regional minimum (varies by region)

  // Apply floor and cap constraints using clamp function
  // clamp(value, min, max) ensures: regionalMin ≤ base ≤ cap
  return {
    baseSIHI: clamp(base, regionalMin, capSIHI), // For Social & Health Insurance
    baseUI: clamp(base, regionalMin, capUI),     // For Unemployment Insurance
  };
}

/**
 * Calculate insurance contributions (SI, HI, UI) from bases.
 * @param bases - Insurance bases object from calcInsuranceBases()
 * @returns Insurance object with si, hi, ui, and total
 */
export function calcInsurance(bases: InsuranceBases): Insurance {
  const si = roundVnd(bases.baseSIHI * RATE_SI); // 8%
  const hi = roundVnd(bases.baseSIHI * RATE_HI); // 1.5%
  const ui = roundVnd(bases.baseUI * RATE_UI); // 1%

  return {
    bases,
    si,
    hi,
    ui,
    total: si + hi + ui,
  };
}

/**
 * Calculate progressive Personal Income Tax from taxable income.
 * @param taxable - Taxable income after deductions (VND)
 * @param regime - Tax regime (2025 or 2026)
 * @returns PIT object with taxable, items (bracket breakdown), and total
 */
export function calcPit(taxable: number, regime: Regime): PIT {
  // Handle non-positive taxable income
  if (taxable <= 0) {
    return {
      taxable: Math.max(0, taxable),
      items: [],
      total: 0,
    };
  }

  const items: PITItem[] = [];
  let remaining = taxable; // Track remaining income to be taxed
  let prevThreshold = 0; // Track previous bracket's upper bound

  // Progressive tax calculation: iterate through tax brackets from lowest to highest
  // Each bracket taxes only the income within that bracket's range
  // Example: If taxable = 100M with brackets [0-5M: 5%], [5M-10M: 10%], [10M+: 15%]
  //   - First 5M taxed at 5% = 250K
  //   - Next 5M (5M-10M) taxed at 10% = 500K
  //   - Remaining 90M taxed at 15% = 13.5M
  //   - Total PIT = 250K + 500K + 13.5M = 14.25M
  for (const bracket of regime.brackets) {
    if (remaining <= 0) break; // Stop if no income left to tax

    // Determine upper bound of current bracket (use Infinity for top bracket)
    const thresholdValue = bracket.threshold === 'inf' ? Infinity : bracket.threshold;

    // Calculate the size of this bracket (e.g., 5M-10M has size 5M)
    const bracketSize = thresholdValue - prevThreshold;

    // Slab = portion of income taxed in this bracket
    // Take minimum of remaining income or bracket size
    const slab = Math.min(remaining, bracketSize);

    // Calculate tax for this slab at bracket's rate
    const tax = roundVnd(slab * bracket.rate);

    // Create Vietnamese label for display (e.g., "Bậc 1: 0–5,000,000 @ 5%")
    const ratePercent = (bracket.rate * 100).toFixed(0);
    let label: string;
    if (bracket.threshold === 'inf') {
      label = `Bậc ${items.length + 1}: >${formatVnd(prevThreshold)} @ ${ratePercent}%`;
    } else {
      label = `Bậc ${items.length + 1}: ${formatVnd(prevThreshold)}–${formatVnd(
        bracket.threshold
      )} @ ${ratePercent}%`;
    }

    items.push({
      label,
      slab,
      rate: bracket.rate,
      tax,
    });

    // Update remaining income and move to next bracket
    remaining -= slab;
    prevThreshold = thresholdValue;
  }

  // Sum all bracket taxes to get total PIT
  const total = items.reduce((sum, item) => sum + item.tax, 0);

  return {
    taxable,
    items,
    total,
  };
}

/**
 * Master calculation function that orchestrates insurance, deductions, PIT, and NET calculation.
 * @param inputs - User-provided calculator inputs
 * @param lunchAllowance - Optional tax-exempt lunch allowance amount (VND)
 * @returns Complete CalculationResult
 */
export function calcAll(inputs: CalculatorInputs, lunchAllowance?: number): CalculationResult {
  const regionalMin = REGIONAL_MINIMUMS[inputs.region].minWage;

  // 1. Calculate insurance bases and amounts
  const bases = calcInsuranceBases(inputs.gross, regionalMin, BASE_SALARY, inputs.insuranceBase);
  const insurance = calcInsurance(bases);

  // 2. Calculate deductions
  const deductions: Deductions = {
    personal: inputs.regime.personalDeduction,
    dependents: inputs.dependents * inputs.regime.dependentDeduction,
    insurance: insurance.total,
    total: 0, // Will calculate below
  };
  deductions.total = deductions.personal + deductions.dependents + deductions.insurance;

  // 3. Calculate taxable income
  // Formula: Taxable = Gross - Deductions - LunchAllowance (tax-exempt)
  // The lunch allowance is part of gross income but is tax-exempt, so we subtract it
  // before calculating PIT
  let taxable = inputs.gross - deductions.total;
  
  // Subtract lunch allowance from taxable income (if provided)
  if (lunchAllowance !== undefined && lunchAllowance > 0) {
    taxable -= lunchAllowance;
  }
  
  // Ensure taxable income is non-negative
  taxable = Math.max(0, taxable);

  // 4. Calculate PIT (on taxable income after lunch allowance deduction)
  const pit = calcPit(taxable, inputs.regime);

  // 5. Calculate NET salary
  const net = inputs.gross - insurance.total - pit.total;

  // 6. Calculate union dues (if user is union member)
  const unionDues = inputs.isUnionMember ? calculateUnionDues(bases.baseSIHI) : undefined;

  // 7. Calculate final NET after union dues and lunch allowance
  const result: CalculationResult = {
    inputs,
    insurance,
    deductions,
    pit,
    net,
    unionDues,
    lunchAllowance, // Include lunch allowance in result
    finalNet: net, // Temporary - will update below
  };

  // Calculate final NET properly (includes union dues deduction and lunch allowance addition)
  result.finalNet = calculateFinalNet(result);

  return result;
}

/**
 * Helper function to format VND amounts for labels.
 * @param amount - Amount in VND
 * @returns Formatted string (e.g., "5,000,000")
 */
function formatVnd(amount: number): string {
  return amount.toLocaleString('vi-VN');
}

/**
 * Compare 2025 vs 2026 tax regimes side-by-side with delta calculations.
 * @param inputs - User-provided calculator inputs (without regime specified)
 * @param lunchAllowance - Optional tax-exempt lunch allowance amount (VND)
 * @returns ComparisonResult with both calculations and deltas
 */
export function compareRegimes(
  inputs: Omit<CalculatorInputs, 'regime'>,
  lunchAllowance?: number
): ComparisonResult {
  // Calculate results for both regimes
  const regime2025 = calcAll({ ...inputs, regime: REGIME_2025 }, lunchAllowance);
  const regime2026 = calcAll({ ...inputs, regime: REGIME_2026 }, lunchAllowance);

  // Calculate deltas (2026 - 2025)
  // Positive delta = 2026 is higher (better for deductions, worse for taxes)
  // Negative delta = 2026 is lower (worse for deductions, better for taxes)
  const deltas = {
    personalDeduction: regime2026.deductions.personal - regime2025.deductions.personal,
    dependentDeduction: regime2026.deductions.dependents - regime2025.deductions.dependents,
    totalDeductions: regime2026.deductions.total - regime2025.deductions.total,
    insurance: regime2026.insurance.total - regime2025.insurance.total,
    taxableIncome: regime2026.pit.taxable - regime2025.pit.taxable,
    pit: regime2026.pit.total - regime2025.pit.total,
    netSalary: regime2026.net - regime2025.net,
  };

  return {
    regime2025,
    regime2026,
    deltas,
  };
}
