# Data Model: Tax-Exempt Lunch Allowance

**Feature**: 005-lunch-allowance  
**Date**: November 7, 2025  
**Status**: Complete

## Overview

This document defines the data structures and state model for the tax-exempt lunch allowance feature. The feature extends the existing salary calculator with optional lunch allowance support.

## Entities

### 1. LunchAllowance (Conceptual Entity)

**Description**: Represents a monthly meal subsidy provided by employers that is exempt from personal income tax in Vietnam.

**Attributes**:

| Attribute | Type | Required | Default | Validation | Description |
|-----------|------|----------|---------|------------|-------------|
| `amount` | number | Yes | 730000 | ≥ 0 | Monthly lunch allowance in VND |
| `enabled` | boolean | Yes | false | - | Whether lunch allowance is active |

**Business Rules**:
- Amount must be non-negative (0 or positive)
- Entire amount is tax-exempt (no threshold cap)
- Amount of 0 is treated as disabled
- Default 730,000 VND represents common Vietnamese company practice
- Foreign companies may use higher amounts (e.g., 1,500,000 VND)

**State Transitions**:
```
[Disabled: enabled=false, amount=730000]
    ↓ (user enables toggle)
[Enabled: enabled=true, amount=730000]
    ↓ (user changes amount)
[Enabled: enabled=true, amount=custom]
    ↓ (user disables toggle)
[Disabled: enabled=false, amount=custom] ← amount is preserved
    ↓ (user re-enables toggle)
[Enabled: enabled=true, amount=custom] ← previous amount restored
```

---

### 2. CalculationResult (Extended Type)

**Description**: Extended version of existing CalculationResult type to include lunch allowance information.

**New Fields**:

| Field | Type | Optional | Description |
|-------|------|----------|-------------|
| `lunchAllowance` | `number \| undefined` | Yes | Tax-exempt lunch allowance amount (undefined when disabled) |

**Full Type Definition**:
```typescript
interface CalculationResult {
  // Existing fields (unchanged)
  gross: number;
  insurance: {
    totalEmployee: number;
    totalEmployer: number;
    bases: {
      baseSIHI: number;
      baseUI: number;
    };
    breakdown: {
      si: { employee: number; employer: number };
      hi: { employee: number; employer: number };
      ui: { employee: number; employer: number };
    };
  };
  deductions: {
    total: number;
    personal: number;
    dependent: number;
  };
  taxableIncome: number;
  tax: number;
  net: number;
  
  // Union dues fields (from feature 004)
  unionDues?: {
    amount: number;
    calculationBase: number;
    cappedAtMax: boolean;
    rate: number;
    maxAmount: number;
  };
  finalNet?: number; // NET after union dues
  
  // NEW: Lunch allowance field
  lunchAllowance?: number; // Tax-exempt lunch allowance amount
}
```

**Calculation Flow**:
```
1. gross → insurance deductions → grossTaxable
2. grossTaxable → personal/dependent deductions → taxableIncome
3. taxableIncome → tax calculation → tax
4. gross - insurance.totalEmployee - tax = net
5. net - (unionDues?.amount ?? 0) = finalNet (or net if no union dues)
6. finalNet + (lunchAllowance ?? 0) = FINAL TAKE-HOME
```

**Note**: `lunchAllowance` is `undefined` when disabled (not 0) to distinguish "not enabled" from "enabled with 0 amount".

---

### 3. CalculatorState (Zustand Store Extension)

**Description**: Extended Zustand store state to include lunch allowance inputs.

**New State Fields**:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `hasLunchAllowance` | boolean | false | Whether lunch allowance is enabled |
| `lunchAllowance` | number | 730000 | Lunch allowance amount in VND |

**New Actions**:

| Action | Signature | Description |
|--------|-----------|-------------|
| `setHasLunchAllowance` | `(has: boolean) => void` | Toggle lunch allowance on/off |
| `setLunchAllowance` | `(amount: number) => void` | Update lunch allowance amount |

**Extended Store Type**:
```typescript
interface CalculatorState {
  // Existing state fields
  gross: number;
  region: RegionCode;
  dependents: number;
  isUnionMember: boolean;
  // ...other existing fields
  
  // NEW: Lunch allowance state
  hasLunchAllowance: boolean;
  lunchAllowance: number;
  
  // Existing actions
  setGross: (gross: number) => void;
  setRegion: (region: RegionCode) => void;
  // ...other existing actions
  
  // NEW: Lunch allowance actions
  setHasLunchAllowance: (has: boolean) => void;
  setLunchAllowance: (amount: number) => void;
}
```

**Implementation Pattern**:
```typescript
const useCalculatorStore = create<CalculatorState>((set) => ({
  // ...existing state
  hasLunchAllowance: false,
  lunchAllowance: 730_000,
  
  setHasLunchAllowance: (has) => set({ hasLunchAllowance: has }),
  setLunchAllowance: (amount) => set({ 
    lunchAllowance: Math.max(0, amount) // Ensure non-negative
  }),
}));
```

---

### 4. URL State Parameters

**Description**: URL query parameters for sharing lunch allowance state.

**Parameters**:

| Parameter | Type | Format | Example | Description |
|-----------|------|--------|---------|-------------|
| `hasLunchAllowance` | boolean | `true\|false` | `hasLunchAllowance=true` | Whether lunch allowance is enabled |
| `lunchAllowance` | number | integer | `lunchAllowance=730000` | Lunch allowance amount in VND |

**URL Examples**:
```
# Lunch allowance disabled
https://example.com/calculator?gross=30000000&region=HN

# Lunch allowance enabled with default
https://example.com/calculator?gross=30000000&region=HN&hasLunchAllowance=true&lunchAllowance=730000

# Lunch allowance enabled with custom amount
https://example.com/calculator?gross=30000000&region=HN&hasLunchAllowance=true&lunchAllowance=1500000
```

**Parsing Rules**:
- If `hasLunchAllowance` is missing or `false`, lunch allowance is disabled
- If `hasLunchAllowance=true` but `lunchAllowance` is missing, use default 730,000
- If `lunchAllowance` is invalid (negative, non-numeric), use default 730,000
- Amount is stored as integer (no decimals)

---

## Constants

**File**: `src/config/constants.ts`

```typescript
/**
 * Default tax-exempt lunch allowance amount
 * Common value for Vietnamese companies
 * Users can customize this amount
 */
export const DEFAULT_LUNCH_ALLOWANCE = 730_000; // VND
```

**Rationale**: 730,000 VND is the most common lunch allowance amount in Vietnam, representing approximately 730 VND/meal × 22 working days. This is NOT a regulatory cap.

---

## Validation Rules

### Input Validation

**Lunch Allowance Amount**:
- **Type**: Must be numeric
- **Range**: Must be ≥ 0 (non-negative)
- **Precision**: Integer values only (no decimals)
- **Maximum**: No upper limit (supports foreign companies with high allowances)

**Implementation**:
```typescript
function validateLunchAllowance(value: unknown): number {
  const parsed = Number(value);
  if (isNaN(parsed) || parsed < 0) {
    return DEFAULT_LUNCH_ALLOWANCE; // Fallback to default
  }
  return Math.floor(parsed); // Ensure integer
}
```

### State Consistency Rules

1. **Toggle Off → Amount Preserved**: When `hasLunchAllowance` is set to `false`, the `lunchAllowance` value is NOT reset. This allows users to toggle off temporarily without losing their custom amount.

2. **Amount Zero → Treated as Disabled**: If a user enters 0, the calculation treats it as "no lunch allowance" (same as disabled).

3. **CalculationResult Field**: The `lunchAllowance` field in `CalculationResult` is `undefined` when disabled, NOT 0. This distinguishes "feature off" from "feature on with 0 amount".

---

## Relationships

### Data Flow Diagram

```
┌─────────────────┐
│ User Input      │
│ (UI Component)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Zustand Store   │
│ - hasLunch...   │
│ - lunchAllowance│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ URL State       │
│ (Persistence)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Calculation     │
│ Engine          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ CalculationResult│
│ (includes lunch) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Result Display  │
│ (UI Component)  │
└─────────────────┘
```

### Type Dependencies

```typescript
// Constants
DEFAULT_LUNCH_ALLOWANCE: 730000

// Store State → URL Parameters
hasLunchAllowance: boolean → "hasLunchAllowance=true"
lunchAllowance: number → "lunchAllowance=730000"

// Store State → Calculation Input
hasLunchAllowance, lunchAllowance → calculateNet(options)

// Calculation → Result Type
enabled lunch allowance → CalculationResult.lunchAllowance: number
disabled lunch allowance → CalculationResult.lunchAllowance: undefined

// Result Type → Display
CalculationResult.lunchAllowance → UI shows "Trợ cấp ăn trưa: +730,000 VND"
```

---

## Migration Notes

**No Data Migration Required**: This is a new feature with no existing data. All state is client-side and ephemeral.

**Backward Compatibility**:
- Existing URLs without lunch allowance parameters work unchanged
- Existing calculation code continues to work (lunch allowance is optional)
- `CalculationResult` type extension is additive (optional field)

**Default Behavior**:
- New users: lunch allowance disabled by default
- Existing calculations: lunch allowance disabled (not in URL parameters)
- Shared URLs without lunch allowance: work as before

---

## Summary

This data model extends the existing calculator with minimal changes:

**New Entities**: 1 conceptual entity (LunchAllowance)
**Extended Types**: 2 (CalculationResult, CalculatorState)
**New Constants**: 1 (DEFAULT_LUNCH_ALLOWANCE)
**New URL Parameters**: 2 (hasLunchAllowance, lunchAllowance)

**Impact**: Low - additive changes only, no breaking changes to existing functionality.
