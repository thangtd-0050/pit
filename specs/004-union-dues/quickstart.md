# Quickstart Guide: Union Dues Calculation

**Feature**: Union Dues Calculation
**Branch**: `004-union-dues`
**Audience**: Developers implementing this feature
**Time to Complete**: ~2-3 hours for core implementation

---

## Overview

This guide walks you through implementing union dues calculation for the Vietnam salary calculator. Union dues are optional deductions for union members, calculated at 0.5% of insurance base (max 234,000 VND).

**What You'll Build**:
- ✅ Checkbox to toggle union member status
- ✅ Union dues calculation function
- ✅ Integration with existing calculator store
- ✅ Breakdown display showing dues
- ✅ URL state persistence
- ✅ Comprehensive test suite

---

## Prerequisites

- Existing calculator codebase (features 001-003 complete)
- React 18.2, TypeScript 5.3, Zustand 4.4, Vitest 4.0
- Familiarity with existing calculation flow (tax.ts, calculatorStore.ts)

---

## Quick Start (30 minutes for MVP)

### Step 1: Add Constants (2 minutes)

Add union dues constants to `src/config/constants.ts`:

```typescript
// src/config/constants.ts

// Existing constant
export const BASE_SALARY = 2_340_000;

// NEW: Union dues constants
/**
 * Union dues rate (0.5% of insurance base)
 * Source: Circular 12/2017/TT-BLĐTBXH
 */
export const UNION_DUES_RATE = 0.005;

/**
 * Maximum union dues cap (10% of base salary = 234,000 VND)
 * Source: Decree 191/2013/NĐ-CP, Article 24
 */
export const UNION_DUES_MAX_RATIO = 0.1;
export const UNION_DUES_MAX = BASE_SALARY * UNION_DUES_MAX_RATIO; // 234,000
```

---

### Step 2: Add Types (3 minutes)

Update `src/types/index.ts` with union dues types:

```typescript
// src/types/index.ts

// NEW: Union dues calculation result
export interface UnionDues {
  amount: number;           // Calculated dues (0-234,000 VND)
  calculationBase: number;  // Insurance base used
  cappedAtMax: boolean;     // Whether 234K cap was hit
  rate: number;             // Always 0.005
  maxAmount: number;        // Always 234,000
}

// EXTEND: Add to existing CalculationResult interface
export interface CalculationResult {
  // ... existing fields
  unionDues?: UnionDues;    // NEW: Present only if union member
  finalNet: number;         // NEW: NET after union dues
}
```

---

### Step 3: Create Calculation Function (10 minutes)

Create `src/lib/union-dues.ts`:

```typescript
// src/lib/union-dues.ts

import { UNION_DUES_RATE, UNION_DUES_MAX } from '@/config/constants';
import type { UnionDues } from '@/types';

/**
 * Calculate union dues for union members
 *
 * Formula: min(insuranceBase × 0.5%, 234,000 VND)
 *
 * @param insuranceBase - Social insurance base salary in VND
 * @returns Union dues calculation result
 * @throws Error if insuranceBase is invalid
 *
 * @example
 * // Normal case (no cap)
 * calculateUnionDues(30_000_000);
 * // → { amount: 150_000, cappedAtMax: false, ... }
 *
 * @example
 * // High salary (capped at max)
 * calculateUnionDues(58_500_000);
 * // → { amount: 234_000, cappedAtMax: true, ... }
 */
export function calculateUnionDues(insuranceBase: number): UnionDues {
  // Validation
  if (typeof insuranceBase !== 'number' || !isFinite(insuranceBase)) {
    throw new Error('Insurance base must be a valid finite number');
  }
  if (insuranceBase < 0) {
    throw new Error('Insurance base must be non-negative');
  }

  // Calculate base amount (0.5% of insurance base)
  const baseAmount = insuranceBase * UNION_DUES_RATE;

  // Apply maximum cap (234,000 VND)
  const amount = Math.min(baseAmount, UNION_DUES_MAX);

  return {
    amount: Math.round(amount),  // Round to whole VND
    calculationBase: insuranceBase,
    cappedAtMax: amount === UNION_DUES_MAX,
    rate: UNION_DUES_RATE,
    maxAmount: UNION_DUES_MAX,
  };
}

/**
 * Calculate final take-home pay after union dues
 *
 * @param netSalary - NET salary after tax and insurance
 * @param unionDues - Union dues object (undefined if not union member)
 * @returns Final take-home pay
 */
export function calculateFinalNet(
  netSalary: number,
  unionDues: UnionDues | undefined
): number {
  if (unionDues === undefined) {
    return netSalary;
  }
  const finalNet = netSalary - unionDues.amount;
  if (finalNet < 0) {
    throw new Error('Final NET cannot be negative (union dues exceed NET salary)');
  }
  return finalNet;
}
```

---

### Step 4: Update Store (5 minutes)

Add union member state to `src/store/calculatorStore.ts`:

```typescript
// src/store/calculatorStore.ts

interface CalculatorStore {
  // ... existing fields

  // NEW: Union member status
  isUnionMember: boolean;
  setIsUnionMember: (value: boolean) => void;
}

export const useCalculatorStore = create<CalculatorStore>((set) => ({
  // ... existing state

  // NEW: Default to false (opt-in)
  isUnionMember: false,
  setIsUnionMember: (value) => set({ isUnionMember: value }),
}));
```

---

### Step 5: Create Checkbox Component (10 minutes)

Create `src/components/UnionDuesCheckbox.tsx`:

```typescript
// src/components/UnionDuesCheckbox.tsx

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { InfoTooltip } from '@/components/InfoTooltip';
import { useCalculatorStore } from '@/store/calculatorStore';

export function UnionDuesCheckbox() {
  const isUnionMember = useCalculatorStore((state) => state.isUnionMember);
  const setIsUnionMember = useCalculatorStore((state) => state.setIsUnionMember);

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="union-member"
        checked={isUnionMember}
        onCheckedChange={(checked) => setIsUnionMember(checked === true)}
        aria-label="Toggle union member status"
      />
      <Label htmlFor="union-member" className="flex items-center gap-1">
        Đoàn viên công đoàn
        <InfoTooltip content="Đoàn phí công đoàn = 0.5% cơ sở BHXH (tối đa 234,000 VND/tháng)" />
      </Label>
    </div>
  );
}
```

---

### Step 6: MVP Test ✅

At this point, you have a working MVP! Test it:

1. Import `UnionDuesCheckbox` in `GrossSalaryInput.tsx`
2. Add checkbox below insurance settings
3. Run `pnpm dev` and test:
   - [ ] Checkbox toggles state
   - [ ] Store updates correctly
   - [ ] No console errors

---

## Full Implementation (2-3 hours)

### Update Calculation Logic

Modify your main calculation function to include union dues:

```typescript
// In your calculation logic (e.g., src/lib/calculateSalary.ts or store)

import { calculateUnionDues, calculateFinalNet } from '@/lib/union-dues';

function calculateSalary(inputs: CalculatorInputs): CalculationResult {
  // ... existing calculations (insurance, deductions, PIT, NET)

  const net = grossSalary - totalInsurance - pit;

  // NEW: Calculate union dues if union member
  const unionDues = inputs.isUnionMember
    ? calculateUnionDues(insuranceBase)
    : undefined;

  // NEW: Calculate final NET
  const finalNet = calculateFinalNet(net, unionDues);

  return {
    // ... existing fields
    net,
    unionDues,    // NEW
    finalNet,     // NEW
  };
}
```

---

### Update Result Display

Add union dues row to `ResultDisplay.tsx`:

```typescript
// src/components/ResultDisplay.tsx

export function ResultDisplay({ result }: { result: CalculationResult }) {
  return (
    <div className="space-y-4">
      {/* ... existing rows (GROSS, insurance, PIT, NET) */}

      {/* NEW: Union dues row (only if union member) */}
      {result.unionDues && (
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1">
            Đoàn phí công đoàn
            {result.unionDues.cappedAtMax && (
              <InfoTooltip content="Đã áp mức tối đa 10% lương cơ sở" />
            )}
          </span>
          <span className="text-red-600">
            -{formatCurrency(result.unionDues.amount)}
          </span>
        </div>
      )}

      {/* NEW: Final NET (replaces or supplements existing NET display) */}
      <div className="flex justify-between items-center border-t-2 pt-2 font-bold">
        <span>Lương thực nhận cuối cùng</span>
        <span className="text-green-600">
          {formatCurrency(result.finalNet)}
        </span>
      </div>
    </div>
  );
}
```

---

### Add URL State Persistence

Update URL state utilities (e.g., `src/lib/url-state.ts`):

```typescript
// src/lib/url-state.ts

// Serialize
export function serializeToURL(inputs: CalculatorInputs): string {
  const params = new URLSearchParams();

  // ... existing parameters

  // NEW: Union member flag
  if (inputs.isUnionMember) {
    params.set('u', '1');
  }

  return params.toString();
}

// Deserialize
export function deserializeFromURL(search: string): Partial<CalculatorInputs> {
  const params = new URLSearchParams(search);

  return {
    // ... existing fields
    isUnionMember: params.get('u') === '1',  // NEW
  };
}
```

---

## Testing (1 hour)

### Unit Tests

Create `tests/unit/union-dues.test.ts`:

```typescript
// tests/unit/union-dues.test.ts

import { describe, it, expect } from 'vitest';
import { calculateUnionDues, calculateFinalNet } from '@/lib/union-dues';

describe('calculateUnionDues', () => {
  it('calculates 0.5% of insurance base (no cap)', () => {
    const result = calculateUnionDues(30_000_000);
    expect(result.amount).toBe(150_000);
    expect(result.cappedAtMax).toBe(false);
  });

  it('caps at 234,000 VND for high salaries', () => {
    const result = calculateUnionDues(58_500_000);
    expect(result.amount).toBe(234_000);
    expect(result.cappedAtMax).toBe(true);
  });

  it('returns 0 for zero insurance base', () => {
    const result = calculateUnionDues(0);
    expect(result.amount).toBe(0);
  });

  it('throws on negative insurance base', () => {
    expect(() => calculateUnionDues(-1000)).toThrow();
  });

  it('includes all required fields', () => {
    const result = calculateUnionDues(30_000_000);
    expect(result).toHaveProperty('amount');
    expect(result).toHaveProperty('calculationBase');
    expect(result).toHaveProperty('cappedAtMax');
    expect(result).toHaveProperty('rate', 0.005);
    expect(result).toHaveProperty('maxAmount', 234_000);
  });
});

describe('calculateFinalNet', () => {
  it('returns NET unchanged if no union dues', () => {
    expect(calculateFinalNet(24_000_000, undefined)).toBe(24_000_000);
  });

  it('subtracts union dues from NET', () => {
    const unionDues = calculateUnionDues(30_000_000); // 150,000
    expect(calculateFinalNet(24_000_000, unionDues)).toBe(23_850_000);
  });
});
```

Run tests: `pnpm test union-dues.test.ts`

---

### Integration Tests

Create `tests/integration/union-dues.integration.test.tsx`:

```typescript
// tests/integration/union-dues.integration.test.tsx

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnionDuesCheckbox } from '@/components/UnionDuesCheckbox';
import { useCalculatorStore } from '@/store/calculatorStore';

describe('Union Dues Integration', () => {
  it('toggles union member status when checkbox clicked', async () => {
    render(<UnionDuesCheckbox />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(useCalculatorStore.getState().isUnionMember).toBe(true);
  });

  it('displays union dues in result when enabled', () => {
    // TODO: Render full calculator, check checkbox, verify breakdown shows dues
  });
});
```

---

## Comparison Mode Support

If your calculator has a comparison mode (2025 vs 2026), update it:

```typescript
// In ComparisonView.tsx or similar

function ComparisonTable({ result2025, result2026 }: Props) {
  return (
    <table>
      {/* ... existing rows */}

      {/* NEW: Union dues row (same in both columns) */}
      {result2025.unionDues && (
        <tr>
          <td>Đoàn phí công đoàn</td>
          <td>{formatCurrency(result2025.unionDues.amount)}</td>
          <td>{formatCurrency(result2026.unionDues.amount)}</td>
          <td>0</td> {/* Delta is always 0 (dues don't depend on tax regime) */}
        </tr>
      )}

      {/* NEW: Final NET (now shows delta including union dues impact) */}
      <tr>
        <td>Lương thực nhận cuối cùng</td>
        <td>{formatCurrency(result2025.finalNet)}</td>
        <td>{formatCurrency(result2026.finalNet)}</td>
        <td>{formatCurrency(result2026.finalNet - result2025.finalNet)}</td>
      </tr>
    </table>
  );
}
```

---

## Documentation Updates

### Update README.md

Add union dues feature to features list:

```markdown
### 🧮 Tính Toán Chính Xác
- **Đoàn phí công đoàn**: Tùy chọn tính đoàn phí (0.5% cơ sở BHXH, max 234K VND) cho đoàn viên
```

---

## Checklist

### Implementation
- [ ] Constants added to `constants.ts`
- [ ] Types added to `types/index.ts`
- [ ] Calculation function created in `lib/union-dues.ts`
- [ ] Store updated with `isUnionMember` state
- [ ] Checkbox component created
- [ ] Result display updated to show union dues
- [ ] URL state serialization/deserialization
- [ ] Comparison mode support (if applicable)

### Testing
- [ ] Unit tests for `calculateUnionDues` (5+ test cases)
- [ ] Unit tests for `calculateFinalNet`
- [ ] Integration test for checkbox toggle
- [ ] Integration test for calculation flow
- [ ] Test coverage ≥80%
- [ ] All tests passing

### Quality
- [ ] TypeScript strict mode (no errors)
- [ ] ESLint passing
- [ ] Accessibility: ARIA labels, keyboard navigation
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] JSDoc comments on public functions

### Documentation
- [ ] README.md updated
- [ ] Inline code comments
- [ ] This quickstart guide validated

---

## Troubleshooting

### Issue: Checkbox doesn't update state

**Solution**: Ensure `onCheckedChange` callback correctly handles boolean vs `CheckedState`:

```typescript
onCheckedChange={(checked) => setIsUnionMember(checked === true)}
//                                                  ^^^^^^^^^^^ Important!
```

### Issue: Union dues not showing in breakdown

**Solution**: Check that `result.unionDues` is defined:
- Store has `isUnionMember = true`
- Calculation logic includes union dues when `isUnionMember` is true
- Result display conditionally renders `{result.unionDues && ...}`

### Issue: URL state not persisting

**Solution**: Verify URL state functions are called:
- Serialize on state change
- Deserialize on page load
- Check browser URL includes `?u=1` when checkbox checked

---

## Next Steps

After completing this guide:

1. **Manual Testing**: Test all scenarios (low/high salary, toggle checkbox, URL sharing)
2. **Code Review**: Have teammate review implementation
3. **Merge to Main**: Create PR, get approval, merge
4. **Deploy**: Deploy to production and verify in GA4 dashboard

---

## Resources

- **Spec**: [spec.md](./spec.md) - Full feature specification
- **Data Model**: [data-model.md](./data-model.md) - Type definitions
- **Contract**: [contracts/calculation-api.md](./contracts/calculation-api.md) - API interface
- **Research**: [research.md](./research.md) - Legal framework and decisions

---

## Support

Questions? Check:
- Existing tax calculation code: `src/lib/tax.ts`
- Store pattern: `src/store/calculatorStore.ts`
- URL state: `src/lib/url-state.ts`

**Estimated Time**: 2-3 hours for full implementation + tests + documentation
