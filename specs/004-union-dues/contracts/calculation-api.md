# API Contract: Union Dues Calculation

**Feature**: Union Dues Calculation
**Branch**: `004-union-dues`
**Date**: November 6, 2025

## Overview

This document defines the programming interface (API contract) for union dues calculation functionality. All functions follow pure functional programming principles (deterministic, no side effects).

---

## Core Calculation API

### calculateUnionDues

Calculate union dues for a union member based on social insurance base.

**Function Signature**:
```typescript
function calculateUnionDues(insuranceBase: number): UnionDues
```

**Parameters**:
| Name | Type | Constraints | Description |
|------|------|-------------|-------------|
| `insuranceBase` | `number` | ≥ 0 | Social insurance base salary in VND |

**Returns**: `UnionDues` object

**Return Type**:
```typescript
interface UnionDues {
  amount: number;           // Calculated dues (0 to 234,000 VND)
  calculationBase: number;  // Input insurance base
  cappedAtMax: boolean;     // Whether cap was applied
  rate: number;             // Always 0.005 (0.5%)
  maxAmount: number;        // Always 234,000 VND
}
```

**Algorithm**:
```typescript
1. baseAmount = insuranceBase × UNION_DUES_RATE (0.005)
2. maxCap = UNION_DUES_MAX (234,000)
3. amount = min(baseAmount, maxCap)
4. cappedAtMax = (amount === maxCap)
5. return { amount, calculationBase: insuranceBase, cappedAtMax, rate: 0.005, maxAmount: 234000 }
```

**Examples**:

```typescript
// Example 1: Normal case (no cap)
calculateUnionDues(30_000_000)
→ {
    amount: 150_000,           // 30M × 0.5%
    calculationBase: 30_000_000,
    cappedAtMax: false,
    rate: 0.005,
    maxAmount: 234_000
  }

// Example 2: High salary (capped)
calculateUnionDues(58_500_000)
→ {
    amount: 234_000,           // min(292.5K, 234K) = 234K
    calculationBase: 58_500_000,
    cappedAtMax: true,
    rate: 0.005,
    maxAmount: 234_000
  }

// Example 3: Zero base
calculateUnionDues(0)
→ {
    amount: 0,
    calculationBase: 0,
    cappedAtMax: false,
    rate: 0.005,
    maxAmount: 234_000
  }

// Example 4: Low salary
calculateUnionDues(5_000_000)
→ {
    amount: 25_000,            // 5M × 0.5%
    calculationBase: 5_000_000,
    cappedAtMax: false,
    rate: 0.005,
    maxAmount: 234_000
  }
```

**Error Handling**:
```typescript
// Invalid input (negative)
calculateUnionDues(-1000)
→ throws Error("Insurance base must be non-negative")

// Invalid input (NaN)
calculateUnionDues(NaN)
→ throws Error("Insurance base must be a valid number")

// Invalid input (Infinity)
calculateUnionDues(Infinity)
→ throws Error("Insurance base must be finite")
```

**Performance**:
- Time complexity: O(1) - constant time arithmetic operations
- Space complexity: O(1) - returns single object
- Target execution time: <1ms

---

## Extended Calculation API

### calculateFinalNet

Calculate final take-home pay after union dues deduction.

**Function Signature**:
```typescript
function calculateFinalNet(netSalary: number, unionDues: UnionDues | undefined): number
```

**Parameters**:
| Name | Type | Constraints | Description |
|------|------|-------------|-------------|
| `netSalary` | `number` | ≥ 0 | NET salary after tax and insurance in VND |
| `unionDues` | `UnionDues \| undefined` | - | Union dues object (undefined if not union member) |

**Returns**: `number` - Final take-home pay in VND

**Algorithm**:
```typescript
if (unionDues === undefined) {
  return netSalary;
} else {
  return netSalary - unionDues.amount;
}
```

**Examples**:

```typescript
// Example 1: Union member
const unionDues = calculateUnionDues(30_000_000); // 150,000 VND
calculateFinalNet(24_000_000, unionDues)
→ 23_850_000  // 24M - 150K

// Example 2: Non-union member
calculateFinalNet(24_000_000, undefined)
→ 24_000_000  // No deduction

// Example 3: High earner (capped dues)
const unionDuesHigh = calculateUnionDues(58_500_000); // 234,000 VND
calculateFinalNet(145_000_000, unionDuesHigh)
→ 144_766_000  // 145M - 234K
```

**Error Handling**:
```typescript
// Invalid NET salary
calculateFinalNet(-1000, undefined)
→ throws Error("NET salary must be non-negative")

// Result would be negative (unrealistic scenario)
calculateFinalNet(100_000, { amount: 150_000, ... })
→ throws Error("Final NET cannot be negative (union dues exceed NET salary)")
```

---

## Store Actions API

### setIsUnionMember

Update union member status in calculator store.

**Function Signature**:
```typescript
setIsUnionMember(value: boolean): void
```

**Parameters**:
| Name | Type | Constraints | Description |
|------|------|-------------|-------------|
| `value` | `boolean` | - | New union member status (true = member, false = non-member) |

**Side Effects**:
- Updates `isUnionMember` field in Zustand store
- Triggers recalculation of `CalculationResult`
- Updates URL state (adds/removes `u=1` parameter)
- Re-renders dependent React components

**Examples**:

```typescript
// Enable union member status
setIsUnionMember(true);
// → Store: isUnionMember = true
// → URL: adds ?u=1
// → Calculation: includes unionDues
// → UI: checkbox checked, union dues visible

// Disable union member status
setIsUnionMember(false);
// → Store: isUnionMember = false
// → URL: removes ?u=1
// → Calculation: excludes unionDues
// → UI: checkbox unchecked, union dues hidden
```

**Error Handling**:
```typescript
// Type checking ensures only boolean allowed
setIsUnionMember("true");  // TypeScript compile error
setIsUnionMember(1);       // TypeScript compile error
```

---

## URL State API

### serializeUnionMemberToURL

Serialize union member status to URL parameter.

**Function Signature**:
```typescript
function serializeUnionMemberToURL(isUnionMember: boolean): URLSearchParams
```

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `isUnionMember` | `boolean` | Union member status |

**Returns**: `URLSearchParams` object with `u` parameter set or omitted

**Algorithm**:
```typescript
const params = new URLSearchParams();
if (isUnionMember === true) {
  params.set('u', '1');
}
// If false, parameter is omitted
return params;
```

**Examples**:

```typescript
// Union member enabled
serializeUnionMemberToURL(true)
→ URLSearchParams { 'u' => '1' }
→ URL string: "?u=1"

// Union member disabled
serializeUnionMemberToURL(false)
→ URLSearchParams {}
→ URL string: "" (no parameter)
```

---

### deserializeUnionMemberFromURL

Deserialize union member status from URL parameter.

**Function Signature**:
```typescript
function deserializeUnionMemberFromURL(params: URLSearchParams): boolean
```

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `params` | `URLSearchParams` | URL search parameters |

**Returns**: `boolean` - Union member status (default: false)

**Algorithm**:
```typescript
return params.get('u') === '1';
```

**Examples**:

```typescript
// URL has u=1
const params1 = new URLSearchParams('?u=1');
deserializeUnionMemberFromURL(params1)
→ true

// URL has no u parameter
const params2 = new URLSearchParams('?gross=30000000');
deserializeUnionMemberFromURL(params2)
→ false

// URL has u=0 (invalid, but handles gracefully)
const params3 = new URLSearchParams('?u=0');
deserializeUnionMemberFromURL(params3)
→ false
```

---

## React Hook API

### useUnionDues

Custom React hook to manage union dues calculation.

**Function Signature**:
```typescript
function useUnionDues(): {
  isUnionMember: boolean;
  setIsUnionMember: (value: boolean) => void;
  unionDues: UnionDues | undefined;
  finalNet: number;
}
```

**Returns**: Object with union dues state and actions

**Return Type**:
```typescript
interface UseUnionDuesReturn {
  isUnionMember: boolean;        // Current union member status
  setIsUnionMember: (value: boolean) => void;  // Update status
  unionDues: UnionDues | undefined;  // Calculated dues (undefined if not member)
  finalNet: number;              // Final take-home pay
}
```

**Usage Example**:

```typescript
function SalaryDisplay() {
  const { isUnionMember, setIsUnionMember, unionDues, finalNet } = useUnionDues();

  return (
    <>
      <Checkbox
        checked={isUnionMember}
        onCheckedChange={setIsUnionMember}
      >
        Đoàn viên công đoàn
      </Checkbox>

      {unionDues && (
        <div>Đoàn phí: {formatCurrency(unionDues.amount)}</div>
      )}

      <div>Lương thực nhận: {formatCurrency(finalNet)}</div>
    </>
  );
}
```

**Dependencies**:
- Reads from Zustand calculator store
- Triggers recalculation on store changes
- Memoizes calculation result

---

## Type Contracts

### UnionDues Type

```typescript
/**
 * Union dues calculation result
 */
interface UnionDues {
  /**
   * Calculated union dues amount in VND
   * Range: [0, 234000]
   * Precision: Whole number (no decimals)
   */
  amount: number;

  /**
   * Social insurance base used for calculation in VND
   * Must match input parameter to calculateUnionDues
   */
  calculationBase: number;

  /**
   * Whether maximum cap (234,000 VND) was applied
   * true → amount = 234,000
   * false → amount < 234,000
   */
  cappedAtMax: boolean;

  /**
   * Union dues rate (always 0.005 = 0.5%)
   * Constant value, included for transparency
   */
  rate: number;

  /**
   * Maximum allowed union dues (always 234,000 VND)
   * Constant value, included for transparency
   */
  maxAmount: number;
}
```

**Invariants**:
- `amount ≥ 0`
- `amount ≤ maxAmount`
- `amount = min(calculationBase × rate, maxAmount)`
- `cappedAtMax = (amount === maxAmount)`
- `rate === 0.005` (constant)
- `maxAmount === 234_000` (constant)

---

## Testing Contract

All implementations MUST pass these contract tests:

```typescript
describe('calculateUnionDues contract', () => {
  it('should exist as a function', () => {
    expect(typeof calculateUnionDues).toBe('function');
  });

  it('should accept number parameter', () => {
    expect(() => calculateUnionDues(0)).not.toThrow();
  });

  it('should return UnionDues object with required fields', () => {
    const result = calculateUnionDues(30_000_000);
    expect(result).toHaveProperty('amount');
    expect(result).toHaveProperty('calculationBase');
    expect(result).toHaveProperty('cappedAtMax');
    expect(result).toHaveProperty('rate');
    expect(result).toHaveProperty('maxAmount');
  });

  it('should calculate 0.5% of insurance base', () => {
    const result = calculateUnionDues(30_000_000);
    expect(result.amount).toBe(150_000);
  });

  it('should cap at 234,000 VND', () => {
    const result = calculateUnionDues(58_500_000);
    expect(result.amount).toBe(234_000);
    expect(result.cappedAtMax).toBe(true);
  });

  it('should handle zero insurance base', () => {
    const result = calculateUnionDues(0);
    expect(result.amount).toBe(0);
  });

  it('should throw on negative input', () => {
    expect(() => calculateUnionDues(-1000)).toThrow();
  });

  it('should be deterministic (pure function)', () => {
    const result1 = calculateUnionDues(30_000_000);
    const result2 = calculateUnionDues(30_000_000);
    expect(result1).toEqual(result2);
  });
});
```

---

## Versioning

**Current Version**: 1.0.0
**Stability**: Stable
**Breaking Changes**: None planned
**Deprecation Policy**: 6 months notice for any breaking changes

**Changelog**:
- **1.0.0** (2025-11-06): Initial API contract definition

---

## Summary

| API Function | Purpose | Input | Output |
|--------------|---------|-------|--------|
| `calculateUnionDues` | Core calculation | `insuranceBase: number` | `UnionDues` |
| `calculateFinalNet` | Final NET after dues | `netSalary: number, unionDues?: UnionDues` | `number` |
| `setIsUnionMember` | Update store state | `value: boolean` | `void` |
| `serializeUnionMemberToURL` | URL encoding | `isUnionMember: boolean` | `URLSearchParams` |
| `deserializeUnionMemberFromURL` | URL decoding | `params: URLSearchParams` | `boolean` |
| `useUnionDues` | React hook | - | `{ isUnionMember, setIsUnionMember, unionDues, finalNet }` |

**Key Contracts**:
- ✅ Pure functions (deterministic, no side effects)
- ✅ Type-safe (TypeScript strict mode)
- ✅ Error handling for invalid inputs
- ✅ Backward compatible (all existing code continues to work)
- ✅ Performance guarantees (<1ms for calculations)
