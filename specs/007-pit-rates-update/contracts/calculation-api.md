# Calculation API Contract Updates

**Feature**: 007-pit-rates-update
**Date**: December 10, 2025
**Purpose**: Contract updates for tax calculation functions with new 2025 rates

## Overview

This document specifies the updated calculation contracts reflecting the new PIT rates approved December 10, 2025. The function signatures remain unchanged—only the expected output values differ due to updated rate configuration.

---

## Updated Contracts

### calcPit() with New 2025 Rates

**Function Signature** (unchanged):
```typescript
function calcPit(taxable: number, regime: Regime): PIT
```

**Updated Examples**:

#### Example 1: Taxable = 20,000,000 VND

**OLD Result** (pre-December 10, 2025):
```typescript
{
  taxable: 20_000_000,
  items: [
    { label: "Bậc 1: 0–5,000,000 @ 5%", slab: 5_000_000, rate: 0.05, tax: 250_000 },
    { label: "Bậc 2: 5,000,000–10,000,000 @ 10%", slab: 5_000_000, rate: 0.1, tax: 500_000 },
    { label: "Bậc 3: 10,000,000–18,000,000 @ 15%", slab: 8_000_000, rate: 0.15, tax: 1_200_000 },
    { label: "Bậc 4: 18,000,000–32,000,000 @ 20%", slab: 2_000_000, rate: 0.2, tax: 400_000 }
  ],
  total: 2_350_000
}
```

**NEW Result** (post-December 10, 2025):
```typescript
{
  taxable: 20_000_000,
  items: [
    { label: "Bậc 1: 0–5,000,000 @ 5%", slab: 5_000_000, rate: 0.05, tax: 250_000 },
    { label: "Bậc 2: 5,000,000–10,000,000 @ 10%", slab: 5_000_000, rate: 0.1, tax: 500_000 },
    { label: "Bậc 3: 10,000,000–18,000,000 @ 10%", slab: 8_000_000, rate: 0.1, tax: 800_000 },
    { label: "Bậc 4: 18,000,000–32,000,000 @ 15%", slab: 2_000_000, rate: 0.15, tax: 300_000 }
  ],
  total: 1_850_000
}
```

**Change**: Total PIT reduced by 500,000 VND (21.3% reduction)

---

#### Example 2: Taxable = 45,000,000 VND

**OLD Result**:
```typescript
{
  taxable: 45_000_000,
  items: [
    { label: "Bậc 1: 0–5,000,000 @ 5%", slab: 5_000_000, rate: 0.05, tax: 250_000 },
    { label: "Bậc 2: 5,000,000–10,000,000 @ 10%", slab: 5_000_000, rate: 0.1, tax: 500_000 },
    { label: "Bậc 3: 10,000,000–18,000,000 @ 15%", slab: 8_000_000, rate: 0.15, tax: 1_200_000 },
    { label: "Bậc 4: 18,000,000–32,000,000 @ 20%", slab: 14_000_000, rate: 0.2, tax: 2_800_000 },
    { label: "Bậc 5: 32,000,000–52,000,000 @ 25%", slab: 13_000_000, rate: 0.25, tax: 3_250_000 }
  ],
  total: 8_000_000
}
```

**NEW Result**:
```typescript
{
  taxable: 45_000_000,
  items: [
    { label: "Bậc 1: 0–5,000,000 @ 5%", slab: 5_000_000, rate: 0.05, tax: 250_000 },
    { label: "Bậc 2: 5,000,000–10,000,000 @ 10%", slab: 5_000_000, rate: 0.1, tax: 500_000 },
    { label: "Bậc 3: 10,000,000–18,000,000 @ 10%", slab: 8_000_000, rate: 0.1, tax: 800_000 },
    { label: "Bậc 4: 18,000,000–32,000,000 @ 15%", slab: 14_000_000, rate: 0.15, tax: 2_100_000 },
    { label: "Bậc 5: 32,000,000–52,000,000 @ 20%", slab: 13_000_000, rate: 0.2, tax: 2_600_000 }
  ],
  total: 6_250_000
}
```

**Change**: Total PIT reduced by 1,750,000 VND (21.9% reduction)

---

#### Example 3: Boundary Case - Taxable = 10,000,000 VND (exact bracket boundary)

**Result** (same old and new, unaffected bracket):
```typescript
{
  taxable: 10_000_000,
  items: [
    { label: "Bậc 1: 0–5,000,000 @ 5%", slab: 5_000_000, rate: 0.05, tax: 250_000 },
    { label: "Bậc 2: 5,000,000–10,000,000 @ 10%", slab: 5_000_000, rate: 0.1, tax: 500_000 }
  ],
  total: 750_000
}
```

**Change**: No change (income doesn't reach affected brackets)

---

#### Example 4: Boundary Case - Taxable = 18,000,000 VND (end of affected bracket 3)

**OLD Result**:
```typescript
{
  taxable: 18_000_000,
  items: [
    { label: "Bậc 1: 0–5,000,000 @ 5%", slab: 5_000_000, rate: 0.05, tax: 250_000 },
    { label: "Bậc 2: 5,000,000–10,000,000 @ 10%", slab: 5_000_000, rate: 0.1, tax: 500_000 },
    { label: "Bậc 3: 10,000,000–18,000,000 @ 15%", slab: 8_000_000, rate: 0.15, tax: 1_200_000 }
  ],
  total: 1_950_000
}
```

**NEW Result**:
```typescript
{
  taxable: 18_000_000,
  items: [
    { label: "Bậc 1: 0–5,000,000 @ 5%", slab: 5_000_000, rate: 0.05, tax: 250_000 },
    { label: "Bậc 2: 5,000,000–10,000,000 @ 10%", slab: 5_000_000, rate: 0.1, tax: 500_000 },
    { label: "Bậc 3: 10,000,000–18,000,000 @ 10%", slab: 8_000_000, rate: 0.1, tax: 800_000 }
  ],
  total: 1_550_000
}
```

**Change**: Total PIT reduced by 400,000 VND (full benefit of bracket 3 reduction)

---

#### Example 5: Boundary Case - Taxable = 52,000,000 VND (end of affected brackets)

**OLD Result**:
```typescript
{
  taxable: 52_000_000,
  items: [
    { label: "Bậc 1: 0–5,000,000 @ 5%", slab: 5_000_000, rate: 0.05, tax: 250_000 },
    { label: "Bậc 2: 5,000,000–10,000,000 @ 10%", slab: 5_000_000, rate: 0.1, tax: 500_000 },
    { label: "Bậc 3: 10,000,000–18,000,000 @ 15%", slab: 8_000_000, rate: 0.15, tax: 1_200_000 },
    { label: "Bậc 4: 18,000,000–32,000,000 @ 20%", slab: 14_000_000, rate: 0.2, tax: 2_800_000 },
    { label: "Bậc 5: 32,000,000–52,000,000 @ 25%", slab: 20_000_000, rate: 0.25, tax: 5_000_000 }
  ],
  total: 9_750_000
}
```

**NEW Result**:
```typescript
{
  taxable: 52_000_000,
  items: [
    { label: "Bậc 1: 0–5,000,000 @ 5%", slab: 5_000_000, rate: 0.05, tax: 250_000 },
    { label: "Bậc 2: 5,000,000–10,000,000 @ 10%", slab: 5_000_000, rate: 0.1, tax: 500_000 },
    { label: "Bậc 3: 10,000,000–18,000,000 @ 10%", slab: 8_000_000, rate: 0.1, tax: 800_000 },
    { label: "Bậc 4: 18,000,000–32,000,000 @ 15%", slab: 14_000_000, rate: 0.15, tax: 2_100_000 },
    { label: "Bậc 5: 32,000,000–52,000,000 @ 20%", slab: 20_000_000, rate: 0.2, tax: 4_000_000 }
  ],
  total: 7_650_000
}
```

**Change**: Total PIT reduced by 2,100,000 VND (maximum benefit from all three affected brackets)

---

#### Example 6: High Income - Taxable = 100,000,000 VND (beyond affected brackets)

**OLD Result**:
```typescript
{
  taxable: 100_000_000,
  items: [
    { label: "Bậc 1: 0–5,000,000 @ 5%", slab: 5_000_000, rate: 0.05, tax: 250_000 },
    { label: "Bậc 2: 5,000,000–10,000,000 @ 10%", slab: 5_000_000, rate: 0.1, tax: 500_000 },
    { label: "Bậc 3: 10,000,000–18,000,000 @ 15%", slab: 8_000_000, rate: 0.15, tax: 1_200_000 },
    { label: "Bậc 4: 18,000,000–32,000,000 @ 20%", slab: 14_000_000, rate: 0.2, tax: 2_800_000 },
    { label: "Bậc 5: 32,000,000–52,000,000 @ 25%", slab: 20_000_000, rate: 0.25, tax: 5_000_000 },
    { label: "Bậc 6: 52,000,000–80,000,000 @ 30%", slab: 28_000_000, rate: 0.3, tax: 8_400_000 },
    { label: "Bậc 7: >80,000,000 @ 35%", slab: 20_000_000, rate: 0.35, tax: 7_000_000 }
  ],
  total: 25_150_000
}
```

**NEW Result**:
```typescript
{
  taxable: 100_000_000,
  items: [
    { label: "Bậc 1: 0–5,000,000 @ 5%", slab: 5_000_000, rate: 0.05, tax: 250_000 },
    { label: "Bậc 2: 5,000,000–10,000,000 @ 10%", slab: 5_000_000, rate: 0.1, tax: 500_000 },
    { label: "Bậc 3: 10,000,000–18,000,000 @ 10%", slab: 8_000_000, rate: 0.1, tax: 800_000 },
    { label: "Bậc 4: 18,000,000–32,000,000 @ 15%", slab: 14_000_000, rate: 0.15, tax: 2_100_000 },
    { label: "Bậc 5: 32,000,000–52,000,000 @ 20%", slab: 20_000_000, rate: 0.2, tax: 4_000_000 },
    { label: "Bậc 6: 52,000,000–80,000,000 @ 30%", slab: 28_000_000, rate: 0.3, tax: 8_400_000 },
    { label: "Bậc 7: >80,000,000 @ 35%", slab: 20_000_000, rate: 0.35, tax: 7_000_000 }
  ],
  total: 23_050_000
}
```

**Change**: Total PIT reduced by 2,100,000 VND (same absolute benefit as 52M case, but smaller percentage due to higher income)

---

## Test Requirements

### Updated Test Cases for `calcPit()`

All test files using REGIME_2025 must be updated:

1. **Boundary tests** (`tests/unit/tax.test.ts`):
   ```typescript
   describe('calcPit with new 2025 rates', () => {
     it('should calculate correctly at 10M boundary (unaffected)', () => {
       expect(calcPit(10_000_000, REGIME_2025).total).toBe(750_000);
     });

     it('should calculate correctly at 18M boundary (end of bracket 3)', () => {
       expect(calcPit(18_000_000, REGIME_2025).total).toBe(1_550_000); // was 1_950_000
     });

     it('should calculate correctly at 32M boundary (end of bracket 4)', () => {
       expect(calcPit(32_000_000, REGIME_2025).total).toBe(3_650_000); // was 4_750_000
     });

     it('should calculate correctly at 52M boundary (end of bracket 5)', () => {
       expect(calcPit(52_000_000, REGIME_2025).total).toBe(7_650_000); // was 9_750_000
     });

     it('should maintain same tax for income below 10M', () => {
       expect(calcPit(8_000_000, REGIME_2025).total).toBe(550_000); // unchanged
     });
   });
   ```

2. **Progressive calculation tests** (`tests/contract/calculation-api.test.ts`):
   ```typescript
   it('should calculate progressive tax correctly for middle income', () => {
     const result = calcPit(20_000_000, REGIME_2025);
     expect(result.total).toBe(1_850_000); // was 2_350_000
     expect(result.items).toHaveLength(4);
     expect(result.items[2].rate).toBe(0.1); // bracket 3 now 10%
     expect(result.items[3].rate).toBe(0.15); // bracket 4 now 15%
   });
   ```

3. **Integration tests** (`tests/integration/salary-flow.test.ts`):
   ```typescript
   it('should show reduced PIT with new rates in full calculation', () => {
     const inputs = {
       gross: 30_000_000,
       regime: REGIME_2025,
       region: 'I',
       dependents: 0,
       insuranceBase: undefined,
       isUnionMember: false
     };
     const result = calcAll(inputs);
     // Update expected values based on new rates
     expect(result.pit.total).toBeLessThan(/* old value */);
     expect(result.net).toBeGreaterThan(/* old value */);
   });
   ```

---

## Comparison Contract

### compareRegimes() Behavior

**Function Signature** (unchanged):
```typescript
function compareRegimes(
  inputs: Omit<CalculatorInputs, 'regime'>,
  lunchAllowance?: number
): ComparisonResult
```

**Expected Delta Patterns**:

For incomes with taxable amount in affected range (10M-52M):
- `deltas.pit` should be **negative** (tax reduced)
- `deltas.net` should be **positive** (net salary increased)
- Magnitude depends on how much taxable income falls in affected brackets

**Example Comparison** (Gross = 30M, Region I, no dependents):

```typescript
const comparison = compareRegimes({ gross: 30_000_000, region: 'I', dependents: 0 });

// 2025 result (new rates)
comparison.result2025.pit.total; // e.g., 2_950_000

// 2026 result (unchanged)
comparison.result2026.pit.total; // e.g., 2_150_000

// Deltas (2026 - 2025)
comparison.deltas.pit; // still negative since 2026 has lower rates overall
```

**Note**: The comparison shows 2025 vs 2026, not old 2025 vs new 2025. This feature updates REGIME_2025 in place, so comparisons will reflect the new rates going forward.

---

## UI Component Contracts

### PITBreakdown Component

**Props** (unchanged):
```typescript
interface PITBreakdownProps {
  pit: PIT;
}
```

**Rendering Changes**:
- Labels automatically update to show "@ 10%" for bracket 3, "@ 15%" for bracket 4, "@ 20%" for bracket 5
- Tax amounts will be lower for affected brackets
- Total PIT displayed will be reduced for middle-income users

**No component code changes required** - component is data-driven.

---

## Validation Rules

### Rate Monotonicity Check

After updating brackets, verify rates are monotonically non-decreasing:

```typescript
const rates = REGIME_2025.brackets.map(b => b.rate);
for (let i = 1; i < rates.length; i++) {
  if (rates[i] < rates[i - 1]) {
    throw new Error(`Rate regression at bracket ${i}: ${rates[i]} < ${rates[i-1]}`);
  }
}
```

**Result**: ✅ PASS
```
[0.05, 0.1, 0.1, 0.15, 0.2, 0.3, 0.35] // Valid: non-decreasing
```

---

## Backward Compatibility

**Breaking Changes**: None

**Reason**:
- Function signatures unchanged
- Return type structure unchanged
- Only configuration data values differ
- Existing client code continues to work without modification

**Migration Path**: Update test expectations only.

---

## Related Files

- **Implementation**: `src/config/constants.ts` (REGIME_2025 brackets)
- **Calculation Logic**: `src/lib/tax.ts` (calcPit function - no changes)
- **Test Files**:
  - `tests/unit/tax.test.ts`
  - `tests/contract/calculation-api.test.ts`
  - `tests/integration/salary-flow.test.ts`
