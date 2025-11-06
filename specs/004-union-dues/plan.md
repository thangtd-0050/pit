# Implementation Plan: Union Dues Calculation

**Branch**: `004-union-dues` | **Date**: November 6, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-union-dues/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add optional union dues calculation for union members in the Vietnam salary calculator. When enabled via checkbox, system calculates union dues at 0.5% of social insurance base (capped at 234,000 VND) and deducts from NET salary to show final take-home pay. Union dues do NOT affect Personal Income Tax calculation - they are deducted AFTER all tax and insurance calculations. Feature includes breakdown display, URL state persistence, and comparison mode support.

## Technical Context

**Language/Version**: TypeScript 5.3.3 (strict mode enabled)
**Primary Dependencies**: React 18.2, Vite 5.0, Zustand 4.4, Tailwind CSS 3.4, shadcn/ui (Radix UI components)
**Storage**: N/A (client-side only calculator, URL state for sharing)
**Testing**: Vitest 4.0.7, @testing-library/react 16.3.0, @vitest/coverage-v8
**Target Platform**: Web (SPA), responsive design (mobile/tablet/desktop), GitHub Pages deployment
**Project Type**: Single-project React SPA
**Performance Goals**: Instant calculation (<10ms for union dues), bundle size <200KB gzipped
**Constraints**: No backend/database, all calculations client-side, must work offline once loaded
**Scale/Scope**: Small addition to existing calculator (~5-10 new components/functions, ~200-300 LOC)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality Excellence ✅ PASS
- Union dues calculation will be isolated in calculation library with clear function names
- Validation logic separated from UI components
- Constants extracted (UNION_DUES_RATE = 0.005, UNION_DUES_MAX_RATIO = 0.1)
- TypeScript strict mode ensures type safety

### II. Testing-First Discipline (NON-NEGOTIABLE) ✅ PASS
- TDD approach: Tests will be written FIRST for union dues calculation logic
- Contract tests for calculation interface
- Unit tests for 0.5% calculation and 234K cap logic
- Integration tests for checkbox → calculation → display flow
- Target: ≥80% coverage for new code

### III. Modern UI/UX Consistency ✅ PASS
- Checkbox follows existing shadcn/ui Switch component pattern
- Union dues breakdown integrates with existing ResultDisplay component
- Responsive design maintained for mobile/tablet/desktop
- Accessibility: proper ARIA labels for checkbox, keyboard navigation support
- Immediate visual feedback when checkbox toggled

### IV. Performance-By-Design ✅ PASS
- Union dues calculation is simple arithmetic (<10ms)
- No additional API calls or heavy computations
- Memoized calculation results (React useMemo)
- No bundle size impact (reuses existing components)

### V. Security & Privacy Foundation ✅ PASS
- No PII collected (salary amounts already handled safely)
- Checkbox state in URL uses same serialization as existing parameters
- No new external dependencies or security surface

### VI. Maintainability & Technical Debt Management ✅ PASS
- Follows existing calculator architecture pattern
- Reuses URL state management utilities
- Clear separation: calculation logic → store → UI
- No breaking changes to existing functionality

### VII. Documentation & Knowledge Sharing ✅ PASS
- JSDoc comments for calculation functions
- README updated with union dues feature description
- Quickstart guide with usage examples
- Inline code comments for cap logic

**GATE RESULT**: ✅ **PASS** - All constitutional principles satisfied. No violations to justify.

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
├── components/
│   ├── ui/              # shadcn/ui primitives (existing)
│   ├── GrossSalaryInput.tsx
│   ├── ResultDisplay.tsx      # UPDATE: add union dues row
│   ├── InsuranceBreakdown.tsx
│   └── UnionDuesCheckbox.tsx  # NEW: checkbox component
├── lib/
│   ├── tax.ts                 # Existing tax calculation
│   ├── format.ts              # Existing formatters
│   └── union-dues.ts          # NEW: union dues calculation
├── store/
│   └── calculatorStore.ts     # UPDATE: add isUnionMember state
├── types/
│   └── index.ts               # UPDATE: add UnionDues type
└── config/
    └── constants.ts           # UPDATE: add union dues constants

tests/
├── unit/
│   └── union-dues.test.ts     # NEW: calculation logic tests
├── integration/
│   └── union-dues.integration.test.tsx  # NEW: E2E flow tests
└── contract/
    └── calculation.contract.test.ts     # UPDATE: add union dues contract
```

**Structure Decision**: Single-project React SPA structure (Option 1). Union dues feature integrates into existing calculator codebase by:
- Adding new calculation function in `lib/union-dues.ts`
- Updating Zustand store to track checkbox state
- Adding checkbox UI component following shadcn/ui patterns
- Extending ResultDisplay to show union dues breakdown when enabled

## Complexity Tracking

> **No constitutional violations - this section not required**

All constitutional principles are satisfied without exceptions. Union dues feature follows existing patterns and does not introduce additional complexity.

---

## Phase Completion Summary

### Phase 0: Research ✅ COMPLETE
- **Artifact**: [research.md](./research.md)
- **Status**: All NEEDS CLARIFICATION resolved
- **Key Decisions**:
  - Union dues formula: 0.5% of insurance base, max 234K VND
  - UI pattern: Checkbox in GrossSalaryInput
  - State management: Extend Zustand store with isUnionMember boolean
  - URL state: Single character flag `u=1`

### Phase 1: Design & Contracts ✅ COMPLETE
- **Artifacts**:
  - [data-model.md](./data-model.md) - Type definitions and data structures
  - [contracts/calculation-api.md](./contracts/calculation-api.md) - API interface contract
  - [quickstart.md](./quickstart.md) - Developer implementation guide
- **Status**: All design documents complete
- **Agent Context**: Updated .github/copilot-instructions.md with feature technologies

### Constitution Re-Check (Post-Design) ✅ PASS

All constitutional principles remain satisfied after Phase 1 design:

- **I. Code Quality**: ✅ Design uses clear function names, type-safe interfaces, constants extracted
- **II. Testing-First**: ✅ Contract tests defined, unit/integration test cases documented
- **III. UI/UX Consistency**: ✅ Checkbox follows shadcn/ui patterns, accessible design
- **IV. Performance**: ✅ Simple arithmetic calculations (<1ms), memoization strategy defined
- **V. Security**: ✅ No new security surface, uses existing URL serialization
- **VI. Maintainability**: ✅ Extends existing patterns, backward compatible
- **VII. Documentation**: ✅ Comprehensive docs (research, data-model, contracts, quickstart)

**No design changes required** - all principles satisfied.

---

## Next Steps

Planning phase is complete. Ready for task breakdown:

```bash
# Generate tasks.md with TDD workflow
/speckit.tasks
```

This will create `tasks.md` with:
- Setup phase (constants, types, tests)
- User Story 1: Core calculation (P1)
- User Story 2: Breakdown display (P2)
- User Story 3: Comparison mode (P3)
- Polish & deployment

Each task will follow TDD: Write test → Verify FAIL → Implement → Verify PASS → Refactor.
