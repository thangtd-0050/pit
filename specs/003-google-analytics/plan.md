# Implementation Plan: Add Google Analytics Tracking

**Branch**: `003-google-analytics` | **Date**: 2025-11-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-google-analytics/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Integrate Google Analytics 4 (GA4) tracking into the Vietnam Gross-to-Net Salary Calculator to monitor user engagement, feature usage, and performance metrics. Primary requirement is client-side tracking of page views, user interactions (salary calculations, preset clicks, regime switches), and performance metrics while respecting user privacy (IP anonymization, no PII tracking). Technical approach uses GA4's native gtag.js library loaded asynchronously with graceful degradation when tracking fails or is blocked.

**Measurement ID**: `G-9YLLHMNV3W` (provided by user)

## Technical Context

**Language/Version**: TypeScript 5.3.3 (strict mode enabled)
**Primary Dependencies**: 
- Google Analytics 4 (gtag.js) - client-side tracking library
- React 18.2.0 - existing UI framework
- Vite 5.0.10 - build tool (supports script injection in index.html)

**Storage**: N/A (client-side only, no server-side persistence)
**Testing**: Vitest 1.4.0, React Testing Library 14.1.2, Playwright 1.41.1 (existing stack)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - ES2020+)
**Project Type**: Single-page web application (SPA) with React
**Performance Goals**: 
- Analytics script load: <500ms (async, non-blocking)
- Event tracking overhead: <10ms per event
- Zero impact on existing page load time (<3s FCP maintained)

**Constraints**: 
- No backend/server-side tracking (client-side only)
- No personally identifiable information (PII) tracked
- Must work with ad blockers gracefully (no errors, calculator functions normally)
- Must respect privacy (IP anonymization enabled)

**Scale/Scope**: 
- Single-page application with 3 view modes (2025, 2026, Compare)
- ~10 tracked events (pageviews, clicks, calculations, shares)
- Expected traffic: hundreds to thousands of daily users
- No database, no API endpoints required

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality Excellence
- ✅ **PASS**: Analytics integration will use TypeScript with strict typing
- ✅ **PASS**: Event tracking abstracted into dedicated analytics service (single responsibility)
- ✅ **PASS**: Measurement ID externalized as environment variable (no magic strings)

### II. Testing-First Discipline (NON-NEGOTIABLE)
- ✅ **PASS**: TDD approach required - tests written before implementation
- ✅ **PASS**: Contract tests for analytics service API (trackPageView, trackEvent methods)
- ✅ **PASS**: Integration tests with mocked gtag to verify tracking calls
- ✅ **PASS**: Unit tests for event parameter construction and privacy filters (no PII)
- ⚠️ **NOTE**: E2E tests will mock analytics (cannot verify GA dashboard in CI, manual verification required)

### III. Modern UI/UX Consistency
- ✅ **PASS**: Analytics is invisible to users - no UI changes required
- ✅ **PASS**: Graceful degradation when blocked - calculator functionality unaffected
- ✅ **PASS**: No loading spinners or blocking on analytics initialization

### IV. Performance-By-Design
- ✅ **PASS**: Gtag.js loaded asynchronously with async/defer attributes
- ✅ **PASS**: No blocking on main thread - analytics calls are fire-and-forget
- ✅ **PASS**: Performance budget maintained (script <50KB, gzipped <15KB)
- ✅ **PASS**: Lazy initialization - tracking starts after app renders

### V. Security & Privacy Foundation
- ✅ **PASS**: IP anonymization enabled in GA4 config
- ✅ **PASS**: No PII tracked (salary amounts, user identity excluded from events)
- ✅ **PASS**: Measurement ID stored in environment variable (not hardcoded)
- ✅ **PASS**: HTTPS-only tracking (existing site already uses HTTPS)

### VI. Maintainability & Technical Debt Management
- ✅ **PASS**: Analytics service abstraction allows future migration to other platforms
- ✅ **PASS**: Configuration externalized (easy to disable/change measurement ID)
- ✅ **PASS**: Error handling prevents analytics failures from breaking app
- ✅ **PASS**: TypeScript interfaces document expected event structure

### VII. Documentation & Knowledge Sharing
- ✅ **PASS**: Quickstart guide will document how to view GA dashboard
- ✅ **PASS**: Event tracking documented with parameter definitions
- ✅ **PASS**: Environment variable setup instructions in README
- ✅ **PASS**: Migration guide if measurement ID changes

**RESULT**: ✅ **ALL GATES PASSED** - Proceed to Phase 0 Research

---

## Phase 0: Research ✅ COMPLETE

**Research document**: [research.md](./research.md)

**Key decisions**:
1. **Integration method**: Google gtag.js via CDN (official, auto-updating)
2. **Privacy approach**: IP anonymization + no PII tracking
3. **SPA strategy**: Manual page view tracking on view mode changes
4. **Testing**: Multi-layer with mocked gtag (contract, unit, integration)
5. **Error handling**: Graceful degradation, silent failures in production
6. **Performance**: Async loading, fire-and-forget calls (<10ms overhead)

---

## Phase 1: Design & Contracts ✅ COMPLETE

**Data model**: [data-model.md](./data-model.md)
**API contracts**: [contracts/analytics-service.md](./contracts/analytics-service.md)
**Quickstart guide**: [quickstart.md](./quickstart.md)

**Design summary**:
- **Service layer**: `AnalyticsService` with typed interfaces
- **React hook**: `useAnalytics` for component-level tracking
- **Event types**: PageView, CalculationEvent, PresetClickEvent, RegimeSwitchEvent, ShareEvent
- **Privacy filters**: Validate and sanitize all events before sending
- **Error boundaries**: Never throw, graceful degradation

---

## Constitution Check (Post-Design Re-evaluation)

*Re-checked after Phase 1 design completion*

### I. Code Quality Excellence
- ✅ **PASS**: Service abstraction with TypeScript strict mode
- ✅ **PASS**: Single-responsibility design (analytics.ts, types file, hook)
- ✅ **PASS**: Event validation and privacy filtering in dedicated functions
- ✅ **PASS**: Measurement ID externalized to environment variable

### II. Testing-First Discipline (NON-NEGOTIABLE)
- ✅ **PASS**: Contract tests defined for service interface
- ✅ **PASS**: Unit tests for event construction and privacy filters
- ✅ **PASS**: Integration tests for component tracking
- ✅ **PASS**: TDD workflow ready (tests before implementation)

### III. Modern UI/UX Consistency
- ✅ **PASS**: Zero UI impact (invisible tracking)
- ✅ **PASS**: Graceful degradation with ad blockers
- ✅ **PASS**: No blocking on user interactions

### IV. Performance-By-Design
- ✅ **PASS**: Async script loading documented
- ✅ **PASS**: Fire-and-forget calls (<10ms verified in contract)
- ✅ **PASS**: No blocking on main thread
- ✅ **PASS**: Performance budget: gtag.js <15KB gzipped

### V. Security & Privacy Foundation
- ✅ **PASS**: IP anonymization enabled in config
- ✅ **PASS**: PII filtering enforced in validation layer
- ✅ **PASS**: Privacy-safe event parameters documented
- ✅ **PASS**: HTTPS-only tracking (existing infrastructure)

### VI. Maintainability & Technical Debt Management
- ✅ **PASS**: Service abstraction allows future platform changes
- ✅ **PASS**: Configuration externalized (measurement ID)
- ✅ **PASS**: Error handling prevents tracking failures from breaking app
- ✅ **PASS**: TypeScript interfaces document event contracts

### VII. Documentation & Knowledge Sharing
- ✅ **PASS**: Quickstart guide created (view dashboard, verify tracking)
- ✅ **PASS**: Event tracking documented with examples
- ✅ **PASS**: API contracts with usage examples
- ✅ **PASS**: Data model with TypeScript interfaces

**RESULT**: ✅ **ALL GATES PASSED POST-DESIGN** - Ready for Phase 2 (Tasks)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Single-page React application structure (existing)
src/
├── services/
│   └── analytics.ts         # NEW: Analytics service (trackPageView, trackEvent)
├── hooks/
│   └── useAnalytics.ts      # NEW: React hook for tracking
├── types/
│   └── analytics.ts         # NEW: Event types and interfaces
├── components/              # EXISTING: UI components
│   ├── GrossSalaryInput.tsx # MODIFIED: Add preset click tracking
│   ├── Results.tsx          # MODIFIED: Add calculation tracking
│   └── Footer.tsx           # MODIFIED: Add share tracking
├── App.tsx                  # MODIFIED: Initialize analytics
└── main.tsx                 # EXISTING: Entry point

public/
└── index.html               # MODIFIED: Add gtag.js script tags

tests/
├── unit/
│   ├── analytics.test.ts    # NEW: Analytics service tests
│   └── useAnalytics.test.ts # NEW: Hook tests
├── integration/
│   └── analytics.integration.test.ts  # NEW: E2E tracking tests
└── contract/
    └── analytics.contract.test.ts     # NEW: API contract tests
```

**Structure Decision**: Single-page application with new analytics layer added to existing `src/services/` pattern. Analytics service provides abstraction over gtag.js, allowing future migration to other platforms. React hook (`useAnalytics`) provides convenient access to tracking methods from components.

## Complexity Tracking

> **No constitutional violations detected** - All gates passed. No complexity justification required.
