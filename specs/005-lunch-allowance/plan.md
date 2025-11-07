# Implementation Plan: Tax-Exempt Lunch Allowance

**Branch**: `005-lunch-allowance` | **Date**: November 7, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-lunch-allowance/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add tax-exempt lunch allowance calculation to the Vietnam salary calculator. Users can enable/disable lunch allowance (default 730,000 VND) and customize the amount. The entire allowance is treated as tax-exempt income added to final net salary without affecting gross taxable income. This feature follows the same pattern as the existing union dues feature (004), using a toggle + input field with URL state persistence.

**Primary Requirements**:
- Toggle control to enable/disable lunch allowance
- Default value: 730,000 VND (common Vietnamese company benefit)
- Editable input for custom amounts (supports higher values for foreign companies)
- Full amount is tax-exempt (no threshold cap)
- Add to final NET salary after all tax calculations
- URL state persistence for sharing
- Display in results breakdown

**Technical Approach**:
- Extend CalculationResult type with `lunchAllowance` field
- Create LunchAllowanceInput component (similar to UnionDuesCheckbox pattern)
- Update tax.calculateNet() to accept optional lunch allowance parameter
- Modify ResultDisplay to show lunch allowance as tax-exempt income
- Add URL state parameters: `lunchAllowance` (amount), `hasLunchAllowance` (boolean)
- Reuse existing Zustand store pattern for state management

## Technical Context

**Language/Version**: TypeScript 5.3.3 (strict mode enabled)
**Primary Dependencies**: React 18.2, Vite 5.0, Zustand 4.4, Tailwind CSS 3.4, shadcn/ui (Radix UI components)
**Storage**: Client-side only (URL state for persistence, no backend)
**Testing**: Vitest 4.0.7, @testing-library/react 16.3.0, TDD methodology (RED → GREEN → REFACTOR)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge), mobile-responsive SPA
**Project Type**: Single-page web application (frontend only)
**Performance Goals**: <1.5s First Contentful Paint, instant recalculation on input changes (<100ms)
**Constraints**: Client-side calculation only (no server), bundle size <200KB gzipped, works offline
**Scale/Scope**: Small feature addition to existing calculator (~200 LOC), integrates with 4 existing features

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Phase 0 Check**: ✅ PASS (all 7 principles met)
**Phase 1 Re-check**: ✅ PASS (all 7 principles maintained)
**Gate Status**: OPEN - Proceed to implementation

### I. Code Quality Excellence ✅
- **Status**: PASS (Phase 0 + Phase 1)
- **Evidence**:
  - Feature follows existing codebase patterns (union dues)
  - Uses TypeScript strict mode (no `any` types in contracts)
  - Clear naming conventions (hasLunchAllowance, setLunchAllowance)
  - Comprehensive type definitions in contracts/calculation-api.md
  - Well-documented function signatures and interfaces
- **Action**: Maintain consistency with existing code quality standards

### II. Testing-First Discipline (NON-NEGOTIABLE) ✅
- **Status**: PASS
- **Evidence**: TDD workflow enforced (Vitest + @testing-library), spec defines testable acceptance criteria, existing features have ≥80% coverage
- **Action**: Write tests BEFORE implementation for all 3 user stories (unit, integration, component tests)

### III. Modern UI/UX Consistency ✅
- **Status**: PASS
- **Evidence**: Reusing shadcn/ui components (Switch, Input, Label), follows existing calculator UX patterns, mobile-responsive design
- **Action**: Ensure accessibility (ARIA labels, keyboard navigation) and consistent theming

### IV. Performance-By-Design ✅
- **Status**: PASS
- **Evidence**: Client-side calculation (<100ms), no network calls, follows existing performance patterns
- **Action**: Verify instant recalculation on input changes, no performance regression

### V. Security & Privacy Foundation ✅
- **Status**: PASS
- **Evidence**: No sensitive data, client-side only, input validation for numeric values, no XSS risk (React escaping)
- **Action**: Validate lunch allowance input (non-negative numbers only)

### VI. Maintainability & Technical Debt Management ✅
- **Status**: PASS
- **Evidence**: Small, focused feature (~200 LOC), follows existing patterns, clear separation of concerns
- **Action**: Document calculation logic in JSDoc comments

### VII. Documentation & Knowledge Sharing ✅
- **Status**: PASS
- **Evidence**: Spec includes user scenarios, plan includes quickstart guide, acceptance criteria are clear
- **Action**: Update README.md with lunch allowance feature description

**OVERALL GATE STATUS**: ✅ **PASS** - All constitutional principles satisfied, no violations to justify

## Project Structure

### Documentation (this feature)

```text
specs/005-lunch-allowance/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── calculation-api.md  # Calculation function contracts
├── checklists/          # Quality validation
│   └── requirements.md  # Spec quality checklist (already created)
├── spec.md              # Feature specification (already created)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── LunchAllowanceInput.tsx          # New: Toggle + input for lunch allowance
│   ├── CalculatorInputs.tsx             # Modified: Add LunchAllowanceInput
│   ├── ResultDisplay.tsx                # Modified: Show lunch allowance breakdown
│   ├── SalaryCalculator.tsx             # Modified: Integrate lunch allowance
│   └── ui/                              # Existing shadcn/ui components (reused)
│       ├── switch.tsx
│       ├── input.tsx
│       └── label.tsx
├── lib/
│   ├── lunch-allowance.ts               # New: Calculation logic (if needed)
│   ├── tax.ts                           # Modified: Accept lunch allowance param
│   └── url-state.ts                     # Modified: Add lunchAllowance params
├── types/
│   └── index.ts                         # Modified: Add lunchAllowance field to CalculationResult
├── store/
│   └── calculatorStore.ts               # Modified: Add lunchAllowance state (if using Zustand)
└── config/
    └── constants.ts                     # Modified: Add DEFAULT_LUNCH_ALLOWANCE = 730_000

tests/
├── unit/
│   └── lunch-allowance.test.ts          # New: Unit tests for calculation logic
├── integration/
│   └── lunch-allowance.integration.test.tsx  # New: Toggle, URL state, recalculation
├── components/
│   ├── LunchAllowanceInput.test.tsx     # New: Component tests
│   └── ResultDisplay.test.tsx           # Modified: Test lunch allowance display
└── contract/
    └── lunch-allowance.contract.test.ts # New: Contract tests for API surface
```

**Structure Decision**: Single-page web application structure (Option 1 from template). This is a frontend-only feature that extends the existing salary calculator. All state is client-side with URL persistence. The structure follows existing feature patterns (001-004) with separation of components, lib (logic), types, and tests organized by test type (unit, integration, component, contract).

## Complexity Tracking

**No violations requiring justification** - This feature adheres to all constitutional principles without introducing additional complexity. The implementation follows established patterns from previous features (particularly union dues feature 004) and maintains the existing architecture's simplicity.
