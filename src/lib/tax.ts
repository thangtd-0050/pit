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
  const base = insuranceBase ?? gross;
  const capSIHI = 20 * baseSalary; // 20 × 2,340,000 = 46,800,000
  const capUI = 20 * regionalMin; // 20 × regional minimum

  return {
    baseSIHI: clamp(base, regionalMin, capSIHI),
    baseUI: clamp(base, regionalMin, capUI),
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
  let remaining = taxable;
  let prevThreshold = 0;

  for (const bracket of regime.brackets) {
    if (remaining <= 0) break;

    const thresholdValue = bracket.threshold === 'inf' ? Infinity : bracket.threshold;
    const bracketSize = thresholdValue - prevThreshold;
    const slab = Math.min(remaining, bracketSize);
    const tax = roundVnd(slab * bracket.rate);

    // Create Vietnamese label
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

    remaining -= slab;
    prevThreshold = thresholdValue;
  }

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
 * @returns Complete CalculationResult
 */
export function calcAll(inputs: CalculatorInputs): CalculationResult {
  const regionalMin = REGIONAL_MINIMUMS[inputs.region].minWage;

  // 1. Calculate insurance bases and amounts
  const bases = calcInsuranceBases(
    inputs.gross,
    regionalMin,
    BASE_SALARY,
    inputs.insuranceBase
  );
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
  const taxable = Math.max(0, inputs.gross - deductions.total);

  // 4. Calculate PIT
  const pit = calcPit(taxable, inputs.regime);

  // 5. Calculate NET salary
  const net = inputs.gross - insurance.total - pit.total;

  return {
    inputs,
    insurance,
    deductions,
    pit,
    net,
  };
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
 * @returns ComparisonResult with both calculations and deltas
 */
export function compareRegimes(
  inputs: Omit<CalculatorInputs, 'regime'>
): ComparisonResult {
  // Calculate results for both regimes
  const regime2025 = calcAll({ ...inputs, regime: REGIME_2025 });
  const regime2026 = calcAll({ ...inputs, regime: REGIME_2026 });

  // Calculate deltas (2026 - 2025)
  // Positive delta = 2026 is higher (better for deductions, worse for taxes)
  // Negative delta = 2026 is lower (worse for deductions, better for taxes)
  const deltas = {
    personalDeduction:
      regime2026.deductions.personal - regime2025.deductions.personal,
    dependentDeduction:
      regime2026.deductions.dependents - regime2025.deductions.dependents,
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
