# Implementation Plan: Update 2025 Personal Income Tax Rates

**Branch**: `007-pit-rates-update` | **Date**: December 10, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-pit-rates-update/spec.md`

## Summary

Update the Personal Income Tax calculator to reflect the newly approved law (passed December 10, 2025, with 92%+ approval) that reduces tax rates for two middle-income brackets:
- 10-30M VND bracket: 15% → 10% (5% reduction)
- 30-60M VND bracket: 25% → 20% (5% reduction)

The implementation will modify the existing REGIME_2025 tax brackets in the constants configuration, update tests to verify the new rates, and ensure the calculator UI displays updated results with comparison capabilities.

## Technical Context

**Language/Version**: TypeScript 5.3.3 (strict mode enabled)
**Primary Dependencies**: React 18.2, Vite 5.0, Zustand 4.4, Tailwind CSS 3.4, shadcn/ui (Radix UI components)
**Storage**: Client-side only (URL state for persistence, no backend)
**Testing**: Vitest + React Testing Library (contract, integration, unit tests)
**Target Platform**: Web browser (GitHub Pages deployment)
**Project Type**: Single project (client-side web application)
**Performance Goals**: <1.5s First Contentful Paint, <100ms calculation response
**Constraints**: Client-side only (no API), responsive design (mobile-first), accessible (WCAG 2.1 AA)
**Scale/Scope**: Single-page app, ~10 components affected, ~5 test files to update

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle I: Code Quality Excellence
- Configuration change in constants.ts follows existing patterns
- Type-safe with TypeScript strict mode
- Self-documenting constant names (REGIME_2025)

### ✅ Principle II: Testing-First Discipline (NON-NEGOTIABLE)
- MUST update existing contract tests for new rates
- MUST add test cases for bracket boundaries (10M, 30M, 60M)
- MUST verify comparison view shows correct differences
- Test coverage maintained ≥80%

### ✅ Principle III: Modern UI/UX Consistency
- No UI changes required (existing components display updated calculations)
- Comparison view already supports showing rate differences
- FR-006 requires adding notice/indicator about new law

### ✅ Principle IV: Performance-By-Design
- Configuration change has zero performance impact
- Pure calculation functions remain deterministic
- No new computational complexity

### ✅ Principle V: Security & Privacy Foundation
- No security implications (client-side calculation only)
- No user data collection or storage

### ✅ Principle VI: Maintainability & Technical Debt Management
- Simple configuration change, no new technical debt
- Clear version dating (REGIME_2025 label preserved for historical accuracy)
- Comment updates document the law change date

### ✅ Principle VII: Documentation & Knowledge Sharing
- MUST update quickstart.md with new rates
- MUST document law passage date (December 10, 2025)
- MUST update existing data-model.md with rate changes

**Gate Status**: ✅ PASS - All constitutional principles satisfied. Simple configuration update with comprehensive test coverage.

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
src/
├── config/
│   └── constants.ts         # UPDATE: REGIME_2025 brackets (rates for 10-30M, 30-60M)
├── lib/
│   └── tax.ts              # No changes (uses regime.brackets dynamically)
├── components/
│   ├── PITBreakdown.tsx    # No changes (displays calculated results)
│   ├── ComparisonView.tsx  # No changes (shows deltas automatically)
│   └── Header.tsx          # UPDATE: Add notice about new law (FR-006)
└── types/
    └── index.ts            # No changes (types remain same)

tests/
├── contract/
│   └── calculation-api.test.ts  # UPDATE: Test cases for new rates
├── integration/
│   └── salary-flow.test.ts      # UPDATE: End-to-end with new calculations
└── unit/
    └── tax.test.ts              # UPDATE: Bracket boundary tests
```

**Structure Decision**: Single project (client-side web app). This is a configuration update affecting primarily `src/config/constants.ts`. The existing calculation engine (`src/lib/tax.ts`) is data-driven and requires no changes. UI components automatically reflect new calculations. Test files must be updated to verify new rates and boundary conditions.

## Complexity Tracking

No constitutional violations. This is a straightforward configuration update with comprehensive test coverage.
