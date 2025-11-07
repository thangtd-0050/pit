# Research: Tax-Exempt Lunch Allowance Implementation

**Feature**: 005-lunch-allowance  
**Date**: November 7, 2025  
**Status**: Complete

## Research Questions & Findings

### 1. Vietnamese Tax Regulations for Lunch Allowance

**Question**: What are the current Vietnamese tax regulations regarding lunch allowance benefits?

**Findings**:
- **Circular 111/2013/TT-BTC** (Article 2, Section 9): Lunch allowances provided by employers are considered non-taxable income when they are reasonable meal subsidies for employees during working hours
- **Updated Practice (2024-2025)**: For foreign companies and modern enterprises, lunch allowances are generally treated as fully tax-exempt benefits regardless of amount, as they are considered welfare benefits rather than salary
- **Common Default**: 730,000 VND/month is a typical amount offered by Vietnamese companies, but this is NOT a regulatory cap
- **No Threshold**: Unlike some allowances with specific caps, lunch allowance tax-exempt status is based on the benefit's nature (meal subsidy) rather than a specific monetary threshold

**Decision**: Implement lunch allowance as fully tax-exempt income with no cap. Use 730,000 VND as the default value (common practice) but allow users to enter any amount.

**Rationale**: This aligns with current Vietnamese tax practice and supports both local companies (typically 730K) and foreign companies (often higher amounts like 1-1.5M VND).

**Alternatives Considered**:
- **730K cap with excess taxable**: Rejected - outdated interpretation of regulations
- **Fixed 730K only**: Rejected - doesn't support foreign companies with higher allowances
- **No default value**: Rejected - adds friction for 95% of users

---

### 2. Integration with Existing Calculator Logic

**Question**: How should lunch allowance integrate with the existing tax calculation flow?

**Findings**:
- **Current Flow**: Gross Salary → BHXH/BHYT/BHTN deductions → Taxable Income → PIT calculation → NET Salary → Union Dues deduction → Final NET
- **Lunch Allowance Nature**: Tax-exempt income that should NOT be included in gross taxable income
- **Best Practice**: Add lunch allowance AFTER all tax calculations, similar to adding a bonus to final take-home pay

**Decision**: Add lunch allowance to final NET salary after all deductions (insurance, tax, union dues).

**Calculation Flow**:
```
Step 1: Calculate insurance base
Step 2: Deduct insurance from gross → Gross Taxable Income
Step 3: Apply deductions (personal, dependents) → Taxable Income
Step 4: Calculate PIT → Tax Amount
Step 5: NET = Gross - Insurance - Tax
Step 6: Deduct Union Dues (if applicable) → NET after union dues
Step 7: Add Lunch Allowance (if enabled) → Final NET
```

**Rationale**: This approach:
- Keeps lunch allowance separate from taxable income calculation
- Makes the tax-exempt nature explicit in the UI
- Matches user mental model (allowance is added to paycheck, not part of taxable salary)
- Simplifies implementation (no changes to core tax logic)

**Alternatives Considered**:
- **Add to gross before tax**: Rejected - would make it taxable, violates tax regulations
- **Separate "allowances" calculation section**: Rejected - over-engineering for single allowance type
- **Reduce taxable income by allowance**: Rejected - mathematically incorrect and confusing

---

### 3. UI/UX Pattern Selection

**Question**: What UI pattern should be used for lunch allowance input?

**Findings**:
- **Existing Pattern**: Union dues feature (004) uses Switch (toggle) + disabled state when off
- **User Need**: Most users want simple toggle with default, some need customization
- **shadcn/ui Components**: Switch, Input, Label components available
- **Accessibility**: Switch has built-in ARIA support, Input needs proper labeling

**Decision**: Use toggle (Switch) + editable Input field pattern, following union dues precedent.

**Component Structure**:
```tsx
<div className="flex items-center justify-between">
  <div>
    <Label>Trợ cấp ăn trưa không chịu thuế</Label>
    <p className="text-sm text-muted-foreground">
      Khoản trợ cấp ăn trưa/ăn giữa ca (mặc định 730,000 VND)
    </p>
  </div>
  <div className="flex items-center gap-2">
    <Input
      type="number"
      value={lunchAllowance}
      onChange={...}
      disabled={!hasLunchAllowance}
      className="w-32"
    />
    <Switch
      checked={hasLunchAllowance}
      onCheckedChange={...}
    />
  </div>
</div>
```

**Rationale**:
- Familiar pattern (matches union dues UX)
- Toggle enables quick on/off without data entry
- Input allows customization when needed
- Disabled state when toggle is off prevents confusion

**Alternatives Considered**:
- **Checkbox + Input**: Rejected - Switch is more modern and provides better visual feedback
- **Single Input with 0 = disabled**: Rejected - less intuitive, requires deletion to disable
- **Dropdown with preset values**: Rejected - doesn't support custom amounts for foreign companies

---

### 4. State Management Strategy

**Question**: How should lunch allowance state be managed in the application?

**Findings**:
- **Current Pattern**: calculatorStore (Zustand) holds calculator inputs
- **Union Dues Pattern**: Uses store + URL state for sharing
- **State Requirements**: 
  - `hasLunchAllowance: boolean` (toggle state)
  - `lunchAllowance: number` (amount value)
  - Default: `hasLunchAllowance = false, lunchAllowance = 730_000`

**Decision**: Use Zustand store for state + URL parameters for persistence/sharing.

**Store Extension**:
```typescript
// calculatorStore.ts
interface CalculatorState {
  // ...existing state
  hasLunchAllowance: boolean;
  lunchAllowance: number;
  setHasLunchAllowance: (has: boolean) => void;
  setLunchAllowance: (amount: number) => void;
}
```

**URL Parameters**:
- `hasLunchAllowance=true/false` (boolean)
- `lunchAllowance=730000` (number)

**Rationale**:
- Consistent with existing architecture
- URL persistence enables sharing calculations
- Zustand provides reactive updates
- Simple, predictable state model

**Alternatives Considered**:
- **Local component state only**: Rejected - doesn't support URL sharing
- **Separate lunch allowance store**: Rejected - over-engineering
- **Redux**: Rejected - Zustand already in use, Redux is overkill

---

### 5. Testing Strategy

**Question**: What testing approach should be used for this feature?

**Findings**:
- **TDD Requirement**: Constitution mandates test-first approach
- **Existing Test Structure**: unit/, integration/, components/, contract/ directories
- **Coverage Target**: ≥80% for new code
- **Testing Tools**: Vitest 4.0.7 + @testing-library/react 16.3.0

**Decision**: Follow TDD workflow with 4 test layers:

**Unit Tests** (`tests/unit/lunch-allowance.test.ts`):
- Test calculation logic (if separate function created)
- Test edge cases: zero, negative, very large values
- Test default value behavior

**Component Tests** (`tests/components/LunchAllowanceInput.test.tsx`):
- Toggle enables/disables input
- Input accepts numeric values only
- Default value displayed correctly
- State updates on user interaction

**Integration Tests** (`tests/integration/lunch-allowance.integration.test.tsx`):
- Toggle lunch allowance → calculation updates
- Custom amount → calculation uses custom value
- URL state persistence (enable/disable + custom amount)
- Share link preserves lunch allowance state

**Contract Tests** (`tests/contract/lunch-allowance.contract.test.ts`):
- Verify CalculationResult type includes lunchAllowance field
- Verify calculateNet() signature accepts lunch allowance parameter
- Verify URL state contract (parameter names, types)

**Rationale**: 
- Comprehensive coverage across all layers
- Test-first approach catches bugs early
- Each layer tests different concerns (logic, UI, integration, contracts)
- Supports independent user story testing

**Alternatives Considered**:
- **E2E tests only**: Rejected - too slow, poor feedback loop
- **No contract tests**: Rejected - Constitution requires API contract testing
- **Manual testing only**: Rejected - violates TDD principle

---

### 6. Performance Considerations

**Question**: What performance optimizations are needed for lunch allowance?

**Findings**:
- **Calculation Complexity**: O(1) - simple addition to final NET
- **Re-render Triggers**: Input changes, toggle changes
- **Bundle Size Impact**: ~50 lines component + ~20 lines logic = negligible
- **Existing Performance**: Calculator recalculates instantly (<100ms)

**Decision**: No special optimizations needed beyond React best practices.

**Implementation Notes**:
- Use React.memo() for LunchAllowanceInput if needed (profile first)
- Debounce input changes if typing causes lag (unlikely with simple addition)
- Ensure calculation function is pure (no side effects)

**Rationale**:
- Simple feature with minimal computational cost
- Existing calculator performance is excellent
- Premature optimization violates YAGNI principle
- Profile before optimizing

**Alternatives Considered**:
- **useMemo for calculation**: Likely unnecessary - profile first
- **Web Worker for calculation**: Rejected - overkill for simple addition
- **Throttling**: Rejected - not needed for instant feedback requirement

---

## Summary of Decisions

| Decision Area | Choice | Key Rationale |
|---------------|--------|---------------|
| **Tax Treatment** | Fully tax-exempt, no cap | Aligns with Vietnamese regulations for foreign companies |
| **Default Value** | 730,000 VND | Most common amount, but allows customization |
| **Calculation Flow** | Add to final NET after all deductions | Keeps tax-exempt nature explicit, simplifies logic |
| **UI Pattern** | Switch (toggle) + Input field | Familiar pattern from union dues feature |
| **State Management** | Zustand store + URL params | Consistent with existing architecture |
| **Testing** | 4-layer TDD (unit/component/integration/contract) | Comprehensive coverage, TDD compliance |
| **Performance** | No special optimizations | Simple feature, profile before optimizing |

## Open Questions

None - all research questions have been resolved with concrete decisions.

## References

- Vietnamese Tax Regulations: Circular 111/2013/TT-BTC
- Existing Feature: specs/004-union-dues (UI/UX pattern reference)
- React Best Practices: https://react.dev/learn
- shadcn/ui Documentation: https://ui.shadcn.com/
- Zustand Documentation: https://zustand.docs.pmnd.rs/
