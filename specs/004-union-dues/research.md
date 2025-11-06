# Research: Union Dues Calculation

**Feature**: Union Dues Calculation
**Branch**: `004-union-dues`
**Date**: November 6, 2025

## Overview

This document consolidates research findings for implementing union dues calculation in the Vietnam salary calculator. Union dues are mandatory deductions for union members, separate from tax and insurance calculations.

## Legal Framework Research

### Decision: Vietnamese Union Dues Regulations

**What was chosen**: Implement union dues calculation based on Vietnamese labor law:
- Rate: 0.5% of social insurance base salary
- Maximum cap: 10% of legal base salary (currently 2,340,000 VND → 234,000 VND cap)
- Deduction timing: AFTER tax and insurance (from NET salary)
- Not a tax deduction: Does NOT reduce taxable income for PIT calculation

**Rationale**:
- Follows Decree 191/2013/NĐ-CP on union organization and operation
- Aligns with Circular 12/2017/TT-BLĐTBXH on union dues collection
- Consistent with existing calculator's adherence to Vietnamese labor law
- Cap ensures fairness for high earners (prevents excessive deductions)

**Alternatives considered**:
- Fixed amount union dues → Rejected: Not aligned with Vietnamese law, less fair
- Progressive rates by salary tier → Rejected: Not how union dues work in Vietnam
- Optional custom rate → Rejected: Adds complexity, users expect legal compliance

**References**:
- Decree 191/2013/NĐ-CP, Article 24: Union member contributions
- Circular 12/2017/TT-BLĐTBXH: Collection and management of union dues
- Labor Code 2019, Chapter XVII: Trade unions

---

## Calculation Logic Research

### Decision: Two-Step Calculation with Cap

**What was chosen**:
```typescript
// Step 1: Calculate base amount
baseAmount = socialInsuranceBase × 0.005 (0.5%)

// Step 2: Apply maximum cap
unionDues = min(baseAmount, BASE_SALARY × 0.1)
// where BASE_SALARY = 2,340,000 VND
// therefore max = 234,000 VND
```

**Rationale**:
- Mathematically simple, fast computation (<1ms)
- Transparent formula users can verify manually
- Cap prevents unexpected large deductions for high earners
- Matches existing insurance calculation pattern (also has caps)

**Alternatives considered**:
- Single-step calculation without cap → Rejected: Violates legal maximum
- Cap based on gross salary → Rejected: Law specifies base salary (2.34M)
- Dynamic cap based on year → Considered for future enhancement when base salary changes

**Edge Cases Handled**:
- Social insurance base = 0 → Union dues = 0 (no insurance, no dues)
- Very low salary < regional minimum → Calculate on actual base (may be 0)
- Very high salary (>117M) → Insurance base capped at 58.5M, then union dues = min(58.5M × 0.5%, 234K) = 234K

---

## Integration Pattern Research

### Decision: Extend Existing Calculator Store Pattern

**What was chosen**: Add union dues state to existing Zustand calculator store
```typescript
interface CalculatorStore {
  // Existing fields...
  isUnionMember: boolean;
  setIsUnionMember: (value: boolean) => void;
}
```

**Rationale**:
- Consistent with existing pattern (insurance mode, region, dependents all in same store)
- Single source of truth for calculator state
- Automatic re-calculation on state change (existing reactivity)
- URL state serialization already handles boolean flags

**Alternatives considered**:
- Separate union dues store → Rejected: Overkill for single boolean flag
- Component-local state → Rejected: Harder to sync with URL state
- Derive from other fields → Rejected: Checkbox is explicit user choice, not derived

**Implementation Details**:
- Checkbox component reads/writes `isUnionMember` from store
- Calculation logic reads `isUnionMember` to conditionally calculate dues
- ResultDisplay reads `isUnionMember` to conditionally show breakdown row
- URL state utility serializes boolean as `u=1` (union member) or omits if false

---

## UI/UX Pattern Research

### Decision: Checkbox Near Insurance Settings

**What was chosen**: Place "Đoàn viên công đoàn" checkbox in GrossSalaryInput component, near insurance base mode selector

**Rationale**:
- Union dues depend on insurance base, so logical proximity
- Checkbox is familiar UI pattern for opt-in features
- Consistent with existing checkbox for "Custom insurance base"
- Mobile-friendly (no additional screen or modal needed)

**Alternatives considered**:
- Toggle in settings panel → Rejected: Too hidden, users might miss it
- Separate section → Rejected: Creates visual clutter for optional feature
- Always-on with manual override → Rejected: Default should be off (not everyone is union member)

**Accessibility Requirements**:
- Label: "Đoàn viên công đoàn" with tooltip explaining impact
- ARIA: `aria-label="Toggle union member status"`
- Keyboard: Space/Enter to toggle, Tab to navigate
- Screen reader: Announce state change when toggled

---

## Testing Strategy Research

### Decision: TDD with Three Test Layers

**What was chosen**:
1. **Contract tests**: Verify `calculateUnionDues(insuranceBase)` interface
2. **Unit tests**: Test calculation logic with edge cases
3. **Integration tests**: Test checkbox → store → calculation → display flow

**Rationale**:
- Follows existing calculator test pattern (tax calculation uses same layers)
- Contract tests catch breaking changes early
- Unit tests ensure mathematical correctness
- Integration tests verify user-facing behavior

**Test Cases Required**:
```typescript
// Unit tests
- calculateUnionDues(30_000_000) → 150_000 (0.5% of 30M)
- calculateUnionDues(58_500_000) → 234_000 (cap at 10% of 2.34M)
- calculateUnionDues(0) → 0 (no base, no dues)
- calculateUnionDues(5_000_000) → 25_000 (low salary case)

// Integration tests
- Checkbox unchecked → no union dues in breakdown
- Checkbox checked → union dues appear in breakdown
- Toggle checkbox → NET salary updates
- URL with u=1 → checkbox restores checked state
```

**Coverage Target**: ≥80% for new code (union-dues.ts, UnionDuesCheckbox.tsx)

---

## Performance Considerations

### Decision: Memoize Calculation Result

**What was chosen**: Use React `useMemo` to cache union dues calculation
```typescript
const unionDues = useMemo(() => {
  if (!isUnionMember) return 0;
  return calculateUnionDues(insuranceBase);
}, [isUnionMember, insuranceBase]);
```

**Rationale**:
- Calculation is pure function (same inputs → same output)
- Prevents unnecessary re-calculations on unrelated state changes
- Negligible memory cost (single number cached)
- Consistent with existing tax calculation memoization

**Alternatives considered**:
- No memoization → Rejected: Wastes CPU on every render
- Memoize in store → Rejected: Store should be simple state container
- Web Worker → Rejected: Massive overkill for simple arithmetic

**Performance Benchmark**: Calculation should complete in <10ms (target: <1ms actual)

---

## URL State Format Research

### Decision: Single Character Flag `u`

**What was chosen**: Add `u=1` to URL when union member checkbox is checked, omit when unchecked
```
# Union member enabled
https://example.com/pit?gross=30000000&region=1&u=1

# Union member disabled (default)
https://example.com/pit?gross=30000000&region=1
```

**Rationale**:
- Minimal URL length impact (2 chars: `u=1`)
- Consistent with existing boolean flags (region uses numbers)
- Easy to parse and serialize
- Human-readable parameter name

**Alternatives considered**:
- `union=true` → Rejected: Too verbose, wastes URL space
- `um=1` → Rejected: Less intuitive abbreviation
- Bitpack with other flags → Rejected: Premature optimization

**Implementation**: Extend existing URL state utility functions
```typescript
// Serialize
if (isUnionMember) params.set('u', '1');

// Deserialize
const isUnionMember = params.get('u') === '1';
```

---

## Comparison Mode Behavior Research

### Decision: Show Identical Dues in Both Columns

**What was chosen**: When in Compare mode (2025 vs 2026), display same union dues amount in both columns with delta = 0

**Rationale**:
- Union dues depend on insurance base, NOT on tax regime
- Insurance base is same in 2025 and 2026 (legal minimums/caps unchanged)
- Showing identical amounts clarifies that union dues are regime-independent
- Delta focuses user attention on tax differences only

**UI Treatment**:
```
| Item           | 2025      | 2026      | Delta  |
|----------------|-----------|-----------|--------|
| Đoàn phí CĐ    | 150,000   | 150,000   | 0      |
| NET (final)    | 24,850,000| 25,050,000| +200K  |
```

**Alternatives considered**:
- Hide union dues in compare mode → Rejected: User expects to see all deductions
- Show in only one column → Rejected: Breaks table symmetry, confusing
- Add tooltip explaining why delta = 0 → Accepted as enhancement

---

## Constants Management

### Decision: Add to Existing constants.ts

**What was chosen**: Define union dues constants alongside existing base salary
```typescript
// In src/config/constants.ts
export const BASE_SALARY = 2_340_000; // Existing

export const UNION_DUES_RATE = 0.005; // 0.5%
export const UNION_DUES_MAX_RATIO = 0.1; // 10% of base salary
export const UNION_DUES_MAX = BASE_SALARY * UNION_DUES_MAX_RATIO; // 234,000
```

**Rationale**:
- Centralized constants location (single source of truth)
- Easy to update when base salary changes
- Type-safe with TypeScript const assertions
- Self-documenting with comments

**Alternatives considered**:
- Hardcode 234,000 → Rejected: Not maintainable, hides calculation
- Separate union-dues-constants.ts → Rejected: Overkill for 3 constants
- Magic numbers inline → Rejected: Violates code quality principle

---

## Accessibility Research

### Decision: WCAG 2.1 AA Compliance

**What was chosen**:
- Checkbox with visible label "Đoàn viên công đoàn"
- Tooltip on hover/focus explaining impact
- Keyboard navigation (Space/Enter to toggle)
- Screen reader announces: "Đoàn viên công đoàn, checkbox, not checked" → "checked"
- Focus indicator follows existing shadcn/ui pattern

**Rationale**:
- Maintains WCAG 2.1 AA compliance of existing calculator
- Checkbox is inherently accessible HTML element
- shadcn/ui components have accessibility built-in

**Testing**: Use axe DevTools to verify no accessibility violations

---

## Summary of Key Decisions

| Aspect | Decision | Impact |
|--------|----------|--------|
| **Calculation Formula** | 0.5% of insurance base, max 234K VND | Simple, legally compliant, user-verifiable |
| **UI Pattern** | Checkbox in GrossSalaryInput near insurance settings | Discoverable, mobile-friendly, accessible |
| **State Management** | Add `isUnionMember` boolean to Zustand store | Consistent with existing pattern, minimal change |
| **URL State** | `u=1` parameter when enabled | Short, human-readable, backward compatible |
| **Testing Approach** | TDD with contract/unit/integration layers | High confidence, catches regressions |
| **Performance** | Memoized calculation result | <10ms target (actual <1ms) |
| **Comparison Mode** | Show identical dues in both 2025/2026 columns | Clarifies dues are regime-independent |

---

## Open Questions

None - all technical decisions resolved through research.

---

## References

- Vietnamese labor law research: Decree 191/2013, Circular 12/2017
- Existing calculator codebase: src/lib/tax.ts, src/store/calculatorStore.ts
- shadcn/ui documentation: Checkbox component patterns
- WCAG 2.1 AA guidelines: Form controls and labels
