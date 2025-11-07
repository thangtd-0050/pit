# Tasks: Tax-Exempt Lunch Allowance

**Feature Branch**: `005-lunch-allowance`
**Input**: Design documents from `/specs/005-lunch-allowance/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**TDD Approach**: This feature follows Test-Driven Development (RED → GREEN → REFACTOR). Tests are written BEFORE implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [TaskID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- **File paths**: All paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project configuration and constant definitions

- [X] T001 Add DEFAULT_LUNCH_ALLOWANCE constant (730,000) to src/config/constants.ts
- [X] T002 [P] Create unit test for constants in tests/unit/constants.test.ts

**Checkpoint**: Constants defined and tested

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type definitions and contracts that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Extend CalculationResult interface with optional lunchAllowance field in src/types/index.ts
- [X] T004 [P] Create contract test for CalculationResult type extension in tests/contract/lunch-allowance.contract.test.ts
- [X] T005 Extend CalculatorState interface in src/store/calculatorStore.ts with hasLunchAllowance and lunchAllowance fields
- [X] T006 Implement setHasLunchAllowance and setLunchAllowance actions in src/store/calculatorStore.ts
- [X] T007 [P] Create unit tests for store actions in tests/unit/calculator-store.test.ts (8 test cases)

**Checkpoint**: Foundation ready - type system extended, store ready for user story implementation

---

## Phase 3: User Story 1 - Enable Tax-Exempt Lunch Allowance in Salary Calculation (Priority: P1) 🎯 MVP

**Goal**: Users can enable tax-exempt lunch allowance (default 730,000 VND) and see it added to final net salary as fully tax-exempt income

**Independent Test**: Enable lunch allowance toggle with default value, verify calculation shows 730,000 VND added to final NET (not to gross taxable income)

### Tests for User Story 1 (TDD - Write FIRST, ensure they FAIL before implementation)

- [X] T008 [P] [US1] Create unit test file tests/unit/lunch-allowance.test.ts with 6 test cases:
  - Test 1: Returns undefined when lunch allowance is disabled
  - Test 2: Adds default lunch allowance (730K) to final NET when enabled
  - Test 3: Handles zero lunch allowance
  - Test 4: Works with union dues and lunch allowance together
  - Test 5: Handles very large lunch allowance amounts
  - Test 6: Verifies lunch allowance does NOT affect gross taxable income

### Implementation for User Story 1

- [X] T009 [US1] Extend CalculateNetOptions interface with optional lunchAllowance parameter in src/lib/tax.ts
- [X] T010 [US1] Update calculateNet function in src/lib/tax.ts to accept lunchAllowance option and add to final NET after union dues
- [X] T011 [US1] Update calculateNet return statement to include lunchAllowance field in result object in src/lib/tax.ts
- [X] T012 [P] [US1] Extend parseStateFromURL function in src/lib/url-state.ts to parse hasLunchAllowance and lunchAllowance parameters
- [X] T013 [P] [US1] Extend serializeStateToURL function in src/lib/url-state.ts to serialize lunch allowance state when enabled
- [X] T014 [P] [US1] Create unit tests for URL state parsing/serialization in tests/unit/url-state.test.ts (8 test cases)

**Checkpoint**: At this point, core calculation logic works - lunch allowance can be enabled and correctly affects final NET salary

---

## Phase 4: User Story 2 - Customize Tax-Exempt Lunch Allowance Amount (Priority: P2)

**Goal**: Users can customize the lunch allowance amount to match their actual company benefit (supports values different from 730K, including higher amounts for foreign companies)

**Independent Test**: Enable lunch allowance, change input to custom amount (e.g., 1,500,000 VND), verify calculation uses custom amount as fully tax-exempt income

### Tests for User Story 2 (TDD - Write FIRST)

- [ ] T015 [P] [US2] Create component test file tests/components/LunchAllowanceInput.test.tsx with 9 test cases:
  - Test 1: Renders toggle and input field
  - Test 2: Disables input when toggle is off
  - Test 3: Enables input when toggle is on
  - Test 4: Updates store when toggle is changed
  - Test 5: Updates store when amount is changed
  - Test 6: Shows default value (730K) initially
  - Test 7: Preserves custom amount when toggled off and on
  - Test 8: Shows tax-exempt hint when enabled
  - Test 9: Hides tax-exempt hint when disabled

### Implementation for User Story 2

- [ ] T016 [US2] Create LunchAllowanceInput component in src/components/LunchAllowanceInput.tsx with toggle and input field
- [ ] T017 [US2] Implement toggle handler (setHasLunchAllowance) in LunchAllowanceInput component
- [ ] T018 [US2] Implement input change handler (setLunchAllowance with validation) in LunchAllowanceInput component
- [ ] T019 [US2] Add disabled state for input when toggle is off in LunchAllowanceInput component
- [ ] T020 [US2] Add accessibility labels (ARIA) for toggle and input in LunchAllowanceInput component
- [ ] T021 [US2] Import and add LunchAllowanceInput component to Calculator component in src/components/Calculator.tsx (after union dues input)
- [ ] T022 [US2] Update calculation call in Calculator component to pass lunchAllowance option from store state

**Checkpoint**: At this point, User Stories 1 AND 2 work independently - users can enable/disable and customize lunch allowance amount via UI

---

## Phase 5: User Story 3 - Display Tax-Exempt Lunch Allowance in Results (Priority: P3)

**Goal**: Users see clear breakdown showing lunch allowance as tax-exempt income added to final net salary

**Independent Test**: Enable lunch allowance with various amounts (730K, 1.5M), verify results display shows: (1) lunch allowance amount, (2) tax-exempt confirmation, (3) updated final NET

### Tests for User Story 3 (TDD - Write FIRST)

- [ ] T023 [P] [US3] Create integration test file tests/integration/lunch-allowance.integration.test.tsx with 5 test cases:
  - Test 1: Recalculates when lunch allowance is enabled
  - Test 2: Uses custom amount in calculation
  - Test 3: Persists state in URL
  - Test 4: Restores state from URL
  - Test 5: Works with union dues feature

### Implementation for User Story 3

- [ ] T024 [US3] Add lunch allowance display section to ResultsDisplay component in src/components/ResultsDisplay.tsx
- [ ] T025 [US3] Add conditional rendering based on result.lunchAllowance !== undefined in ResultsDisplay
- [ ] T026 [US3] Display lunch allowance amount with "tax-exempt" label and green color (+amount) in ResultsDisplay
- [ ] T027 [US3] Ensure lunch allowance appears after union dues and before final NET in results breakdown

**Checkpoint**: All user stories (1, 2, 3) are now independently functional with complete UI display

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, edge case handling, and final validation

- [ ] T028 [P] Add JSDoc comments to calculateNet function explaining lunch allowance parameter in src/lib/tax.ts
- [ ] T029 [P] Add JSDoc comments to LunchAllowanceInput component in src/components/LunchAllowanceInput.tsx
- [ ] T030 Add input validation for negative values (clamp to 0) in setLunchAllowance action in src/store/calculatorStore.ts
- [ ] T031 Add input validation to floor decimal values to integers in setLunchAllowance action in src/store/calculatorStore.ts
- [ ] T032 [P] Update README.md with lunch allowance feature description in project root
- [ ] T033 Run full test suite and verify all tests pass (npm test)
- [ ] T034 Run linting and fix any issues (npm run lint)
- [ ] T035 Verify bundle size is within constraints (<200KB gzipped) using build tool
- [ ] T036 Manual QA: Test all 6 scenarios from quickstart.md (enable default, custom amount, toggle off/on, URL sharing, with union dues, zero value)
- [ ] T037 Final code review using checklist from quickstart.md Step 10

---

## Dependencies & Execution Order

### User Story Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundation) ← BLOCKING for all user stories
    ↓
    ├─→ Phase 3 (US1 - Enable) ← Independent, can be first MVP
    │   ↓
    ├─→ Phase 4 (US2 - Customize) ← Builds on US1 (needs calculation working)
    │   ↓
    └─→ Phase 5 (US3 - Display) ← Builds on US1+US2 (needs full functionality)
        ↓
    Phase 6 (Polish) ← Final cleanup
```

### Critical Path

1. **MUST complete Phase 1 + Phase 2** before ANY user story work (types and store must be ready)
2. **US1 is prerequisite** for US2 and US3 (calculation logic must work before UI/display)
3. **US2 can be developed** after US1 is complete (UI component depends on calculation)
4. **US3 can be developed** after US1 is complete (display depends on calculation)
5. **US2 and US3 can run in parallel** (different files, no direct dependency)

### Parallel Opportunities

**Within Phase 2 (Foundation)**:
- T004 (contract tests) can run parallel with T005-T006 (store implementation)

**Within Phase 3 (US1)**:
- T008 (unit tests) can be written while waiting for T009-T011 (calculation logic)
- T012-T013 (URL state) can run parallel with T009-T011 (calculation logic)
- T014 (URL tests) can run parallel with T008 (calculation tests)

**Between Phase 4 and Phase 5**:
- T015 (US2 component tests) can run parallel with T023 (US3 integration tests)
- After US1 complete: T016-T022 (US2 UI) and T024-T027 (US3 display) can run in parallel

**Within Phase 6 (Polish)**:
- T028, T029, T032 (documentation) can all run in parallel
- T033, T034, T035 (validation) can run in parallel after all implementation complete

---

## Implementation Strategy

### MVP Scope (Recommended First Delivery)

**Phase 1 + Phase 2 + Phase 3 (US1)** = Functional MVP

This delivers:
- ✅ Users can enable lunch allowance with default 730K value
- ✅ Calculation correctly adds full amount as tax-exempt to final NET
- ✅ URL state persistence for sharing
- ✅ Core functionality independently testable
- ✅ ~15-20 tests covering calculation logic

**Estimated Time**: 2-3 hours (following TDD approach from quickstart.md)

### Phase 4 (US2) - UI Enhancement

Add user customization:
- ✅ Toggle + Input UI component
- ✅ Custom amount validation
- ✅ Integration with Calculator component
- ✅ ~10 additional tests

**Estimated Time**: 1-1.5 hours

### Phase 5 (US3) - Display Polish

Add results breakdown:
- ✅ Visual display of lunch allowance
- ✅ Tax-exempt label
- ✅ Integration tests for full workflow
- ✅ ~5 additional tests

**Estimated Time**: 0.5-1 hour

### Phase 6 - Final Polish

**Estimated Time**: 0.5-1 hour

**Total Estimated Time**: 4-6 hours (matches quickstart.md estimate)

---

## Task Summary

**Total Tasks**: 37 tasks across 6 phases

**Task Breakdown by Phase**:
- Phase 1 (Setup): 2 tasks
- Phase 2 (Foundation): 5 tasks
- Phase 3 (US1 - Enable): 7 tasks (3 test tasks, 4 implementation tasks)
- Phase 4 (US2 - Customize): 8 tasks (1 test task, 7 implementation tasks)
- Phase 5 (US3 - Display): 5 tasks (1 test task, 4 implementation tasks)
- Phase 6 (Polish): 10 tasks

**Task Breakdown by Story**:
- Setup/Foundation: 7 tasks (no story label)
- User Story 1 (P1): 7 tasks
- User Story 2 (P2): 8 tasks
- User Story 3 (P3): 5 tasks
- Polish/Cross-cutting: 10 tasks (no story label)

**Parallel Tasks**: 14 tasks marked with [P] can run in parallel

**Test Tasks**: 30 test cases across 4 layers:
- Unit tests: 14 test cases (constants, calculation, store, URL state)
- Component tests: 9 test cases (LunchAllowanceInput)
- Integration tests: 5 test cases (full workflow)
- Contract tests: 2 test cases (type contracts)

**Independent Test Criteria**:
- ✅ **US1**: Enable toggle → verify 730K added to final NET as tax-exempt
- ✅ **US2**: Change input to 1.5M → verify custom amount used in calculation
- ✅ **US3**: Enable with various amounts → verify display shows amount + tax-exempt label + updated final NET

**Files to Create**: 5 new files
- src/components/LunchAllowanceInput.tsx
- tests/unit/lunch-allowance.test.ts
- tests/unit/constants.test.ts (new test cases)
- tests/components/LunchAllowanceInput.test.tsx
- tests/integration/lunch-allowance.integration.test.tsx

**Files to Modify**: 7 existing files
- src/config/constants.ts (add DEFAULT_LUNCH_ALLOWANCE)
- src/types/index.ts (extend CalculationResult)
- src/store/calculatorStore.ts (add lunch allowance state + actions)
- src/lib/tax.ts (extend calculateNet)
- src/lib/url-state.ts (add URL parameters)
- src/components/Calculator.tsx (add LunchAllowanceInput)
- src/components/ResultsDisplay.tsx (display lunch allowance)
- README.md (document feature)

---

## Format Validation

✅ **All tasks follow checklist format**: `- [ ] [TaskID] [P?] [Story?] Description with file path`

✅ **Task IDs**: Sequential T001-T037 in execution order

✅ **Story labels**: Properly assigned to US1, US2, US3 tasks

✅ **Parallel markers**: 14 tasks marked [P] for parallel execution

✅ **File paths**: All tasks include specific file paths relative to repo root

✅ **Immediately executable**: Each task is specific enough for LLM completion without additional context

---

## Next Steps

1. **Review this task list** to ensure it matches your understanding
2. **Start with MVP** (Phase 1 + Phase 2 + Phase 3) for fastest value delivery
3. **Follow TDD** approach: Write tests first (RED), implement (GREEN), refactor
4. **Use quickstart.md** as detailed implementation guide for each step
5. **Track progress** by checking off completed tasks in this file

**Ready to implement? Start with T001! 🚀**
