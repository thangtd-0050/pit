# Data Model: Vietnam Gross-to-Net Salary Calculator

**Feature**: 001-gross-net-calculator
**Created**: 2025-11-05
**Phase**: 1 (Design & Contracts)

## Overview

This document defines the core data structures and entities used throughout the Vietnam salary calculator application. All entities are defined as TypeScript interfaces and types, serving as the contract between components and business logic.

---

## 1. Configuration Entities

### 1.1 RegionId
```typescript
type RegionId = "I" | "II" | "III" | "IV";
```

**Description**: Vietnamese regional classification for minimum wage determination.

**Values**:
- `"I"`: Region I (Hanoi, Ho Chi Minh City, major urban areas)
- `"II"`: Region II (Secondary cities, provincial capitals)
- `"III"`: Region III (Smaller cities and towns)
- `"IV"`: Region IV (Rural areas)

**Usage**: Input selection, insurance base floor calculation

---

### 1.2 RegionConfig
```typescript
interface RegionConfig {
  minWage: number; // Monthly minimum wage in VND
}
```

**Description**: Configuration for each region containing the statutory minimum wage.

**Fields**:
- `minWage`: Minimum monthly wage in VND (e.g., 4,960,000 for Region I)

**Validation Rules**:
- `minWage` must be positive integer
- Values updated annually per government decree

**Example**:
```typescript
const regionI: RegionConfig = {
  minWage: 4_960_000
};
```

---

### 1.3 TaxBracket
```typescript
interface TaxBracket {
  threshold: number | "inf"; // Upper bound of this bracket (VND/month) or infinity for highest bracket
  rate: number;               // Tax rate as decimal (0.05 = 5%)
}
```

**Description**: Defines a single progressive income tax bracket.

**Fields**:
- `threshold`: Upper limit of taxable income for this bracket. Use `"inf"` for the highest bracket.
- `rate`: Tax rate as decimal (0.05 = 5%, 0.10 = 10%, etc.)

**Validation Rules**:
- `threshold` must be positive integer or `"inf"`
- `rate` must be between 0 and 1 (inclusive)
- Brackets must be ordered by ascending threshold

**Example**:
```typescript
const bracket: TaxBracket = {
  threshold: 5_000_000,
  rate: 0.05  // 5% tax rate
};

const highestBracket: TaxBracket = {
  threshold: "inf",
  rate: 0.35  // 35% tax rate for all income above previous bracket
};
```

---

### 1.4 Regime
```typescript
interface Regime {
  id: "2025" | "2026";              // Regime identifier
  personalDeduction: number;         // Personal deduction amount (VND/month)
  dependentDeduction: number;        // Per-dependent deduction amount (VND/month)
  brackets: TaxBracket[];           // Progressive tax brackets
}
```

**Description**: Complete tax regime configuration for a specific year.

**Fields**:
- `id`: Year identifier ("2025" or "2026")
- `personalDeduction`: Fixed personal deduction in VND (11M for 2025, 15.5M for 2026)
- `dependentDeduction`: Per-dependent deduction in VND (4M for 2025, 6.2M for 2026)
- `brackets`: Array of tax brackets defining progressive taxation

**Validation Rules**:
- `personalDeduction` must be positive integer
- `dependentDeduction` must be positive integer
- `brackets` must have at least 1 element
- Last bracket must have threshold = `"inf"`

**Example**:
```typescript
const regime2025: Regime = {
  id: "2025",
  personalDeduction: 11_000_000,
  dependentDeduction: 4_000_000,
  brackets: [
    { threshold: 5_000_000, rate: 0.05 },
    { threshold: 10_000_000, rate: 0.10 },
    { threshold: 18_000_000, rate: 0.15 },
    { threshold: 32_000_000, rate: 0.20 },
    { threshold: 52_000_000, rate: 0.25 },
    { threshold: 80_000_000, rate: 0.30 },
    { threshold: "inf", rate: 0.35 }
  ]
};
```

---

## 2. Calculation Input Entities

### 2.1 CalculatorInputs
```typescript
interface CalculatorInputs {
  gross: number;              // Gross monthly salary in VND
  dependents: number;         // Number of dependents (≥0)
  region: RegionId;           // Region selection (I, II, III, IV)
  insuranceBase?: number;     // Optional custom insurance base (VND). If undefined, uses gross.
  regime: Regime;             // Tax regime to apply (2025 or 2026)
}
```

**Description**: User-provided inputs for salary calculation.

**Fields**:
- `gross`: Gross monthly salary in VND (positive integer)
- `dependents`: Number of dependents for tax deduction (non-negative integer)
- `region`: Selected region for minimum wage floor
- `insuranceBase`: Optional custom insurance base. If omitted, defaults to gross.
- `regime`: Tax regime object (2025 or 2026)

**Validation Rules**:
- `gross` must be positive integer
- `dependents` must be non-negative integer (0, 1, 2, ...)
- `insuranceBase` (if provided) must be positive integer
- `region` must be one of "I", "II", "III", "IV"

**Example**:
```typescript
const inputs: CalculatorInputs = {
  gross: 30_000_000,
  dependents: 2,
  region: "I",
  insuranceBase: undefined,  // Will use gross as insurance base
  regime: REGIME_2025
};
```

---

## 3. Calculation Intermediate Entities

### 3.1 InsuranceBases
```typescript
interface InsuranceBases {
  baseSIHI: number;  // Base for SI (BHXH) and HI (BHYT) calculation (VND)
  baseUI: number;    // Base for UI (BHTN) calculation (VND)
}
```

**Description**: Calculated insurance contribution bases after applying floors and caps.

**Fields**:
- `baseSIHI`: Clamped base for Social Insurance (8%) and Health Insurance (1.5%)
  - Floor: Regional minimum wage
  - Cap: 20 × base salary (2,340,000 VND → 46,800,000 VND cap)
- `baseUI`: Clamped base for Unemployment Insurance (1%)
  - Floor: Regional minimum wage
  - Cap: 20 × regional minimum wage

**Calculation**:
```typescript
baseSIHI = clamp(insuranceBase, regionalMinWage, 20 * BASE_SALARY)
baseUI = clamp(insuranceBase, regionalMinWage, 20 * regionalMinWage)
```

**Example**:
```typescript
// For gross = 30M, Region I (min wage 4.96M), base salary 2.34M
const bases: InsuranceBases = {
  baseSIHI: 30_000_000,  // 30M < 46.8M cap, > 4.96M floor
  baseUI: 30_000_000     // 30M < 99.2M cap, > 4.96M floor
};
```

---

### 3.2 Insurance
```typescript
interface Insurance {
  bases: InsuranceBases;    // Calculation bases
  si: number;               // Social Insurance amount (BHXH) in VND
  hi: number;               // Health Insurance amount (BHYT) in VND
  ui: number;               // Unemployment Insurance amount (BHTN) in VND
  total: number;            // Total insurance contribution (VND)
}
```

**Description**: Complete insurance calculation results.

**Fields**:
- `bases`: Insurance bases after floor/cap application
- `si`: Social Insurance (8% of baseSIHI), rounded to integer
- `hi`: Health Insurance (1.5% of baseSIHI), rounded to integer
- `ui`: Unemployment Insurance (1% of baseUI), rounded to integer
- `total`: Sum of si + hi + ui

**Calculation**:
```typescript
si = round(bases.baseSIHI * 0.08)
hi = round(bases.baseSIHI * 0.015)
ui = round(bases.baseUI * 0.01)
total = si + hi + ui
```

**Example**:
```typescript
const insurance: Insurance = {
  bases: { baseSIHI: 30_000_000, baseUI: 30_000_000 },
  si: 2_400_000,   // 30M * 8%
  hi: 450_000,     // 30M * 1.5%
  ui: 300_000,     // 30M * 1%
  total: 3_150_000
};
```

---

### 3.3 Deductions
```typescript
interface Deductions {
  personal: number;     // Personal deduction (VND)
  dependents: number;   // Total dependent deductions (VND)
  insurance: number;    // Total insurance contribution (VND)
  total: number;        // Sum of all deductions (VND)
}
```

**Description**: Breakdown of all tax deductions.

**Fields**:
- `personal`: Fixed personal deduction from regime (11M or 15.5M)
- `dependents`: Dependent deduction = number of dependents × per-dependent amount
- `insurance`: Total insurance contribution (copied from Insurance.total)
- `total`: Sum of personal + dependents + insurance

**Calculation**:
```typescript
personal = regime.personalDeduction
dependents = inputs.dependents * regime.dependentDeduction
insurance = insuranceResult.total
total = personal + dependents + insurance
```

**Example**:
```typescript
// For 2 dependents, regime 2025, insurance 3.15M
const deductions: Deductions = {
  personal: 11_000_000,
  dependents: 8_000_000,   // 2 * 4M
  insurance: 3_150_000,
  total: 22_150_000
};
```

---

### 3.4 PITItem
```typescript
interface PITItem {
  label: string;  // Human-readable bracket label (Vietnamese)
  slab: number;   // Amount of income in this bracket (VND)
  rate: number;   // Tax rate as decimal
  tax: number;    // Tax amount for this bracket (VND)
}
```

**Description**: Tax calculation for a single progressive tax bracket.

**Fields**:
- `label`: Vietnamese label, e.g., "Bậc 1: 0–5,000,000 @ 5%" or "Bậc 7: >80,000,000 @ 35%"
- `slab`: Portion of taxable income falling in this bracket
- `rate`: Tax rate for this bracket (as decimal)
- `tax`: Tax owed for this bracket = slab × rate (rounded to integer)

**Example**:
```typescript
const pitItem: PITItem = {
  label: "Bậc 2: 5,000,000–10,000,000 @ 10%",
  slab: 5_000_000,
  rate: 0.10,
  tax: 500_000
};
```

---

### 3.5 PIT
```typescript
interface PIT {
  taxable: number;    // Taxable income after deductions (VND)
  items: PITItem[];   // Tax breakdown by bracket
  total: number;      // Total PIT owed (VND)
}
```

**Description**: Complete Personal Income Tax calculation result.

**Fields**:
- `taxable`: Taxable income = max(0, gross - total deductions)
- `items`: Array of tax calculations for each bracket containing income
- `total`: Sum of all bracket taxes

**Calculation**:
```typescript
taxable = max(0, inputs.gross - deductions.total)
// Then apply progressive brackets to taxable amount
total = sum(items.map(item => item.tax))
```

**Example**:
```typescript
const pit: PIT = {
  taxable: 7_850_000,
  items: [
    {
      label: "Bậc 1: 0–5,000,000 @ 5%",
      slab: 5_000_000,
      rate: 0.05,
      tax: 250_000
    },
    {
      label: "Bậc 2: 5,000,000–10,000,000 @ 10%",
      slab: 2_850_000,
      rate: 0.10,
      tax: 285_000
    }
  ],
  total: 535_000
};
```

---

## 4. Calculation Output Entities

### 4.1 CalculationResult
```typescript
interface CalculationResult {
  inputs: CalculatorInputs;  // Original inputs
  insurance: Insurance;      // Insurance calculation results
  deductions: Deductions;    // Deduction breakdown
  pit: PIT;                  // Personal Income Tax results
  net: number;               // Net salary (VND)
}
```

**Description**: Complete salary calculation result for a single regime.

**Fields**:
- `inputs`: Original input values used for calculation
- `insurance`: Insurance calculation with bases and amounts
- `deductions`: Breakdown of all deductions
- `pit`: Progressive income tax calculation
- `net`: Final net salary = gross - insurance.total - pit.total

**Calculation**:
```typescript
net = inputs.gross - insurance.total - pit.total
```

**Example**:
```typescript
const result: CalculationResult = {
  inputs: { gross: 30_000_000, dependents: 2, region: "I", regime: REGIME_2025 },
  insurance: { /* ... */ total: 3_150_000 },
  deductions: { /* ... */ total: 22_150_000 },
  pit: { /* ... */ total: 535_000 },
  net: 26_315_000  // 30M - 3.15M - 0.535M
};
```

---

### 4.2 ComparisonResult
```typescript
interface ComparisonResult {
  result2025: CalculationResult;  // Result using 2025 regime
  result2026: CalculationResult;  // Result using 2026 regime
  deltas: {
    personalDeduction: number;    // Δ in personal deduction (2026 - 2025)
    dependentDeduction: number;   // Δ in dependent deduction
    totalDeductions: number;      // Δ in total deductions
    taxableIncome: number;        // Δ in taxable income
    totalPIT: number;             // Δ in total PIT
    netSalary: number;            // Δ in net salary (positive = better for user)
  };
}
```

**Description**: Side-by-side comparison of 2025 vs 2026 tax regimes with deltas.

**Fields**:
- `result2025`: Calculation result using 2025 regime
- `result2026`: Calculation result using 2026 regime
- `deltas`: Difference values (2026 - 2025)
  - Positive delta in netSalary means 2026 is better for user
  - Negative delta in totalPIT means user pays less tax in 2026

**Delta Calculation**:
```typescript
deltas.netSalary = result2026.net - result2025.net
deltas.totalPIT = result2026.pit.total - result2025.pit.total
// etc. for other fields
```

---

## 5. UI State Entities

### 5.1 PreferencesState
```typescript
interface PreferencesState {
  locale: "en-US" | "vi-VN";       // Number format preference
  darkMode: boolean;                // Dark mode toggle
  showDetails: boolean;             // Show/hide detailed breakdown
  setLocale: (locale: "en-US" | "vi-VN") => void;
  setDarkMode: (enabled: boolean) => void;
  setShowDetails: (show: boolean) => void;
}
```

**Description**: Global UI preferences managed by Zustand store.

**Fields**:
- `locale`: Number format style (en-US: 1,234,567 | vi-VN: 1.234.567)
- `darkMode`: Dark mode enabled/disabled
- `showDetails`: Show detailed calculation breakdown
- Setters for updating each preference

**Persistence**: Stored in localStorage, restored on app load

---

### 5.2 ViewMode
```typescript
type ViewMode = "2025" | "2026" | "compare";
```

**Description**: Active viewing mode selection.

**Values**:
- `"2025"`: Show 2025 regime results only
- `"2026"`: Show 2026 regime results only
- `"compare"`: Show side-by-side comparison with deltas (default)

---

### 5.3 InsuranceBaseMode
```typescript
type InsuranceBaseMode = "gross" | "custom";
```

**Description**: Insurance base calculation mode.

**Values**:
- `"gross"`: Use gross salary as insurance base (default)
- `"custom"`: User provides custom insurance base

---

## 6. Validation Rules Summary

| Entity | Field | Validation Rule |
|--------|-------|----------------|
| CalculatorInputs | gross | Positive integer (> 0) |
| CalculatorInputs | dependents | Non-negative integer (≥ 0) |
| CalculatorInputs | insuranceBase | If provided, positive integer (> 0) |
| CalculatorInputs | region | One of "I", "II", "III", "IV" |
| RegionConfig | minWage | Positive integer |
| TaxBracket | threshold | Positive integer or "inf" |
| TaxBracket | rate | 0 ≤ rate ≤ 1 |
| Regime | brackets | Last bracket.threshold must be "inf" |

---

## 7. Constants

### 7.1 Insurance Rates (Employee Portion)
```typescript
const RATE_SI = 0.08;   // Social Insurance (BHXH): 8%
const RATE_HI = 0.015;  // Health Insurance (BHYT): 1.5%
const RATE_UI = 0.01;   // Unemployment Insurance (BHTN): 1%
```

### 7.2 Base Salary for SI/HI Cap
```typescript
const BASE_SALARY = 2_340_000;  // VND/month
// SI/HI cap = 20 × BASE_SALARY = 46,800,000 VND
```

### 7.3 Regional Minimum Wages
```typescript
const REGIONS: Record<RegionId, RegionConfig> = {
  I: { minWage: 4_960_000 },   // Region I
  II: { minWage: 4_410_000 },  // Region II
  III: { minWage: 3_860_000 }, // Region III
  IV: { minWage: 3_450_000 }   // Region IV
};
```

---

## Entity Relationships

```
CalculatorInputs
    ├──> Regime (2025 or 2026)
    │       └──> TaxBracket[]
    └──> RegionId
            └──> RegionConfig

CalculationResult
    ├──> CalculatorInputs (original inputs)
    ├──> Insurance
    │       └──> InsuranceBases
    ├──> Deductions
    │       └──> references Insurance.total
    └──> PIT
            └──> PITItem[]

ComparisonResult
    ├──> CalculationResult (2025)
    ├──> CalculationResult (2026)
    └──> Deltas (computed differences)
```

---

## State Flow

```
User Input (gross, deps, region, base mode, regime)
    ↓
CalculatorInputs created
    ↓
Insurance calculation (clamp bases → apply rates)
    ↓
Deductions calculation (personal + dependents + insurance)
    ↓
Taxable income = max(0, gross - total deductions)
    ↓
PIT calculation (progressive brackets)
    ↓
Net = gross - insurance - PIT
    ↓
CalculationResult
    ↓
(If compare mode) ComparisonResult with deltas
    ↓
Display to user
```

---

## Next Steps

With data model defined, proceed to:
1. **Generate TypeScript type definitions** in `src/types/index.ts`
2. **Create contracts/** directory with interface documentation
3. **Generate quickstart.md** for development setup
