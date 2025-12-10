# Quickstart Guide: Update 2025 Personal Income Tax Rates

**Feature**: 007-pit-rates-update
**Date**: December 10, 2025
**Audience**: Developers implementing the PIT rate update

## Overview

This guide walks you through implementing the newly approved Personal Income Tax rate changes that reduce rates for middle-income earners. The update involves modifying tax bracket configurations and updating related tests.

**What Changed**:
- 10M-18M bracket: 15% → 10%
- 18M-32M bracket: 20% → 15%
- 32M-52M bracket: 25% → 20%
- All other brackets: No changes

**Impact**: Users earning in the 10M-52M VND taxable income range will see reduced tax liability and increased net salary.

---

## Prerequisites

- Node.js 18+ and pnpm installed
- Existing PIT calculator codebase cloned
- Branch `007-pit-rates-update` checked out
- Familiarity with TypeScript and Vitest

---

## Quick Start (5 steps)

### Step 1: Update Tax Brackets Configuration

**File**: `src/config/constants.ts`

**Locate** the REGIME_2025 constant (around line 90):

```typescript
export const REGIME_2025: Regime = {
  id: '2025',
  personalDeduction: 11_000_000,
  dependentDeduction: 4_400_000,
  brackets: [
    { threshold: 5_000_000, rate: 0.05 },
    { threshold: 10_000_000, rate: 0.1 },
    { threshold: 18_000_000, rate: 0.15 },  // ← CHANGE to 0.1
    { threshold: 32_000_000, rate: 0.2 },   // ← CHANGE to 0.15
    { threshold: 52_000_000, rate: 0.25 },  // ← CHANGE to 0.2
    { threshold: 80_000_000, rate: 0.3 },
    { threshold: 'inf', rate: 0.35 },
  ],
};
```

**Update** to new rates:

```typescript
/**
 * Tax regime for 2025 (updated December 10, 2025 per approved law).
 * - Personal deduction: 11,000,000 VND
 * - Dependent deduction: 4,400,000 VND per dependent
 * - 7 progressive tax brackets from 5% to 35%
 *
 * RATE CHANGES (effective December 10, 2025):
 * Law passed by National Assembly with 92%+ approval
 * - 10M-18M bracket: 15% → 10% (reduced by 5%)
 * - 18M-32M bracket: 20% → 15% (reduced by 5%)
 * - 32M-52M bracket: 25% → 20% (reduced by 5%)
 * - Other brackets unchanged
 */
export const REGIME_2025: Regime = {
  id: '2025',
  personalDeduction: 11_000_000,
  dependentDeduction: 4_400_000,
  brackets: [
    { threshold: 5_000_000, rate: 0.05 },   // 0-5M @ 5%
    { threshold: 10_000_000, rate: 0.1 },   // 5-10M @ 10%
    { threshold: 18_000_000, rate: 0.1 },   // 10-18M @ 10% (was 15%)
    { threshold: 32_000_000, rate: 0.15 },  // 18-32M @ 15% (was 20%)
    { threshold: 52_000_000, rate: 0.2 },   // 32-52M @ 20% (was 25%)
    { threshold: 80_000_000, rate: 0.3 },   // 52-80M @ 30%
    { threshold: 'inf', rate: 0.35 },       // >80M @ 35%
  ],
};
```

**Verify**: Run `npm run lint` to ensure no syntax errors.

---

### Step 2: Update Unit Tests

**File**: `tests/unit/tax.test.ts`

**Locate** the `describe('calcPit')` block and update test expectations:

```typescript
describe('calcPit with 2025 rates', () => {
  it('should handle boundary at 18M (end of bracket 3)', () => {
    const pit = calcPit(18_000_000, REGIME_2025);
    expect(pit.total).toBe(1_550_000); // OLD: 1_950_000
    expect(pit.items[2].rate).toBe(0.1); // Bracket 3 now 10%
  });

  it('should handle boundary at 32M (end of bracket 4)', () => {
    const pit = calcPit(32_000_000, REGIME_2025);
    expect(pit.total).toBe(3_650_000); // OLD: 4_750_000
    expect(pit.items[3].rate).toBe(0.15); // Bracket 4 now 15%
  });

  it('should handle boundary at 52M (end of bracket 5)', () => {
    const pit = calcPit(52_000_000, REGIME_2025);
    expect(pit.total).toBe(7_650_000); // OLD: 9_750_000
    expect(pit.items[4].rate).toBe(0.2); // Bracket 5 now 20%
  });

  it('should calculate progressive tax for middle income', () => {
    const pit = calcPit(20_000_000, REGIME_2025);
    expect(pit.total).toBe(1_850_000); // OLD: 2_350_000
    expect(pit.items).toHaveLength(4);
  });

  it('should not change tax for low income (< 10M)', () => {
    const pit = calcPit(8_000_000, REGIME_2025);
    expect(pit.total).toBe(550_000); // Unchanged
  });
});
```

**Run**: `pnpm test tests/unit/tax.test.ts` to verify.

---

### Step 3: Update Contract Tests

**File**: `tests/contract/calculation-api.test.ts`

**Update** the `calcAll()` integration test expectations:

```typescript
describe('calcAll with new 2025 rates', () => {
  it('should calculate full salary flow with reduced PIT', () => {
    const inputs: CalculatorInputs = {
      gross: 30_000_000,
      regime: REGIME_2025,
      region: 'I',
      dependents: 0,
      insuranceBase: undefined,
      isUnionMember: false,
    };

    const result = calcAll(inputs);

    // Insurance unchanged
    expect(result.insurance.total).toBe(3_150_000);

    // Deductions unchanged
    expect(result.deductions.total).toBe(14_150_000);

    // Taxable income unchanged
    expect(result.pit.taxable).toBe(15_850_000);

    // PIT REDUCED due to new rates
    expect(result.pit.total).toBe(1_292_500); // OLD: 1_632_500

    // Net salary INCREASED
    expect(result.net).toBe(25_557_500); // OLD: 25_217_500
  });
});
```

**Run**: `pnpm test tests/contract/` to verify contract compliance.

---

### Step 4: Update Integration Tests

**File**: `tests/integration/salary-flow.test.ts`

**Update** end-to-end test scenarios with new expected values:

```typescript
describe('Salary calculation flow with new rates', () => {
  it('should show tax reduction for middle-income user', () => {
    // Simulate user entering 25M gross salary
    const result = calcAll({
      gross: 25_000_000,
      regime: REGIME_2025,
      region: 'I',
      dependents: 1,
      insuranceBase: undefined,
      isUnionMember: false,
    });

    // Verify reduced PIT
    const oldExpectedPIT = 1_487_500; // What it would be with old rates
    expect(result.pit.total).toBeLessThan(oldExpectedPIT);
    expect(result.pit.total).toBe(1_147_500); // New expected value

    // Verify increased net
    const oldExpectedNet = 19_412_500; // What it would be with old rates
    expect(result.net).toBeGreaterThan(oldExpectedNet);
    expect(result.net).toBe(19_752_500); // New expected value
  });
});
```

**Run**: `pnpm test tests/integration/` to verify.

---

### Step 5: Add Law Notification Banner (Optional - FR-006)

**File**: `src/components/Header.tsx`

**Add** informational banner about the new law:

```tsx
export function Header() {
  const [showBanner, setShowBanner] = useState(true);

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('pit-banner-dismissed', 'true');
  };

  useEffect(() => {
    const dismissed = localStorage.getItem('pit-banner-dismissed');
    if (dismissed) setShowBanner(false);
  }, []);

  return (
    <>
      {showBanner && (
        <div className="bg-blue-50 dark:bg-blue-950 border-b border-blue-200 dark:border-blue-800 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <span className="font-semibold">ℹ️ Cập nhật thuế TNCN 2025:</span> Áp dụng thuế suất mới
              (10% cho 10-18 triệu, 15% cho 18-32 triệu, 20% cho 32-52 triệu) theo luật
              thông qua ngày 10/12/2025 với 92%+ tán thành.
            </p>
            <button
              onClick={dismissBanner}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              aria-label="Đóng thông báo"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <header className="border-b">
        {/* Existing header content */}
      </header>
    </>
  );
}
```

---

## Verification Checklist

Before committing, verify:

- [ ] `src/config/constants.ts` has updated rates (0.1, 0.15, 0.2)
- [ ] Comments document law passage date (December 10, 2025)
- [ ] All unit tests pass: `pnpm test tests/unit/`
- [ ] All contract tests pass: `pnpm test tests/contract/`
- [ ] All integration tests pass: `pnpm test tests/integration/`
- [ ] Linting clean: `pnpm run lint`
- [ ] Type checking clean: `pnpm run type-check`
- [ ] Dev server runs: `pnpm dev` and manual test calculation
- [ ] Banner displays (if implemented)

---

## Testing Examples

### Manual Test Cases

Run dev server (`pnpm dev`) and test these scenarios:

1. **Low income (unaffected)**:
   - Gross: 15,000,000
   - Region: I
   - Dependents: 0
   - Expected: No tax change vs old rates

2. **Middle income (affected)**:
   - Gross: 30,000,000
   - Region: I
   - Dependents: 0
   - Expected: PIT reduced, Net increased

3. **High income (partially affected)**:
   - Gross: 80,000,000
   - Region: I
   - Dependents: 2
   - Expected: PIT reduced by max 2.1M (savings from affected brackets)

4. **Boundary test**:
   - Gross: 21,000,000 (taxable ~10M, right at bracket 3 start)
   - Region: I
   - Dependents: 0
   - Expected: Entire taxable amount benefits from 10% rate

---

## Troubleshooting

### Tests Failing with "Expected X but got Y"

**Cause**: Test expectations still have old values.

**Fix**: Update `expect()` assertions to match new rates. Use the contracts document ([contracts/calculation-api.md](./contracts/calculation-api.md)) for correct expected values.

### Linting Error: "Rate must be monotonically increasing"

**Cause**: Typo in rate values (e.g., 0.1 instead of 0.15).

**Fix**: Verify brackets array has rates in order: `[0.05, 0.1, 0.1, 0.15, 0.2, 0.3, 0.35]`. Note bracket 2 and 3 both have 0.1 (this is correct).

### TypeScript Error: "Type 'number' is not assignable to type 'never'"

**Cause**: Type inference issue (rare).

**Fix**: Ensure `Regime` type import is correct and `brackets` array matches `TaxBracket[]` type.

---

## Additional Resources

- **Spec**: [spec.md](./spec.md) - Full feature requirements
- **Research**: [research.md](./research.md) - Decision rationale
- **Data Model**: [data-model.md](./data-model.md) - Calculation examples
- **Contracts**: [contracts/calculation-api.md](./contracts/calculation-api.md) - API contract updates

---

## Summary

This is a **configuration-only update**:
- ✅ Update 3 rate values in `src/config/constants.ts`
- ✅ Update test expectations across 3 test files
- ✅ Add optional banner for user notification
- ✅ No changes to calculation logic, types, or component code

**Time estimate**: 1-2 hours including testing.

**Risk level**: Low (isolated config change, comprehensive test coverage).
