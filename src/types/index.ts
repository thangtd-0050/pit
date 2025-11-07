// ============================================================================
// Configuration Entities
// ============================================================================

/**
 * Vietnamese regional classification for minimum wage determination.
 * - "I": Region I (Hanoi, Ho Chi Minh City, major urban areas)
 * - "II": Region II (Secondary cities, provincial capitals)
 * - "III": Region III (Smaller cities and towns)
 * - "IV": Region IV (Rural areas)
 */
export type RegionId = 'I' | 'II' | 'III' | 'IV';

/**
 * Configuration for each region containing the statutory minimum wage.
 */
export interface RegionConfig {
  /** Monthly minimum wage in VND (e.g., 4,960,000 for Region I) */
  minWage: number;
}

/**
 * Defines a single progressive income tax bracket.
 */
export interface TaxBracket {
  /** Upper bound of this bracket (VND/month) or infinity for highest bracket */
  threshold: number | 'inf';
  /** Tax rate as decimal (0.05 = 5%) */
  rate: number;
}

/**
 * Complete tax regime configuration for a specific year.
 */
export interface Regime {
  /** Regime identifier */
  id: '2025' | '2026';
  /** Personal deduction amount (VND/month) */
  personalDeduction: number;
  /** Per-dependent deduction amount (VND/month) */
  dependentDeduction: number;
  /** Progressive tax brackets */
  brackets: TaxBracket[];
}

// ============================================================================
// Calculation Input Entities
// ============================================================================

/**
 * User-provided inputs for salary calculation.
 */
export interface CalculatorInputs {
  /** Gross monthly salary in VND */
  gross: number;
  /** Number of dependents (≥0) */
  dependents: number;
  /** Region selection (I, II, III, IV) */
  region: RegionId;
  /** Optional custom insurance base (VND). If undefined, uses gross. */
  insuranceBase?: number;
  /** Tax regime to apply (2025 or 2026) */
  regime: Regime;
  /** Whether user is a trade union member (for union dues calculation) */
  isUnionMember?: boolean;
}

// ============================================================================
// Calculation Intermediate Entities
// ============================================================================

/**
 * Calculated insurance contribution bases after applying floors and caps.
 */
export interface InsuranceBases {
  /** Base for SI (BHXH) and HI (BHYT) calculation (VND) */
  baseSIHI: number;
  /** Base for UI (BHTN) calculation (VND) */
  baseUI: number;
}

/**
 * Complete insurance calculation results.
 */
export interface Insurance {
  /** Calculation bases */
  bases: InsuranceBases;
  /** Social Insurance amount (BHXH) in VND - 8% of baseSIHI */
  si: number;
  /** Health Insurance amount (BHYT) in VND - 1.5% of baseSIHI */
  hi: number;
  /** Unemployment Insurance amount (BHTN) in VND - 1% of baseUI */
  ui: number;
  /** Total insurance contribution (VND) */
  total: number;
}

/**
 * Breakdown of all tax deductions.
 */
export interface Deductions {
  /** Personal deduction (VND) */
  personal: number;
  /** Total dependent deductions (VND) */
  dependents: number;
  /** Total insurance contribution (VND) */
  insurance: number;
  /** Sum of all deductions (VND) */
  total: number;
}

/**
 * Tax calculation for a single progressive tax bracket.
 */
export interface PITItem {
  /** Human-readable bracket label (Vietnamese) */
  label: string;
  /** Amount of income in this bracket (VND) */
  slab: number;
  /** Tax rate as decimal */
  rate: number;
  /** Tax amount for this bracket (VND) */
  tax: number;
}

/**
 * Complete Personal Income Tax calculation result.
 */
export interface PIT {
  /** Taxable income after deductions (VND) */
  taxable: number;
  /** Tax breakdown by bracket */
  items: PITItem[];
  /** Total PIT owed (VND) */
  total: number;
}

/**
 * Union dues calculation result for trade union members.
 */
export interface UnionDues {
  /**
   * Calculated union dues amount in VND
   * Formula: min(insuranceBase × 0.005, 234000)
   */
  amount: number;

  /**
   * Social insurance base used for calculation in VND
   * Source: insuranceBase from CalculationResult
   */
  calculationBase: number;

  /**
   * Whether the maximum cap was applied
   * true if amount = 234,000 (cap reached)
   */
  cappedAtMax: boolean;

  /**
   * The rate applied (always 0.005 = 0.5%)
   */
  rate: number;

  /**
   * Maximum allowed amount (always 234,000 VND)
   */
  maxAmount: number;
}

// ============================================================================
// Calculation Output Entities
// ============================================================================

/**
 * Complete salary calculation result for a single regime.
 */
export interface CalculationResult {
  /** Original inputs */
  inputs: CalculatorInputs;
  /** Insurance calculation results */
  insurance: Insurance;
  /** Deduction breakdown */
  deductions: Deductions;
  /** Personal Income Tax results */
  pit: PIT;
  /** Net salary (VND) */
  net: number;
  /**
   * Union dues calculation (only present if user is union member)
   * undefined if isUnionMember = false
   */
  unionDues?: UnionDues;
  /**
   * Tax-exempt lunch allowance amount
   * - undefined: Lunch allowance is disabled
   * - number: Lunch allowance amount in VND (≥ 0)
   * 
   * @remarks
   * - This is always undefined when the user hasn't enabled lunch allowance
   * - When enabled, this value is added to final NET salary
   * - Value is NOT included in gross taxable income
   * - Entire amount is tax-exempt (no cap)
   */
  lunchAllowance?: number;
  /**
   * Final take-home pay after union dues deduction and lunch allowance addition
   * If unionDues exists and lunchAllowance exists: net - unionDues.amount + lunchAllowance
   * If only unionDues exists: net - unionDues.amount
   * If only lunchAllowance exists: net + lunchAllowance
   * Otherwise: same as net
   */
  finalNet: number;
}

/**
 * Side-by-side comparison of 2025 vs 2026 tax regimes with deltas.
 */
export interface ComparisonResult {
  /** Result using 2025 regime */
  regime2025: CalculationResult;
  /** Result using 2026 regime */
  regime2026: CalculationResult;
  /** Difference values (2026 - 2025) */
  deltas: {
    /** Δ in personal deduction (2026 - 2025) */
    personalDeduction: number;
    /** Δ in dependent deduction */
    dependentDeduction: number;
    /** Δ in total deductions */
    totalDeductions: number;
    /** Δ in insurance (should be 0) */
    insurance: number;
    /** Δ in taxable income */
    taxableIncome: number;
    /** Δ in total PIT */
    pit: number;
    /** Δ in net salary (positive = better for user) */
    netSalary: number;
  };
}

// ============================================================================
// UI State Entities
// ============================================================================

/**
 * Global UI preferences managed by Zustand store.
 */
export interface PreferencesState {
  /** Number format preference */
  locale: 'en-US' | 'vi-VN';
  /** Dark mode toggle */
  darkMode: boolean;
  /** Show/hide detailed breakdown */
  showDetails: boolean;
  /** Active viewing mode */
  viewMode: ViewMode;
  /** Update locale preference */
  setLocale: (locale: 'en-US' | 'vi-VN') => void;
  /** Update dark mode setting */
  setDarkMode: (enabled: boolean) => void;
  /** Update show details setting */
  setShowDetails: (show: boolean) => void;
  /** Update view mode */
  setViewMode: (mode: ViewMode) => void;
}

/**
 * Active viewing mode selection.
 * - "2025": Show 2025 regime results only
 * - "2026": Show 2026 regime results only
 * - "compare": Show side-by-side comparison with deltas
 */
export type ViewMode = '2025' | '2026' | 'compare';

/**
 * Insurance base calculation mode.
 * - "gross": Use gross salary as insurance base (default)
 * - "custom": User provides custom insurance base
 */
export type InsuranceBaseMode = 'gross' | 'custom';

/**
 * URL-shareable state for calculator.
 * Used for encoding/decoding query parameters.
 */
export interface URLState {
  /** Gross salary in VND */
  gross?: number;
  /** Number of dependents */
  dependents?: number;
  /** Regional minimum wage identifier */
  region?: RegionId;
  /** Insurance base calculation mode */
  insuranceBaseMode?: InsuranceBaseMode;
  /** Custom insurance base amount (when mode is 'custom') */
  customInsuranceBase?: number;
  /** Active view mode */
  viewMode?: ViewMode;
  /** Number format locale */
  locale?: 'en-US' | 'vi-VN';
  /** Whether user is a union member */
  isUnionMember?: boolean;
  /** Whether lunch allowance is enabled */
  hasLunchAllowance?: boolean;
  /** Lunch allowance amount in VND */
  lunchAllowance?: number;
}
