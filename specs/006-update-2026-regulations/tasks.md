# Tasks: Update 2026 Regulations

**Feature Branch**: `006-update-2026-regulations`
**Status**: In Progress

## Phase 1: Setup

**Goal**: Prepare the environment for development.

- [X] T001 Verify development environment and run existing tests to ensure clean state

## Phase 2: Foundational

**Goal**: Define the new 2026 constants and configuration structures.
**Blocking**: Must be completed before User Stories.

- [X] T002 Define `REGIONAL_MINIMUMS_2026` constant in `src/config/constants.ts`
- [X] T003 Rename/Alias existing `REGIONAL_MINIMUMS` to `REGIONAL_MINIMUMS_2025` in `src/config/constants.ts`
- [X] T004 [P] Export `getCapUI` helper function in `src/config/constants.ts`

## Phase 3: User Story 1 - Calculate Salary with 2026 Regulations (P1)

**Goal**: Ensure calculations use new RMW values when 2026 regime is selected.
**Independent Test**: Verify calculations match 2026 RMW values and BHTN ceiling (20x RMW).

### Tests
- [X] T005 [US1] Create unit test for 2026 RMW selection in `tests/unit/tax.test.ts`
- [X] T006 [US1] Create unit test for BHTN ceiling calculation with 2026 values in `tests/unit/tax.test.ts`

### Implementation
- [X] T007 [US1] Update `calcAll` function in `src/lib/tax.ts` to select RMW based on `inputs.regime.id`
- [X] T008 [US1] Verify `calcInsuranceBases` correctly applies the passed RMW in `src/lib/tax.ts`

## Phase 4: User Story 2 - View Explanations for 2026 Changes (P2)

**Goal**: Show tooltips and "New" badges to explain 2026 changes.
**Independent Test**: Verify "New" badges and tooltips appear only when 2026 regime is active.

### Tests
- [X] T009 [US2] Create component test for `InsuranceBreakdown` with `regimeId='2026'` in `tests/components/InsuranceBreakdown.test.tsx`

### Implementation
- [X] T010 [US2] Update `InsuranceBreakdownProps` interface to include `regimeId` in `src/components/InsuranceBreakdown.tsx`
- [X] T011 [US2] Implement "New" badge logic for RMW values in `src/components/InsuranceBreakdown.tsx`
- [X] T012 [US2] Implement Tooltip logic explaining BHTN ceiling (20x RMW) in `src/components/InsuranceBreakdown.tsx`
- [X] T013 [US2] Update `ResultDisplay.tsx` (or parent component) to pass `regimeId` to `InsuranceBreakdown`

## Final Phase: Polish

**Goal**: Ensure high quality and consistency.

- [ ] T014 Verify mobile responsiveness of new tooltips and badges
- [ ] T015 Run full test suite to ensure no regressions in 2025 calculations

## Dependencies

1. **Phase 2 (Foundational)** must be completed first.
2. **Phase 3 (US1)** depends on Phase 2.
3. **Phase 4 (US2)** depends on Phase 3 (logic should be in place before UI explanation).

## Parallel Execution Examples

- **T005 & T006** (Tests) can be written while **T002 & T003** (Constants) are being defined.
- **T009** (Component Test) can be written in parallel with **T010-T012** (Component Implementation).

## Implementation Strategy

1. **MVP**: Complete Phase 2 and Phase 3 to ensure the core calculation logic is correct for 2026.
2. **Enhancement**: Complete Phase 4 to add the requested UI explanations.
3. **Verification**: Run all tests and manual verification.
