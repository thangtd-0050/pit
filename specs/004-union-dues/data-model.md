# Data Model: Union Dues Calculation

**Feature**: Union Dues Calculation
**Branch**: `004-union-dues`
**Date**: November 6, 2025

## Overview

This document defines the data structures and types required for union dues calculation feature. All types extend existing calculator data model.

---

## Core Types

### UnionDues

Represents the calculated union dues for a union member.

```typescript
interface UnionDues {
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
```

**Usage**:
```typescript
// Example calculation for 30M insurance base
const unionDues: UnionDues = {
  amount: 150_000,           // 30M × 0.5% = 150K
  calculationBase: 30_000_000,
  cappedAtMax: false,        // 150K < 234K
  rate: 0.005,
  maxAmount: 234_000
};

// Example for high salary (58.5M insurance base)
const unionDuesHigh: UnionDues = {
  amount: 234_000,           // Capped at max
  calculationBase: 58_500_000,
  cappedAtMax: true,         // 292.5K > 234K → capped
  rate: 0.005,
  maxAmount: 234_000
};
```

---

## Extended Types

### CalculationResult (Extended)

Extend existing `CalculationResult` interface to include union dues.

```typescript
interface CalculationResult {
  // ... existing fields (gross, insurance, deductions, pit, net)

  /**
   * Union dues calculation (only present if user is union member)
   * undefined if isUnionMember = false
   */
  unionDues?: UnionDues;

  /**
   * Final take-home pay after union dues deduction
   * If unionDues exists: net - unionDues.amount
   * Otherwise: same as net
   */
  finalNet: number;
}
```

**Backward Compatibility**:
- `unionDues` is optional (undefined for non-union members)
- `finalNet` always present (equals `net` when no union dues)
- Existing code reading `net` field unchanged
- New code reads `finalNet` for actual take-home amount

---

### CalculatorStore (Extended)

Extend Zustand store to track union member status.

```typescript
interface CalculatorStore {
  // ... existing fields (grossSalary, region, dependents, etc.)

  /**
   * Whether the employee is a union member
   * Default: false (opt-in feature)
   */
  isUnionMember: boolean;

  /**
   * Update union member status
   * Triggers recalculation of result
   */
  setIsUnionMember: (value: boolean) => void;
}
```

**State Transitions**:
```
Initial: isUnionMember = false
User clicks checkbox → setIsUnionMember(true)
Calculator recalculates → includes unionDues in result
User unclicks checkbox → setIsUnionMember(false)
Calculator recalculates → removes unionDues from result
```

---

### URLState (Extended)

Extend URL state parameters to include union member flag.

```typescript
interface URLState {
  // ... existing params (gross, region, dependents, etc.)

  /**
   * Union member flag (1 = true, omitted = false)
   * Serialized as 'u=1' in URL query string
   */
  u?: '1';
}
```

**Serialization Examples**:
```
// Union member enabled
?gross=30000000&region=1&u=1

// Union member disabled (default)
?gross=30000000&region=1
```

---

## Constants

### Union Dues Constants

Define in `src/config/constants.ts`:

```typescript
/**
 * Union dues calculation rate (0.5%)
 * Source: Circular 12/2017/TT-BLĐTBXH
 */
export const UNION_DUES_RATE = 0.005;

/**
 * Union dues maximum cap ratio (10% of base salary)
 * Source: Decree 191/2013/NĐ-CP, Article 24
 */
export const UNION_DUES_MAX_RATIO = 0.1;

/**
 * Union dues maximum amount in VND (234,000)
 * Calculated as: BASE_SALARY (2,340,000) × 10%
 */
export const UNION_DUES_MAX = BASE_SALARY * UNION_DUES_MAX_RATIO;
```

**Type Safety**:
```typescript
// All constants are readonly numbers
typeof UNION_DUES_RATE === 'number'; // 0.005
typeof UNION_DUES_MAX === 'number';  // 234000
```

---

## Validation Rules

### Input Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| `isUnionMember` | Must be boolean | "Union member status must be true or false" |
| `insuranceBase` | Must be ≥ 0 | "Insurance base cannot be negative" |

### Calculation Validation

| Scenario | Expected Behavior |
|----------|-------------------|
| `insuranceBase = 0` | `unionDues.amount = 0` (no base, no dues) |
| `insuranceBase > 0` | `unionDues.amount = min(base × 0.005, 234000)` |
| `isUnionMember = false` | `unionDues = undefined`, `finalNet = net` |
| `isUnionMember = true` | `unionDues` calculated, `finalNet = net - amount` |

---

## Relationships

### Entity Relationship Diagram

```
CalculatorInputs
      ↓
CalculationResult
  ├─→ Insurance (existing)
  ├─→ Deductions (existing)
  ├─→ PIT (existing)
  ├─→ UnionDues (NEW) ──┐
  └─→ finalNet (NEW) ←──┘
                (net - unionDues.amount)

CalculatorStore
  ├─→ isUnionMember (NEW boolean flag)
  └─→ triggers recalculation when changed
```

**Data Flow**:
1. User checks "Đoàn viên công đoàn" checkbox
2. `setIsUnionMember(true)` called
3. Store updates `isUnionMember = true`
4. Calculator reads `insuranceBase` from existing calculation
5. `calculateUnionDues(insuranceBase)` returns `UnionDues` object
6. `CalculationResult` includes `unionDues` and `finalNet`
7. UI displays union dues in breakdown and updated NET

---

## State Transitions

### Union Member Status Lifecycle

```
┌─────────────────┐
│ isUnionMember   │
│ = false         │ ← Initial state (default)
│ (unchecked)     │
└────────┬────────┘
         │ User clicks checkbox
         ↓
┌─────────────────┐
│ isUnionMember   │
│ = true          │
│ (checked)       │
└────────┬────────┘
         │ User unclicks checkbox
         ↓
┌─────────────────┐
│ isUnionMember   │
│ = false         │
│ (unchecked)     │
└─────────────────┘
```

### Calculation State Transitions

```
Non-Union Member:
  unionDues = undefined
  finalNet = net

     ↓ setIsUnionMember(true)

Union Member:
  unionDues = { amount: X, ... }
  finalNet = net - X

     ↓ setIsUnionMember(false)

Non-Union Member:
  unionDues = undefined
  finalNet = net
```

---

## Type Guards

### Runtime Type Checking

```typescript
/**
 * Check if union dues are present in calculation result
 */
function hasUnionDues(result: CalculationResult): result is CalculationResult & { unionDues: UnionDues } {
  return result.unionDues !== undefined;
}

/**
 * Check if union dues hit the maximum cap
 */
function isUnionDuesCapped(unionDues: UnionDues): boolean {
  return unionDues.cappedAtMax === true;
}
```

**Usage**:
```typescript
if (hasUnionDues(result)) {
  console.log(`Union dues: ${result.unionDues.amount} VND`);
  if (isUnionDuesCapped(result.unionDues)) {
    console.log('Capped at maximum 234,000 VND');
  }
}
```

---

## Migration Notes

### Backward Compatibility

**Existing Code**: Continues to work without changes
```typescript
// Old code reading NET (still valid)
const netSalary = result.net;
```

**New Code**: Should read finalNet for accuracy
```typescript
// New code should use finalNet
const takeHomePay = result.finalNet;
```

**URL State**: Existing URLs without `u` parameter work unchanged (default: non-union member)

### Database Schema

**N/A** - This is a client-side calculator with no persistent storage. All state is ephemeral (in-memory Zustand store) or URL-encoded.

---

## Examples

### Example 1: Low Salary (No Cap)

```typescript
// Input
const inputs = {
  grossSalary: 15_000_000,
  region: 'I',
  dependents: 0,
  isUnionMember: true
};

// Insurance base (same as gross, no custom)
const insuranceBase = 15_000_000;

// Union dues calculation
const unionDues: UnionDues = {
  amount: 75_000,              // 15M × 0.5% = 75K
  calculationBase: 15_000_000,
  cappedAtMax: false,          // 75K < 234K
  rate: 0.005,
  maxAmount: 234_000
};

// Calculation result
const result: CalculationResult = {
  // ... other fields
  net: 12_500_000,            // Example NET after tax/insurance
  unionDues: unionDues,
  finalNet: 12_425_000        // 12.5M - 75K
};
```

### Example 2: High Salary (Capped)

```typescript
// Input
const inputs = {
  grossSalary: 185_000_000,   // Very high salary
  region: 'I',
  dependents: 2,
  isUnionMember: true
};

// Insurance base (capped at 58.5M)
const insuranceBase = 58_500_000;

// Union dues calculation
const unionDues: UnionDues = {
  amount: 234_000,             // Capped at max (not 292.5K)
  calculationBase: 58_500_000,
  cappedAtMax: true,           // 292.5K > 234K → cap applied
  rate: 0.005,
  maxAmount: 234_000
};

// Calculation result
const result: CalculationResult = {
  // ... other fields
  net: 145_000_000,           // Example NET after tax/insurance
  unionDues: unionDues,
  finalNet: 144_766_000       // 145M - 234K
};
```

### Example 3: Non-Union Member

```typescript
// Input
const inputs = {
  grossSalary: 30_000_000,
  region: 'I',
  dependents: 1,
  isUnionMember: false        // Not a union member
};

// Calculation result
const result: CalculationResult = {
  // ... other fields
  net: 24_000_000,            // Example NET after tax/insurance
  unionDues: undefined,        // No union dues
  finalNet: 24_000_000        // Same as NET (no deduction)
};
```

---

## Summary

**New Types**: `UnionDues`
**Extended Types**: `CalculationResult`, `CalculatorStore`, `URLState`
**New Constants**: `UNION_DUES_RATE`, `UNION_DUES_MAX_RATIO`, `UNION_DUES_MAX`
**Backward Compatible**: Yes - all existing code continues to work
**Breaking Changes**: None - all additions are optional or additive
