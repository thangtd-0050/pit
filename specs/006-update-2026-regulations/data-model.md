# Data Model: Update 2026 Regulations

**Feature**: Update 2026 Regulations
**Status**: Draft
**Date**: 2025-11-19

## Constants

### Regional Minimum Wages (RMW)

We will introduce versioned constants for RMW to support multiple years.

```typescript
// src/config/constants.ts

// Existing (renamed or aliased for 2025)
export const REGIONAL_MINIMUMS_2025: Record<RegionId, RegionConfig> = {
  I: { minWage: 4_960_000 },
  II: { minWage: 4_410_000 },
  III: { minWage: 3_860_000 },
  IV: { minWage: 3_450_000 },
};

// New for 2026
export const REGIONAL_MINIMUMS_2026: Record<RegionId, RegionConfig> = {
  I: { minWage: 5_310_000 },
  II: { minWage: 4_730_000 },
  III: { minWage: 4_140_000 },
  IV: { minWage: 3_700_000 },
};
```

### Unemployment Insurance Caps

The UI caps are derived from RMW. Since RMW is now dynamic based on year, the caps will also be dynamic.

```typescript
// src/config/constants.ts

// Helper to get cap based on RMW
export const getCapUI = (regionalMin: number) => 20 * regionalMin;
```

## Entity Updates

### CalculatorInputs

No changes to the interface, but the `regime` field (which contains `id: '2025' | '2026'`) will now determine which RMW set is used.

### Calculation Logic

The `calcAll` function in `src/lib/tax.ts` will be updated to select the correct RMW based on `inputs.regime.id`.

```typescript
// src/lib/tax.ts

export function calcAll(inputs: CalculatorInputs, lunchAllowance?: number): CalculationResult {
  // Select RMW based on regime ID
  const regionalMinimums = inputs.regime.id === '2026'
    ? REGIONAL_MINIMUMS_2026
    : REGIONAL_MINIMUMS_2025;

  const regionalMin = regionalMinimums[inputs.region].minWage;

  // ... rest of calculation uses this regionalMin
}
```
