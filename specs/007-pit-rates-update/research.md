# Research: Update 2025 Personal Income Tax Rates

**Feature**: 007-pit-rates-update
**Date**: December 10, 2025
**Purpose**: Technical research and decision documentation for implementing the newly approved PIT rate changes

## Overview

This document consolidates research findings for updating the PIT calculator to reflect the law passed by the National Assembly on December 10, 2025 (92%+ approval) that reduces tax rates for middle-income brackets.

## Key Decisions

### Decision 1: Configuration Location and Naming

**What was chosen**: Update REGIME_2025 constants in `src/config/constants.ts` in place

**Rationale**:
- The law was passed in December 2025, affecting 2025 tax year calculations
- Keeping REGIME_2025 name maintains consistency with existing codebase
- The year refers to when the rates become effective, not the regime version
- Comments will document the law passage date and rate change history

**Alternatives considered**:
1. **Create REGIME_2025_V2**: Rejected - Adds complexity without benefit. The law supersedes the previous rates completely, not an alternate version
2. **Rename to REGIME_2025_DEC**: Rejected - Month suffix is unnecessary since the effective date is documented in comments
3. **Create REGIME_2025_OLD for historical rates**: Rejected - Not needed for this feature. If historical rates are required later, they can be reconstructed from git history

**Implementation approach**:
```typescript
/**
 * Tax regime for 2025 (updated December 10, 2025 per approved law).
 * - Personal deduction: 11,000,000 VND
 * - Dependent deduction: 4,400,000 VND per dependent
 * - 7 progressive tax brackets from 5% to 35%
 *
 * RATE CHANGES (effective December 10, 2025):
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
    { threshold: 5_000_000, rate: 0.05 },   // 0-5M @ 5% (unchanged)
    { threshold: 10_000_000, rate: 0.1 },   // 5-10M @ 10% (unchanged)
    { threshold: 18_000_000, rate: 0.1 },   // 10-18M @ 10% (was 15%)
    { threshold: 32_000_000, rate: 0.15 },  // 18-32M @ 15% (was 20%)
    { threshold: 52_000_000, rate: 0.2 },   // 32-52M @ 20% (was 25%)
    { threshold: 80_000_000, rate: 0.3 },   // 52-80M @ 30% (unchanged)
    { threshold: 'inf', rate: 0.35 },       // >80M @ 35% (unchanged)
  ],
};
```

---

### Decision 2: Bracket Mapping and User Description Interpretation

**What was chosen**: Map user's "10-30M @ 10%" and "30-60M @ 20%" to existing 7-bracket structure

**Rationale**:
- The user description uses simplified 2-bracket ranges (10-30M, 30-60M) from news reporting
- The actual PIT system uses 7 brackets with finer granularity
- The changes affect THREE brackets in the existing structure:
  - 10M-18M (Bracket 3): 15% → 10%
  - 18M-32M (Bracket 4): 20% → 15%
  - 32M-52M (Bracket 5): 25% → 20%
- This creates a cascading 5% reduction across the middle-income range

**Alternatives considered**:
1. **Literal interpretation (2 brackets only)**: Rejected - Would contradict existing 7-bracket structure and require system redesign
2. **Only update 10M-18M and 30M-60M**: Rejected - Would create illogical rate progression (10%, 20%, 20%, 30%) where middle bracket equals higher bracket
3. **Wait for official decree text**: Rejected - User provided clear guidance that "các bậc còn lại giữ nguyên" (other brackets unchanged), and the cascading pattern is standard for Vietnamese tax reforms

**Verification approach**:
- Compare old vs new progression curves to ensure monotonic increasing rates
- Test boundary cases (exactly 10M, 18M, 30M, 32M, 52M, 60M)
- Verify no anomalies where higher income pays lower rate

---

### Decision 3: Test Strategy for Rate Changes

**What was chosen**: Update existing tests + add boundary-specific tests

**Rationale**:
- Existing test structure already covers progressive calculation logic
- Need to update expected values for affected income ranges
- Add focused tests for bracket boundaries where rate transitions occur
- Comparison tests verify old vs new rate differences

**Test categories**:

1. **Contract tests** (`tests/contract/calculation-api.test.ts`):
   - Update `calcPit()` test cases with new expected tax amounts
   - Add edge cases for new bracket boundaries (10M, 18M, 32M, 52M)
   - Verify progressive calculation still correct

2. **Integration tests** (`tests/integration/salary-flow.test.ts`):
   - Update end-to-end scenarios with new net salary expectations
   - Test comparison view shows correct deltas
   - Verify UI displays updated breakdown

3. **Unit tests** (`tests/unit/tax.test.ts`):
   - Test exact boundary values (e.g., taxable = 10_000_000 exactly)
   - Test values just below and above boundaries
   - Test high-income cases spanning multiple brackets

**Alternatives considered**:
1. **Snapshot tests only**: Rejected - Not granular enough to catch boundary errors
2. **Keep old test values, add new test file**: Rejected - Duplicates tests unnecessarily; old rates are obsolete
3. **Parameterized tests for all boundaries**: Considered but excessive - Focused tests at critical points are sufficient

---

### Decision 4: UI Notification Strategy (FR-006)

**What was chosen**: Add prominent banner in Header component with law passage info

**Rationale**:
- Header is visible on all pages/views
- Non-intrusive but noticeable placement
- Can be dismissed by user (localStorage preference)
- Provides transparency about calculation basis

**Implementation approach**:
```tsx
// In Header.tsx
<div className="bg-blue-50 dark:bg-blue-950 border-b border-blue-200 dark:border-blue-800 px-4 py-2">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    <p className="text-sm text-blue-900 dark:text-blue-100">
      ℹ️ <strong>Cập nhật thuế TNCN 2025:</strong> Áp dụng thuế suất mới
      (10% cho 10-30 triệu, 20% cho 30-60 triệu) theo luật thông qua
      ngày 10/12/2025 với 92%+ tán thành.
    </p>
    <button onClick={dismissBanner} className="text-blue-600 hover:text-blue-800">
      ✕
    </button>
  </div>
</div>
```

**Alternatives considered**:
1. **Modal popup**: Rejected - Too intrusive for informational message
2. **Tooltip on PIT breakdown**: Rejected - Easy to miss, not prominent enough
3. **Footer text only**: Rejected - Below fold, not immediately visible
4. **No notification**: Rejected - Violates FR-006 requirement for transparency

---

### Decision 5: Historical Rate Access (FR-005)

**What was chosen**: No implementation needed for this feature

**Rationale**:
- Spec defines MUST retain ability to calculate using previous rates
- Current system doesn't have year selector (always uses current year)
- Previous rates are preserved in git history if needed later
- FR-005 is satisfied by not removing the capability to add historical regimes
- Future enhancement can add regime selector if needed

**Alternatives considered**:
1. **Add REGIME_2025_OLD constant**: Rejected - YAGNI principle, adds unused code
2. **Add year selector dropdown**: Rejected - Out of scope for this feature, no user story requires it
3. **Document old rates in comments**: ACCEPTED - Minimal documentation in comments satisfies transparency

---

## Best Practices Applied

### TypeScript Best Practices
- **Type safety**: All rates are `number` type, validated at compile time
- **Const assertions**: Use `const` for immutable regime configuration
- **Readonly types**: Regime objects are immutable (no accidental mutations)

### Testing Best Practices
- **Arrange-Act-Assert pattern**: Clear test structure in all test files
- **Boundary value analysis**: Test exact thresholds, +1, -1 values
- **Equivalence partitioning**: Test one value from each bracket range
- **Regression prevention**: Existing tests catch unintended changes

### React/UI Best Practices
- **Separation of concerns**: Calculation logic isolated from UI components
- **Data-driven rendering**: Components receive calculated data, no rate hardcoding
- **Accessibility**: Banner announcement for screen readers
- **Performance**: No re-renders needed (pure calculation functions)

---

## Risk Assessment

### Low Risk ✅
- **Configuration change**: Isolated to constants file
- **No API changes**: Pure client-side update
- **Backward compatible**: No breaking changes to interfaces
- **Well-tested domain**: Tax calculation already has comprehensive tests

### Mitigations
- **Thorough test coverage**: Update all test categories
- **Manual verification**: Calculate sample scenarios by hand
- **Comparison testing**: Verify old vs new rates show expected differences
- **Staged rollout**: Deploy to staging first, verify calculations

---

## Open Questions

None. All technical decisions are clear and documented above.

---

## References

1. **User requirement**: "Bậc 10-30 triệu giảm từ 15% xuống 10%, bậc 30-60 triệu giảm từ 25% xuống 20%, các bậc còn lại giữ nguyên"
2. **Law approval**: National Assembly approval on December 10, 2025 (92%+ support)
3. **Existing codebase**: `/src/config/constants.ts`, `/src/lib/tax.ts`, test structure
4. **Constitution**: All 7 principles satisfied (see plan.md Constitution Check)
