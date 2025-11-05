# Calculation API Contract

**Feature**: 001-gross-net-calculator
**Created**: 2025-11-05
**Type**: Pure Function Interfaces (No HTTP API)

## Overview

This document defines the contract for all calculation functions in the Vietnam salary calculator. Since this is a **client-side only application**, there are no HTTP endpoints. Instead, these contracts define the TypeScript function signatures that serve as the public API for the calculation engine.

All functions are **pure** (no side effects), **deterministic** (same inputs → same outputs), and **synchronous** (no async/await needed).

---

## Core Calculation Functions

### 1. clamp()
**Purpose**: Clamp a value between a minimum and maximum.

**Signature**:
```typescript
function clamp(value: number, min: number, max: number): number
```

**Parameters**:
- `value`: The number to clamp
- `min`: Minimum bound (inclusive)
- `max`: Maximum bound (inclusive)

**Returns**:
- The clamped value: `max(min, min(value, max))`

**Example**:
```typescript
clamp(30_000_000, 4_960_000, 46_800_000) // → 30_000_000 (within bounds)
clamp(50_000_000, 4_960_000, 46_800_000) // → 46_800_000 (capped)
clamp(3_000_000, 4_960_000, 46_800_000)  // → 4_960_000 (floored)
```

**Testing Requirements**:
- Test value within bounds
- Test value above max (should return max)
- Test value below min (should return min)
- Test value exactly at min and max

---

### 2. roundVnd()
**Purpose**: Round a number to the nearest integer VND (no decimals).

**Signature**:
```typescript
function roundVnd(amount: number): number
```

**Parameters**:
- `amount`: The monetary amount to round

**Returns**:
- Rounded integer using standard rounding (0.5 rounds up)

**Example**:
```typescript
roundVnd(2_400_000.49) // → 2_400_000
roundVnd(2_400_000.50) // → 2_400_001
roundVnd(450_000.00)   // → 450_000
```

**Testing Requirements**:
- Test rounding up (>= 0.5)
- Test rounding down (< 0.5)
- Test exact integers (no change)
- Test negative numbers (edge case, should not occur in practice)

---

### 3. calcInsuranceBases()
**Purpose**: Calculate clamped insurance contribution bases for SI/HI and UI.

**Signature**:
```typescript
function calcInsuranceBases(
  gross: number,
  regionalMin: number,
  baseSalary: number,
  insuranceBase?: number
): InsuranceBases
```

**Parameters**:
- `gross`: Gross monthly salary (VND)
- `regionalMin`: Regional minimum wage (VND)
- `baseSalary`: Base salary constant for SI/HI cap (2,340,000 VND)
- `insuranceBase`: Optional custom insurance base (VND). Defaults to `gross` if undefined.

**Returns**: `InsuranceBases` object
```typescript
{
  baseSIHI: number,  // Clamped between regionalMin and 20×baseSalary
  baseUI: number     // Clamped between regionalMin and 20×regionalMin
}
```

**Logic**:
```typescript
const base = insuranceBase ?? gross;
const capSIHI = 20 * baseSalary;      // 20 × 2,340,000 = 46,800,000
const capUI = 20 * regionalMin;       // 20 × regional minimum
return {
  baseSIHI: clamp(base, regionalMin, capSIHI),
  baseUI: clamp(base, regionalMin, capUI)
};
```

**Example**:
```typescript
// Region I (min 4,960,000), base salary 2,340,000, gross 30M
calcInsuranceBases(30_000_000, 4_960_000, 2_340_000)
// → { baseSIHI: 30_000_000, baseUI: 30_000_000 }

// High gross (185M) exceeds caps
calcInsuranceBases(185_000_000, 4_960_000, 2_340_000)
// → { baseSIHI: 46_800_000 (capped), baseUI: 99_200_000 (capped) }

// Low custom base below floor
calcInsuranceBases(30_000_000, 4_960_000, 2_340_000, 3_000_000)
// → { baseSIHI: 4_960_000 (floored), baseUI: 4_960_000 (floored) }
```

**Testing Requirements**:
- Test all 4 regions (different regional minimums)
- Test gross within bounds (no capping)
- Test gross exceeding SI/HI cap
- Test gross exceeding UI cap
- Test custom base below floor
- Test custom base above cap
- Test custom base undefined (defaults to gross)

---

### 4. calcInsurance()
**Purpose**: Calculate insurance contributions (SI, HI, UI) from bases.

**Signature**:
```typescript
function calcInsurance(bases: InsuranceBases): Insurance
```

**Parameters**:
- `bases`: Insurance bases object from `calcInsuranceBases()`

**Returns**: `Insurance` object
```typescript
{
  bases: InsuranceBases,  // Input bases (pass-through)
  si: number,             // BHXH = 8% of baseSIHI
  hi: number,             // BHYT = 1.5% of baseSIHI
  ui: number,             // BHTN = 1% of baseUI
  total: number           // Sum of si + hi + ui
}
```

**Logic**:
```typescript
const si = roundVnd(bases.baseSIHI * 0.08);
const hi = roundVnd(bases.baseSIHI * 0.015);
const ui = roundVnd(bases.baseUI * 0.01);
return {
  bases,
  si,
  hi,
  ui,
  total: si + hi + ui
};
```

**Example**:
```typescript
calcInsurance({ baseSIHI: 30_000_000, baseUI: 30_000_000 })
// → {
//   bases: { baseSIHI: 30_000_000, baseUI: 30_000_000 },
//   si: 2_400_000,   // 30M × 8%
//   hi: 450_000,     // 30M × 1.5%
//   ui: 300_000,     // 30M × 1%
//   total: 3_150_000
// }
```

**Testing Requirements**:
- Test standard case (bases within normal ranges)
- Test rounding behavior (verify roundVnd applied to each)
- Test with capped bases (high gross scenarios)
- Test with floored bases (low custom base scenarios)
- Verify total is sum of si + hi + ui

---

### 5. calcPit()
**Purpose**: Calculate progressive Personal Income Tax from taxable income.

**Signature**:
```typescript
function calcPit(taxable: number, regime: Regime): PIT
```

**Parameters**:
- `taxable`: Taxable income in VND (gross - total deductions)
- `regime`: Tax regime object (2025 or 2026) containing brackets

**Returns**: `PIT` object
```typescript
{
  taxable: number,     // Input taxable income (pass-through)
  items: PITItem[],    // Breakdown by bracket
  total: number        // Sum of all bracket taxes
}
```

**Logic** (progressive brackets):
```typescript
if (taxable <= 0) return { taxable, items: [], total: 0 };

let remaining = taxable;
let prev = 0;
let total = 0;
const items: PITItem[] = [];

regime.brackets.forEach((bracket, index) => {
  const threshold = bracket.threshold === "inf"
    ? Number.POSITIVE_INFINITY
    : bracket.threshold;

  const slab = Math.max(0, Math.min(remaining, threshold - prev));

  if (slab > 0) {
    const tax = roundVnd(slab * bracket.rate);
    total += tax;
    remaining -= slab;

    const label = threshold === Number.POSITIVE_INFINITY
      ? `Bậc ${index + 1}: >${formatVnd(prev)} @ ${bracket.rate * 100}%`
      : `Bậc ${index + 1}: ${formatVnd(prev)}–${formatVnd(threshold)} @ ${bracket.rate * 100}%`;

    items.push({ label, slab, rate: bracket.rate, tax });
  }

  prev = threshold;
});

return { taxable, items, total };
```

**Example** (2025 regime, taxable 7,850,000):
```typescript
calcPit(7_850_000, REGIME_2025)
// → {
//   taxable: 7_850_000,
//   items: [
//     {
//       label: "Bậc 1: 0–5,000,000 @ 5%",
//       slab: 5_000_000,
//       rate: 0.05,
//       tax: 250_000
//     },
//     {
//       label: "Bậc 2: 5,000,000–10,000,000 @ 10%",
//       slab: 2_850_000,
//       rate: 0.10,
//       tax: 285_000
//     }
//   ],
//   total: 535_000
// }
```

**Testing Requirements**:
- **Edge cases at bracket thresholds**:
  - 2025: 5M, 10M, 18M, 32M, 52M, 80M
  - 2026: 10M, 30M, 60M, 100M
- Test taxable = 0 (returns empty items, total 0)
- Test taxable < 0 (same as 0)
- Test taxable in highest bracket (threshold = "inf")
- Test exact match at bracket boundary
- Verify progressive calculation (each bracket calculated separately)
- Verify rounding applied to each bracket's tax

---

### 6. calcAll()
**Purpose**: Perform complete salary calculation (master function).

**Signature**:
```typescript
function calcAll(
  inputs: CalculatorInputs,
  regionalMin: number,
  baseSalary: number
): CalculationResult
```

**Parameters**:
- `inputs`: User inputs (gross, dependents, region, insuranceBase, regime)
- `regionalMin`: Regional minimum wage for selected region
- `baseSalary`: Base salary constant (2,340,000)

**Returns**: `CalculationResult` object
```typescript
{
  inputs: CalculatorInputs,  // Original inputs
  insurance: Insurance,      // Insurance calculation
  deductions: Deductions,    // Deduction breakdown
  pit: PIT,                  // PIT calculation
  net: number                // Net salary
}
```

**Logic**:
```typescript
// 1. Calculate insurance bases and amounts
const bases = calcInsuranceBases(inputs.gross, regionalMin, baseSalary, inputs.insuranceBase);
const insurance = calcInsurance(bases);

// 2. Calculate deductions
const dedPersonal = inputs.regime.personalDeduction;
const dedDeps = inputs.dependents * inputs.regime.dependentDeduction;
const dedTotal = dedPersonal + dedDeps + insurance.total;

// 3. Calculate taxable income (floored at 0)
const taxable = Math.max(0, inputs.gross - dedTotal);

// 4. Calculate PIT
const pit = calcPit(taxable, inputs.regime);

// 5. Calculate net salary
const net = inputs.gross - insurance.total - pit.total;

return {
  inputs,
  insurance,
  deductions: {
    personal: dedPersonal,
    dependents: dedDeps,
    insurance: insurance.total,
    total: dedTotal
  },
  pit,
  net
};
```

**Example**:
```typescript
const inputs: CalculatorInputs = {
  gross: 30_000_000,
  dependents: 2,
  region: "I",
  insuranceBase: undefined,
  regime: REGIME_2025
};

calcAll(inputs, 4_960_000, 2_340_000)
// → Complete CalculationResult with all breakdowns
```

**Testing Requirements**:
- **Regression tests** with known correct values:
  - 10M gross, 2 deps, Region I
  - 30M gross, 2 deps, Region I
  - 60M gross, 2 deps, Region I
  - 100M gross, 2 deps, Region I
  - 185M gross, 2 deps, Region I
- Test with 0 dependents
- Test with custom insurance base
- Test each region (I, II, III, IV)
- Test both 2025 and 2026 regimes
- Verify NET = gross - insurance - PIT

---

## Formatting Functions

### 7. formatNumber()
**Purpose**: Format a number with thousand separators based on locale.

**Signature**:
```typescript
function formatNumber(value: number, locale: "en-US" | "vi-VN"): string
```

**Parameters**:
- `value`: Number to format
- `locale`: Locale selection ("en-US" or "vi-VN")

**Returns**:
- Formatted string with thousand separators, no decimals

**Logic**:
```typescript
return new Intl.NumberFormat(locale, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}).format(value);
```

**Example**:
```typescript
formatNumber(30_000_000, "en-US") // → "30,000,000"
formatNumber(30_000_000, "vi-VN") // → "30.000.000"
```

**Testing Requirements**:
- Test en-US locale (comma separator)
- Test vi-VN locale (period separator)
- Test large numbers (billions)
- Test zero
- Verify no decimal places

---

### 8. sanitizeNumericInput()
**Purpose**: Clean user input to extract numeric value.

**Signature**:
```typescript
function sanitizeNumericInput(input: string): number
```

**Parameters**:
- `input`: User input string (may contain commas, underscores, spaces)

**Returns**:
- Parsed numeric value (integer)

**Logic**:
```typescript
// Remove all non-digit characters except leading minus
const cleaned = input.replace(/[^0-9-]/g, "");
return parseInt(cleaned, 10) || 0;
```

**Example**:
```typescript
sanitizeNumericInput("30,000,000") // → 30000000
sanitizeNumericInput("30_000_000") // → 30000000
sanitizeNumericInput("30 000 000") // → 30000000
sanitizeNumericInput("185000000")  // → 185000000
sanitizeNumericInput("")           // → 0
sanitizeNumericInput("abc")        // → 0
```

**Testing Requirements**:
- Test comma-separated input
- Test underscore-separated input
- Test space-separated input
- Test plain numeric input
- Test empty string (should return 0)
- Test non-numeric input (should return 0)

---

## URL State Functions

### 9. encodeStateToURL()
**Purpose**: Encode calculator state into URL query parameters for sharing.

**Signature**:
```typescript
function encodeStateToURL(state: URLState): string
```

**Parameters**:
- `state`: Object containing calculator inputs and view mode
```typescript
interface URLState {
  gross: number;
  dependents: number;
  region: RegionId;
  insuranceBaseMode: InsuranceBaseMode;
  customInsuranceBase?: number;
  viewMode: ViewMode;
  locale: "en-US" | "vi-VN";
}
```

**Returns**:
- Query string (e.g., `?g=30000000&d=2&r=I&m=compare&fmt=en-US`)

**Logic**:
```typescript
const params = new URLSearchParams();
params.set("g", state.gross.toString());
params.set("d", state.dependents.toString());
params.set("r", state.region);
if (state.insuranceBaseMode === "custom" && state.customInsuranceBase) {
  params.set("ib", state.customInsuranceBase.toString());
}
params.set("m", state.viewMode);
params.set("fmt", state.locale);
return params.toString();
```

**Example**:
```typescript
encodeStateToURL({
  gross: 30_000_000,
  dependents: 2,
  region: "I",
  insuranceBaseMode: "gross",
  viewMode: "compare",
  locale: "en-US"
})
// → "g=30000000&d=2&r=I&m=compare&fmt=en-US"
```

---

### 10. decodeStateFromURL()
**Purpose**: Parse URL query parameters to restore calculator state.

**Signature**:
```typescript
function decodeStateFromURL(queryString: string): Partial<URLState>
```

**Parameters**:
- `queryString`: URL query string (with or without leading `?`)

**Returns**:
- Partial URLState object with successfully parsed values

**Logic**:
```typescript
const params = new URLSearchParams(queryString);
const state: Partial<URLState> = {};

const gross = parseInt(params.get("g") || "", 10);
if (!isNaN(gross)) state.gross = gross;

const deps = parseInt(params.get("d") || "", 10);
if (!isNaN(deps) && deps >= 0) state.dependents = deps;

const region = params.get("r");
if (region && ["I", "II", "III", "IV"].includes(region)) {
  state.region = region as RegionId;
}

// ... similar for other parameters

return state;
```

**Example**:
```typescript
decodeStateFromURL("?g=30000000&d=2&r=I&m=compare&fmt=en-US")
// → { gross: 30000000, dependents: 2, region: "I", viewMode: "compare", locale: "en-US" }

decodeStateFromURL("?invalid=data")
// → {} (empty object, fallback to defaults)
```

**Testing Requirements**:
- Test valid complete query string
- Test partial query string (some params missing)
- Test invalid values (should be ignored)
- Test empty query string (returns empty object)
- Test malformed query string (handle gracefully)

---

## Comparison Functions

### 11. compareRegimes()
**Purpose**: Calculate and compare results for both 2025 and 2026 regimes.

**Signature**:
```typescript
function compareRegimes(
  inputs: Omit<CalculatorInputs, "regime">,
  regionalMin: number,
  baseSalary: number
): ComparisonResult
```

**Parameters**:
- `inputs`: Calculator inputs without regime (regime will be applied internally for both 2025 and 2026)
- `regionalMin`: Regional minimum wage
- `baseSalary`: Base salary constant

**Returns**: `ComparisonResult` object
```typescript
{
  result2025: CalculationResult,
  result2026: CalculationResult,
  deltas: {
    personalDeduction: number,
    dependentDeduction: number,
    totalDeductions: number,
    taxableIncome: number,
    totalPIT: number,
    netSalary: number
  }
}
```

**Logic**:
```typescript
const result2025 = calcAll({ ...inputs, regime: REGIME_2025 }, regionalMin, baseSalary);
const result2026 = calcAll({ ...inputs, regime: REGIME_2026 }, regionalMin, baseSalary);

const deltas = {
  personalDeduction: result2026.deductions.personal - result2025.deductions.personal,
  dependentDeduction: result2026.deductions.dependents - result2025.deductions.dependents,
  totalDeductions: result2026.deductions.total - result2025.deductions.total,
  taxableIncome: result2026.pit.taxable - result2025.pit.taxable,
  totalPIT: result2026.pit.total - result2025.pit.total,
  netSalary: result2026.net - result2025.net
};

return { result2025, result2026, deltas };
```

**Example**:
```typescript
compareRegimes(
  { gross: 30_000_000, dependents: 2, region: "I" },
  4_960_000,
  2_340_000
)
// → ComparisonResult with both results and deltas
```

**Testing Requirements**:
- Test with various gross amounts (low, medium, high)
- Verify deltas are calculated correctly (2026 - 2025)
- Test scenarios where 2026 is better (positive net delta)
- Test scenarios where 2025 is better (negative net delta)
- Verify insurance amounts are identical (same rules for both regimes)

---

## Function Dependencies

```
clamp()
    ↑
calcInsuranceBases()
    ↑
calcInsurance()
    ↑                       ↑
calcPit() ←── calcAll() ←── compareRegimes()
    ↑
roundVnd()
```

---

## Testing Strategy

### Unit Tests (tests/unit/)
- **tax.test.ts**: All calculation functions
- **format.test.ts**: Formatting and sanitization
- **url-state.test.ts**: URL encoding/decoding

### Coverage Target
- ≥80% line coverage for all calculation functions
- 100% coverage for edge cases (bracket thresholds, floor/cap boundaries)

### Regression Test Data
Create fixtures with known correct values for common scenarios:
```typescript
// fixtures.ts
export const REGRESSION_CASES = [
  {
    input: { gross: 10_000_000, dependents: 2, region: "I" },
    expected2025: { net: 9_150_000, pit: 0, insurance: 850_000 },
    expected2026: { net: 9_150_000, pit: 0, insurance: 850_000 }
  },
  // ... more cases
];
```

---

## Performance Considerations

- All functions are **O(n)** where n = number of tax brackets (max 7)
- No async operations required (synchronous calculations)
- Memoization not needed (calculations are fast <1ms)
- Debounce input handlers at UI layer (300ms) to prevent excessive recalculations

---

## Next Steps

With calculation contracts defined:
1. Implement functions in `src/lib/tax.ts`, `src/lib/format.ts`, `src/lib/url-state.ts`
2. Write unit tests in `tests/unit/` following TDD methodology
3. Generate quickstart.md for development workflow
