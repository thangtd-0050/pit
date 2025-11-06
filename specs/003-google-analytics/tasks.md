# Tasks: Add Google Analytics Tracking

**Input**: Design documents from `/specs/003-google-analytics/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/analytics-service.md

**Tests**: TDD approach - tests written BEFORE implementation (RED → GREEN → REFACTOR)

**Organization**: Tasks grouped by user story to enable independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Environment configuration and type definitions

- [ ] T001 Add VITE_GA_MEASUREMENT_ID environment variable to .env and .env.example with value G-9YLLHMNV3W
- [ ] T002 [P] Create src/types/analytics.ts with TypeScript interfaces (AnalyticsEvent, PageViewParams, CalculationEventParams, PresetClickEventParams, RegimeSwitchEventParams, ShareEventParams, ViewMode, IAnalyticsService)
- [ ] T003 [P] Add gtag.js script tags to public/index.html with async loading and GA4 config (anonymize_ip: true, send_page_view: false)
- [ ] T004 [P] Declare global Window interface with gtag and dataLayer properties in src/types/analytics.ts

**Checkpoint**: Environment ready for analytics integration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core analytics service infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Create tests/mocks/analytics.ts with mock gtag function for testing
- [ ] T006 [P] Create src/services/analytics.ts file with basic service structure and error handling wrapper
- [ ] T007 Create src/hooks/useAnalytics.ts file with basic React hook structure

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Track Page Views and Basic Usage (Priority: P1) 🎯 MVP

**Goal**: Implement basic page view tracking for homepage and view mode switches. This is the MVP - delivers immediate value by showing traffic patterns in GA4 dashboard.

**Independent Test**: Visit site, switch between 2025/2026/Compare views, verify page_view events appear in GA4 Realtime dashboard with correct paths (/2025, /2026, /compare).

### Tests for User Story 1 (TDD - Write FIRST, Verify FAIL)

- [ ] T008 [P] [US1] Contract test: Create tests/contract/analytics.contract.test.ts to verify IAnalyticsService interface exists with trackPageView method
- [ ] T009 [P] [US1] Unit test: Create tests/unit/analytics.test.ts with test case "trackPageView should call gtag with page_view event and correct params"
- [ ] T010 [P] [US1] Unit test: Add test case "trackPageView should handle missing gtag gracefully without throwing"
- [ ] T011 [P] [US1] Unit test: Add test case "trackPageView should validate path starts with slash"
- [ ] T012 [P] [US1] Hook test: Create tests/unit/useAnalytics.test.ts with test case "useAnalytics should provide trackPageView method"

**Verify**: Run `pnpm test` - all 5 tests should FAIL (RED) ✅

### Implementation for User Story 1

- [ ] T013 [US1] Implement trackPageView method in src/services/analytics.ts with gtag('event', 'page_view') call and error handling
- [ ] T014 [US1] Add path validation in trackPageView (must start with '/', max 100 chars)
- [ ] T015 [US1] Implement isAvailable method in src/services/analytics.ts to check if window.gtag exists
- [ ] T016 [US1] Export singleton analytics instance from src/services/analytics.ts
- [ ] T017 [US1] Implement useAnalytics hook in src/hooks/useAnalytics.ts with trackPageView wrapper using useCallback
- [ ] T018 [US1] Add trackPageView call in src/App.tsx useEffect to track initial page load (/2025)
- [ ] T019 [US1] Add trackPageView call when view mode changes in src/App.tsx (track /2025, /2026, /compare based on activeView state)

**Verify**: Run `pnpm test` - all US1 tests should PASS (GREEN) ✅

### Refactor & Integration for User Story 1

- [ ] T020 [US1] Integration test: Create tests/integration/analytics.integration.test.ts to verify App component tracks page view on mount
- [ ] T021 [US1] Integration test: Add test case to verify view mode change triggers trackPageView with correct path
- [ ] T022 [US1] Refactor: Extract gtag call logic to separate internal function for testability
- [ ] T023 [US1] Add JSDoc comments to trackPageView and isAvailable methods

**Verify**: Run `pnpm test` - all tests pass, coverage >80% for analytics.ts ✅

**Checkpoint**: User Story 1 COMPLETE - Basic page view tracking working, can see traffic in GA4 dashboard

---

## Phase 4: User Story 2 - Track User Interactions and Events (Priority: P2)

**Goal**: Track user interactions (preset clicks, calculations, regime switches, shares) to understand feature usage patterns.

**Independent Test**: Click preset buttons, calculate salary, switch regimes, share results - verify corresponding events appear in GA4 with correct parameters.

### Tests for User Story 2 (TDD - Write FIRST, Verify FAIL)

- [ ] T024 [P] [US2] Contract test: Add tests to analytics.contract.test.ts to verify trackEvent, trackCalculation, trackPresetClick, trackRegimeSwitch, trackShare methods exist
- [ ] T025 [P] [US2] Unit test: Add test case "trackEvent should call gtag with custom event name and params"
- [ ] T026 [P] [US2] Unit test: Add test case "trackEvent should validate event name format (lowercase_snake_case)"
- [ ] T027 [P] [US2] Unit test: Add test case "trackCalculation should send calculate_salary event with regime param"
- [ ] T028 [P] [US2] Unit test: Add test case "trackPresetClick should sanitize preset amount to generic label (preset_30M)"
- [ ] T029 [P] [US2] Unit test: Add test case "trackPresetClick should reject PII (large numbers >1M)"
- [ ] T030 [P] [US2] Unit test: Add test case "trackRegimeSwitch should validate from !== to"
- [ ] T031 [P] [US2] Unit test: Add test case "trackShare should send share event with method parameter"

**Verify**: Run `pnpm test` - all 8 new tests should FAIL (RED) ✅

### Implementation for User Story 2

- [ ] T032 [US2] Implement trackEvent method in src/services/analytics.ts with event name validation and gtag call
- [ ] T033 [US2] Implement event name validation function (regex: ^[a-z][a-z0-9_]*$)
- [ ] T034 [US2] Implement trackCalculation method with CalculationEventParams type
- [ ] T035 [US2] Implement trackPresetClick method with preset sanitization logic (convert 30_000_000 → "preset_30M")
- [ ] T036 [US2] Implement PII filter for trackPresetClick (reject values >1_000_000)
- [ ] T037 [US2] Implement trackRegimeSwitch method with from/to validation
- [ ] T038 [US2] Implement trackShare method with ShareEventParams type
- [ ] T039 [US2] Add all tracking methods to useAnalytics hook with useCallback wrappers
- [ ] T040 [US2] Add trackPresetClick call in src/components/GrossSalaryInput.tsx preset button onClick handlers
- [ ] T041 [US2] Add trackCalculation call in src/store/calculatorStore.ts when salary calculation completes
- [ ] T042 [US2] Add trackRegimeSwitch call in src/App.tsx when activeView state changes (track from previous to new view)
- [ ] T043 [US2] Add trackShare calls in src/components/Results.tsx for URL share and copy buttons

**Verify**: Run `pnpm test` - all US2 tests should PASS (GREEN) ✅

### Refactor & Integration for User Story 2

- [ ] T044 [US2] Integration test: Add test case to verify GrossSalaryInput tracks preset click when button clicked
- [ ] T045 [US2] Integration test: Add test case to verify calculation tracking when inputs change
- [ ] T046 [US2] Integration test: Add test case to verify regime switch tracking on view mode toggle
- [ ] T047 [US2] Integration test: Add test case to verify share tracking on share button click
- [ ] T048 [US2] Refactor: Extract parameter sanitization logic to separate utility functions
- [ ] T049 [US2] Refactor: Create validateEventParams helper to centralize validation
- [ ] T050 [US2] Add JSDoc comments to all tracking methods with @param and @example tags

**Verify**: Run `pnpm test` - all tests pass, integration tests verify component tracking ✅

**Checkpoint**: User Story 2 COMPLETE - All user interactions tracked, feature usage visible in GA4

---

## Phase 5: User Story 3 - Track Performance and User Experience Metrics (Priority: P3)

**Goal**: Track performance metrics (page load time, calculation duration) to monitor UX and identify performance issues.

**Independent Test**: Load page on slow connection, perform calculations, verify timing metrics appear in GA4 custom metrics.

### Tests for User Story 3 (TDD - Write FIRST, Verify FAIL)

- [ ] T051 [P] [US3] Unit test: Add test case "should track page load time using Performance API"
- [ ] T052 [P] [US3] Unit test: Add test case "should track calculation duration in trackCalculation"
- [ ] T053 [P] [US3] Unit test: Add test case "should handle missing Performance API gracefully"

**Verify**: Run `pnpm test` - all 3 new tests should FAIL (RED) ✅

### Implementation for User Story 3

- [ ] T054 [US3] Add performance timing logic to trackPageView to capture page load time using window.performance.timing
- [ ] T055 [US3] Extend trackCalculation to accept optional calculationTime parameter
- [ ] T056 [US3] Add performance.now() timing measurement in calculation logic (src/store/calculatorStore.ts)
- [ ] T057 [US3] Pass calculationTime to trackCalculation when calling from store
- [ ] T058 [US3] Add performance API availability check with fallback

**Verify**: Run `pnpm test` - all US3 tests should PASS (GREEN) ✅

### Refactor & Integration for User Story 3

- [ ] T059 [US3] Integration test: Add test case to verify page load timing is tracked
- [ ] T060 [US3] Integration test: Add test case to verify calculation timing is included in events
- [ ] T061 [US3] Refactor: Extract performance measurement to reusable utility function
- [ ] T062 [US3] Add JSDoc comments for performance-related parameters

**Verify**: Run `pnpm test` - all tests pass ✅

**Checkpoint**: User Story 3 COMPLETE - Performance metrics tracked, can monitor UX in GA4

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Code quality, documentation, and production readiness

- [ ] T063 [P] Add comprehensive JSDoc comments to all exported functions in src/services/analytics.ts
- [ ] T064 [P] Add console.warn logging in development mode when analytics is blocked (import.meta.env.DEV check)
- [ ] T065 [P] Add console.log for successful analytics initialization in development mode
- [ ] T066 [P] Update README.md with Analytics section explaining GA4 integration, measurement ID, and environment variable setup
- [ ] T067 [P] Update README.md with privacy policy note about analytics tracking and IP anonymization
- [ ] T068 [P] Create .env.example if not exists and add VITE_GA_MEASUREMENT_ID with placeholder value
- [ ] T069 Verify all tests pass: `pnpm test --run`
- [ ] T070 Verify type checking: `pnpm tsc --noEmit`
- [ ] T071 Verify linting: `pnpm lint`
- [ ] T072 Build and verify no console errors: `pnpm build && pnpm preview`
- [ ] T073 Manual test in production: Deploy to staging, test all tracking in GA4 Realtime view
- [ ] T074 Manual test: Verify graceful degradation with ad blocker enabled (calculator works, no errors)
- [ ] T075 Manual test: Verify all events appear in GA4 dashboard with correct parameters
- [ ] T076 Update specs/003-google-analytics/tasks.md to mark all tasks complete

**Checkpoint**: Feature COMPLETE and ready for production deployment

---

## Implementation Strategy

### MVP Scope (Deploy First)

**User Story 1 only** (T001-T023):
- Basic page view tracking
- View mode navigation tracking
- ~23 tasks, ~4-6 hours of work
- Delivers immediate value: traffic visibility in GA4

### Incremental Additions

1. **MVP + Interactions** (add US2): T024-T050
   - Feature usage insights
   - ~27 additional tasks, ~6-8 hours
   
2. **Full Feature** (add US3): T051-T076
   - Performance monitoring
   - ~26 additional tasks, ~4-6 hours

### Parallel Execution Opportunities

**Within User Story 1** (after T007):
- Tests: T008, T009, T010, T011, T012 can run in parallel (different test files)
- After T017: T018, T019 can be done in parallel (different components)

**Within User Story 2** (after T023):
- Tests: T024, T025-T031 can run in parallel
- Implementation: T040, T041, T042, T043 can run in parallel (different components)
- Integration tests: T044, T045, T046, T047 can run in parallel

**Within User Story 3** (after T050):
- Tests: T051, T052, T053 can run in parallel
- Integration tests: T059, T060 can run in parallel

**Polish Phase**:
- All documentation tasks T063-T068 can run in parallel

---

## Dependencies Between User Stories

```
Phase 1 (Setup) ────┬──> Phase 3: US1 (MVP - Page Views)
                    │
Phase 2 (Foundation)┼──> Phase 4: US2 (Interactions) [depends on US1 completion]
                    │
                    └──> Phase 5: US3 (Performance) [depends on US2 completion]

All stories ────────────> Phase 6: Polish
```

**Key Points**:
- US1 is fully independent (MVP)
- US2 extends US1 tracking (builds on service layer)
- US3 extends US2 tracking (adds timing to existing events)
- Each story is independently testable
- Each story delivers incremental value

---

## Task Summary

**Total Tasks**: 76
- Phase 1 (Setup): 4 tasks
- Phase 2 (Foundation): 3 tasks
- Phase 3 (US1 - MVP): 16 tasks
- Phase 4 (US2 - Interactions): 27 tasks
- Phase 5 (US3 - Performance): 12 tasks
- Phase 6 (Polish): 14 tasks

**Parallel Opportunities**: ~35 tasks can run in parallel (marked with [P])

**Testing Tasks**: 23 tasks (30% of total)
- Contract tests: 2 tasks
- Unit tests: 15 tasks
- Integration tests: 6 tasks

**MVP Completion**: After T023 (16 tasks from phases 1-3, ~4-6 hours)

---

## Validation Checklist

- ✅ All tasks follow format: `- [ ] [ID] [P?] [Story?] Description with file path`
- ✅ Tasks organized by user story (US1, US2, US3)
- ✅ Each user story has independent test criteria
- ✅ TDD workflow: Tests written before implementation
- ✅ File paths are specific and complete
- ✅ Dependencies clearly documented
- ✅ Parallel opportunities identified
- ✅ MVP scope defined (US1 only)
- ✅ Incremental delivery path outlined

**Status**: ✅ READY FOR IMPLEMENTATION
