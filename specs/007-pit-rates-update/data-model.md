# Data Model: Update 2026 Personal Income Tax Rates

**Feature**: 007-pit-rates-update
**Date**: December 10, 2025
**Purpose**: Data model changes and entity definitions for 2026 PIT rate update

## Overview

This feature updates the 2026 tax regime configuration data without changing the underlying data model structure. All existing types and interfaces remain unchanged. REGIME_2025 remains unchanged. This document describes the REGIME_2026 configuration changes and their impact on calculation results.

## Modified Entities

### REGIME_2026 (Configuration Data)

**Location**: `src/config/constants.ts`

**Current Structure** (unchanged):
```typescript
interface Regime {
  id: string;
  personalDeduction: number;
  dependentDeduction: number;
  brackets: TaxBracket[];
}

interface TaxBracket {
  threshold: number | "inf";
  rate: number;
}
```

**Configuration Changes**:

**OLD VALUES** (originally proposed 2026 regime, before December 10, 2025):
```typescript
export const REGIME_2026: Regime = {
  id: '2026',
  personalDeduction: 15_500_000,
  dependentDeduction: 6_200_000,
  brackets: [
    { threshold: 10_000_000, rate: 0.05 },  // 0-10M @ 5%
    { threshold: 30_000_000, rate: 0.15 },  // 10-30M @ 15% ← CHANGED
    { threshold: 60_000_000, rate: 0.25 },  // 30-60M @ 25% ← CHANGED
    { threshold: 100_000_000, rate: 0.3 },  // 60-100M @ 30%
    { threshold: 'inf', rate: 0.35 },       // >100M @ 35%
  ],
};
```

**NEW VALUES** (approved December 10, 2025, effective 2026):
```typescript
export const REGIME_2026: Regime = {
  id: '2026',
  personalDeduction: 15_500_000,
  dependentDeduction: 6_200_000,
  brackets: [
    { threshold: 10_000_000, rate: 0.05 },  // 0-10M @ 5%
    { threshold: 30_000_000, rate: 0.1 },   // 10-30M @ 10% (was 15%)
    { threshold: 60_000_000, rate: 0.2 },   // 30-60M @ 20% (was 25%)
    { threshold: 100_000_000, rate: 0.3 },  // 60-100M @ 30%
    { threshold: 'inf', rate: 0.35 },       // >100M @ 35%
  ],
};
```

**Change Summary**:
- Bracket 2 (10M-30M): `rate: 0.15` → `rate: 0.1` (5% reduction)
- Bracket 3 (30M-60M): `rate: 0.25` → `rate: 0.2` (5% reduction)
- All other brackets: No changes
- Deductions: No changes (15.5M personal, 6.2M dependent remain as proposed)

**Validation Rules** (unchanged):
- `threshold` must be positive integer or `"inf"`
- `rate` must be between 0 and 1 (inclusive)
- Brackets must be ordered by ascending threshold
- Rates must be monotonically non-decreasing

---

## Unchanged Entities

The following entities are not modified by this feature:

### REGIME_2025
**No changes**. The current 2025 regime remains intact with its original 7 tax brackets (5%, 10%, 15%, 20%, 25%, 30%, 35%) and deductions (11M personal, 4.4M dependent).

### TaxBracket
Type structure remains identical. Only REGIME_2026 configuration data values change.

### Insurance, InsuranceBases
No changes. Insurance calculations use regional minimums and base salary, not tax brackets.

### Deductions
No changes to REGIME_2025 deductions. REGIME_2026 deductions remain as originally proposed (15.5M personal, 6.2M dependent).

### PIT, PITItem
No changes. These are calculation output types. The calculation algorithm in `calcPit()` is data-driven and automatically applies new rates from the brackets array.

### CalculationResult, ComparisonResult
No changes. Output structure remains identical.

### UI State (PreferencesState, CalculatorInputs)
No changes. User input structure is unchanged.

---

## Calculation Impact Examples

### Example 1: Taxable Income = 20,000,000 VND (Middle-income earner)

**OLD calculation**:
```
Bracket 1: 5,000,000 × 5% = 250,000
Bracket 2: 5,000,000 × 10% = 500,000
Bracket 3: 8,000,000 × 15% = 1,200,000  ← affected
Bracket 4: 2,000,000 × 20% = 400,000    ← affected
Total PIT: 2,350,000 VND
```

**NEW calculation**:
```
Bracket 1: 5,000,000 × 5% = 250,000
Bracket 2: 5,000,000 × 10% = 500,000
Bracket 3: 8,000,000 × 10% = 800,000    ← reduced by 400,000
Bracket 4: 2,000,000 × 15% = 300,000    ← reduced by 100,000
Total PIT: 1,850,000 VND
```

**Savings**: 500,000 VND (21.3% reduction in tax liability)

---

### Example 2: Taxable Income = 45,000,000 VND (Upper-middle income)

**OLD calculation**:
```
Bracket 1: 5,000,000 × 5% = 250,000
Bracket 2: 5,000,000 × 10% = 500,000
Bracket 3: 8,000,000 × 15% = 1,200,000  ← affected
Bracket 4: 14,000,000 × 20% = 2,800,000 ← affected
Bracket 5: 13,000,000 × 25% = 3,250,000 ← affected
Total PIT: 8,000,000 VND
```

**NEW calculation**:
```
Bracket 1: 5,000,000 × 5% = 250,000
Bracket 2: 5,000,000 × 10% = 500,000
Bracket 3: 8,000,000 × 10% = 800,000    ← reduced by 400,000
Bracket 4: 14,000,000 × 15% = 2,100,000 ← reduced by 700,000
Bracket 5: 13,000,000 × 20% = 2,600,000 ← reduced by 650,000
Total PIT: 6,250,000 VND
```

**Savings**: 1,750,000 VND (21.9% reduction in tax liability)

---

### Example 3: Taxable Income = 8,000,000 VND (Low income, unaffected)

**OLD and NEW calculation** (identical):
```
Bracket 1: 5,000,000 × 5% = 250,000
Bracket 2: 3,000,000 × 10% = 300,000
Total PIT: 550,000 VND
```

**Savings**: 0 VND (no brackets affected)

---

### Example 4: Taxable Income = 100,000,000 VND (High income)

**OLD calculation**:
```
Bracket 1: 5M × 5% = 250,000
Bracket 2: 5M × 10% = 500,000
Bracket 3: 8M × 15% = 1,200,000    ← affected
Bracket 4: 14M × 20% = 2,800,000   ← affected
Bracket 5: 20M × 25% = 5,000,000   ← affected
Bracket 6: 28M × 30% = 8,400,000
Bracket 7: 20M × 35% = 7,000,000
Total PIT: 25,150,000 VND
```

**NEW calculation**:
```
Bracket 1: 5M × 5% = 250,000
Bracket 2: 5M × 10% = 500,000
Bracket 3: 8M × 10% = 800,000      ← reduced by 400,000
Bracket 4: 14M × 15% = 2,100,000   ← reduced by 700,000
Bracket 5: 20M × 20% = 4,000,000   ← reduced by 1,000,000
Bracket 6: 28M × 30% = 8,400,000
Bracket 7: 20M × 35% = 7,000,000
Total PIT: 23,050,000 VND
```

**Savings**: 2,100,000 VND (8.3% reduction in tax liability)

---

## Boundary Conditions

Critical test cases for bracket transitions:

| Taxable Income | Brackets Crossed | Old PIT | New PIT | Savings |
|----------------|------------------|---------|---------|---------|
| 10,000,000 | 1-2 (unaffected) | 750,000 | 750,000 | 0 |
| 10,000,001 | 1-3 (starts affected) | 750,000 | 750,000 | ~0 |
| 18,000,000 | 1-3 (fully affected) | 1,950,000 | 1,550,000 | 400,000 |
| 18,000,001 | 1-4 (starts 2nd affected) | 1,950,000 | 1,550,000 | ~400,000 |
| 32,000,000 | 1-4 (fully affected) | 4,750,000 | 3,650,000 | 1,100,000 |
| 32,000,001 | 1-5 (starts 3rd affected) | 4,750,000 | 3,650,000 | ~1,100,000 |
| 52,000,000 | 1-5 (fully affected) | 9,750,000 | 7,650,000 | 2,100,000 |
| 52,000,001 | 1-6 (exits affected range) | 9,750,000 | 7,650,000 | ~2,100,000 |
| 80,000,000 | 1-6 (no change above 52M) | 18,150,000 | 16,050,000 | 2,100,000 |

**Note**: Savings plateau at 2,100,000 VND for incomes above 52M since higher brackets are unchanged.

---

## Data Migration

**Not applicable**. This is a configuration change only. No database schema changes, no data migration scripts needed.

---

## Rollback Strategy

**Approach**: Git revert

If the new rates need to be rolled back:
1. `git revert <commit-hash>` to restore old bracket rates
2. Re-run test suite to verify old calculations
3. Redeploy to GitHub Pages

**Data integrity**: No user data is affected (client-side only, no persistence).

---

## Related Documentation

- **Spec**: [spec.md](./spec.md) - Functional requirements and user stories
- **Research**: [research.md](./research.md) - Decision rationale and alternatives
- **Contracts**: [contracts/calculation-api.md](./contracts/calculation-api.md) - Updated API examples
- **Quickstart**: [quickstart.md](./quickstart.md) - User guide with new rates
