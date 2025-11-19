# Component API Contracts: Update 2026 Regulations

**Feature**: Update 2026 Regulations
**Status**: Draft
**Date**: 2025-11-19

## Components

### InsuranceBreakdown

Updated to support displaying 2026-specific explanations.

**File**: `src/components/InsuranceBreakdown.tsx`

**Props**:

```typescript
interface InsuranceBreakdownProps {
  insurance: Insurance;
  /** Custom insurance base entered by user (if any) */
  customBase?: number;
  /** Regional minimum wage for floor comparison */
  regionalMin?: number;
  /**
   * Active tax regime ID.
   * Used to display specific tooltips for 2026 changes.
   */
  regimeId?: '2025' | '2026';
}
```

**Behavior**:
- If `regimeId === '2026'`, display "New" badge next to relevant fields.
- If `regimeId === '2026'`, show tooltips explaining the new RMW and BHTN ceiling (20x RMW).

### InfoTooltip (New Component)

A reusable tooltip component for showing explanations.

**File**: `src/components/InfoTooltip.tsx` (Already exists, will be reused)

**Props**:
- `content`: ReactNode - The content to display in the tooltip.
- `trigger`: ReactNode - The element that triggers the tooltip (usually an icon).

## Functions

### calcAll

Updated to use the correct RMW constants.

**File**: `src/lib/tax.ts`

**Signature**:
```typescript
export function calcAll(inputs: CalculatorInputs, lunchAllowance?: number): CalculationResult
```
(Signature remains the same, internal logic changes)
