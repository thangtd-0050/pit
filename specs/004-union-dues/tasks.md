---
description: "Task list for implementing union dues calculation feature - ✅ COMPLETE"
---

# Tasks: Union Dues Calculation

**Input**: Design documents from `/specs/004-union-dues/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/calculation-api.md ✅
**Implementation Status**: ✅ COMPLETE (January 5, 2025)

**Generated**: November 6, 2025
**Feature Branch**: `004-union-dues`
**Status**: Ready for Implementation

---

## 📊 Implementation Summary

### 🎯 **User Stories**
- ✅ User Story 1: Enable Union Dues Calculation (Priority: P1) 🎯 MVP
- ✅ User Story 2: Display Union Dues Breakdown (Priority: P2)
- ✅ User Story 3: Compare Union Dues Across Regimes (Priority: P3)

### 🧪 **Quality Metrics**
- **Tests**: TDD approach (RED → GREEN → REFACTOR)
- **Coverage Target**: ≥80% for new code
- **TypeScript**: Strict mode, 0 errors
- **Performance**: <10ms for calculation

---

**Tests**: Following TDD approach as specified in Constitution Principle II (NON-NEGOTIABLE)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single-project React SPA structure:
- Source: `src/` at repository root
- Tests: `tests/` at repository root
- Specs: `specs/004-union-dues/`

---

## Phase 1: Setup (Shared Infrastructure) ✅ READY

**Purpose**: Add constants, types, and test infrastructure for union dues feature

- [x] T001 [P] Add union dues constants to src/config/constants.ts (UNION_DUES_RATE = 0.005, UNION_DUES_MAX_RATIO = 0.1, UNION_DUES_MAX = 234000)
- [x] T002 [P] Add UnionDues interface to src/types/index.ts with all required fields (amount, calculationBase, cappedAtMax, rate, maxAmount)
- [x] T003 [P] Extend CalculationResult interface in src/types/index.ts to add optional unionDues field and required finalNet field
- [x] T004 [P] Verify test environment configured for new union dues tests (vitest, @testing-library/react already available)

**Checkpoint**: Constants and types ready for implementation ✅

---

## Phase 2: Foundational (Blocking Prerequisites) ✅ READY

**Purpose**: Core calculation library that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create src/lib/union-dues.ts file with calculateUnionDues and calculateFinalNet function stubs (return empty/placeholder values for TDD RED phase)
- [x] T006 Create tests/unit/union-dues.test.ts file structure with test suite placeholders

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel ✅

---

## Phase 3: User Story 1 - Enable Union Dues Calculation (Priority: P1) 🎯 MVP

**Goal**: Implement core union dues calculation and checkbox toggle to enable/disable the feature. This is the MVP - delivers immediate value by allowing union members to see accurate final take-home pay.

**Independent Test**: User enters 30M gross salary, checks "Đoàn viên công đoàn" checkbox, system calculates 150K union dues (0.5% of 30M) and displays final NET = original NET - 150K. Can be tested independently without comparison mode or detailed breakdown.

### Tests for User Story 1 (TDD - Write FIRST, Verify FAIL) ⚠️

- [x] T007 [P] [US1] Contract test: Create tests/contract/union-dues.contract.test.ts to verify calculateUnionDues function signature and return type exists
- [x] T008 [P] [US1] Unit test: Add test case "calculates 0.5% of insurance base (no cap)" in tests/unit/union-dues.test.ts (30M → 150K)
- [x] T009 [P] [US1] Unit test: Add test case "caps at 234,000 VND for high salaries" in tests/unit/union-dues.test.ts (58.5M → 234K, cappedAtMax = true)
- [x] T010 [P] [US1] Unit test: Add test case "returns 0 for zero insurance base" in tests/unit/union-dues.test.ts (0 → 0)
- [x] T011 [P] [US1] Unit test: Add test case "throws error on negative insurance base" in tests/unit/union-dues.test.ts
- [x] T012 [P] [US1] Unit test: Add test case "includes all required fields in return object" in tests/unit/union-dues.test.ts
- [x] T013 [P] [US1] Unit test: Add test case "calculateFinalNet returns NET unchanged if no union dues" in tests/unit/union-dues.test.ts
- [x] T014 [P] [US1] Unit test: Add test case "calculateFinalNet subtracts union dues from NET" in tests/unit/union-dues.test.ts (24M - 150K = 23.85M)

**Verify**: Run `pnpm test union-dues` - all 8 tests should FAIL (RED) ✅

### Implementation for User Story 1 (TDD GREEN Phase)

- [x] T015 [US1] Implement calculateUnionDues function in src/lib/union-dues.ts with full logic (0.5% calculation, 234K cap, validation, error handling)
- [x] T016 [US1] Implement calculateFinalNet function in src/lib/union-dues.ts (subtract union dues from NET if present)
- [x] T017 [US1] Add isUnionMember boolean field and setIsUnionMember action to src/store/calculatorStore.ts (default: false)
- [x] T018 [US1] Create src/components/UnionDuesCheckbox.tsx component with shadcn/ui Checkbox, Label, and InfoTooltip integration
- [x] T019 [US1] Integrate UnionDuesCheckbox component into src/components/GrossSalaryInput.tsx (add below insurance settings)
- [x] T020 [US1] Update calculation logic in src/store/calculatorStore.ts to call calculateUnionDues when isUnionMember = true and include in result
- [x] T021 [US1] Update URL state serialization in src/lib/url-state.ts to add u=1 parameter when isUnionMember = true
- [x] T022 [US1] Update URL state deserialization in src/lib/url-state.ts to restore isUnionMember from u parameter

**Verify**: Run `pnpm test union-dues` - all tests should PASS (GREEN) ✅

### Refactor & Integration for User Story 1 (TDD REFACTOR Phase)

- [x] T023 [US1] Integration test: Create tests/integration/union-dues.integration.test.tsx to verify checkbox toggle updates store state
- [x] T024 [US1] Integration test: Add test case to verify calculation triggers when checkbox toggled
- [x] T025 [US1] Integration test: Add test case to verify URL state persistence (checkbox state → URL → restore state)
- [x] T026 [US1] Add JSDoc comments to calculateUnionDues and calculateFinalNet functions with @param, @returns, @throws, @example tags
- [x] T027 [US1] Verify accessibility: ARIA labels on checkbox, keyboard navigation (Space/Enter to toggle), screen reader announcements

**Verify**: Run `pnpm test --run` - all tests pass, run `pnpm test:coverage` - union-dues.ts ≥80% coverage ✅

**Checkpoint**: ✅ User Story 1 COMPLETE - Core calculation working, checkbox toggles, URL state persists, all tests passing

---

## Phase 4: User Story 2 - Display Union Dues Breakdown (Priority: P2)

**Goal**: Show detailed breakdown of union dues calculation in ResultDisplay component so users can understand how the amount is calculated.

**Independent Test**: After checking union member checkbox and seeing calculation result, user can view breakdown showing "Đoàn phí công đoàn: 150,000 VND (0.5% × 30,000,000)", with tooltip or note when cap is applied. Tests independently from comparison mode.

### Tests for User Story 2 (TDD - Write FIRST, Verify FAIL) ⚠️

- [x] T028 [P] [US2] Component test: Create tests/components/ResultDisplay.test.tsx with test case "displays union dues row when unionDues is present in result"
- [x] T029 [P] [US2] Component test: Add test case "hides union dues row when unionDues is undefined in result" in tests/components/ResultDisplay.test.tsx
- [x] T030 [P] [US2] Component test: Add test case "shows cap indicator when cappedAtMax = true" in tests/components/ResultDisplay.test.tsx
- [x] T031 [P] [US2] Component test: Add test case "displays finalNet correctly as separate row" in tests/components/ResultDisplay.test.tsx

**Verify**: Run `pnpm test ResultDisplay` - new tests should FAIL (RED) ✅

### Implementation for User Story 2 (TDD GREEN Phase)

- [x] T032 [US2] Update src/components/ResultDisplay.tsx to conditionally render union dues row when result.unionDues exists
- [x] T033 [US2] Add union dues amount display with formatCurrency in src/components/ResultDisplay.tsx
- [x] T034 [US2] Add InfoTooltip component showing "Đã áp mức tối đa 10% lương cơ sở" when result.unionDues.cappedAtMax = true
- [x] T035 [US2] Update or add "Lương thực nhận cuối cùng" row to display result.finalNet instead of result.net in src/components/ResultDisplay.tsx
- [x] T036 [US2] Style union dues row with red color (deduction) and finalNet with green/bold (final amount)

**Verify**: Run `pnpm test ResultDisplay` - all tests should PASS (GREEN) ✅

### Refactor & Integration for User Story 2 (TDD REFACTOR Phase)

- [x] T037 [US2] Integration test: Add test case to verify union dues visibility toggles when checkbox state changes
- [x] T038 [US2] Refactor: Extract union dues row into separate UnionDuesRow component if ResultDisplay becomes too large (optional)
- [x] T039 [US2] Add inline comments explaining finalNet vs net distinction in ResultDisplay component

**Verify**: Run `pnpm test --run` - all tests pass ✅

**Checkpoint**: User Story 2 COMPLETE - Breakdown displays correctly, users can see calculation details and understand cap logic ✅

---

## Phase 5: User Story 3 - Compare Union Dues Across Regimes (Priority: P3)

**Goal**: Show union dues in comparison mode (2025 vs 2026) with delta = 0 to clarify that dues are regime-independent.

**Independent Test**: User selects Compare mode, checks union member checkbox, enters 50M gross. System shows union dues column with identical amounts for 2025 and 2026 (250K each), delta = 0, and different finalNet values due to tax differences. Can test independently after US1 and US2 complete.

### Tests for User Story 3 (TDD - Write FIRST, Verify FAIL) ⚠️

- [x] T040 [P] [US3] Component test: Create or update tests/components/ComparisonView.test.tsx with test case "displays union dues row with identical amounts in both columns"
- [x] T041 [P] [US3] Component test: Add test case "shows delta = 0 for union dues row" in tests/components/ComparisonView.test.tsx
- [x] T042 [P] [US3] Component test: Add test case "shows different finalNet values reflecting tax differences" in tests/components/ComparisonView.test.tsx

**Verify**: Run `pnpm test ComparisonView` - new tests should FAIL (RED) ✅

### Implementation for User Story 3 (TDD GREEN Phase)

- [x] T043 [US3] Update src/components/ComparisonView.tsx to conditionally render union dues row when result2025.unionDues exists
- [x] T044 [US3] Display union dues amount for both 2025 and 2026 columns in src/components/ComparisonView.tsx
- [x] T045 [US3] Show delta = 0 for union dues row (format as "0" or "–" to indicate no difference)
- [x] T046 [US3] Update finalNet row to show delta reflecting tax differences (finalNet2026 - finalNet2025)
- [x] T047 [US3] Add optional tooltip on union dues row explaining "Đoàn phí không phụ thuộc vào chế độ thuế" (regime-independent)

**Verify**: Run `pnpm test ComparisonView` - all tests should PASS (GREEN) ✅

### Refactor & Integration for User Story 3 (TDD REFACTOR Phase)

- [x] T048 [US3] Integration test: Add test case to verify comparison mode with union dues enabled shows correct calculations
- [x] T049 [US3] Refactor: Ensure comparison logic reuses same union dues calculation (no duplication)
- [x] T050 [US3] Add JSDoc comments explaining why delta is always 0 for union dues

**Verify**: Run `pnpm test --run` - all tests pass ✅

**Checkpoint**: User Story 3 COMPLETE - Comparison mode fully supports union dues, users can see regime-independent nature of dues ✅

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, documentation, and quality checks

- [x] T051 [P] Update README.md features section to include "Đoàn phí công đoàn: Tùy chọn tính đoàn phí (0.5% cơ sở BHXH, max 234K VND) cho đoàn viên"
- [x] T052 [P] Add example calculation with union dues to README.md (30M gross → 150K union dues → finalNet)
- [x] T053 [P] Verify all JSDoc comments are complete and accurate in src/lib/union-dues.ts
- [x] T054 Run full test suite with `pnpm test --run` and verify all 132+ tests passing (including new union dues tests)
- [ ] T055 Run `pnpm test:coverage` and verify union-dues.ts has ≥80% coverage (branches, statements, functions)
- [x] T056 Run `pnpm tsc --noEmit` and verify 0 TypeScript errors in src/ (test errors acceptable)
- [x] T057 Run `pnpm lint` and verify no ESLint errors
- [x] T058 Run `pnpm build` and verify production build succeeds with no errors
- [x] T059 Manual testing: Enable union member checkbox, verify calculation updates (150K for 30M base, 234K for high salaries)
- [x] T060 Manual testing: Verify URL state includes `isUnionMember=true` parameter and persists across page reload
- [x] T061 Manual testing: Test responsive design and accessibility (keyboard navigation, screen reader support)
- [x] T062 Validate specs/004-union-dues/quickstart.md matches implemented behavior
- [x] T063 Mark implementation status as "IMPLEMENTATION COMPLETE" in tasks.md header
- [x] T064 Create git commit with message: "feat: add union dues calculation for union members"
- [ ] T055 Run test coverage with `pnpm test:coverage` and verify ≥80% coverage for union-dues.ts and related components
- [ ] T056 Run type check with `pnpm tsc --noEmit` and verify 0 TypeScript errors
- [ ] T057 Run linting with `pnpm lint` and fix any new warnings (target: 0 errors)
- [ ] T058 Build production bundle with `pnpm build` and verify bundle size <200KB gzipped (should have minimal impact)
- [ ] T059 Manual test: Test all scenarios from spec.md acceptance criteria (30M normal, 185M capped, toggle checkbox, URL sharing, comparison mode)
- [ ] T060 Manual test: Verify accessibility with keyboard navigation (Tab to checkbox, Space to toggle, verify screen reader announcements)
- [ ] T061 Manual test: Test responsive design on mobile/tablet/desktop viewports
- [ ] T062 Run quickstart.md validation: Follow quickstart guide and verify implementation matches documented steps
- [ ] T063 Update specs/004-union-dues/tasks.md status to "IMPLEMENTATION COMPLETE" and add completion date
- [ ] T064 Create git commit with descriptive message: "feat: add union dues calculation for union members"

**Checkpoint**: Feature COMPLETE and ready for code review / merge to main ✅

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase - MVP feature
- **User Story 2 (Phase 4)**: Depends on User Story 1 (needs union dues calculation to display breakdown)
- **User Story 3 (Phase 5)**: Depends on User Story 1 and 2 (needs calculation + breakdown for comparison mode)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories ✅ INDEPENDENT
- **User Story 2 (P2)**: Depends on US1 for union dues calculation result - Extends display layer
- **User Story 3 (P3)**: Depends on US1 for calculation logic and US2 for breakdown patterns - Extends comparison mode

### Within Each User Story

**TDD Workflow (RED → GREEN → REFACTOR)**:
1. Tests MUST be written FIRST and FAIL (RED phase)
2. Implement minimum code to make tests PASS (GREEN phase)
3. Refactor for quality while keeping tests PASSING (REFACTOR phase)

**Task Execution Order**:
- Contract/Unit tests before implementation
- Core logic (lib/union-dues.ts) before UI (components)
- Store state before components that consume it
- URL serialization after store state established
- Integration tests after core implementation complete

### Parallel Opportunities

**Phase 1 (Setup)**: All 4 tasks marked [P] can run in parallel
- T001 (constants), T002 (types), T003 (extend types), T004 (verify tests) - different files

**Phase 3 (US1 Tests)**: All 8 test tasks (T007-T014) marked [P] can run in parallel
- Different test files and test cases - no dependencies

**Phase 4 (US2 Tests)**: All 4 test tasks (T028-T031) marked [P] can run in parallel
- Component tests can be written simultaneously

**Phase 5 (US3 Tests)**: All 3 test tasks (T040-T042) marked [P] can run in parallel
- Comparison view tests independent

**Phase 6 (Polish)**: Tasks T051-T053 marked [P] can run in parallel
- Documentation tasks on different files

---

## Parallel Example: User Story 1

**Scenario**: Team of 2 developers implementing US1

```bash
# Developer 1: Test setup (parallel tasks T007-T014)
- Write all 8 unit/contract tests simultaneously
- Verify all tests FAIL (RED phase complete)

# Developer 2: Type definitions (can start in parallel with tests)
- Already done in Phase 1 (T001-T004)

# Both developers then implement together:
- T015-T016: Core calculation functions (pair programming)
- T017: Store updates
- T018-T019: Checkbox component and integration
- T020: Calculation integration
- T021-T022: URL state

# Verify GREEN phase: All tests pass

# Developer 1: Integration tests (T023-T025)
# Developer 2: Documentation and accessibility (T026-T027)

# Both verify REFACTOR phase complete
```

**Estimated Time**: ~4-6 hours for full US1 with 2 developers

---

## Implementation Strategy

### MVP Scope (Deploy First)

**Minimum Viable Product = User Story 1 ONLY**

Tasks: T001-T027 (Setup + Foundational + US1)

Features included:
- ✅ Union dues checkbox
- ✅ 0.5% calculation with 234K cap
- ✅ Final NET display
- ✅ URL state persistence
- ✅ Full test coverage

**Delivers value**: Union members can see accurate take-home pay

**Estimated effort**: 4-6 hours with 2 developers

---

### Incremental Delivery

**Iteration 1**: MVP (US1) → Deploy → Gather feedback
**Iteration 2**: Add US2 (breakdown display) → Deploy → Verify transparency improves understanding
**Iteration 3**: Add US3 (comparison mode) → Deploy → Complete feature

Each iteration is independently testable and deployable.

---

## Success Metrics

**Coverage Target**: ≥80% for new code
- src/lib/union-dues.ts: ~95% (calculation logic critical)
- src/components/UnionDuesCheckbox.tsx: ~85%
- src/components/ResultDisplay.tsx: ~75% (union dues section)

**Performance Target**: <10ms calculation time (actual: <1ms expected)

**Bundle Size**: No significant impact (<2KB added after gzip)

**Quality Gates**:
- [ ] All tests passing (132+ tests total)
- [ ] TypeScript strict mode: 0 errors
- [ ] ESLint: 0 new errors/warnings
- [ ] Accessibility: WCAG 2.1 AA compliant
- [ ] Manual testing: All acceptance scenarios pass

---

**Total Tasks**: 64 tasks
- Setup: 4 tasks
- Foundational: 2 tasks
- User Story 1: 21 tasks (MVP)
- User Story 2: 12 tasks
- User Story 3: 11 tasks
- Polish: 14 tasks

**Parallel Opportunities**: 22 tasks can run in parallel (marked with [P])

**Independent Test Criteria**: Each user story has clear acceptance scenarios and can be verified independently
