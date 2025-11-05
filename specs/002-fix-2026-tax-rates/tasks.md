---
description: "Task list for fixing 2026 tax regime rates"
---

# Tasks: Fix 2026 Tax Regime Rates

**Input**: Design documents from `/specs/002-fix-2026-tax-rates/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Following TDD methodology (NON-NEGOTIABLE per constitution) - tests updated BEFORE implementation

**Organization**: Tasks grouped by user story for independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)
- Include exact file paths in descriptions

## Path Conventions

Single-project React SPA structure:
- Source: `src/` at repository root
- Tests: `tests/` at repository root
- Documentation: `README.md` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project environment and prerequisites

- [X] T001 Verify current test suite passes (97 tests, 76% coverage baseline)
- [X] T002 Verify current REGIME_2026 incorrect rates in src/config/constants.ts
- [X] T003 Document current vs. corrected rates in feature branch

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: N/A - This bug fix has no foundational prerequisites. Existing infrastructure is sufficient.

**Checkpoint**: Project verified, ready for user story implementation

---

## Phase 3: User Story 1 - Correct 2026 Tax Calculations (Priority: P1) 🎯 MVP

**Goal**: Fix REGIME_2026 tax bracket rates from incorrect (5%-10%-15%-20%-35%) to correct (5%-15%-25%-30%-35%) so all 2026 tax calculations are accurate per Vietnamese law.

**Independent Test**: Enter any gross salary, select 2026 regime, verify tax breakdown shows rates 5%, 15%, 25%, 30%, 35% applied to brackets 0-10M, 10-30M, 30-60M, 60-100M, >100M respectively. Compare with 2025 regime to verify different results.

### Tests for User Story 1 (TDD - Write FIRST, ensure FAIL before fix) ⚠️

- [X] T004 [P] [US1] Update test assertion for 10M taxable income case in tests/unit/tax.test.ts (line ~234)
- [X] T005 [P] [US1] Update test assertion for 30M taxable income case in tests/unit/tax.test.ts (line ~238)
- [X] T006 [P] [US1] Update test assertion for 60M taxable income case in tests/unit/tax.test.ts (line ~242)
- [X] T007 [P] [US1] Update test assertion for 100M taxable income case in tests/unit/tax.test.ts (line ~246)
- [X] T008 [P] [US1] Update test assertion for 150M taxable income case in tests/unit/tax.test.ts (line ~251)
- [X] T009 [US1] Run test suite to verify tests FAIL with current incorrect constants (expected RED phase)

### Implementation for User Story 1

- [X] T010 [US1] Update REGIME_2026 bracket rates in src/config/constants.ts (lines 80-84): change 0.10→0.15, 0.15→0.25, 0.20→0.30
- [X] T011 [US1] Run test suite to verify all tests PASS with corrected constants (expected GREEN phase)
- [X] T012 [US1] Verify comparison mode shows accurate deltas between 2025 and 2026 regimes
- [X] T013 [US1] Verify URL state restoration works with corrected calculations

**Checkpoint**: At this point, all 2026 tax calculations should be accurate. Test suite should show 97 tests passing with ≥76% coverage. User Story 1 is fully functional.

---

## Phase 4: User Story 2 - Verify Tax Documentation (Priority: P2)

**Goal**: Update all documentation references to show correct 2026 tax rates (5%-15%-25%-30%-35%) so users have accurate information.

**Independent Test**: Review README, code comments, and any UI tooltips mentioning 2026 tax rates - all should display correct 5-bracket structure with rates 5%, 15%, 25%, 30%, 35%.

### Implementation for User Story 2

- [X] T014 [P] [US2] Update personal/dependent deduction values in README.md (lines 148-149) to match actual constants (15.5M, 6.2M not 13M, 5.2M)
- [X] T015 [P] [US2] Add 2026 column to tax bracket table in README.md (around line 151-172) showing correct rates
- [X] T016 [P] [US2] Update JSDoc comment for REGIME_2026 in src/config/constants.ts (lines 69-75) to reflect correct bracket structure
- [X] T017 [US2] Verify all documentation is consistent with corrected implementation

**Checkpoint**: All user stories complete. Documentation matches implementation. Feature ready for final polish.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and quality checks

- [ ] T018 Run full test suite and verify 97 tests passing with ≥76% coverage
- [ ] T019 Verify no lint errors with `npm run lint`
- [ ] T020 Test manual scenarios from spec.md acceptance criteria (50M salary with 2 dependents, 150M with 0 dependents, comparison mode, URL restoration)
- [ ] T021 Update feature specification status to "Complete" in specs/002-fix-2026-tax-rates/spec.md
- [ ] T022 Create git commit with descriptive message referencing bug fix

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately (T001-T003)
- **Foundational (Phase 2)**: N/A - no foundational work needed
- **User Story 1 (Phase 3)**: Depends on Setup verification - CRITICAL path (T004-T013)
- **User Story 2 (Phase 4)**: Depends on US1 completion to ensure docs match implementation (T014-T017)
- **Polish (Phase 5)**: Depends on all user stories being complete (T018-T022)

### User Story Dependencies

- **User Story 1 (P1)**: Can start immediately after Setup (Phase 1) - No dependencies on other stories
  - **CRITICAL**: This is the MVP. Delivers core bug fix for accurate tax calculations.
- **User Story 2 (P2)**: Should start after US1 complete to ensure documentation matches corrected implementation
  - Could technically be done in parallel, but safer to wait for US1 to avoid documenting twice

### Within Each User Story

**User Story 1 (TDD Workflow)**:
1. **RED Phase**: Update all test assertions (T004-T008 in parallel) → Run tests expecting failures (T009)
2. **GREEN Phase**: Fix constants (T010) → Verify tests pass (T011)
3. **Verification**: Manual checks (T012-T013)

**User Story 2 (Documentation)**:
- All doc updates (T014-T016) can run in parallel
- Final verification (T017) waits for all docs updated

### Parallel Opportunities

- **Phase 1 Setup**: All T001-T003 can run in parallel
- **User Story 1 Tests**: T004-T008 all marked [P] - can update different test assertions simultaneously
- **User Story 2 Docs**: T014-T016 all marked [P] - can update different documentation files simultaneously

---

## Parallel Example: User Story 1

```bash
# RED Phase - Update all test assertions in parallel:
Task T004: "Update 10M test assertion in tests/unit/tax.test.ts"
Task T005: "Update 30M test assertion in tests/unit/tax.test.ts"
Task T006: "Update 60M test assertion in tests/unit/tax.test.ts"
Task T007: "Update 100M test assertion in tests/unit/tax.test.ts"
Task T008: "Update 150M test assertion in tests/unit/tax.test.ts"

# Then run test suite (T009) to verify failures

# GREEN Phase - Fix implementation:
Task T010: "Update REGIME_2026 rates in src/config/constants.ts"

# Then verify tests pass (T011)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003) - verify baseline
2. Complete Phase 3: User Story 1 (T004-T013) - fix calculations
3. **STOP and VALIDATE**:
   - All tests pass (97 tests)
   - Coverage ≥76%
   - Manual test: 50M salary with 2 dependents shows correct tax
   - Manual test: Comparison mode shows accurate deltas
4. **MVP READY**: Core bug fix complete, accurate calculations delivered

### Full Feature Delivery

1. Complete Setup (Phase 1)
2. Complete User Story 1 (Phase 3) - MVP checkpoint
3. Complete User Story 2 (Phase 4) - documentation updated
4. Complete Polish (Phase 5) - final quality checks
5. **FEATURE COMPLETE**: Merge to main branch

### Parallel Team Strategy

With 2 developers:

1. **Both**: Complete Setup (Phase 1) together
2. **Developer A**: User Story 1 (Phase 3) - TDD workflow
3. **Developer A completes, then Developer B**: User Story 2 (Phase 4) - documentation
4. **Both**: Polish (Phase 5) together

Or alternatively:

1. **Both**: Setup + User Story 1 together (critical path)
2. **Split after US1**:
   - Developer A: User Story 2 documentation
   - Developer B: Polish tasks (running tests, manual validation)

---

## Quality Gates (from Constitution)

Each checkpoint must verify:

1. ✅ **Testing-First**: Tests updated BEFORE constant changes (T004-T009 before T010)
2. ✅ **All Tests Pass**: 97 tests passing after implementation (T011, T018)
3. ✅ **Coverage Maintained**: ≥76% coverage (T018)
4. ✅ **Documentation Updated**: README and comments reflect changes (T014-T017)

**CRITICAL**: Do not proceed to next phase if quality gates fail.

---

## Task Summary

- **Total Tasks**: 22
- **Phase 1 (Setup)**: 3 tasks - verify environment
- **Phase 2 (Foundational)**: 0 tasks - no foundational work needed
- **Phase 3 (User Story 1 - P1)**: 10 tasks - fix calculations (TDD workflow)
- **Phase 4 (User Story 2 - P2)**: 4 tasks - update documentation
- **Phase 5 (Polish)**: 5 tasks - final verification

**Parallel Opportunities**: 13 tasks marked [P] across test updates and documentation

**MVP Scope**: Complete Setup (3 tasks) + User Story 1 (10 tasks) = 13 tasks for core bug fix

**Estimated Effort**:
- MVP (US1): 2-3 hours for experienced developer (straightforward constant + test changes)
- Full Feature: 3-4 hours including documentation and polish
- This is a low-complexity, high-impact bug fix

---

## Notes

- [P] tasks = different files or independent assertions, can run in parallel
- [Story] label maps task to specific user story for traceability
- TDD workflow is NON-NEGOTIABLE per constitution: RED → GREEN → VERIFY
- Each user story should be independently completable and testable
- Stop at any checkpoint to validate story independently before proceeding
- Test coverage must remain ≥76% (currently 76%, should not decrease)
- All 97 existing tests must continue passing
