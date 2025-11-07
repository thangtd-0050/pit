# API Contract: Lunch Allowance Calculation

**Feature**: 005-lunch-allowance
**Date**: November 7, 2025
**Version**: 1.0.0

## Overview

This document defines the function contracts (API surface) for the lunch allowance feature. Since this is a client-side feature with no backend API, "API" refers to the public functions and type signatures that other parts of the codebase will interact with.

---

## Constants API

### DEFAULT_LUNCH_ALLOWANCE

**File**: `src/config/constants.ts`

```typescript
/**
 * Default tax-exempt lunch allowance amount
 * Common value for Vietnamese companies
 *
 * @constant
 * @type {number}
 * @default 730000
 */
export const DEFAULT_LUNCH_ALLOWANCE = 730_000;
```

**Contract**:
- **Type**: `number` (constant)
- **Value**: `730000` (VND)
- **Immutable**: Yes (exported const)
- **Usage**: Default value for lunch allowance input field

---

## Type Definitions API

### CalculationResult Extension

**File**: `src/types/index.ts`

```typescript
/**
 * Extended calculation result including optional lunch allowance
 */
interface CalculationResult {
  // ... existing fields omitted for brevity

  /**
   * Tax-exempt lunch allowance amount
   *
   * @property {number | undefined} lunchAllowance
   * - undefined: Lunch allowance is disabled
   * - number: Lunch allowance amount in VND (≥ 0)
   *
   * @remarks
   * - This is always undefined when the user hasn't enabled lunch allowance
   * - When enabled, this value is added to final NET salary
   * - Value is NOT included in gross taxable income
   * - Entire amount is tax-exempt (no cap)
   *
   * @example
   * // Lunch allowance disabled
   * { ..., lunchAllowance: undefined }
   *
   * // Lunch allowance enabled with default
   * { ..., lunchAllowance: 730000 }
   *
   * // Lunch allowance enabled with custom amount
   * { ..., lunchAllowance: 1500000 }
   */
  lunchAllowance?: number;
}
```

**Contract**:
- **Type**: `number | undefined`
- **Optional**: Yes (undefined when disabled)
- **Constraints**: If defined, must be ≥ 0
- **Semantic Difference**:
  - `undefined`: Feature is disabled
  - `0`: Feature is enabled but amount is 0 (effectively disabled)
  - `> 0`: Feature is enabled with specific amount

---

## State Management API

### Zustand Store Extension

**File**: `src/store/calculatorStore.ts`

```typescript
interface CalculatorState {
  // ... existing state fields

  /**
   * Whether lunch allowance is enabled
   * @default false
   */
  hasLunchAllowance: boolean;

  /**
   * Lunch allowance amount in VND
   * @default 730000
   * @constraints Must be ≥ 0
   */
  lunchAllowance: number;

  /**
   * Toggle lunch allowance on/off
   *
   * @param has - true to enable, false to disable
   *
   * @remarks
   * - Disabling does NOT reset the amount value
   * - Amount is preserved for future re-enabling
   *
   * @example
   * const store = useCalculatorStore();
   * store.setHasLunchAllowance(true); // Enable with current amount
   */
  setHasLunchAllowance: (has: boolean) => void;

  /**
   * Update lunch allowance amount
   *
   * @param amount - Lunch allowance amount in VND
   *
   * @remarks
   * - Negative values are clamped to 0
   * - Decimal values are floored to integer
   * - No maximum limit
   * - Does NOT automatically enable lunch allowance
   *
   * @example
   * const store = useCalculatorStore();
   * store.setLunchAllowance(1500000); // Set to 1.5M VND
   * store.setLunchAllowance(-100); // Clamped to 0
   * store.setLunchAllowance(730000.99); // Floored to 730000
   */
  setLunchAllowance: (amount: number) => void;
}
```

**Contract**:

| Function | Parameters | Returns | Side Effects | Validation |
|----------|------------|---------|--------------|------------|
| `setHasLunchAllowance` | `has: boolean` | `void` | Updates store state | None |
| `setLunchAllowance` | `amount: number` | `void` | Updates store state | Clamps to ≥ 0, floors to integer |

**State Consistency Rules**:
1. Changing `hasLunchAllowance` does NOT modify `lunchAllowance` value
2. Changing `lunchAllowance` does NOT modify `hasLunchAllowance` state
3. Both values can be set independently

---

## URL State API

### URL Parameters

**File**: `src/lib/url-state.ts`

```typescript
/**
 * Parse lunch allowance state from URL parameters
 *
 * @param searchParams - URLSearchParams from window.location.search
 * @returns Lunch allowance state object
 *
 * @example
 * const params = new URLSearchParams(window.location.search);
 * const { hasLunchAllowance, lunchAllowance } = parseLunchAllowanceFromURL(params);
 */
function parseLunchAllowanceFromURL(searchParams: URLSearchParams): {
  hasLunchAllowance: boolean;
  lunchAllowance: number;
}

/**
 * Serialize lunch allowance state to URL parameters
 *
 * @param state - Lunch allowance state object
 * @returns Updated URLSearchParams
 *
 * @example
 * const params = new URLSearchParams();
 * serializeLunchAllowanceToURL(params, {
 *   hasLunchAllowance: true,
 *   lunchAllowance: 730000
 * });
 * // params.toString() === "hasLunchAllowance=true&lunchAllowance=730000"
 */
function serializeLunchAllowanceToURL(
  params: URLSearchParams,
  state: { hasLunchAllowance: boolean; lunchAllowance: number }
): URLSearchParams
```

**URL Parameter Contract**:

| Parameter | Type | Format | Required | Default | Validation |
|-----------|------|--------|----------|---------|------------|
| `hasLunchAllowance` | boolean | `true\|false` | No | `false` | Must be `"true"` or `"false"` |
| `lunchAllowance` | number | integer string | No | `730000` | Must parse to non-negative integer |

**Parsing Rules**:
```typescript
// hasLunchAllowance parsing
if (params.get('hasLunchAllowance') === 'true') {
  hasLunchAllowance = true;
} else {
  hasLunchAllowance = false; // Default or any other value
}

// lunchAllowance parsing
const parsed = parseInt(params.get('lunchAllowance') ?? '', 10);
if (isNaN(parsed) || parsed < 0) {
  lunchAllowance = DEFAULT_LUNCH_ALLOWANCE;
} else {
  lunchAllowance = parsed;
}
```

**Serialization Rules**:
```typescript
// Always include both parameters if lunch allowance is enabled
if (hasLunchAllowance) {
  params.set('hasLunchAllowance', 'true');
  params.set('lunchAllowance', lunchAllowance.toString());
} else {
  // Remove parameters if disabled (clean URL)
  params.delete('hasLunchAllowance');
  params.delete('lunchAllowance');
}
```

---

## Calculation Function API

### calculateNet Extension

**File**: `src/lib/tax.ts`

```typescript
/**
 * Calculate net salary with optional lunch allowance
 *
 * @param gross - Gross salary in VND
 * @param insurance - Insurance deductions
 * @param deductions - Tax deductions (personal + dependent)
 * @param tax - Personal income tax amount
 * @param options - Additional calculation options
 * @param options.unionDues - Optional union dues amount
 * @param options.lunchAllowance - Optional tax-exempt lunch allowance
 *
 * @returns Net salary calculation result
 *
 * @remarks
 * - lunchAllowance is added AFTER all deductions (insurance, tax, union dues)
 * - lunchAllowance does NOT affect taxable income
 * - Final formula: NET = (Gross - Insurance - Tax - UnionDues) + LunchAllowance
 *
 * @example
 * // Without lunch allowance
 * const result1 = calculateNet(30000000, insurance, deductions, tax);
 * // result1.net === 25222500, result1.lunchAllowance === undefined
 *
 * // With lunch allowance
 * const result2 = calculateNet(30000000, insurance, deductions, tax, {
 *   lunchAllowance: 730000
 * });
 * // result2.net === 25222500, result2.lunchAllowance === 730000
 * // result2.finalNet === 25952500 (net + lunch allowance)
 */
interface CalculateNetOptions {
  unionDues?: number;
  lunchAllowance?: number; // NEW
}

function calculateNet(
  gross: number,
  insurance: Insurance,
  deductions: Deductions,
  tax: number,
  options?: CalculateNetOptions
): CalculationResult
```

**Contract**:

| Parameter | Type | Required | Default | Validation |
|-----------|------|----------|---------|------------|
| `gross` | `number` | Yes | - | Must be ≥ 0 |
| `insurance` | `Insurance` | Yes | - | Valid Insurance object |
| `deductions` | `Deductions` | Yes | - | Valid Deductions object |
| `tax` | `number` | Yes | - | Must be ≥ 0 |
| `options?.unionDues` | `number` | No | `undefined` | If provided, ≥ 0 |
| `options?.lunchAllowance` | `number` | No | `undefined` | If provided, ≥ 0 |

**Return Type**:
```typescript
CalculationResult {
  // ... existing fields
  lunchAllowance?: number; // Equals options.lunchAllowance if provided
  finalNet?: number; // net - unionDues + lunchAllowance (if applicable)
}
```

**Calculation Order**:
```typescript
1. baseSalary - insurance.totalEmployee = grossAfterInsurance
2. grossAfterInsurance - tax = net
3. net - (unionDues ?? 0) = netAfterUnionDues
4. netAfterUnionDues + (lunchAllowance ?? 0) = finalNet
```

---

## Component API

### LunchAllowanceInput Component

**File**: `src/components/LunchAllowanceInput.tsx`

```typescript
/**
 * Lunch allowance input component with toggle and amount field
 *
 * @component
 *
 * @example
 * <LunchAllowanceInput />
 */
export default function LunchAllowanceInput(): JSX.Element
```

**Contract**:
- **Props**: None (uses Zustand store internally)
- **Returns**: React component
- **Side Effects**: Updates calculator store on user interaction
- **Dependencies**:
  - `useCalculatorStore` hook
  - `Switch`, `Input`, `Label` UI components
  - `DEFAULT_LUNCH_ALLOWANCE` constant

**User Interactions**:
```typescript
// Toggle switch
onToggleChange(checked: boolean) {
  store.setHasLunchAllowance(checked);
}

// Input field change
onAmountChange(value: string) {
  const amount = parseInt(value, 10);
  if (!isNaN(amount) && amount >= 0) {
    store.setLunchAllowance(amount);
  }
}
```

**Accessibility**:
- Switch has ARIA label: "Bật trợ cấp ăn trưa"
- Input has associated label: "Trợ cấp ăn trưa không chịu thuế"
- Input is disabled when toggle is off (visual and functional)
- Keyboard navigable (Tab, Space for toggle, Arrow keys for input)

---

## Testing Contracts

### Unit Tests

**File**: `tests/unit/lunch-allowance.test.ts`

```typescript
describe('Lunch Allowance Calculation', () => {
  it('should return undefined when lunch allowance is disabled');
  it('should add lunch allowance to final NET when enabled');
  it('should handle zero lunch allowance');
  it('should handle very large lunch allowance amounts');
  it('should clamp negative values to 0');
});
```

### Component Tests

**File**: `tests/components/LunchAllowanceInput.test.tsx`

```typescript
describe('LunchAllowanceInput Component', () => {
  it('should render toggle and input field');
  it('should disable input when toggle is off');
  it('should enable input when toggle is on');
  it('should update store when toggle is changed');
  it('should update store when amount is changed');
  it('should show default value initially');
  it('should preserve custom amount when toggled off and on');
});
```

### Integration Tests

**File**: `tests/integration/lunch-allowance.integration.test.tsx`

```typescript
describe('Lunch Allowance Integration', () => {
  it('should recalculate when lunch allowance is enabled');
  it('should use custom amount in calculation');
  it('should persist state in URL');
  it('should restore state from URL');
  it('should work with union dues feature');
});
```

### Contract Tests

**File**: `tests/contract/lunch-allowance.contract.test.ts`

```typescript
describe('Lunch Allowance Contracts', () => {
  describe('Type Contracts', () => {
    it('CalculationResult should have optional lunchAllowance field');
    it('CalculatorState should have lunch allowance fields');
  });

  describe('Function Contracts', () => {
    it('calculateNet should accept lunchAllowance option');
    it('calculateNet should return lunchAllowance in result');
  });

  describe('URL State Contracts', () => {
    it('should parse hasLunchAllowance parameter');
    it('should parse lunchAllowance parameter');
    it('should serialize to URL correctly');
  });
});
```

---

## Versioning

**Version**: 1.0.0

**Breaking Changes**:
- None (this is the initial implementation)

**Backward Compatibility**:
- ✅ Existing code works unchanged (lunch allowance is optional)
- ✅ Existing URLs work unchanged (missing parameters = disabled)
- ✅ Existing types extended with optional fields only

**Future Compatibility**:
- Field names `hasLunchAllowance`, `lunchAllowance` are reserved
- If lunch allowance regulations change (e.g., cap is introduced), we can:
  - Add `lunchAllowanceCap` field to CalculationResult
  - Keep `lunchAllowance` as user input
  - Add `taxExemptPortion` and `taxablePortion` fields
  - Maintain backward compatibility with optional fields

---

## Migration Guide

**For New Code**:
```typescript
// Access lunch allowance from store
const { hasLunchAllowance, lunchAllowance } = useCalculatorStore();

// Update lunch allowance
const { setHasLunchAllowance, setLunchAllowance } = useCalculatorStore();
setHasLunchAllowance(true);
setLunchAllowance(730000);

// Include in calculation
const result = calculateSalary(inputs, {
  lunchAllowance: hasLunchAllowance ? lunchAllowance : undefined
});

// Display in UI
{result.lunchAllowance !== undefined && (
  <div>Trợ cấp ăn trưa: +{formatNumber(result.lunchAllowance)} VND</div>
)}
```

**For Existing Code**:
- No changes required
- Lunch allowance is disabled by default
- Optional fields in CalculationResult can be safely ignored

---

## Summary

**Public API Surface**:
- 1 constant: `DEFAULT_LUNCH_ALLOWANCE`
- 2 type extensions: `CalculationResult`, `CalculatorState`
- 2 store actions: `setHasLunchAllowance`, `setLunchAllowance`
- 2 URL functions: `parseLunchAllowanceFromURL`, `serializeLunchAllowanceToURL`
- 1 calculation option: `lunchAllowance` parameter in `calculateNet`
- 1 component: `LunchAllowanceInput`

**Contract Guarantees**:
- Non-negative amounts only
- Undefined vs 0 distinction for enabled state
- Amount preserved when toggled off
- Full tax exemption (no threshold logic)
- Additive to NET after all deductions

**Testing Coverage**: 4 test layers (unit, component, integration, contract) with ~20 test cases total
